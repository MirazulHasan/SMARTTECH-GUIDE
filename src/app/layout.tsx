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
            <Toaster 
              position="bottom-right" 
              toastOptions={{
                style: {
                  background: 'rgba(6, 11, 25, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid #10b98144',
                  color: '#10b981',
                  fontFamily: 'var(--font-space), monospace',
                  borderRadius: '18px',
                  padding: '12px 24px',
                  boxShadow: '0 0 30px rgba(16, 185, 129, 0.1)',
                  fontSize: '14px',
                  letterSpacing: '0.05em',
                },
              }}
            />
          </PostProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
