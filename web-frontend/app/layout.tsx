"use client";

import "./globals.css";
import { useState } from "react";
import Loader from "./components/Loader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {loading ? (
          <Loader onComplete={() => setLoading(false)} />
        ) : (
          children
        )}
      </body>
    </html>
  );
}