import { Pool } from "pg";

// Supabase Database Connection
const pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
