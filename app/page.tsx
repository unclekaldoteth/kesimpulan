import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Pastikan file app/providers.tsx sudah dibuat ya!

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
  openGraph: {
    title: "Kesimpulan",
    description: "Ringkas artikel panjang jadi visual & kuis.",
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
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${appUrl}/opengraph-image.png`,
      button: {
        title: "Buka App",
        action: {
          type: "launch_frame",
          name: "Kesimpulan",
          url: appUrl,
          splashImageUrl: `${appUrl}/icon.png`,
          splashBackgroundColor: "#000000",
        },
      },
    }),
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
        <Providers>
          <div className="min-h-screen safe-area-view">
              {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}