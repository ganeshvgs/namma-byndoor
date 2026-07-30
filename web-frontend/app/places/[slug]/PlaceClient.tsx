"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { api } from "../../lib/api";

import Navbar from "../../components/Navbar";
import PlaceDetailsLoading from "./loading";
import { PlaceDetails, PlaceApiResponse } from "../../../types/place";
import { useGallery } from "../../../hooks/useGallery";

import { PlaceHero } from "../../../components/place/PlaceHero";
import { PlaceQuickInfo } from "../../../components/place/PlaceQuickInfo";
import { PlaceContentSections } from "../../../components/place/PlaceContentSections";
import { PlaceGallery } from "../../../components/place/PlaceGallery";
import { GalleryLightbox } from "../../../components/place/GalleryLightbox";
import { PlaceVideo } from "../../../components/place/PlaceVideo";
import { PlaceMap } from "../../../components/place/PlaceMap";
import { PlaceTags } from "../../../components/place/PlaceTags";
import { StickyActionBar } from "../../../components/place/StickyActionBar";
import { EmptyState } from "../../../components/place/EmptyState";
import { ErrorState } from "../../../components/place/ErrorState";

const TOKENS = {
  bgMain: "#F8FCFF",
  bgSecondary: "#EEF8FF",
} as const;

interface PlaceClientProps {
  initialPlace?: PlaceDetails | null;
  slug: string;
}

export default function PlaceClient({ initialPlace, slug }: PlaceClientProps) {
  // Use initial data if available (Server side fetched), otherwise null
  const [place, setPlace] = useState<PlaceDetails | null>(initialPlace || null);
  // Only show loading if we didn't receive initial data
  const [loading, setLoading] = useState<boolean>(!initialPlace);
  const [error, setError] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  
  const [retryKey, setRetryKey] = useState<number>(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // If we already have the initial place from the server, do not fetch again.
    if (initialPlace && retryKey === 0) {
      return;
    }

    let isMounted = true;

    const loadPlaceData = async () => {
      if (!slug) {
        if (isMounted) {
          setNotFound(true);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(false);
        setNotFound(false);
        
        const response = await api.get<PlaceApiResponse>(`/api/places/${slug}`);
        
        if (!isMounted) return;

        const placeData = response?.place || response?.data;

        if (placeData && placeData.status === "active") {
          setPlace(placeData);
        } else {
          setNotFound(true);
        }
      } catch (err: any) {
        if (!isMounted) return;
        
        if (err?.status === 404 || err?.message?.includes("404")) {
          setNotFound(true);
        } else {
          setError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPlaceData();

    return () => {
      isMounted = false;
    };
  }, [slug, retryKey, initialPlace]);

  const handleRetry = useCallback(() => {
    setRetryKey((prev) => prev + 1);
  }, []);

  const validGalleryImages = useMemo(() => {
    if (!place?.galleryImages) return [];
    return place.galleryImages.filter((img) => img && img.image && img.image.trim() !== "");
  }, [place?.galleryImages]);

  const {
    isOpen: lightboxOpen,
    currentIndex: lightboxIndex,
    openLightbox,
    closeLightbox,
    nextImage,
    prevImage,
    setCurrentIndex,
  } = useGallery(validGalleryImages.length);

  if (loading) return <PlaceDetailsLoading />;

  if (notFound || !place) {
    return (
      <main className="min-h-screen flex flex-col bg-[#F8FCFF]">
        <Navbar />
        <EmptyState />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col bg-[#F8FCFF]">
        <Navbar />
        <ErrorState onRetry={handleRetry} />
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col pb-24 overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, ${TOKENS.bgMain} 0%, ${TOKENS.bgSecondary} 100%)`,
      }}
    >
      <Navbar />

      <PlaceHero
        place={place}
        hasGallery={validGalleryImages.length > 0}
        onOpenGallery={() => openLightbox(0)}
        reducedMotion={reducedMotion}
      />

      <PlaceQuickInfo place={place} reducedMotion={reducedMotion} />

      <PlaceContentSections
        contentSections={place.contentSections}
        story={place.story}
        title={place.title}
        reducedMotion={reducedMotion}
      />

      <PlaceGallery
        images={validGalleryImages}
        onOpenLightbox={openLightbox}
        reducedMotion={reducedMotion}
      />

      <PlaceVideo videoUrl={place.video} reducedMotion={reducedMotion} />
      
      <PlaceMap place={place} reducedMotion={reducedMotion} />
      
      <PlaceTags tags={place.tags} />

      <StickyActionBar
        place={place}
        hasGallery={validGalleryImages.length > 0}
        onOpenGallery={() => openLightbox(0)}
      />

      {lightboxOpen && validGalleryImages.length > 0 && (
        <GalleryLightbox
          images={validGalleryImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
          onSelect={setCurrentIndex}
        />
      )}
    </main>
  );
}