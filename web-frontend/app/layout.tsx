import "./globals.css";
import { Metadata } from "next";
import { LoaderProvider } from "./providers/LoaderProvider";

const noFoucScript = `
(function () {
  try {
    var visited = sessionStorage.getItem("namma-byndoor-loaded");
    if (!visited) {
      sessionStorage.setItem("namma-byndoor-loaded", "1");
      if (window.location.pathname === "/") {
        document.documentElement.classList.add("is-loading");
      }
    }
  } catch (e) {}
})();
`;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://byndoor.kundapura.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
  },

  title: {
    default:
      "Byndoor (Baindur), Karnataka – Places to Visit, Beaches, Waterfalls & Travel Guide",
    template: "%s | Byndoor",
  },

  description:
    "Explore Byndoor (Baindur), Karnataka with beautiful beaches, waterfalls, temples, trekking destinations, villages, restaurants, resorts and complete travel information.",

  keywords: [
    "Byndoor",
    "Baindur",
    "Byndoor Karnataka",
    "Baindur Karnataka",
    "Places to Visit in Byndoor",
    "Byndoor Tourism",
    "Byndoor Travel Guide",
    "Byndoor Beach",
    "Byndoor Waterfalls",
    "Byndoor Temples",
    "Things to do in Byndoor",
    "Tourist Places in Byndoor",
    "Western Ghats Karnataka",
    "Coastal Karnataka",
    "Udupi Tourism",
    "Maravanthe Beach",
    "Kodachadri",
    "Belkal Theertha",
    "Ottinene",
  ],

  authors: [
    {
      name: "Byndoor",
    },
  ],

  creator: "Byndoor",

  publisher: "Byndoor",

  category: "Travel",

  applicationName: "Byndoor",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Byndoor",
    title:
      "Byndoor (Baindur), Karnataka – Places to Visit, Beaches & Travel Guide",
    description:
      "Discover beaches, waterfalls, temples, trekking destinations and tourist attractions in Byndoor (Baindur), Karnataka.",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Byndoor (Baindur), Karnataka – Places to Visit & Travel Guide",
    description:
      "Explore beaches, waterfalls, temples and tourist attractions in Byndoor, Karnataka.",
  },

  verification: {
    // google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Byndoor",
      alternateName: "Baindur",
      url: siteUrl,
      inLanguage: "en-IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      name: "Byndoor",
      alternateName: "Baindur",
      description:
        "Travel guide to Byndoor (Baindur), Karnataka featuring beaches, waterfalls, temples and tourist attractions.",
      url: siteUrl,
      touristType: [
        "Nature Lovers",
        "Adventure Travelers",
        "Pilgrims",
        "Family Travelers",
      ],
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Udupi District",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Byndoor",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFoucScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>

      <body suppressHydrationWarning>
        <LoaderProvider>
          <div id="main-content">{children}</div>
        </LoaderProvider>
      </body>
    </html>
  );
}
