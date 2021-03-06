//fichier configuration de Sequelize
const dbConfig = require('../config/db');
const Sequelize = require("sequelize");
const path = require('path');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: 3306,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

      try {
         sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user")(sequelize, Sequelize);
db.posts = require('./post')(sequelize, Sequelize);
db.comments= require('./comment')(sequelize, Sequelize);

db.users.hasMany(db.posts)
db.posts.belongsTo(db.users, {onDelete: "CASCADE",})

db.posts.hasMany(db.comments)
db.comments.belongsTo(db.posts, {onDelete: "CASCADE",})

db.users.hasMany(db.comments)
db.comments.belongsTo(db.users, {onDelete: "CASCADE",})

db.sequelize.sync();

module.exports = db;

