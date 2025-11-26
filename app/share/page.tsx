import { Metadata } from 'next';
import Home from '../page'; // Kita reuse tampilan Home biar gak kerja 2x

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const appUrl = "https://kesimpulan.vercel.app";
  
  // 1. Ambil teks summary dari URL
  const summary = searchParams.summary as string || "Ringkasan visual instan.";
  
  // 2. Bikin URL Gambar Dinamis (ini manggil api/og yang lu kasih)
  const imageUrl = `${appUrl}/api/og?summary=${encodeURIComponent(summary)}`;

  // 3. Config Frame v2 (JSON Blob)
  const frameConfig = {
    version: "next",
    imageUrl: imageUrl, // <--- GAMBARNYA JADI DINAMIS DISINI
    button: {
      title: "Buka Ringkasan",
      action: {
        type: "launch_frame",
        name: "Kesimpulan",
        url: appUrl,
        splashImageUrl: `${appUrl}/icon.png`,
        splashBackgroundColor: "#000000",
      },
    },
  };

  return {
    title: "Kesimpulan: " + summary.substring(0, 50),
    openGraph: {
      title: "Kesimpulan Visual",
      description: summary,
      images: [imageUrl],
    },
    other: {
      "fc:frame": JSON.stringify(frameConfig),
    },
  };
}

// Tampilkan halaman Home biasa (User gak ngerasa bedanya)
export default function SharePage() {
  return <Home />;
}