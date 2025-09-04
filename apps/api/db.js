import dotenv from 'dotenv-mono';
import fs from "fs";
import mysql from 'mysql2/promise';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_MYSQLHOST,
  user: process.env.DB_MYSQLUSER,
  password: process.env.DB_MYSQLPASSWORD,
  database: process.env.DB_MYSQLDATABASE,
  port: process.env.DB_MYSQLPORT,
  ssl: {
    ca: fs.readFileSync(process.env.DB_MYSQL_ssl_CA),
  },
});

export default pool;
