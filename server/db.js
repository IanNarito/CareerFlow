const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = mysql.createPool({
  // It will try to use the .env value, otherwise it uses the XAMPP default
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',      
  password: process.env.DB_PASS || '',      
  database: process.env.DB_NAME || 'careerflow_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Logic to check the connection on start
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Failed: ", err.message);
  } else {
    console.log("✅ Database Connected: careerflow_db");
    connection.release();
  }
});

module.exports = pool.promise();