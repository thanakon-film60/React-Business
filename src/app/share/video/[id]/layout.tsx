import { Metadata } from "next";
import pool from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * LINE Video Sharing - Open Graph Meta Tags
 *
 * Requirements for LINE inline video playback:
 * 1. og:type = "video.other"
 * 2. og:video = direct MP4 URL (HTTPS required) - MUST be actual .mp4 file
 * 3. og:video:secure_url = same as og:video
 * 4. og:video:type = "video/mp4"
 * 5. og:video:width and og:video:height
 * 6. og:image = thumbnail URL (must be HTTPS, not data URL)
 *
 * IMPORTANT for LINE inline playback:
 * - Video URL must point to actual MP4 file (not streaming/HLS)
 * - Video should be under 10MB for best experience
 * - H.264 codec required
 * - If video is stored as base64, we use streaming endpoint with .mp4 extension
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const videoId = parseInt(id);

  if (isNaN(videoId)) {
    return getDefaultMetadata();
  }

  // Use hardcoded base URL for production
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://tpp-thanakon.store";

  let client;
  try {
    client = await pool.connect();

    // Fetch video directly from database for server-side rendering
    const query = `
      SELECT 
        id,
        name,
        description,
        file_type,
        file_url,
        mime_type,
        duration,
        duration_seconds,
        width,
        height,
        category_name
      FROM media_files
      WHERE id = $1 AND is_active = TRUE
    `;

    const result = await client.query(query, [videoId]);

    if (result.rows.length === 0) {
      return getDefaultMetadata();
    }

    const video = result.rows[0];

    // Construct URLs
    const pageUrl = `${baseUrl}/share/video/${id}`;

    // For LINE inline playback, we need a direct video URL
    // Use streaming endpoint for database-stored videos (handles Range requests)
    // Only use external URL if it's a full CDN/external URL
    let videoUrl: string;
    if (video.file_url && video.file_url.startsWith("http")) {
      // External CDN URL - use directly
      videoUrl = video.file_url;
    } else {
      // Database stored video (base64) or local file - use streaming API
      // The streaming API handles proper video delivery with Range requests
      videoUrl = `${baseUrl}/api/video-stream/${id}`;
    } // Thumbnail URL via API
    const thumbnailUrl = `${baseUrl}/api/video-thumbnail/${id}`;

    // Embed URL for player iframe
    const embedUrl = `${baseUrl}/share/video/${id}/embed`;

    // Title and description
    const title = video.name || "Video";
    const description =
      video.description ||
      `ดู${video.file_type === "clip" ? "คลิป" : "วิดีโอ"} - ${
        video.category_name || "Media Gallery"
      }`;

    const videoWidth = video.width || 1280;
    const videoHeight = video.height || 720;
    const mimeType = video.mime_type || "video/mp4";
    const durationSeconds = video.duration_seconds || 0;

    return {
      title: title,
      description: description,
      // Standard Open Graph for LINE Video
      openGraph: {
        title: title,
        description: description,
        url: pageUrl,
        siteName: "BJH Media Gallery",
        type: "video.other",
        images: [
          {
            url: thumbnailUrl,
            width: videoWidth,
            height: videoHeight,
            alt: title,
          },
        ],
        videos: [
          {
            url: videoUrl,
            secureUrl: videoUrl,
            type: mimeType,
            width: videoWidth,
            height: videoHeight,
          },
        ],
        locale: "th_TH",
      },
      // Twitter Player Card (LINE uses this for inline player)
      twitter: {
        card: "player",
        title: title,
        description: description,
        images: [thumbnailUrl],
        players: [
          {
            playerUrl: embedUrl,
            streamUrl: videoUrl,
            width: videoWidth,
            height: videoHeight,
          },
        ],
      },
      // Additional meta tags for LINE and other platforms
      other: {
        // Primary video meta tags
        "og:video": videoUrl,
        "og:video:url": videoUrl,
        "og:video:secure_url": videoUrl,
        "og:video:type": mimeType,
        "og:video:width": String(videoWidth),
        "og:video:height": String(videoHeight),
        "og:video:duration": String(durationSeconds),

        // Twitter player tags (LINE compatible)
        "twitter:player": embedUrl,
        "twitter:player:width": String(videoWidth),
        "twitter:player:height": String(videoHeight),
        "twitter:player:stream": videoUrl,
        "twitter:player:stream:content_type": mimeType,

        // LINE specific meta tags
        "line:title": title,
        "line:description": description,
        "line:image": thumbnailUrl,
      },
    };
  } catch (error) {
    console.error("Error generating video metadata:", error);
    return getDefaultMetadata();
  } finally {
    if (client) {
      client.release();
    }
  }
}

function getDefaultMetadata(): Metadata {
  return {
    title: "Video - Media Gallery",
    description: "Watch video in Media Gallery",
    openGraph: {
      title: "Video - Media Gallery",
      description: "Watch video",
      type: "video.other",
    },
  };
}

export default function VideoShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
