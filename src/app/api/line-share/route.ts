import { NextRequest, NextResponse } from "next/server";

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

    const { mediaId, mediaType, title, description, thumbnailUrl, mediaUrl } =
      body;

    // Validate required fields
    if (!mediaId || !mediaType || !title || !mediaUrl) {
      return NextResponse.json(
        {
          success: false,
          shareUrl: "",
          error: "Missing required fields: mediaId, mediaType, title, mediaUrl",
        },
        { status: 400 }
      );
    }

    // Get base URL from environment or request
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    // Create embed URL for video playback within LINE
    // This URL will serve an optimized video player page
    const embedUrl = `${baseUrl}/share/video/${mediaId}`;

    // Create share message with video preview
    const shareText = createShareMessage(
      title,
      description,
      embedUrl,
      mediaType
    );

    // LINE Web Share URL (for desktop/browser)
    const webShareUrl = `${LINE_SHARE_BASE}?url=${encodeURIComponent(
      embedUrl
    )}&text=${encodeURIComponent(shareText)}`;

    // LINE App Share URL (for mobile)
    const lineAppShareUrl = `${LINE_MSG_BASE}${encodeURIComponent(
      shareText + "\n\n" + embedUrl
    )}`;

    console.log(`📤 LINE Share generated for media ID: ${mediaId}`);
    console.log(`📎 Embed URL: ${embedUrl}`);

    return NextResponse.json({
      success: true,
      shareUrl: lineAppShareUrl,
      webShareUrl: webShareUrl,
      embedUrl: embedUrl,
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
    },
  });
}

// Helper function to create share message
function createShareMessage(
  title: string,
  description: string | undefined,
  url: string,
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
