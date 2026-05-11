import type { MetadataRoute } from "next";

const siteUrl = "https://apps-freepdf.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/admin/", "/api/"]
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
