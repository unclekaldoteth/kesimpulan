import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // Ambil teks summary dari URL, kalau gak ada pake default
    const summary = searchParams.get('summary')?.slice(0, 200) || 'Ringkas artikel & Cast jadi visual instan.';
    const title = "Kesimpulan.";

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050505',
            color: 'white',
            padding: '40px',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Logo Kecil */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
             <span style={{ fontSize: 30, fontWeight: 900 }}>{title}</span>
          </div>

          {/* Kotak Teks Summary */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            <p style={{ fontSize: 42, fontWeight: 600, lineHeight: 1.4, margin: 0, color: '#e5e5e5' }}>
              "{summary}..."
            </p>
          </div>

          {/* Footer */}
          <p style={{ position: 'absolute', bottom: 30, fontSize: 20, color: '#666' }}>
            Powered by AI • Farcaster Mini App
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}