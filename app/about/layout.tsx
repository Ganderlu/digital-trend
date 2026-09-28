import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | TeveXtra Story, Mission & Team",
  description:
    "Learn about TeveXtra — a premier independent wealth management firm founded in 2012, blending rigorous macro research with advanced risk modeling for serious global investors.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | TeveXtra Story, Mission & Team",
    description:
      "Learn about TeveXtra — a premier independent wealth management firm founded in 2012, blending rigorous macro research with advanced risk modeling for serious global investors.",
    url: "https://www.tevextra.com/about",
    type: "article",
    images: [
      {
        url: "/images/tx.png",
        width: 1200,
        height: 630,
        alt: "About TeveXtra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | TeveXtra Story, Mission & Team",
    description:
      "Learn about TeveXtra — a premier independent wealth management firm founded in 2012, blending rigorous macro research with advanced risk modeling for serious global investors.",
    images: ["/images/tx.png"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
