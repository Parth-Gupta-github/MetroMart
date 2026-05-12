import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db/pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  try {
    console.log('Initializing database...');
    console.log('Pool type:', typeof pool.query);

    // Test connection
    try {
      const testResult = await pool.query('SELECT 1 as test');
      console.log('Connection test result:', testResult.rows);
    } catch (connError) {
      console.error('Connection test failed:', connError.message);
    }

    // Read schema.sql
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema file...');
    await pool.query(schemaSQL);

    // Grant permissions to service role
    console.log('Granting permissions...');
    await pool.query(`
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
    `);

    console.log('✅ Database initialized successfully!');

    // Optionally run DDL for sample data
    const ddlPath = path.join(__dirname, '..', 'ddl.sql');
    if (fs.existsSync(ddlPath)) {
      console.log('Loading sample data...');
      const ddlSQL = fs.readFileSync(ddlPath, 'utf8');
      const ddlStatements = ddlSQL.split(';').filter(stmt => stmt.trim().length > 0);

      for (const statement of ddlStatements) {
        if (statement.trim()) {
          console.log('Executing DDL:', statement.trim().substring(0, 50) + '...');
          await pool.query(statement);
        }
      }
      console.log('✅ Sample data loaded!');
    }

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    process.exit();
  }
}

initDatabase();
