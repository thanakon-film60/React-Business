import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * API to setup media tables
 * GET /api/setup-media-tables - Create media_files and related tables
 */

export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    console.log("🔄 Starting media tables setup...");

    // Drop existing tables
    await client.query("DROP TABLE IF EXISTS media_tags CASCADE");
    await client.query("DROP TABLE IF EXISTS media_files CASCADE");
    await client.query("DROP TABLE IF EXISTS media_categories CASCADE");

    // Create media_categories table
    await client.query(`
      CREATE TABLE media_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create media_files table
    await client.query(`
      CREATE TABLE media_files (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('image', 'video', 'clip')),
        file_url TEXT,
        thumbnail_base64 TEXT,
        file_base64 TEXT,
        mime_type VARCHAR(100),
        file_size BIGINT,
        file_size_display VARCHAR(50),
        duration VARCHAR(20),
        duration_seconds INTEGER,
        width INTEGER,
        height INTEGER,
        category_id INTEGER REFERENCES media_categories(id),
        category_name VARCHAR(100),
        is_favorite BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        is_public BOOLEAN DEFAULT TRUE,
        view_count INTEGER DEFAULT 0,
        download_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        uploaded_by INTEGER,
        uploaded_by_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        search_vector TSVECTOR
      )
    `);

    // Create media_tags table
    await client.query(`
      CREATE TABLE media_tags (
        id SERIAL PRIMARY KEY,
        media_id INTEGER REFERENCES media_files(id) ON DELETE CASCADE,
        tag_name VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(media_id, tag_name)
      )
    `);

    // Create indexes
    await client.query(
      "CREATE INDEX idx_media_files_type ON media_files(file_type)"
    );
    await client.query(
      "CREATE INDEX idx_media_files_category ON media_files(category_id)"
    );
    await client.query(
      "CREATE INDEX idx_media_files_category_name ON media_files(category_name)"
    );
    await client.query(
      "CREATE INDEX idx_media_files_favorite ON media_files(is_favorite) WHERE is_favorite = TRUE"
    );
    await client.query(
      "CREATE INDEX idx_media_files_created ON media_files(created_at DESC)"
    );
    await client.query(
      "CREATE INDEX idx_media_files_views ON media_files(view_count DESC)"
    );
    await client.query(
      "CREATE INDEX idx_media_tags_name ON media_tags(tag_name)"
    );
    await client.query(
      "CREATE INDEX idx_media_tags_media ON media_tags(media_id)"
    );

    // Create update timestamp function and trigger
    await client.query(`
      CREATE OR REPLACE FUNCTION update_media_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await client.query(
      "DROP TRIGGER IF EXISTS trigger_update_media_timestamp ON media_files"
    );

    await client.query(`
      CREATE TRIGGER trigger_update_media_timestamp
        BEFORE UPDATE ON media_files
        FOR EACH ROW
        EXECUTE FUNCTION update_media_timestamp()
    `);

    // Insert default categories
    await client.query(`
      INSERT INTO media_categories (name, description) VALUES
        ('Before/After', 'รูปภาพก่อน-หลัง'),
        ('Surgery Videos', 'วิดีโอการผ่าตัด'),
        ('Promo Clips', 'คลิปโปรโมท'),
        ('Consultations', 'การให้คำปรึกษา'),
        ('Training', 'วิดีโอฝึกอบรม'),
        ('Social Media', 'คอนเทนต์ Social Media'),
        ('Marketing', 'สื่อการตลาด'),
        ('Testimonials', 'รีวิวจากลูกค้า'),
        ('Products', 'รูปภาพสินค้า'),
        ('Events', 'งานอีเวนต์')
    `);

    // Insert sample data
    await client.query(`
      INSERT INTO media_files (
        name, description, file_type, file_url, thumbnail_base64,
        mime_type, file_size, file_size_display, category_name,
        is_favorite, view_count, uploaded_by_name, duration
      ) VALUES 
      (
        'Before-After-001.jpg',
        'รูปก่อน-หลังทำหน้า',
        'image',
        'https://picsum.photos/seed/1/800/600',
        'https://picsum.photos/seed/1/400/300',
        'image/jpeg',
        2516582,
        '2.4 MB',
        'Before/After',
        TRUE,
        1250,
        'Admin',
        NULL
      ),
      (
        'Surgery-Video-001.mp4',
        'วิดีโอการผ่าตัดแบบ Training',
        'video',
        'https://picsum.photos/seed/2/800/600',
        'https://picsum.photos/seed/2/400/300',
        'video/mp4',
        48023142,
        '45.8 MB',
        'Surgery Videos',
        FALSE,
        890,
        'Admin',
        '12:45'
      ),
      (
        'Promo-Clip-001.mp4',
        'คลิปโปรโมทสำหรับ Social Media',
        'clip',
        'https://picsum.photos/seed/3/800/600',
        'https://picsum.photos/seed/3/400/300',
        'video/mp4',
        15938355,
        '15.2 MB',
        'Promo Clips',
        TRUE,
        2340,
        'Admin',
        '00:45'
      ),
      (
        'Patient-Photo-002.jpg',
        'รูปปรึกษาผู้ป่วย',
        'image',
        'https://picsum.photos/seed/4/800/600',
        'https://picsum.photos/seed/4/400/300',
        'image/jpeg',
        1887436,
        '1.8 MB',
        'Consultations',
        FALSE,
        560,
        'Admin',
        NULL
      ),
      (
        'Training-Video-002.mp4',
        'วิดีโอฝึกอบรมพนักงาน',
        'video',
        'https://picsum.photos/seed/5/800/600',
        'https://picsum.photos/seed/5/400/300',
        'video/mp4',
        93739212,
        '89.4 MB',
        'Training',
        TRUE,
        1890,
        'Admin',
        '28:30'
      ),
      (
        'Social-Clip-002.mp4',
        'คลิปสำหรับ TikTok',
        'clip',
        'https://picsum.photos/seed/6/800/600',
        'https://picsum.photos/seed/6/400/300',
        'video/mp4',
        8912896,
        '8.5 MB',
        'Social Media',
        FALSE,
        4560,
        'Admin',
        '00:30'
      )
    `);

    // Insert sample tags
    await client.query(`
      INSERT INTO media_tags (media_id, tag_name) VALUES
        (1, 'Before/After'),
        (1, 'Face'),
        (2, 'Surgery'),
        (2, 'Training'),
        (3, 'Promotion'),
        (3, 'Social'),
        (4, 'Patient'),
        (4, 'Consultation'),
        (5, 'Training'),
        (5, 'Medical'),
        (6, 'Social'),
        (6, 'TikTok')
    `);

    console.log("✅ Media tables setup completed!");

    return NextResponse.json({
      success: true,
      message: "Media tables created successfully!",
      tables: ["media_categories", "media_files", "media_tags"],
      sampleData: {
        categories: 10,
        files: 6,
        tags: 12,
      },
    });
  } catch (error) {
    console.error("❌ Error setting up tables:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
