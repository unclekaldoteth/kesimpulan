// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kesimpulan AI",
  description: "Ringkas artikel & Cast jadi visual dalam detik.",
};

// STANDAR RESMI FARCASTER (Agar tidak bisa di-zoom & full screen)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Wajib false biar rasa native app
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-black`}>
        {/* Menangani Safe Area (Poni HP) biar konten gak ketutupan */}
        <div className="min-h-screen safe-area-view">
            {children}
        </div>
      </body>
    </html>
  );
}