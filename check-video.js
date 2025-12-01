const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres:Bjh12345!!@n8n.bjhbangkok.com:5432/postgres",
  ssl: false,
});

async function checkVideos() {
  try {
    console.log("Connecting to database...");

    // Set search path to BJH-Server schema
    await pool.query('SET search_path TO "BJH-Server"');

    // List ALL videos
    const result = await pool.query(`
      SELECT id, name, file_type, file_url, mime_type
      FROM media_files 
      WHERE file_type IN ('video', 'clip')
      ORDER BY id DESC
      LIMIT 10
    `);
    console.log("All videos (file_type = video/clip):");
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await pool.end();
  }
}
checkVideos();
