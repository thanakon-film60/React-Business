import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * LINE Sharing API
 *
 * This API generates shareable links for LINE messaging platform
 * Supports video sharing with inline playback capability
 *
 * POST /api/line-share - Generate LINE share URL
 * GET /api/line-share/video/[id] - Get video for LINE embed playback
 */

interface LineShareRequest {
  mediaId: number;
  mediaType: "image" | "video" | "clip";
  title: string;
  description?: string;
  thumbnailUrl?: string;
  mediaUrl: string;
}

interface LineShareResponse {
  success: boolean;
  shareUrl: string;
  webShareUrl?: string;
  embedUrl?: string;
  streamUrl?: string;
  message?: string;
  error?: string;
}

// LINE Share URL formats
const LINE_SHARE_BASE = "https://social-plugins.line.me/lineit/share";
const LINE_MSG_BASE = "line://msg/text/";

export async function POST(
  request: NextRequest
): Promise<NextResponse<LineShareResponse>> {
  try {
    const body: LineShareRequest = await request.json();

    const { mediaId, mediaType, title, description } = body;

    // Validate required fields
    if (!mediaId || !mediaType || !title) {
      return NextResponse.json(
        {
          success: false,
          shareUrl: "",
          error: "Missing required fields: mediaId, mediaType, title",
        },
        { status: 400 }
      );
    }

    // Get base URL dynamically from headers or environment
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `${protocol}://${host}`);

    // Create embed URL for video playback page
    const embedUrl = `${baseUrl}/share/video/${mediaId}`;

    // Create stream URL for direct video access
    const streamUrl = `${baseUrl}/api/video-stream/${mediaId}`;

    // Create share message with video preview
    const shareText = createShareMessage(title, description, mediaType);

    // LINE Web Share URL (for desktop/browser)
    // This URL will make LINE fetch OG meta tags from our page
    const webShareUrl = `${LINE_SHARE_BASE}?url=${encodeURIComponent(
      embedUrl
    )}`;

    // LINE App Share URL (for mobile)
    // Send both text and URL for better experience
    const lineAppShareUrl = `${LINE_MSG_BASE}${encodeURIComponent(
      shareText + "\n\n" + embedUrl
    )}`;

    console.log(`📤 LINE Share generated for media ID: ${mediaId}`);
    console.log(`📎 Embed URL: ${embedUrl}`);
    console.log(`🎥 Stream URL: ${streamUrl}`);

    return NextResponse.json({
      success: true,
      shareUrl: lineAppShareUrl,
      webShareUrl: webShareUrl,
      embedUrl: embedUrl,
      streamUrl: streamUrl,
      message: "LINE share URL generated successfully",
    });
  } catch (error) {
    console.error("❌ Error generating LINE share URL:", error);

    return NextResponse.json(
      {
        success: false,
        shareUrl: "",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET - Get share info for a specific media
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mediaId = searchParams.get("mediaId");

  if (!mediaId) {
    return NextResponse.json(
      { success: false, error: "mediaId is required" },
      { status: 400 }
    );
  }

  // Return LINE sharing configuration
  return NextResponse.json({
    success: true,
    config: {
      lineShareBase: LINE_SHARE_BASE,
      lineMsgBase: LINE_MSG_BASE,
      supportedTypes: ["image", "video", "clip"],
      maxVideoSize: "50MB",
      recommendedFormats: ["mp4", "mov", "webm"],
      lineEmbedSupport: true,
      requirements: {
        https: true,
        ogTags: [
          "og:title",
          "og:description",
          "og:image",
          "og:video",
          "og:type",
        ],
        videoFormats: ["video/mp4 (H.264)", "video/webm"],
      },
    },
  });
}

// Helper function to create share message
function createShareMessage(
  title: string,
  description: string | undefined,
  mediaType: string
): string {
  const emoji =
    mediaType === "video" ? "🎬" : mediaType === "clip" ? "🎥" : "📸";
  let message = `${emoji} ${title}`;

  if (description) {
    message += `\n${description}`;
  }

  message += `\n\n▶️ ดูเลย:`;

  return message;
}
