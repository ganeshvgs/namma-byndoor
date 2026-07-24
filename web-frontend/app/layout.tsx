import "./globals.css";
import { LoaderProvider } from "./providers/LoaderProvider";

// This script executes synchronously before React hydrates, guaranteeing zero FOUC.
const noFoucScript = `
  (function() {
    try {
      var visited = sessionStorage.getItem('namma-byndoor-loaded');
      if (!visited) {
        sessionStorage.setItem('namma-byndoor-loaded', '1');
        // Only trigger loader on the homepage
        if (window.location.pathname === '/') {
          document.documentElement.classList.add('is-loading');
        }
      }
    } catch (e) {}
  })();
`;

export const metadata = {
  title: "Namma Byndoor",
  description: "Discover the beauty of Byndoor",
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