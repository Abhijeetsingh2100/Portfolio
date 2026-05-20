import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abhijeet Singh | Full Stack Mobile Developer",
  description:
    "Futuristic portfolio for Abhijeet Singh, a React Native and Kotlin mobile developer focused on premium product experiences.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Abhijeet Singh | Full Stack Mobile Developer",
    description:
      "Modern cross-platform mobile apps with React Native, Kotlin, and premium UI craftsmanship.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhijeet Singh | Full Stack Mobile Developer",
    description:
      "Modern cross-platform mobile apps with React Native, Kotlin, and premium UI craftsmanship.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" data-theme="dark">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
