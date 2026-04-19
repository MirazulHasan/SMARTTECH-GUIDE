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
import { ThemeProvider } from "@/components/ThemeProvider";
import TechBackground from "@/components/TechBackground";

import { PostProvider } from "@/context/PostContext";
import PostViewer from "@/components/PostViewer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-transparent" suppressHydrationWarning={true}>
        <ThemeProvider>
          <PostProvider>
            <TechBackground />
            {children}
            <PostViewer />
            <Toaster richColors position="bottom-right" />
          </PostProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
