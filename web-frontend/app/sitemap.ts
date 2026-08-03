import { MetadataRoute } from "next";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://byndoor.kundapura.in";

interface SitemapPlace {
  slug?: string;
  updatedAt?: string;
  status?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/places`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const res = await fetch(
      `${API_URL}/api/places?status=active&limit=1000`,
      {
        next: {
          revalidate: 3600, // Regenerate sitemap every hour
        },
      }
    );

    if (!res.ok) {
      console.error(`Sitemap fetch failed: ${res.status}`);
      return routes;
    }

    const data = await res.json();

    const places: SitemapPlace[] =
      data?.data || data?.places || [];

    const dynamicRoutes: MetadataRoute.Sitemap = places
      .filter(
        (place) =>
          place.status === "active" &&
          typeof place.slug === "string" &&
          place.slug.trim().length > 0
      )
      .map((place) => ({
        url: `${SITE_URL}/places/${place.slug}`,
        lastModified: place.updatedAt
          ? new Date(place.updatedAt)
          : now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [...routes, ...dynamicRoutes];
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return routes;
  }
}