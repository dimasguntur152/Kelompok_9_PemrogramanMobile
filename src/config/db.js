require('dotenv').config();
const mysql = require('mysql2/promise');

/**
 * MySQL Database Connection Pool for Kedai Tong Djajakarta
 * 
 * Menggunakan kredensial dari environment variable (.env):
 * - DB_HOST (default: localhost)
 * - DB_USER (default: root)
 * - DB_PASSWORD (default: kosong / XAMPP default)
 * - DB_NAME (default: kedai_tong_djajakarta)
 * - DB_PORT (default: 3306)
 */

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kedai_tong_djajakarta',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
