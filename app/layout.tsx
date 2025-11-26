import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const appUrl = "https://kesimpulan.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Kesimpulan",
  description: "Ringkasan visual instan dari artikel & cast.",
  
  // Open Graph (Untuk WhatsApp/Twitter)
  openGraph: {
    title: "Kesimpulan",
    description: "Ubah teks panjang jadi diagram & kuis.",
    url: appUrl,
    siteName: "Kesimpulan",
    images: [
      {
        url: `${appUrl}/opengraph-image.png`,
        width: 1200,
        height: 630, 
        alt: "Kesimpulan Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  
  // --- FARCASTER MINI APP METADATA (CLEAN VERSION) ---
  other: {
    // Versi wajib
    "fc:frame": "vNext",
    
    // Gambar: GUNAKAN 1.91:1 (Landscape) karena ini standar paling aman
    // Pastikan gambarnya persegi panjang (1200x630)
    "fc:frame:image": `${appUrl}/opengraph-image.png`,
    "fc:frame:image:aspect_ratio": "1.91:1",
    
    // Tombol Peluncuran (Cuma butuh 3 baris ini)
    "fc:frame:button:1": "Buka App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": appUrl,
    
    // HAPUS post_url. 
    // Untuk Mini App (Link Button), post_url sering bikin error kalau webhooknya gak sempurna.
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#050505] text-white`}>
        {children}
      </body>
    </html>
  );
}