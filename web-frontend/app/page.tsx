// path: app/page.tsx
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedPlaces from "./components/FeaturedPlaces";
import CategoryWisePlaces from "./components/CategoryWisePlaces";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <Hero />
      <FeaturedPlaces />
      <CategoryWisePlaces />
      {/* 
        Removed the dummy 'pt-20 min-h-screen' section 
        to allow the Footer to flow naturally after the content.
      */}
      <Footer />
    </main>
  );
}