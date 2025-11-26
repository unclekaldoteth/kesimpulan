// app/.well-known/farcaster.json/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    accountAssociation: {
      header: "eyJmaWQiOiA4ODg4LCJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4MTI...",
      payload: "eyJkb21haW4iOiAia2VzaW1wdWxhbi52ZXJjZWwuYXBwIn0=",
      signature: "MHhi..."
    },
    frame: {
      version: "1",
      name: "Kesimpulan",
      iconUrl: "https://kesimpulan.vercel.app/icon.png", // Pastikan ada icon.png di folder public atau ganti link luar
      homeUrl: "https://kesimpulan.vercel.app",
      imageUrl: "https://kesimpulan.vercel.app/opengraph-image.png",
      buttonTitle: "Buka Kesimpulan",
      splashImageUrl: "https://kesimpulan.vercel.app/icon.png", 
      splashBackgroundColor: "#000000", // <--- UBAH JADI HITAM PEKAT (Sesuai UI)
      webhookUrl: "https://kesimpulan.vercel.app/api/webhook"
    }
  };

  return NextResponse.json(config);
}