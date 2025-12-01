const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres:Bjh12345!!@n8n.bjhbangkok.com:5432/postgres",
  ssl: false,
});

async function checkVideos() {
  try {
    console.log("Connecting to database...");

    // Check public schema - ID 12 with all columns
    const result1 = await pool.query(`
      SELECT id, name, file_type, is_active, mime_type,
             CASE WHEN file_base64 IS NOT NULL THEN LENGTH(file_base64) ELSE 0 END as base64_length
      FROM public.media_files 
      WHERE id = 12
    `);
    console.log("PUBLIC schema - File ID 12:");
    console.log(JSON.stringify(result1.rows, null, 2));

    // Also check what the current search_path is
    const pathResult = await pool.query("SHOW search_path");
    console.log(
      "\nCurrent search_path:",
      JSON.stringify(pathResult.rows, null, 2)
    );

    // Test the EXACT query that the API uses
    const apiQuery = await pool.query(`
      SELECT id, name, file_type, is_active, mime_type,
             CASE WHEN file_base64 IS NOT NULL THEN LENGTH(file_base64) ELSE 0 END as base64_length
      FROM media_files
      WHERE id = 12 AND is_active = TRUE
    `);
    console.log(
      "\nAPI Query result (media_files WHERE id=12 AND is_active=TRUE):"
    );
    console.log(JSON.stringify(apiQuery.rows, null, 2));

    // Check without is_active filter
    const apiQuery2 = await pool.query(`
      SELECT id, name, file_type, is_active, mime_type,
             CASE WHEN file_base64 IS NOT NULL THEN LENGTH(file_base64) ELSE 0 END as base64_length
      FROM media_files
      WHERE id = 12
    `);
    console.log("\nWithout is_active filter:");
    console.log(JSON.stringify(apiQuery2.rows, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await pool.end();
  }
}
checkVideos();
