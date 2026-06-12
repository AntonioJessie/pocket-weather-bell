import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pocket Weather Bell",
  description: "A compact Base weather bell mini app.",
  other: {
    "base:app_id": "6a2bc51f0cfd412b2ab2c314",
    "talentapp:project_verification":
      "1836a48cb8dfb33770d6211c36ef4e55a13c67ad6d8fb427b1ff45583fb7460d0f41542eb514e93fde436272a3c27f1aacfd6a863dc7dfdfe38efdd1e3e2d167",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
