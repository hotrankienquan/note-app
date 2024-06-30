const { where, Op } = require("sequelize");
const db = require("../models");
const log = require("node-file-logger");
class KeyTokenService {
  static removeTokenById = async (id) => {
    const res = await db.storeKey.destroy({
      where: {
        userId: {
          [Op.eq]: id,
        },
      },
    });
    log.Info("remove token by id succeed");
    return Boolean(res) ? res : "error";
  };
  static createOrUpdateKey = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // Find the existing key record for the given user
      const existingKey = await db.storeKey.findOne({
        where: { userId },
      });

      let result;
      if (existingKey) {
        // If the record exists, update it
        await db.storeKey.update(
          {
            publicKey,
            privateKey,
            refreshToken,
          },
          {
            where: { userId },
          }
        );
        result = await db.storeKey.findOne({
          where: {
            userId,
          },
        });
      }
      if (!existingKey) {
        result = await db.storeKey.create({
          userId,
          publicKey,
          privateKey,
          refreshToken,
        });
      }
      log.Info("createOrUpdateKey succeed");

      return result;
    } catch (error) {
      console.error("Error creating or updating key:", error);
      throw error;
    }
  };
}

module.exports = KeyTokenService;
