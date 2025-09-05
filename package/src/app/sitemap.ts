// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tpp-thanakon.store";
  const now = new Date();

  const pages = [
    "/", // Home
    "/about", // About Us
    "/vision-mission", // Vision & Mission
    "/history", // Timeline / History
    "/go-green", // Sustainability (Go Green)
    "/investor-relations", // Investor Relations (hub)
    "/board", // Board of Directors
    "/executives", // Executive Team
    "/subsidiaries", // Subsidiaries (hub)
    "/subsidiaries/oman-air-cargo", // Oman Air Cargo (TH representation)
    "/products", // Products (hub)
    "/products/pakku", // Pakku Packaging catalog
    "/contact", // Contact
  ];

  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
