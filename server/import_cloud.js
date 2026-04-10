const mariadb = require('mariadb');
const fs = require('fs');
require('dotenv').config();

async function runImport() {
    let conn;
    try {
        // 1. Connect using the MariaDB-specific driver (handles Protocol 11)
        conn = await mariadb.createConnection({
            host: process.env.DB_HOST, 
            port: process.env.DB_PORT,
            user: process.env.DB_USER, 
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false } // Required for Aiven
        });

        console.log("🚀 Connected to Aiven (Protocol 11 recognized!)");

        // 2. Read your SQL file
        const sql = fs.readFileSync('C:/careerflow_db.sql', 'utf8');
        
        // 3. Split the file into individual commands
        // We split by ';' but ignore semicolons inside quotes
        const statements = sql.split(/;(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/);

        console.log(`📦 Starting import of ${statements.length} commands...`);

        for (let statement of statements) {
            if (statement.trim()) {
                await conn.query(statement);
            }
        }

        console.log("✅ DATA IMPORT COMPLETE! CareerFlow is live.");

    } catch (err) {
        console.error("❌ ERROR:", err.message);
    } finally {
        if (conn) conn.end();
        process.exit();
    }
}

runImport();