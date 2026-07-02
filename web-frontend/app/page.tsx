  "use client";

  import Navbar from "./components/Navbar";
  import Hero from "./components/Hero";
  export default function Page() {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <Hero />

        <section className="pt-20 min-h-screen" />
      </main>
    );
  }