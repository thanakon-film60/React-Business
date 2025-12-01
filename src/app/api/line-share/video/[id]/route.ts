import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
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

    // Get base URL dynamically
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

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
        file_size,
        file_size_display,
        duration,
        duration_seconds,
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

    // Construct URLs for LINE compatibility
    const pageUrl = `${baseUrl}/share/video/${videoId}`;
    const streamUrl = `${baseUrl}/api/video-stream/${videoId}`;

    // Determine the best video URL
    // Priority: external URL > stream URL (for base64 stored videos)
    let videoUrl = video.file_url;
    if (!videoUrl || videoUrl.startsWith("data:")) {
      videoUrl = streamUrl;
    }

    // Determine thumbnail URL
    let thumbnailUrl = video.thumbnail_base64;
    if (!thumbnailUrl || thumbnailUrl.startsWith("data:")) {
      // Use a placeholder or the first frame
      thumbnailUrl = `${baseUrl}/images/video-placeholder.jpg`;
    }

    // Return video data optimized for LINE playback
    return NextResponse.json({
      success: true,
      data: {
        id: video.id,
        name: video.name,
        description: video.description,
        type: video.file_type,
        url: videoUrl,
        streamUrl: streamUrl,
        pageUrl: pageUrl,
        thumbnail: thumbnailUrl,
        mimeType: video.mime_type || "video/mp4",
        size: video.file_size_display,
        duration: video.duration,
        durationSeconds: video.duration_seconds || 0,
        width: video.width || 1280,
        height: video.height || 720,
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
        image: thumbnailUrl,
        video: videoUrl,
        streamUrl: streamUrl,
        type: "video.other",
        duration: video.duration,
        durationSeconds: video.duration_seconds || 0,
        width: video.width || 1280,
        height: video.height || 720,
        mimeType: video.mime_type || "video/mp4",
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
