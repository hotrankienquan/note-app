const db = require("../models");
const User = db.users;
const Note = db.noteModel;
const {
  BadRequestError,
  AuthFailureError,
  NotFoundError,
} = require("../../core/error.response");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair } = require("../../auth/authUtils");
const KeyTokenService = require("./keytoken.service");

const { redisInstance } = require("../redis/redis");
const { validationResult } = require("express-validator");
const {
  loginValidationRules,
} = require("../validations/api-v1/userValidation");
const { where } = require("sequelize");
const { convertToRealDateTime } = require("../../utils/formatDate");
const log = require("node-file-logger");

class AccessService {
  static getAllNoteByAdmin = async () => {
    const data = await Note.findAll({
      include: [
        {
          model: db.users,
        },
      ],
    });
    if (!data) {
      throw new NotFoundError("not have data");
    }
    return { data };
  };

  static getNoteOfUser = async (
    keyStore,
    { limit: limitParams, offset: offsetParams }
  ) => {
    if(!keyStore?.userId){
      throw new NotFoundError("not found userid");
    }
    const userId = keyStore.userId;

    const key = `note::user${userId}::offset${offsetParams}`;
    const dataCache = await redisInstance.getValueByKey(key);
    if (dataCache) {
      log.Info("data get note of user from redis")
      return {
        message: "redis",
        data: JSON.parse(dataCache),
        countRecord: Number(JSON.parse(dataCache).length),
      };
    }
    const res = await Note.findAll({
      where: {
        userId,
      },
      offset: Number(offsetParams) ?? 0,
      limit: Number(limitParams) ?? 5,
      order: ["updateTimestamp"],
    });

    if (!res) {
      throw new BadRequestError("not found");
    }

    await redisInstance.setKeyValue(key, JSON.stringify(res), {
      EX: 10,
      NX: true,
    });
    log.Info("data from first time get note of user " + JSON.stringify(res))

    return {
      message: "data from first timew",
      data: res,
      count: Array.isArray(res) && res.length
    };
  };

  static addNote = async (payload, keyStore) => {

    const data = await Note.create({
      title: payload.title,
      content: payload.content,
      userId: keyStore?.userId,
    });

    if (!data) {
      throw new BadRequestError("error add new note");
    }
    log.Info("add note succeed" + JSON.stringify(data))

    return data
  };

  static logout = async (keyStore) => {

    if (!keyStore || !keyStore?.userId) {
      throw new Error("failed");
    }

    const res = await KeyTokenService.removeTokenById(keyStore.userId);
    log.Info("logout succeed" + JSON.stringify(res))
    return {res};
  };

  static getalluser = async () => {

   const keyGetAllUser = 'listUser';
    try {
      const dataCache = await redisInstance.getValueByKey(keyGetAllUser);
      if (dataCache) {
        return {
          user: JSON.parse(dataCache),
          message: "data from cache redis",
          count:
            Array.isArray(JSON.parse(dataCache)) &&
            JSON.parse(dataCache).length,
        };
      }
      const result = await User.findAll();

      if (!result) {
        throw new BadRequestError("error");
      }

      await redisInstance.setKeyValue(keyGetAllUser, JSON.stringify(result), {
        EX: 1000,
        NX: true,
      });

      return {
        message: `data recently set by redis, get all succeed`,
        user: result,
        count: result.length,
      };
    } catch (err) {
      console.error("Error setting value in Redis:", err);
      return {
        messageErr: `error set redis get all usser`,
      };
    }
  };

  static loginService = async (payload) => {
    if (!payload.password) {
      throw new AuthFailureError("error");
    }
    const dataFoundUser = await User.findOne({
      where: {
        email: payload.email,
      },
    });

    // const result = dataFoundUser.get({ plain: true });
    // delete result.password;
   
    if (!dataFoundUser) {
      throw new BadRequestError("error 2");
    }

    // match pass
    const match = await bcrypt.compare(
      payload.password,
      dataFoundUser.password
    );
    if (!match) {
      throw new AuthFailureError("error 3");
    }
    const result = dataFoundUser.get({ plain: true});
    const finallyResult = {...result}
    delete finallyResult.password;
    delete finallyResult.hashId
    delete finallyResult.nameWithRole
    delete finallyResult.role
    //3 created private, public
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    const tokens = createTokenPair(
      {
        user: dataFoundUser.id,
        email: dataFoundUser.email,
      },
      publicKey,
      privateKey
    );
    const keyStore = await KeyTokenService.createOrUpdateKey({
      userId: dataFoundUser.id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshtoken,
    });
    if (!keyStore) {
      throw new BadRequestError("error key store");
    }
    log.Info("login succeed" + JSON.stringify(user))
    return {
      user: finallyResult,
      tokens,
    };
  };

  static signUpService = async (payload) => {

    const dataFoundUser = await User.findOne({
      where: {
        email: payload.email,
      },
    });
    if (dataFoundUser) {
      throw new BadRequestError("user existed");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newUser = await User.create({
      username: payload.username,
      password: hashedPassword,
      email: payload.email,
      role: ["user"],
    });
    const result = newUser.get({ plain: true});

    const finallyResult = {...result}
    delete finallyResult.password;
    delete finallyResult.hashId
    delete finallyResult.nameWithRole
    delete finallyResult.role
    if (!newUser) {
      throw new BadRequestError("create user failed");
    }

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const keyStore = await KeyTokenService.createOrUpdateKey({
      userId: newUser.id,
      publicKey,
      privateKey,
    });

    if (!keyStore) {
      throw new BadRequestError("cannot save key store");
    }

    const tokens = createTokenPair(
      {
        user: newUser.id,
        email: newUser.email,
      },
      publicKey,
      privateKey
    );

    const userWithToken = await db.users.findOne({
      where: { id: newUser.id },
      include: [
        {
          model: db.storeKey,
          as: "storeKey",
        },
      ],
    });
    log.Info("register succeed" + JSON.stringify(finallyResult))

    return {
        user: finallyResult,
        tokens,
    };
  };
}

module.exports = AccessService;
