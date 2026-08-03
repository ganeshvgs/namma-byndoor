import "./globals.css";
import { LoaderProvider } from "./providers/LoaderProvider";
import { Metadata } from "next";

const noFoucScript = `
  (function() {
    try {
      var visited = sessionStorage.getItem('namma-byndoor-loaded');
      if (!visited) {
        sessionStorage.setItem('namma-byndoor-loaded', '1');
        if (window.location.pathname === '/') {
          document.documentElement.classList.add('is-loading');
        }
      }
    } catch (e) {}
  })();
`;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://byndoor.kundapura.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Byndoor, Karnataka | Places to Visit & Explore | Namma Byndoor",
    template: "%s | Namma Byndoor",
  },

  description:
    "Discover Byndoor (Baindur), Karnataka. Explore places to visit, including beaches, waterfalls, temples, and destinations across the Western Ghats and coastal region.",

  // ✅ Fixed native integration with Google Search Console
 
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Byndoor, Karnataka | Places to Visit & Explore",
    description:
      "Discover Byndoor (Baindur), Karnataka. Explore places to visit, including beaches, waterfalls, temples, and destinations across the Western Ghats and coastal region.",
    url: siteUrl,
    siteName: "Namma Byndoor",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Byndoor, Karnataka | Places to Visit & Explore",
    description:
      "Discover Byndoor (Baindur), Karnataka. Explore places to visit across the region.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFoucScript }} />
      </head>
      <body suppressHydrationWarning>
        <LoaderProvider>
          <div id="main-content">
            {children}
          </div>
        </LoaderProvider>
      </body>
    </html>
  );
}
