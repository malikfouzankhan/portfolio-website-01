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

/* Pinned here rather than inherited from the fetch. The live GitHub data now
   arrives over GraphQL, which is a POST, and Next's data cache only covers
   GET — without this the route would fall out of static prerendering and go
   dynamic. Matches REVALIDATE_S in lib/github.ts. */
export const revalidate = 900;

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
