/**
 * SEO Configuration สำหรับ TPP (Thai Packaging & Printing)
 * สำหรับ Next.js 15 App Router ใช้ Metadata API แทน next-seo
 * Config นี้เก็บไว้เป็น reference สำหรับค่า default
 */
export const SEO_CONFIG = {
  titleTemplate: "%s | TPP",
  defaultTitle:
    "TPP | ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง | บรรจุภัณฑ์และงานพิมพ์คุณภาพ",
  description:
    "TPP (Thai Packaging & Printing PCL) - บริษัท ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง จำกัด (มหาชน) ผู้นำด้านบรรจุภัณฑ์และงานพิมพ์ในประเทศไทย | บริการครบวงจร คุณภาพระดับโลก | ติดต่อ TPP วันนี้",

  canonical: "https://www.tpp.co.th",

  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://www.tpp.co.th",
    siteName: "TPP - Thai Packaging & Printing",
    title: "TPP | ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง | บรรจุภัณฑ์และงานพิมพ์",
    description:
      "TPP (Thai Packaging & Printing PCL) - บริษัท ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง จำกัด (มหาชน) ผู้นำด้านบรรจุภัณฑ์และงานพิมพ์ในประเทศไทย",
    images: [
      {
        url: "https://www.tpp.co.th/images/logo/LOGO-TPP-SIDE_9.png",
        width: 1200,
        height: 630,
        alt: "TPP Logo - Thai Packaging & Printing",
        type: "image/png",
      },
    ],
  },

  twitter: {
    handle: "@tpppcl",
    site: "@tpppcl",
    cardType: "summary_large_image",
  },

  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      name: "keywords",
      content:
        "TPP, Thai Packaging and Printing, ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง, TPPPCL, บรรจุภัณฑ์, Printing Solutions, งานพิมพ์, Packaging Thailand, กล่องกระดาษ, corrugated box, กล่องลูกฟูก, offset printing, งานพิมพ์ออฟเซ็ท, flexible packaging, บรรจุภัณฑ์อ่อน, label printing, สติ๊กเกอร์, packaging company thailand, printing company thailand, บริษัทบรรจุภัณฑ์, บริษัทงานพิมพ์, SET:TPP",
    },
    {
      name: "author",
      content: "Thai Packaging & Printing PCL",
    },
    {
      name: "geo.region",
      content: "TH-10",
    },
    {
      name: "geo.placename",
      content: "Bangkok",
    },
    {
      name: "language",
      content: "Thai",
    },
    {
      httpEquiv: "x-ua-compatible",
      content: "IE=edge",
    },
  ],

  additionalLinkTags: [
    {
      rel: "icon",
      href: "/TPP.ico",
    },
    {
      rel: "apple-touch-icon",
      href: "/images/logo/LOGO-TPP-SIDE_9.png",
      sizes: "76x76",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
  ],

  robotsProps: {
    nosnippet: false,
    notranslate: false,
    noimageindex: false,
    noarchive: false,
    maxSnippet: -1,
    maxImagePreview: "large",
    maxVideoPreview: -1,
  },
};

/**
 * JSON-LD Organization Schema - เพิ่มประสิทธิภาพสำหรับการค้นหา "TPP" และ "Thai Packaging & Printing"
 */
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TPP - Thai Packaging & Printing",
  legalName: "บริษัท ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง จำกัด (มหาชน)",
  alternateName: [
    "TPP",
    "TPPPCL",
    "Thai Packaging & Printing",
    "ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง",
    "Thai Packaging and Printing PCL",
  ],
  url: "https://www.tpp.co.th",
  logo: "https://www.tpp.co.th/images/logo/LOGO-TPP-SIDE_9.png",
  description:
    "TPP - บริษัท ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง จำกัด (มหาชน) ผู้นำด้านบรรจุภัณฑ์และงานพิมพ์ในประเทศไทย | Leading packaging & printing solutions provider in Thailand | SET:TPP",
  foundingDate: "1977",
  email: "ir@tpp.co.th",
  telephone: "+66-2-xxx-xxxx",
  address: {
    "@type": "PostalAddress",
    addressCountry: "TH",
    addressLocality: "Bangkok",
    addressRegion: "Bangkok",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "13.7563",
    longitude: "100.5018",
  },
  areaServed: {
    "@type": "Country",
    name: "Thailand",
  },
  sameAs: [
    "https://www.facebook.com/tpppcl",
    "https://www.linkedin.com/company/thai-packaging-printing",
    "https://www.set.or.th/th/market/product/stock/quote/TPP/overview",
  ],
  knowsAbout: [
    "Packaging",
    "Printing",
    "Corrugated Box",
    "กล่องลูกฟูก",
    "Offset Printing",
    "งานพิมพ์ออฟเซ็ท",
    "Flexible Packaging",
    "บรรจุภัณฑ์อ่อน",
    "Label Printing",
    "สติ๊กเกอร์",
    "บรรจุภัณฑ์",
    "งานพิมพ์",
  ],
};

/**
 * JSON-LD LocalBusiness Schema - สำหรับการค้นหาในพื้นที่
 */
export const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.tpp.co.th/#organization",
  name: "TPP - Thai Packaging & Printing",
  alternateName: "ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง",
  description:
    "บริษัท ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง จำกัด (มหาชน) ผู้นำด้านบรรจุภัณฑ์และงานพิมพ์ในประเทศไทย",
  url: "https://www.tpp.co.th",
  image: "https://www.tpp.co.th/images/logo/LOGO-TPP-SIDE_9.png",
  priceRange: "$$",
  telephone: "+66-2-xxx-xxxx",
  email: "ir@tpp.co.th",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangkok",
    addressRegion: "Bangkok",
    addressCountry: "TH",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "13.7563",
    longitude: "100.5018",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/tpppcl",
    "https://www.linkedin.com/company/thai-packaging-printing",
    "https://www.set.or.th/th/market/product/stock/quote/TPP/overview",
  ],
};

/**
 * สร้าง BreadcrumbList Schema
 */
export function createBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://www.tpp.co.th${item.url}`,
    })),
  };
}

/**
 * สร้าง Article Schema สำหรับบทความ/ข่าว
 */
export function createArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author = "TPP - Thai Packaging & Printing",
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: author,
      url: "https://www.tpp.co.th",
    },
    publisher: {
      "@type": "Organization",
      name: "TPP - Thai Packaging & Printing",
      logo: {
        "@type": "ImageObject",
        url: "https://www.tpp.co.th/images/logo/LOGO-TPP-SIDE_9.png",
      },
    },
  };
}

/**
 * สร้าง Product Schema สำหรับผลิตภัณฑ์
 */
export function createProductSchema({
  name,
  description,
  image,
  brand = "TPP",
}: {
  name: string;
  description: string;
  image: string;
  brand?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    description: description,
    image: image,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    manufacturer: {
      "@type": "Organization",
      name: "บริษัท ไทยแพคเกจจิ้ง แอนด์ พริ้นติ้ง จำกัด (มหาชน)",
    },
  };
}

/**
 * สร้าง FAQ Schema
 */
export function createFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
