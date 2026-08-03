//path web-frontend/app/places/[slug]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import PlaceClient from "./PlaceClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://byndoor.kundapura.in";

// React 19 cache() deduplicates requests made during the same server render pass
const getPlace = cache(async (slug: string) => {
  try {
    const res = await fetch(`${API_URL}/api/places/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.place || data.data || null;
  } catch (error) {
    return null;
  }
});

// Next.js 16 strictly requires async params
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlace(slug);

  if (!place || place.status !== "active") {
    return { title: "Place Not Found" };
  }

  const title = `${place.title}${place.title.toLowerCase().includes('karnataka') ? '' : ', Karnataka'}`;
  const description = place.shortDescription || `Explore ${place.title} in Byndoor, Karnataka.`;
  const canonicalUrl = `/places/${place.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonicalUrl}`,
      images: place.coverImage ? [place.coverImage] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: place.coverImage ? [place.coverImage] : [],
    },
  };
}

export default async function PlaceServerPage({ params }: Props) {
  const { slug } = await params;
  const place = await getPlace(slug);

  if (!place || place.status !== "active") {
    notFound();
  }

  // Conservative Schema.org mapping
  const catName = place.category?.name?.toLowerCase() || "";
  const schemaType = catName.includes("temple") ? "PlaceOfWorship" : "Place";

  const hasValidCoords = typeof place.latitude === "number" && typeof place.longitude === "number";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": place.title,
    "description": place.shortDescription,
    "image": place.coverImage,
    "url": `${SITE_URL}/places/${place.slug}`,
    ...(hasValidCoords && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": place.latitude,
        "longitude": place.longitude
      }
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlaceClient initialPlace={place} slug={slug} />
    </>
  );
}