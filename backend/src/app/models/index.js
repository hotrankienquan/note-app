require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.storeKey = require("./storeKey.model.js")(sequelize, Sequelize);
db.noteModel = require("./note.model.js")(sequelize, Sequelize);
// db.users.hasOne(db.storeKey);
// db.storeKey.belongsTo(db.users);


// Define relationships
db.users.hasOne(db.storeKey, {
  foreignKey: 'userId',
  as: 'storeKey'
});
db.storeKey.belongsTo(db.users);

//relationship user and note model
db.users.hasMany(db.noteModel, {
  foreignKey: 'userId',
});
db.noteModel.belongsTo(db.users);


// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("--------------xxxxxxxxxxxxxxxxxx--------Connection has been established successfully." + "\n");
    return db.sequelize.sync();
    // {force: true}: remove old migrate => sync() refresh new migrate
  })
  .then(() => {
    console.log("--------Database synchronized--------");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err.message);
  });
  
module.exports = db;
