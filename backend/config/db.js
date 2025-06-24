const { Sequelize } = require('sequelize');
require('dotenv').config();
console.log("DATABASE ENV CHECK:", {
  DB: process.env.MYSQLDATABASE,
  USER: process.env.MYSQLUSER,
  PASS: process.env.MYSQLPASSWORD,
  HOST: process.env.MYSQLHOST,
  PORT: process.env.MYSQLPORT
});
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
