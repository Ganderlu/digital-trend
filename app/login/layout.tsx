import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In to Your Account",
  description: "Sign in to access your TeveXtra account dashboard and manage your investments.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
