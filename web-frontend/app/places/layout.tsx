//path web-frontend/app/places/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Places to Visit in Byndoor, Karnataka",
  description: "Explore tourist places and attractions in Byndoor. Discover beaches, waterfalls, temples, and destinations across the coastal region.",
  alternates: {
    canonical: "/places",
  },
};

export default function PlacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (prefers-reduced-motion: no-preference) {
            html {
              scroll-behavior: smooth;
            }
          }
        `
      }} />
      {children}
    </>
  );
}