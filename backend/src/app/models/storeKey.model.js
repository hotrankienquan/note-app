const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const StoreKeyModel = sequelize.define("store_key", {
    userId: {
      type: DataTypes.UUID
    },
    publicKey: {
      type: Sequelize.STRING,
    },
    privateKey: {
      type: Sequelize.STRING,
    },
    refreshToken: {
      type: Sequelize.STRING,
    },
    refreshTokenUsed: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  });
  return StoreKeyModel;
};
