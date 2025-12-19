const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres:7015892525%2B%2B@db.houhlbfagngkyrbbhmmi.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function setupLogsTable() {
  try {
    console.log("🔄 Connecting to Supabase...");

    // Create expense_logs table
    console.log("🔄 Creating expense_logs table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expense_logs (
        id SERIAL PRIMARY KEY,
        transaction_id INTEGER,
        user_id VARCHAR(100),
        source VARCHAR(50) DEFAULT 'line_bk',
        raw_message TEXT,
        parsed_type VARCHAR(10),
        parsed_amount DECIMAL(12, 2),
        account_info VARCHAR(100),
        transaction_time TIMESTAMP WITH TIME ZONE,
        ip_address VARCHAR(50),
        status VARCHAR(20) DEFAULT 'success',
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log("✅ expense_logs table created!");

    // Create indexes
    console.log("🔄 Creating indexes...");
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_expense_logs_user_id ON expense_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_expense_logs_created_at ON expense_logs(created_at DESC);
    `);
    console.log("✅ Indexes created!");

    // Check table structure
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'expense_logs'
      ORDER BY ordinal_position
    `);

    console.log("\n📋 expense_logs table structure:");
    result.rows.forEach((row) => {
      console.log(`   - ${row.column_name}: ${row.data_type}`);
    });

    console.log("\n🎉 Log table setup complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await pool.end();
  }
}

setupLogsTable();
