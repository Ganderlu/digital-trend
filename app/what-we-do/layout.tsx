import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What We Do | Services, Asset Management & Advisory",
  description:
    "Explore TeveXtra services: stock broking, asset management, alternative assets, risk advisory, market intelligence, and strategic consulting tailored for serious investors.",
  alternates: {
    canonical: "/what-we-do",
  },
  openGraph: {
    title: "What We Do | Services, Asset Management & Advisory",
    description:
      "Explore TeveXtra services: stock broking, asset management, alternative assets, risk advisory, market intelligence, and strategic consulting tailored for serious investors.",
    url: "https://www.tevextra.com/what-we-do",
    type: "website",
    images: [
      {
        url: "/images/tx.png",
        width: 1200,
        height: 630,
        alt: "TeveXtra Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What We Do | Services, Asset Management & Advisory",
    description:
      "Explore TeveXtra services: stock broking, asset management, alternative assets, risk advisory, market intelligence, and strategic consulting tailored for serious investors.",
    images: ["/images/tx.png"],
  },
};

export default function WhatWeDoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
