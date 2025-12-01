import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * Video Thumbnail API for LINE Open Graph
 *
 * LINE requires thumbnail images to be served via HTTPS URL
 * This endpoint serves the thumbnail image for a video
 *
 * GET /api/video-thumbnail/[id] - Get video thumbnail image
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
      return new NextResponse("Invalid video ID", { status: 400 });
    }

    // Fetch thumbnail from database - use public schema explicitly
    const query = `
      SELECT 
        thumbnail_base64,
        name
      FROM public.media_files
      WHERE id = $1 AND COALESCE(is_active, TRUE) = TRUE
    `;

    const result = await client.query(query, [videoId]);

    if (result.rows.length === 0) {
      return new NextResponse("Video not found", { status: 404 });
    }

    const video = result.rows[0];
    const thumbnailData = video.thumbnail_base64;

    // If no thumbnail, return a placeholder
    if (!thumbnailData) {
      // Return a simple placeholder image (1x1 transparent PNG)
      const placeholderBase64 =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      const placeholderBuffer = Buffer.from(placeholderBase64, "base64");

      return new NextResponse(new Uint8Array(placeholderBuffer), {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Length": String(placeholderBuffer.length),
          "Cache-Control": "public, max-age=86400",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Parse base64 data
    let base64Data = thumbnailData;
    let mimeType = "image/jpeg";

    // Extract mime type and data from data URL
    if (base64Data.startsWith("data:")) {
      const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        base64Data = matches[2];
      } else {
        const base64Index = base64Data.indexOf("base64,");
        if (base64Index !== -1) {
          base64Data = base64Data.substring(base64Index + 7);
        }
      }
    }

    // Decode base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");
    const uint8Buffer = new Uint8Array(buffer);

    return new NextResponse(uint8Buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=86400, immutable",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    });
  } catch (error) {
    console.error("❌ Error serving thumbnail:", error);
    return new NextResponse("Internal server error", { status: 500 });
  } finally {
    client.release();
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Max-Age": "86400",
    },
  });
}
