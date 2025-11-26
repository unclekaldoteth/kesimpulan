import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'], 
  variable: '--font-inter', 
});

// URL APLIKASI LU (Ganti kalau beda, tapi kayaknya udah bener ini)
const appUrl = "https://kesimpulan.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Kesimpulan",
  description: "Ringkas artikel panjang dan Cast menjadi visual alur pikir & kuis instan.",
  
  // Standard Open Graph (Buat Twitter/Discord/WhatsApp)
  openGraph: {
    title: "Kesimpulan - Ringkas Apapun Jadi Visual",
    description: "Tempel link, dapatkan diagram alur dan kuis pemahaman dalam hitungan detik.",
    url: appUrl,
    siteName: "Kesimpulan",
    images: [
      {
        url: `${appUrl}/opengraph-image.png`, // Pastikan file ini ada di folder public!
        width: 1200,
        height: 630,
        alt: "Kesimpulan Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  
  // --- FARCASTER FRAME METADATA (YANG WAJIB BENER) ---
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": `${appUrl}/opengraph-image.png`, // Gambar Preview
    "fc:frame:image:aspect_ratio": "1.91:1", // Wajib didefinisikan biar Valid
    
    // Tombol Utama: Buka Mini App
    "fc:frame:button:1": "Buka Kesimpulan",
    "fc:frame:button:1:action": "link", // Tipe aksi: Buka Link
    "fc:frame:button:1:target": appUrl, // Link tujuan (App kita)
    
    // Fallback URL (Sering bikin error kalau ga ada)
    "fc:frame:post_url": `${appUrl}/api/webhook`, 
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