// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tpp-thanakon.store";
  const now = new Date();

  const pages = [
    "/",
    "/about",
    "/vision-mission",
    "/history",
    "/go-green",
    "/investor-relations",
    "/board",
    "/executives",
    "/subsidiaries",
    "/subsidiaries/oman-air-cargo",
    "/products",
    "/products/pakku",
    "/contact",
  ];

  return pages.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));
}
