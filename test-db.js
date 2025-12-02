const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres:Bjh12345!!@n8n.bjhbangkok.com:5432/postgres",
  ssl: false,
});

async function test() {
  const client = await pool.connect();
  try {
    // Test the EXACT query that video-stream API uses
    const result = await client.query(`
      SELECT id, name, is_active, mime_type,
             CASE WHEN file_base64 IS NOT NULL THEN LENGTH(file_base64) ELSE 0 END as base64_len
      FROM public.media_files
      WHERE id = 12 AND COALESCE(is_active, TRUE) = TRUE
    `);

    console.log("Query Result (with COALESCE fix):");
    console.log(JSON.stringify(result.rows, null, 2));

    if (result.rows.length === 0) {
      // Check if record exists at all
      const check = await client.query(
        `SELECT id, name, is_active FROM public.media_files WHERE id = 12`
      );
      console.log("\nRecord exists check:");
      console.log(JSON.stringify(check.rows, null, 2));
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

test();
