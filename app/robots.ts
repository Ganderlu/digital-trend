import type { MetadataRoute } from "next";

const BASE_URL = "https://www.tevextra.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard",
          "/deposit",
          "/withdraw",
          "/account-history",
          "/account-settings",
          "/security-settings",
          "/referrals",
          "/investment-plans",
          "/matrix-investment",
          "/matrix-plan",
          "/trade",
          "/login",
          "/register",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard",
          "/deposit",
          "/withdraw",
          "/account-history",
          "/account-settings",
          "/security-settings",
          "/referrals",
          "/investment-plans",
          "/matrix-investment",
          "/matrix-plan",
          "/trade",
          "/login",
          "/register",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
