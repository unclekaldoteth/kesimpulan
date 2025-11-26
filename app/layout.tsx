// 👇 BARIS INI YANG TADI HILANG/SALAH 👇
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'], 
  variable: '--font-inter', 
});

const appUrl = "https://kesimpulan.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL("https://kesimpulan.vercel.app"),
  title: "Kesimpulan",
  description: "Ringkas artikel panjang jadi visual alur pikir & kuis instan.",
  
  openGraph: {
    title: "Kesimpulan",
    description: "Ringkas artikel panjang jadi visual & kuis.",
    url: "https://kesimpulan.vercel.app",
    siteName: "Kesimpulan",
    images: [
      {
        url: "https://kesimpulan.vercel.app/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kesimpulan Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  
  // --- METADATA FRAME BERSIH ---
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://kesimpulan.vercel.app/opengraph-image.png",
    "fc:frame:image:aspect_ratio": "1.91:1", // Pastikan gambar lu Landscape
    
    // Cuma satu tombol: Buka App
    "fc:frame:button:1": "Buka App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://kesimpulan.vercel.app",
    
    // HAPUS post_url BIAR TIDAK KONFLIK
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-[#050505] text-white`}>
        <div className="min-h-screen safe-area-view">
            {children}
        </div>
      </body>
    </html>
  );
}