import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for LINE Open Graph
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/line-share/video/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        title: "Video - Media Gallery",
        description: "Watch video",
      };
    }

    const data = await response.json();
    const video = data.data;
    const og = data.ogMeta;

    return {
      title: og?.title || video?.name || "Video",
      description: og?.description || "Watch video in Media Gallery",
      openGraph: {
        title: og?.title || video?.name,
        description: og?.description,
        type: "video.other",
        images: og?.image ? [{ url: og.image }] : [],
        videos: og?.video
          ? [
              {
                url: og.video,
                type: video?.mimeType || "video/mp4",
              },
            ]
          : [],
      },
      twitter: {
        card: "player",
        title: og?.title || video?.name,
        description: og?.description,
        images: og?.image ? [og.image] : [],
      },
    };
  } catch (error) {
    return {
      title: "Video - Media Gallery",
      description: "Watch video",
    };
  }
}

export default function VideoShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
