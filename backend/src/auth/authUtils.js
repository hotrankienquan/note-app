const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../middlewares/catchAll");
const db = require("../app/models");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const StoreKeyModel = db.storeKey;

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id", // id
  AUTHORIZATION: "x-atoken-id", // accesstoken
  REFRESHTOKEN: "x-rtoken-id", //refreshtoken
};

const createTokenPair = (payload, publicKey, privateKey) => {
  try {
    const accesstoken = jwt.sign(payload, publicKey, {
      expiresIn: "7d",
    });
    const refreshtoken = jwt.sign(payload, privateKey, {
      expiresIn: "31 days",
    });
    //verify
    // kí thì kí bằng private, trả private về cho user
    // user gửi private lên thì mình verify với public key của mình

    jwt.verify(accesstoken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error verify`, err);
      } else {
        console.log(`decode verify`, decode);
      }
    });
    return {
      accesstoken,
      refreshtoken,
    };
  } catch (error) {}
};

const authentication = asyncHandler(async function authenFuncV2(req, res, next) {

  /**
   * 1 check userId missing
   * 2. get access token
   * 3. verify token
   * 4. check user in bds
   * 5. check keystore with this userid
   * 6. ok all -> return next()
   */
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("user id is not valid");
  }
  //2

  const keyStore = await StoreKeyModel.findOne({
    where: {userId}
  })

  if (!keyStore) {
    throw new NotFoundError("not found keystore");
  }

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.user) {
        throw new AuthFailureError("invalid user id case check refresh token");
      }
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;

      return next();
    } catch (error) {
      throw error;
    }
  }
  //3
  const at = req.headers[HEADER.AUTHORIZATION];
  if (!at) {
    throw new AuthFailureError("access token invalid");
  }

  try {
    const decodeUser = jwt.verify(at, keyStore.publicKey);
    if (userId !== decodeUser.user) {
      throw new AuthFailureError("invalid user id");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log("line 97 auth utils authentication func",error);
    throw error;
  }
})

module.exports = {
  createTokenPair,
  authentication
};
