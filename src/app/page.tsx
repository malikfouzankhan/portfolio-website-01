"use client";

import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen text-white overflow-x-hidden">
      <Nav />
      <Hero />
      <Projects />
      <Skills />
      <Footer />
    </main>
  );
}