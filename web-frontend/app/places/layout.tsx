// path: app/places/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Places | Namma Byndoor",
  description: "Discover beautiful beaches, majestic waterfalls, ancient temples, and hidden gems across Byndoor.",
};

export default function PlacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}