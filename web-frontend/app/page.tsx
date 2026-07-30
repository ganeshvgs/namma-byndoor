import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedPlaces from "./components/FeaturedPlaces";
import CategoryWisePlaces from "./components/CategoryWisePlaces";
import Footer from "./components/Footer";

export default function Page() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nammabyndoor.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Namma Byndoor",
    "url": siteUrl,
    "description": "Tourism and place-discovery platform for Byndoor, Karnataka, India.",
    "about": {
      "@type": "Place",
      "name": "Byndoor",
      "alternateName": "Baindur",
      "containedInPlace": {
        "@type": "State",
        "name": "Karnataka"
      }
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero />
      <FeaturedPlaces />
      <CategoryWisePlaces />
      <Footer />
    </main>
  );
}