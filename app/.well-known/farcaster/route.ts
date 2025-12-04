import { NextResponse } from 'next/server';

// Serve Base/Farcaster mini app manifest from server route to avoid stale/static issues.
export async function GET() {
  const manifest = {
    accountAssociation: {
      header: 'eyJmaWQiOjQ1NjU4NSwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDBkMjgzNDAyNTkxN0ViMTk3NWFiM2M0YzJlMjYyN2JFMTg5OUU3MzAifQ',
      payload: 'eyJkb21haW4iOiJrZXNpbXB1bGFuLnZlcmNlbC5hcHAifQ',
      signature: 'AZA2Z+Vdho9CTgpo0sq3XKhq0GfTKc2ZsIT3YgwRKe5D4x571Ax7oE5dxfHUDH9UdTYhy0yJ5cZbz79G28z2rhs=',
    },
    baseBuilder: {
      ownerAddress: '0x0d2834025917Eb1975ab3c4c2e2627bE1899E730',
    },
    miniapp: {
      version: '1',
      name: 'Kesimpulan',
      homeUrl: 'https://kesimpulan.vercel.app',
      iconUrl: 'https://kesimpulan.vercel.app/icon.png',
      splashImageUrl: 'https://kesimpulan.vercel.app/icon.png',
      splashBackgroundColor: '#000000',
      subtitle: 'Ringkas & mint NFT',
      description: 'Ubah teks atau cast jadi visual alur pikir + kuis, lalu mint sebagai NFT gratis.',
      screenshotUrls: [
        'https://kesimpulan.vercel.app/tampilan-app.png',
        'https://kesimpulan.vercel.app/opengraph-image.png',
      ],
      primaryCategory: 'education',
      tags: ['education', 'nft', 'summary'],
      heroImageUrl: 'https://kesimpulan.vercel.app/opengraph-image.png',
      tagline: 'Ringkasan instan jadi NFT',
      ogTitle: 'Kesimpulan Mini App',
      ogDescription: 'Ringkas, visualkan, dan mint NFT gratis.',
      ogImageUrl: 'https://kesimpulan.vercel.app/opengraph-image.png',
      noindex: true,
    },
    frame: {
      version: '1',
      name: 'Kesimpulan',
      iconUrl: 'https://kesimpulan.vercel.app/icon.png',
      homeUrl: 'https://kesimpulan.vercel.app',
      imageUrl: 'https://kesimpulan.vercel.app/opengraph-image.png',
      buttonTitle: 'Buka App',
      splashImageUrl: 'https://kesimpulan.vercel.app/icon.png',
      splashBackgroundColor: '#000000',
      webhookUrl: 'https://kesimpulan.vercel.app/api/webhook',
      tagline: 'Lebih Cepat Paham',
      description: 'Ringkasan visual instan.',
      triggers: [
        {
          type: 'share',
          action: {
            type: 'launch_frame',
            name: 'Buat Kesimpulan',
            url: 'https://kesimpulan.vercel.app',
          },
        },
      ],
    },
  };

  return NextResponse.json(manifest, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
