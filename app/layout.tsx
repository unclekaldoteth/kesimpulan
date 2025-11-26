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
  metadataBase: new URL(appUrl),
  title: "Kesimpulan",
  description: "Ringkas artikel panjang dan Cast menjadi visual alur pikir & kuis instan.",
  
  // --- OPEN GRAPH (Standar Web2) ---
  openGraph: {
    title: "Kesimpulan",
    description: "Ringkas artikel panjang jadi visual & kuis.",
    url: appUrl,
    siteName: "Kesimpulan",
    images: [
      {
        url: `${appUrl}/opengraph-image.png`,
        width: 1080, // Sesuaikan dengan spec 1:1
        height: 1080,
        alt: "Kesimpulan Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  
  // --- FARCASTER FRAME SPECIFICATION (v2) ---
  other: {
    "fc:frame": "vNext",
    
    // SPEC RULE: Image harus < 3MB. 
    // Gunakan Aspect Ratio 1:1 (Kotak) agar tampilan di feed lebih tinggi/besar.
    "fc:frame:image": `${appUrl}/opengraph-image.png`,
    "fc:frame:image:aspect_ratio": "1:1", 
    
    // Tombol Launch (Link Action)
    "fc:frame:button:1": "Buka App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": appUrl,
    
    // Fallback Webhook (Required by some validators for health check)
    "fc:frame:post_url": `${appUrl}/api/webhook`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000", // Sesuai warna bg app
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