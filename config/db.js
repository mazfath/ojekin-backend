const mysql = require('mysql2/promise');
require('dotenv').config();

const dbUrl = process.env.MYSQL_URL; // Dari Railway

const pool = mysql.createPool({

  uri: dbUrl,

  uri: process.env.MYSQL_URL,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
