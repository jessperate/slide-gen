import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AirOps SlideGen",
  description: "AI-powered presentation builder for AirOps",
  openGraph: {
    title: "AirOps SlideGen",
    description: "AI-powered presentation builder for AirOps",
    images: [{ url: "/opengraph-image", width: 1200, height: 675 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AirOps SlideGen",
    description: "AI-powered presentation builder for AirOps",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
