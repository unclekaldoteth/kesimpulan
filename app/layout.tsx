import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'], 
  variable: '--font-inter', 
});

// --- METADATA LENGKAP (PENTING BUAT PREVIEW) ---
export const metadata: Metadata = {
  // Base URL wajib biar gambar opengraph kebaca
  metadataBase: new URL("https://kesimpulan.vercel.app"), 
  
  title: "Kesimpulan",
  description: "Ringkas artikel panjang dan Cast menjadi visual alur pikir & kuis instan.",
  
  // Ini yang bikin kartu preview muncul (WAJIB)
  openGraph: {
    title: "Kesimpulan - Ringkas Apapun Jadi Visual",
    description: "Tempel link, dapatkan diagram alur dan kuis pemahaman dalam hitungan detik.",
    url: "https://kesimpulan.vercel.app",
    siteName: "Kesimpulan Mini App",
    images: [
      {
        url: "/opengraph-image.png", // Pastikan file ini ada di folder public
        width: 1200,
        height: 630,
        alt: "Kesimpulan App Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  
  // Metadata tambahan buat Farcaster
  other: {
    "fc:frame": "vNext", // Sinyal kalau ini App modern
    "fc:frame:image": "https://kesimpulan.vercel.app/opengraph-image.png",
    "fc:frame:button:1": "Buka Kesimpulan",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://kesimpulan.vercel.app",
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