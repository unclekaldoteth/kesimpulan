import type { Metadata } from "next";

const APP_URL = "https://kesimpulan.vercel.app";

type SharePageProps = {
  searchParams?: {
    summary?: string;
  };
};

function normalizeSummary(searchParams?: { summary?: string }) {
  const raw = searchParams?.summary || "Ringkas artikel & Cast jadi visual instan.";
  // Biar aman, potong maksimal 200 karakter (match sama api/og)
  return raw.slice(0, 200);
}

export async function generateMetadata(
  { searchParams }: SharePageProps
): Promise<Metadata> {
  const summary = normalizeSummary(searchParams);
  const ogImageUrl = `${APP_URL}/api/og?summary=${encodeURIComponent(summary)}`;

  // Mini App embed khusus halaman share
  const frame = {
    version: "next",
    imageUrl: ogImageUrl, // <- ini yang bakal jadi gambar di card
    button: {
      title: "Buat Kesimpulan",
      action: {
        type: "launch_frame",
        name: "Kesimpulan",
        url: APP_URL, // buka mini app utama
        splashImageUrl: `${APP_URL}/icon.png`,
        splashBackgroundColor: "#000000",
      },
    },
  };

  return {
    title: "Kesimpulan",
    description: summary,
    openGraph: {
      title: "Kesimpulan",
      description: summary,
      url: APP_URL,
      siteName: "Kesimpulan",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Kesimpulan Preview",
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    other: {
      // Untuk Mini App embed
      "fc:frame": JSON.stringify(frame),
      // Opsional, tapi sesuai spec baru Mini App
      "fc:miniapp": JSON.stringify(frame),
    },
  };
}

export default function SharePage({ searchParams }: SharePageProps) {
  const summary = normalizeSummary(searchParams);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-xl px-4 text-center space-y-4">
        <h1 className="text-3xl font-extrabold">Kesimpulan.</h1>
        <p className="text-sm text-slate-200 whitespace-pre-line">
          {summary}
        </p>
        <p className="text-[11px] text-slate-400">
          Dibuat otomatis oleh Mini App Kesimpulan di Farcaster.
        </p>
      </div>
    </main>
  );
}
