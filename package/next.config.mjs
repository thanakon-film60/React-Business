/** @type {import('next').NextConfig} */

const POLICY_FILENAME = "ข้อบังคับเกี่ยวกับการทำงาน ฉบับปรับปรุง ปี 2568.pdf";

const POLICY_PATH = `/downloads/${encodeURIComponent(POLICY_FILENAME)}`;

const CONTENT_DISPOSITION = `inline; filename="${POLICY_FILENAME}"; filename*=UTF-8''${encodeURIComponent(
  POLICY_FILENAME
)}`;

const nextConfig = {
  images: {
    unoptimized: true,
  },

  async redirects() {
    return [
      { source: "/dl/policy-2568", destination: POLICY_PATH, permanent: false },
    ];
  },

  async headers() {
    return [
      {
        source: "/downloads/:path*.pdf",
        headers: [
          { key: "Content-Type", value: "application/pdf" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cache-Control", value: "private, no-store" },
          { key: "Content-Disposition", value: CONTENT_DISPOSITION },
        ],
      },
    ];
  },
};

export default nextConfig;
