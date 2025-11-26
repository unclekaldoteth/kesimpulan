import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = "https://kesimpulan.vercel.app"; // Pastikan ini domain asli lu

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOiA4ODg4LCJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4MTI...",
      payload: "eyJkb21haW4iOiAia2VzaW1wdWxhbi52ZXJjZWwuYXBwIn0=",
      signature: "MHhi..."
    },
    frame: {
      version: "1",
      name: "Kesimpulan",
      iconUrl: `${appUrl}/icon.png`, 
      homeUrl: appUrl,
      imageUrl: `${appUrl}/opengraph-image.png`,
      buttonTitle: "Buat Ringkasan",
      splashImageUrl: `${appUrl}/icon.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${appUrl}/api/webhook`,
      
      // --- FITUR BARU SESUAI STANDAR ---
      // 1. Discovery (SEO)
      description: "Ringkas artikel panjang dan Cast menjadi visual alur pikir (Mermaid) dan kuis interaktif dalam hitungan detik. Didukung oleh AI.",
      keywords: ["ai", "summary", "education", "productivity", "indonesia", "reading"],
      
      // 2. Share Extension (Biar bisa terima link dari luar)
      // Ini memungkinkan user nge-share URL langsung ke Mini App lu
      triggers: [
        { 
          type: "share", 
          action: { type: "launch_frame", name: "Ringkas Ini", url: appUrl } 
        }
      ]
    }
  };

  return NextResponse.json(config);
}