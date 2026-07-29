import { useState, useCallback } from "react";

export function useGallery(totalImages: number) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((index = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  }, [totalImages]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  }, [totalImages]);

  return {
    isOpen,
    currentIndex,
    openLightbox,
    closeLightbox,
    nextImage,
    prevImage,
    setCurrentIndex,
  };
}