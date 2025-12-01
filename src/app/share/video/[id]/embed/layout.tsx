import { Metadata } from "next";
import { headers } from "next/headers";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Embed Layout - Minimal metadata for iframe embedding
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Video Player`,
    description: "Embedded video player",
    robots: {
      index: false,
      follow: false,
    },
    other: {
      "X-Frame-Options": "ALLOWALL",
    },
  };
}

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta httpEquiv="X-Frame-Options" content="ALLOWALL" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#000",
          overflow: "hidden",
        }}
      >
        {children}
      </body>
    </html>
  );
}
