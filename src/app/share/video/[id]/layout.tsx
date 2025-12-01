import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for LINE Open Graph
// LINE requires specific OG meta tags for in-app video playback
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Get base URL from environment or headers
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  try {
    const response = await fetch(`${baseUrl}/api/line-share/video/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return getDefaultMetadata();
    }

    const data = await response.json();
    const video = data.data;
    const og = data.ogMeta;

    // Construct URLs
    const pageUrl = `${baseUrl}/share/video/${id}`;
    const videoStreamUrl = `${baseUrl}/api/video-stream/${id}`;
    const thumbnailUrl = og?.image || `${baseUrl}/images/video-placeholder.jpg`;

    // Title and description
    const title = og?.title || video?.name || "Video";
    const description =
      og?.description ||
      video?.description ||
      `Watch ${video?.type === "clip" ? "clip" : "video"} - Media Gallery`;

    return {
      title: title,
      description: description,
      // Standard Open Graph for LINE
      openGraph: {
        title: title,
        description: description,
        url: pageUrl,
        siteName: "Media Gallery",
        type: "video.other",
        images: [
          {
            url: thumbnailUrl,
            width: video?.width || 1280,
            height: video?.height || 720,
            alt: title,
          },
        ],
        videos: [
          {
            url: videoStreamUrl,
            secureUrl: videoStreamUrl,
            type: video?.mimeType || "video/mp4",
            width: video?.width || 1280,
            height: video?.height || 720,
          },
        ],
        locale: "th_TH",
      },
      // Twitter Player Card (also used by LINE)
      twitter: {
        card: "player",
        title: title,
        description: description,
        images: [thumbnailUrl],
        players: [
          {
            playerUrl: pageUrl,
            streamUrl: videoStreamUrl,
            width: video?.width || 1280,
            height: video?.height || 720,
          },
        ],
      },
      // Additional meta tags for LINE
      other: {
        "og:video:url": videoStreamUrl,
        "og:video:secure_url": videoStreamUrl,
        "og:video:type": video?.mimeType || "video/mp4",
        "og:video:width": String(video?.width || 1280),
        "og:video:height": String(video?.height || 720),
        "og:video:duration": String(video?.durationSeconds || 0),
        // LINE specific
        "line:title": title,
        "line:description": description,
        "line:image": thumbnailUrl,
      },
    };
  } catch (error) {
    console.error("Error generating video metadata:", error);
    return getDefaultMetadata();
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
