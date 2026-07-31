import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Namma Byndoor",
  description:
    "Contact Namma Byndoor to suggest places, share local information, report corrections or send feedback about destinations across Byndoor.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex flex-col min-h-screen bg-white">{children}</main>;
}