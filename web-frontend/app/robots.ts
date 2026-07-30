// path : web-frontend/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nammabyndoor.vercel.app";

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/api/',
        '/login' // Prevents indexing login/admin forms
      ], 
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}