const mysql = require('mysql2');
const dotenv = require('dotenv').config();

// Load environment variables
const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

// Create a connection pool to manage multiple connections
const pool = mysql.createPool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
  connection.release(); 
});


module.exports = pool;
