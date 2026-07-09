  "use client";

  import Navbar from "./components/Navbar";
  import Hero from "./components/Hero";
  import FeaturedPlaces from "./components/FeaturedPlaces";
  import ContactForm from  "./contact/page";
  import CategoryWisePlaces from "./components/CategoryWisePlaces";
  export default function Page() {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <FeaturedPlaces />
        <CategoryWisePlaces />
        <ContactForm />
        <section className="pt-20 min-h-screen" />
      </main>
    );
  }