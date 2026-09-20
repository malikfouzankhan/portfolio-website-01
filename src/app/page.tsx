import Nav from "@/components/nav/Nav";
import CommandPalette from "@/components/CommandPalette";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Work from "@/components/sections/Work";
import Stack from "@/components/sections/Stack";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { hasResume } from "@/lib/assets";

// Server component. Only Nav, CommandPalette and the small interactive bits
// inside sections ship as client JS.
export default function Home() {
  return (
    <>
      <Nav />
      <CommandPalette hasResume={hasResume()} />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Work />
        <Stack />
      </main>
      {/* Contact grows to fill whatever the footer doesn't, so the two always
          land together inside one viewport. */}
      <div className="flex min-h-svh flex-col">
        <Contact />
        <Footer />
      </div>
    </>
  );
}
