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
      iconUrl: "https://cdn-icons-png.flaticon.com/512/10008/10008906.png",
      homeUrl: "https://kesimpulan.vercel.app", // <--- Domain Lu
      imageUrl: "https://kesimpulan.vercel.app/opengraph-image.png", // <--- Domain Lu
      buttonTitle: "Buat Kesimpulan",
      splashImageUrl: "https://kesimpulan.vercel.app/splash.png", // <--- Domain Lu
      splashBackgroundColor: "#020617",
      webhookUrl: "https://kesimpulan.vercel.app/api/webhook" // <--- Domain Lu
    }
  };

  return NextResponse.json(config);
}