import type { Metadata } from "next";
import { Bebas_Neue, DM_Mono, DM_Sans } from "next/font/google";
import Preloader from "@/components/Preloader";
import { profile } from "@/data/profile";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const description = `${profile.name} — backend-leaning full-stack engineer in ${profile.location}. Production systems: WhatsApp Business Platform integrations, queue-backed pipelines, multi-tenant CRMs.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — Full-Stack Engineer`,
    template: `%s — ${profile.name}`,
  },
  description,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: profile.name,
    title: `${profile.name} — Full-Stack Engineer`,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Full-Stack Engineer`,
    description,
    creator: "@_malik_fouzan_",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    jobTitle: "Full-Stack Engineer",
    address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
    sameAs: profile.socials.map((s) => s.href),
    knowsAbout: ["Node.js", "NestJS", "TypeScript", "PostgreSQL", "WhatsApp Business API", "Docker"],
  };

  return (
    <html
      lang="en"
      // Dark is the default, so the server-rendered value is already correct
      // for most visitors and the boot script below only ever has to correct
      // it to light.
      data-theme="dark"
      /* The boot script rewrites data-theme before React hydrates, so React
         finds an attribute it did not render and warns. This is the intended
         escape hatch for exactly that pattern, and it only covers THIS
         element's own attributes — one level deep — so genuine mismatches in
         children still surface.

         The alternative is storing the theme in a cookie so the server renders
         the correct value, but that forces the page dynamic and gives up
         static prerendering for a warning that describes intended behaviour. */
      suppressHydrationWarning
      className={`${bebas.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <head>
        {/* Runs before first paint: without it a light-theme visitor sees a
            dark flash on every navigation. Deliberately tiny and synchronous. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('theme')==='light')document.documentElement.dataset.theme='light'}catch(e){}",
          }}
        />
        {/* Decides whether this visit gets the preloader, and must run before
            first paint for the same reason the theme script does — after it,
            so the cover paints on the correct ground rather than flashing
            dark at a light-theme visitor.

            Three conditions, each load-bearing:
            - "/" only. /archive renders no <Nav>, so there would be nothing
              for the mark to fly to.
            - No hash. A deep link means the visitor wants the content, and
              the restored scroll would put the nav in its morphed state
              mid-measurement anyway.
            - Not reduced motion — declined at the source rather than left to
              the stylesheet, which can only clamp durations, not a pause.

            Deliberately NOT gated on sessionStorage: the cover is wanted on
            every reload. Client-side navigation (/archive and back) never
            re-runs this script, so in-app moves stay uncovered for free —
            which is exactly the distinction asked for.

            The watchdog is the important part: this script runs INDEPENDENTLY
            of the app bundle, so if that bundle never executes (chunk 404,
            parse error, blocker) nothing would ever lift the cover and the
            page would be bricked — on a site that otherwise degrades fine
            with JS off entirely. Preloader.tsx clears this the moment it takes
            ownership. Must stay comfortably above the sequence's own total. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var r=document.documentElement;if(location.pathname==='/'&&!location.hash&&!matchMedia('(prefers-reduced-motion: reduce)').matches){r.dataset.preloading='hold';window.__mfkPreloadGuard=setTimeout(function(){r.removeAttribute('data-preloading')},5000)}}catch(e){document.documentElement.removeAttribute('data-preloading')}",
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-300 focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-black"
        >
          Skip to content
        </a>
        {/* Always rendered, on the server too — whether it is VISIBLE is
            decided purely by the `data-preloading` attribute in CSS, so React
            never renders two different trees and there is nothing to
            mismatch on hydration. */}
        <Preloader />
        {children}
        <script
          type="application/ld+json"
          // Static object built above — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
