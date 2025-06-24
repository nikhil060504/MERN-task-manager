const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,     // database name
  process.env.MYSQLUSER,         // username
  process.env.MYSQLPASSWORD,     // password
  {
    host: process.env.MYSQLHOST, // host
    port: process.env.MYSQLPORT, // port
    dialect: 'mysql',
    logging: false,              // optional: disable SQL query logging
  }
);

module.exports = sequelize;
