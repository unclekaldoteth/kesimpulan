export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://esolvhnpvfoavgycrwgy.supabase.co';
const DEFAULT_SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzb2x2aG5wdmZvYXZneWNyd2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDEzMjUwMiwiZXhwIjoyMDc5NzA4NTAyfQ.w_03lST6letbAI-_X266dXd9hH6H0cWLdjCEf-uCoZs';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  DEFAULT_SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  '';

// Minimal check: bucket create/list needs service_role key; reject anon/public keys to avoid RLS errors
const isServiceRoleKey = (key: string) => {
  try {
    const payload = key.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return decoded.role === 'service_role';
  } catch {
    return false;
  }
};

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

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase URL/Service Key belum dikonfigurasi (butuh SUPABASE_SERVICE_ROLE_KEY di server).' },
        { status: 500 }
      );
    }

    if (!isServiceRoleKey(supabaseKey)) {
      return NextResponse.json(
        { error: 'Gunakan SUPABASE_SERVICE_ROLE_KEY (bukan anon/public key) agar bisa akses Storage.' },
        { status: 500 }
      );
    }

    // Try upload to Supabase; jika gagal, error agar user tahu (tidak fallback ke placeholder)
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ensure bucket exists and is public
    const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets();
    if (bucketListError) {
      return NextResponse.json({ error: `Supabase bucket list gagal: ${bucketListError.message}` }, { status: 500 });
    }
    const hasBucket = buckets?.some((b) => b.name === STORAGE_BUCKET);
    if (!hasBucket) {
      const { error: createBucketError } = await supabase.storage.createBucket(STORAGE_BUCKET, { public: true });
      if (createBucketError) {
        return NextResponse.json({ error: `Supabase bucket create gagal: ${createBucketError.message}` }, { status: 500 });
      }
    } else {
      await supabase.storage.updateBucket(STORAGE_BUCKET, { public: true }).catch(() => {});
    }

    const imagePath = `images/${Date.now()}-${Math.random().toString(16).slice(2)}.png`;
    const { error: imageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(imagePath, Buffer.from(base64, 'base64'), {
        cacheControl: '3600',
        contentType: 'image/png',
      });

    if (imageError) {
      return NextResponse.json({ error: `Upload gambar gagal: ${imageError.message}` }, { status: 500 });
    }

    const { data: imageData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imagePath);
    metadata.image = imageData.publicUrl;

    const metadataPath = `metadata/${Date.now()}-${Math.random().toString(16).slice(2)}.json`;
    const { error: metadataError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(metadataPath, JSON.stringify(metadata), {
        cacheControl: '3600',
        contentType: 'application/json',
      });

    if (metadataError) {
      return NextResponse.json({ error: `Upload metadata gagal: ${metadataError.message}` }, { status: 500 });
    }

    const { data: metadataPublic } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(metadataPath);

    return NextResponse.json({
      tokenURI: metadataPublic.publicUrl,
      imageUrl: metadata.image,
    });
  } catch (error) {
    console.error('mint-metadata error', error);
    return NextResponse.json({ error: 'Gagal menyiapkan metadata.' }, { status: 500 });
  }
}
