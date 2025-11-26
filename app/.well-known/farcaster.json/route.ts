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
      homeUrl: appUrl,
      imageUrl: `${appUrl}/opengraph-image.png`,
      buttonTitle: "Buka App",
      splashImageUrl: `${appUrl}/icon.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${appUrl}/api/webhook`,
      
      // Metadata lain...
      tagline: "Lebih Cepat Paham",
      description: "Ringkasan visual instan.",
      
      // 👇 INI KUNCINYA 👇
      triggers: [
        { 
          type: "share", 
          action: { 
            type: "launch_frame", 
            name: "Buat Kesimpulan", // Nama menu yang muncul saat klik Share
            url: appUrl 
          } 
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