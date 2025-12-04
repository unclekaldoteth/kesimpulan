export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://esolvhnpvfoavgycrwgy.supabase.co';
const DEFAULT_SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzb2x2aG5wdmZvYXZneWNyd2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzI1MDIsImV4cCI6MjA3OTcwODUwMn0.5Ftxio_WD-2dRhBmMVosu_fYFxjXjhimxLMhZtgHSnY';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  DEFAULT_SUPABASE_KEY;

const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'kesimpulan-nft';

export async function POST(req: Request) {
  try {
    const { imageDataUrl, summary } = await req.json();

    if (!imageDataUrl || typeof imageDataUrl !== 'string' || !imageDataUrl.startsWith('data:image')) {
      return NextResponse.json({ error: 'Data gambar tidak valid.' }, { status: 400 });
    }

    const [, base64] = imageDataUrl.split(',');
    if (!base64) {
      return NextResponse.json({ error: 'Format gambar tidak dikenali.' }, { status: 400 });
    }

    // Build metadata once; we will either upload or fallback to data: URI
    const summaryText = (summary as string | undefined)?.slice(0, 500) || 'Ringkasan visual dari Kesimpulan.';
    const placeholderImage = `https://kesimpulan.vercel.app/share?summary=${encodeURIComponent(
      summaryText.slice(0, 120)
    )}`;

    const metadata = {
      name: 'Kesimpulan NFT',
      description: summaryText,
      image: imageDataUrl || placeholderImage, // default fallback; will be replaced if upload succeeds
    };

    // Try upload to Supabase if configured
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const imagePath = `images/${Date.now()}-${Math.random().toString(16).slice(2)}.png`;
        const { error: imageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(imagePath, Buffer.from(base64, 'base64'), {
            cacheControl: '3600',
            contentType: 'image/png',
          });

        if (imageError) throw imageError;

        const { data: imageData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imagePath);
        metadata.image = imageData.publicUrl;

        const metadataPath = `metadata/${Date.now()}-${Math.random().toString(16).slice(2)}.json`;
        const { error: metadataError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(metadataPath, JSON.stringify(metadata), {
            cacheControl: '3600',
            contentType: 'application/json',
          });

        if (metadataError) throw metadataError;

        const { data: metadataPublic } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(metadataPath);

        return NextResponse.json({
          tokenURI: metadataPublic.publicUrl,
          imageUrl: metadata.image,
        });
      } catch (err: any) {
        console.error('Supabase upload failed, falling back to data URI', err);
      }
    }

    // Fallback: inline metadata via data URI with small payload (no base64 image to avoid oversized calldata)
    const fallbackMetadata = {
      ...metadata,
      image: placeholderImage,
    };
    const tokenURI = `data:application/json;utf8,${encodeURIComponent(JSON.stringify(fallbackMetadata))}`;
    return NextResponse.json({ tokenURI, imageUrl: placeholderImage });
  } catch (error) {
    console.error('mint-metadata error', error);
    return NextResponse.json({ error: 'Gagal menyiapkan metadata.' }, { status: 500 });
  }
}
