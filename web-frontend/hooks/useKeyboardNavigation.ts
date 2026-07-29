import { useEffect } from "react";

interface KeyboardNavigationProps {
  onEscape?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onEscape,
  onArrowLeft,
  onArrowRight,
  enabled = true,
}: KeyboardNavigationProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
      } else if (e.key === "ArrowLeft" && onArrowLeft) {
        e.preventDefault();
        onArrowLeft();
      } else if (e.key === "ArrowRight" && onArrowRight) {
        e.preventDefault();
        onArrowRight();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onEscape, onArrowLeft, onArrowRight]);
}