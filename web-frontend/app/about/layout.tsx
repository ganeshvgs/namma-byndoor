import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Byndoor, Karnataka",
  description: "Learn about Byndoor (also known as Baindur)—where the Western Ghats meet the Arabian Sea. Discover a region shaped by coastlines, rivers, and enduring local heritage.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}