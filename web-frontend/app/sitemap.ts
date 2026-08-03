import { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://byndoor.kundapura.in";

interface SitemapPlace {
  slug?: string;
  updatedAt?: string;
  status?: string;
  featured?: boolean;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/places`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  let featuredRoutes: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(
      `${API_URL}/api/places?status=active&featured=true&sort=priority&limit=100`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch featured places for sitemap: ${res.status}`);
      return staticRoutes;
    }

    const data = await res.json();
    const places: SitemapPlace[] = data.data || data.places || [];

    featuredRoutes = places
      .filter(
        (place) =>
          place.status === "active" &&
          place.featured === true &&
          typeof place.slug === "string" &&
          place.slug.trim().length > 0
      )
      .map((place) => {
        const route: MetadataRoute.Sitemap[number] = {
          url: `${SITE_URL}/places/${place.slug}`,
          changeFrequency: "weekly",
          priority: 0.8,
        };

        if (place.updatedAt && !Number.isNaN(Date.parse(place.updatedAt))) {
          route.lastModified = new Date(place.updatedAt);
        }

        return route;
      });
  } catch (error) {
    console.error("Failed to generate featured destination sitemap:", error);
  }

  return [...staticRoutes, ...featuredRoutes];
}
