import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoderTools - Free Developer Tools",
  description: "16+ free developer tools including JSON formatter, Base64 encoder, JWT decoder, UUID generator, and more. All tools work client-side for privacy and speed.",
  keywords: "developer tools, JSON formatter, Base64 encoder, JWT decoder, UUID generator, web development, programming tools",
  authors: [{ name: "CoderTools" }],
  openGraph: {
    title: "CoderTools - Free Developer Tools",
    description: "16+ free developer tools for developers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
