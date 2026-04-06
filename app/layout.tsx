import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"),
  title: "Roope Aaltonen - Interactive network-topology inspired portfolio homepage",
  description:
    "Interactive network-topology inspired portfolio homepage by Roope Aaltonen, focused on junior infrastructure, networking, Linux, cloud and connected systems roles.",
  openGraph: {
    title: "Roope Aaltonen - Interactive network-topology inspired portfolio homepage",
    description:
      "Interactive network-topology inspired portfolio homepage focused on practical networking, Linux, cloud and connected systems work.",
    type: "website",
    images: [
      {
        url: "/linkedin-browser-page.png",
        width: 1200,
        height: 630,
        alt: "Roope Aaltonen interactive network-topology inspired portfolio homepage",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] antialiased">{children}</body>
    </html>
  );
}
