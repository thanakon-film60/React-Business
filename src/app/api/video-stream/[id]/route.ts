import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * Video Streaming API for LINE In-App Playback
 *
 * This endpoint serves video content in a format compatible with LINE's in-app player
 * It handles range requests for seeking and proper streaming
 *
 * Requirements for LINE inline playback:
 * - MP4 format with H.264 codec
 * - HTTPS (required in production)
 * - Direct video URL (not HLS/streaming)
 * - Proper CORS headers
 * - Support for Range requests (for seeking)
 *
 * GET /api/video-stream/[id] - Stream video content
 */

// Common CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers":
    "Range, Accept-Ranges, Content-Range, Content-Length, Content-Type",
  "Access-Control-Expose-Headers":
    "Accept-Ranges, Content-Range, Content-Length",
  "X-Content-Type-Options": "nosniff",
};

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

    // Fetch video from database - use public schema explicitly
    const query = `
      SELECT 
        id,
        name,
        file_type,
        file_url,
        file_base64,
        mime_type,
        file_size
      FROM public.media_files
      WHERE id = $1 AND COALESCE(is_active, TRUE) = TRUE
    `;

    const result = await client.query(query, [videoId]);

    if (result.rows.length === 0) {
      return new NextResponse("Video not found", { status: 404 });
    }

    const video = result.rows[0];
    const mimeType = video.mime_type || "video/mp4";

    // If video is stored as external URL, redirect to it
    if (video.file_url && !video.file_url.startsWith("data:")) {
      return NextResponse.redirect(video.file_url);
    }

    // If video is stored as base64, decode and stream it
    if (video.file_base64) {
      let base64Data = video.file_base64;

      // Remove data URL prefix if present
      if (base64Data.startsWith("data:")) {
        const base64Index = base64Data.indexOf("base64,");
        if (base64Index !== -1) {
          base64Data = base64Data.substring(base64Index + 7);
        }
      }

      // Decode base64 to buffer
      const buffer = Buffer.from(base64Data, "base64");
      const contentLength = buffer.length;

      // Handle range requests for video seeking
      const range = request.headers.get("range");

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : contentLength - 1;
        const chunkSize = end - start + 1;

        const chunk = buffer.slice(start, end + 1);
        // Convert Buffer to Uint8Array for NextResponse compatibility
        const uint8Chunk = new Uint8Array(chunk);

        return new NextResponse(uint8Chunk, {
          status: 206,
          headers: {
            "Content-Range": `bytes ${start}-${end}/${contentLength}`,
            "Accept-Ranges": "bytes",
            "Content-Length": String(chunkSize),
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=31536000, immutable",
            ...corsHeaders,
          },
        });
      }

      // Full video response - convert Buffer to Uint8Array
      const uint8Buffer = new Uint8Array(buffer);
      return new NextResponse(uint8Buffer, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Content-Length": String(contentLength),
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
          ...corsHeaders,
        },
      });
    }

    // No video content available
    return new NextResponse("Video content not available", { status: 404 });
  } catch (error) {
    console.error("❌ Error streaming video:", error);
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
      ...corsHeaders,
      "Access-Control-Max-Age": "86400",
    },
  });
}

// Handle HEAD requests (LINE may use this to check video info)
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();

  try {
    const { id } = await params;
    const videoId = parseInt(id);

    if (isNaN(videoId)) {
      return new NextResponse(null, { status: 400 });
    }

    const query = `
      SELECT mime_type, file_size, file_base64
      FROM public.media_files
      WHERE id = $1 AND COALESCE(is_active, TRUE) = TRUE
    `;

    const result = await client.query(query, [videoId]);

    if (result.rows.length === 0) {
      return new NextResponse(null, { status: 404 });
    }

    const video = result.rows[0];
    const mimeType = video.mime_type || "video/mp4";

    // Calculate content length from base64 if stored
    let contentLength = video.file_size;
    if (video.file_base64 && !contentLength) {
      let base64Data = video.file_base64;
      if (base64Data.startsWith("data:")) {
        const base64Index = base64Data.indexOf("base64,");
        if (base64Index !== -1) {
          base64Data = base64Data.substring(base64Index + 7);
        }
      }
      contentLength = Math.floor(base64Data.length * 0.75);
    }

    return new NextResponse(null, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(contentLength || 0),
        "Accept-Ranges": "bytes",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("❌ Error in HEAD request:", error);
    return new NextResponse(null, { status: 500 });
  } finally {
    client.release();
  }
}
