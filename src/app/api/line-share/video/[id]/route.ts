import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * Video Embed Page API for LINE Sharing
 *
 * This endpoint returns the video data optimized for LINE in-app playback
 * GET /api/line-share/video/[id] - Get video for embedded playback
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();

  try {
    const { id } = await params;
    const videoId = parseInt(id);

    if (isNaN(videoId)) {
      return NextResponse.json(
        { success: false, error: "Invalid video ID" },
        { status: 400 }
      );
    }

    // Fetch video details from database
    const query = `
      SELECT 
        id,
        name,
        description,
        file_type,
        file_url,
        file_base64,
        thumbnail_base64,
        mime_type,
        file_size_display,
        duration,
        width,
        height,
        category_name,
        view_count
      FROM media_files
      WHERE id = $1 AND is_active = TRUE
    `;

    const result = await client.query(query, [videoId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 }
      );
    }

    const video = result.rows[0];

    // Increment view count
    await client.query(
      "UPDATE media_files SET view_count = view_count + 1 WHERE id = $1",
      [videoId]
    );

    // Return video data optimized for LINE playback
    return NextResponse.json({
      success: true,
      data: {
        id: video.id,
        name: video.name,
        description: video.description,
        type: video.file_type,
        url: video.file_url || video.file_base64,
        thumbnail: video.thumbnail_base64,
        mimeType: video.mime_type,
        size: video.file_size_display,
        duration: video.duration,
        width: video.width,
        height: video.height,
        category: video.category_name,
        views: video.view_count + 1,
      },
      // LINE Open Graph metadata for rich preview
      ogMeta: {
        title: video.name,
        description:
          video.description ||
          `${video.file_type === "clip" ? "คลิป" : "วิดีโอ"} - ${
            video.category_name || "Media Gallery"
          }`,
        image: video.thumbnail_base64 || video.file_url,
        video: video.file_url || video.file_base64,
        type: "video.other",
        duration: video.duration,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching video for LINE share:", error);

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
