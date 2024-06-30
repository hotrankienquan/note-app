const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const UserModel = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      // autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
    },
    hashId : {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ""
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    nameWithRole: {
      type: Sequelize.STRING,
      get(){
        return `${this.username} - ${JSON.stringify(this.role)}`
      }
    }, 
  }, {
    timestamps: true,
    createdAt: true,
    updatedAt: "updateTimestamp", // updatedAt should be called updateTimestamp
  });
  return UserModel;
};

