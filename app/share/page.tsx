import { Metadata } from 'next';
import MainApp from '../components/MainApp'; // Import komponen UI yang baru

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const appUrl = "https://kesimpulan.vercel.app";
  const summary = (searchParams.summary as string) || "Ringkasan visual instan.";
  const imageUrl = `${appUrl}/api/og?summary=${encodeURIComponent(summary)}`;

  const frameConfig = {
    version: "next",
    imageUrl: imageUrl,
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
  };

  return {
    title: "Kesimpulan",
    openGraph: {
      title: "Kesimpulan: " + summary.substring(0, 50),
      description: summary,
      images: [imageUrl],
    },
    other: {
      "fc:frame": JSON.stringify(frameConfig),
    },
  };
}

export default function SharePage() {
  return <MainApp />;
}