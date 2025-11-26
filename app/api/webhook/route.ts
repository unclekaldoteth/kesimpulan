import { NextRequest, NextResponse } from 'next/server';

// Ini Endpoint POST Beneran (Bukan Dummy)
export async function POST(req: NextRequest) {
  try {
    // 1. Terima data dari Farcaster
    const body = await req.json();
    
    // (Optional) Disini nanti tempat verifikasi signature Farcaster
    // Biar server lu tau request ini asli dari Farcaster, bukan hacker.
    
    console.log("Farcaster Ping:", body);

    // 2. Return Response Sukses (200 OK)
    // Ini ngasih tau Validator: "Yes, server gue hidup dan siap."
    return NextResponse.json({
      status: "success",
      message: "Kesimpulan App Ready",
      timestamp: Date.now(),
    });

  } catch (error) {
    // Handle kalau request error
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}

// Endpoint GET buat ngecek manual di browser
export async function GET() {
  return NextResponse.json({ status: "System Normal", mode: "Production" });
}