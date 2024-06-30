const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const NoteModel = sequelize.define("note", {
        userId: {
            type: DataTypes.UUID
        },
        title: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.TEXT('long')
        }
      }, {
        timestamps: true,
        createdAt: true,
        updatedAt: "updateTimestamp", // updatedAt should be called updateTimestamp
      });
      return NoteModel;
}