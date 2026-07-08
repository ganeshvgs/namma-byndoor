  "use client";

  import Navbar from "./components/Navbar";
  import Hero from "./components/Hero";
  import FeaturedPlaces from "./components/FeaturedPlaces";
  export default function Page() {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <FeaturedPlaces />

        <section className="pt-20 min-h-screen" />
      </main>
    );
  }