const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres:7015892525%2B%2B@db.houhlbfagngkyrbbhmmi.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    console.log("🔄 Connecting to Supabase...");
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Connected to Supabase:", result.rows[0].now);

    // Create expense_transactions table
    console.log("🔄 Creating expense_transactions table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expense_transactions (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        note TEXT,
        slip_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log("✅ Table created successfully!");

    // Create indexes
    console.log("🔄 Creating indexes...");
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_expense_transactions_type ON expense_transactions(type);
      CREATE INDEX IF NOT EXISTS idx_expense_transactions_date ON expense_transactions(date DESC);
      CREATE INDEX IF NOT EXISTS idx_expense_transactions_category ON expense_transactions(category);
    `);
    console.log("✅ Indexes created successfully!");

    // Check table exists
    const tableCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'expense_transactions'
      ORDER BY ordinal_position
    `);
    console.log("\n📋 Table structure:");
    tableCheck.rows.forEach((row) => {
      console.log(`   - ${row.column_name}: ${row.data_type}`);
    });

    console.log("\n🎉 Database setup complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
