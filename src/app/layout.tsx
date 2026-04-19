import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap"
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap"
});

export const metadata: Metadata = {
  title: "SmartTech Guide | Free Stuff & Tech News",
  description: "Your ultimate destination for free games, free software, tech news, PC tips, tricks, and must-know websites that level up your tech game.",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
        <Toaster richColors position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
