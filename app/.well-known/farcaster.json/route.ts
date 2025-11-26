import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = "https://kesimpulan.vercel.app";

  const config = {
    accountAssociation: {
      // INI BAGIAN YANG BARU LU PASTE:
      header: "eyJmaWQiOjQ1NjU4NSwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDBkMjgzNDAyNTkxN0ViMTk3NWFiM2M0YzJlMjYyN2JFMTg5OUU3MzAifQ",
      payload: "eyJkb21haW4iOiJrZXNpbXB1bGFuLnZlcmNlbC5hcHAifQ",
      signature: "AZA2Z+Vdho9CTgpo0sq3XKhq0GfTKc2ZsIT3YgwRKe5D4x571Ax7oE5dxfHUDH9UdTYhy0yJ5cZbz79G28z2rhs="
    },
    frame: {
      version: "1",
      name: "Kesimpulan",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: "https://kesimpulan.vercel.app/home",
      imageUrl: `${appUrl}/opengraph-image.png`,
      buttonTitle: "Buat Ringkasan",
      splashImageUrl: `${appUrl}/icon.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${appUrl}/api/webhook`,
      subtitle: "Ringkasan Visual Instan",
      tagline: "Lebih Cepat Paham",
      primaryCategory: "productivity",
      heroImageUrl: `${appUrl}/opengraph-image.png`,
      screenshotUrls: [
        `${appUrl}/tampilan-app.png` 
      ],
      description: "Ringkas artikel panjang dan Cast menjadi visual alur pikir (Mermaid) dan kuis interaktif dalam hitungan detik. Didukung oleh AI.",
      castShareUrl: appUrl,
      keywords: ["ai", "summary", "education", "productivity", "indonesia", "reading"],
      triggers: [
        { 
          type: "share", 
          action: { type: "launch_frame", name: "Ringkas Ini", url: appUrl } 
        }
      ]
    }
  };

  return NextResponse.json(config, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}