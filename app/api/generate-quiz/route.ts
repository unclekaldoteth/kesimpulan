import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { text, url } = await req.json();
    let contentToAnalyze = text;

    // --- 1. SMART SCRAPING (Khusus Warpcast/Social) ---
    if (url) {
      try {
        // Trik: Nyamar jadi Bot Twitter/Discord supaya website ngasih Preview Text asli
        const response = await fetch(url, {
            headers: { 
                "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
            }
        });

        if (!response.ok) throw new Error(`Failed to fetch`);
        const html = await response.text();
        const $ = cheerio.load(html);

        // Bersihin sampah HTML
        $('script, style, nav, footer, header, svg, button, form').remove();
        
        // PRIORITY 1: Ambil dari Meta Description (Biasanya isi Cast ada disini)
        const ogDesc = $('meta[property="og:description"]').attr('content');
        const twitterDesc = $('meta[name="twitter:description"]').attr('content');
        const metaDesc = $('meta[name="description"]').attr('content');
        
        // PRIORITY 2: Title (Kadang isi Cast pendek masuk title)
        const ogTitle = $('meta[property="og:title"]').attr('content');
        const pageTitle = $('title').text();

        // PRIORITY 3: Body Text (Dibersihkan)
        let bodyText = $('body').text().replace(/\s+/g, ' ').trim();

        // LOGIKA PENGGABUNGAN PINTAR
        // Kita utamakan Description karena di Warpcast, itulah isi kontennya.
        // Kalau Body Text isinya cuma "Log in / Sign up", kita buang.
        
        let combinedText = "";
        
        if (ogDesc && ogDesc.length > 10) {
            combinedText = ogDesc; // Percaya penuh pada metadata preview
        } else {
            // Fallback ke body
            combinedText = bodyText;
        }

        // Gabungkan title buat konteks tambahan
        if (ogTitle && !ogTitle.includes("Warpcast") && !ogTitle.includes("Farcaster")) {
            combinedText = `${ogTitle}. ${combinedText}`;
        }

        contentToAnalyze = combinedText;
        console.log("Scraped Text Preview:", contentToAnalyze.substring(0, 100)); // Cek di log Vercel

      } catch (e) {
        console.error("Scraping Error:", e);
        return NextResponse.json({ error: 'Gagal membaca link. Pastikan link publik.' }, { status: 400 });
      }
    }

    if (!contentToAnalyze || contentToAnalyze.length < 20) {
        return NextResponse.json({ error: 'Konten terlalu pendek atau tidak terbaca.' }, { status: 400 });
    }

    // --- 2. GEMINI DENGAN "ANTI-HALUSINASI" ---
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let contentType = "Artikel";
    if (url && (url.includes("warpcast") || url.includes("farcaster"))) contentType = "Cast";
    else if (url && (url.includes("twitter") || url.includes("x.com"))) contentType = "Tweet";

    const prompt = `
      Anda adalah AI Tutor edukatif untuk pengguna Indonesia.

      KONTEKS SUMBER: Ini adalah sebuah ${contentType}.
      
      TEKS SUMBER: 
      "${contentToAnalyze.substring(0, 6000)}"

      INSTRUKSI:
      1. Pelajari TEKS SUMBER.
      2. Buat Diagram Mermaid.js SANGAT SEDERHANA (Flowchart TD).
      3. Buat Ringkasan. 
         - PENTING: Jika sumber adalah 'Cast' atau 'Tweet', gunakan istilah tersebut dalam ringkasan (Jangan sebut 'Artikel').
         - Contoh: "Cast dari @username ini membahas..." atau "Tweet ini menjelaskan..."
      
      FORMAT OUTPUT (JSON MURNI):
      {
        "summary": "Ringkasan 3 poin utama (Bahasa Indonesia, gunakan istilah ${contentType})",
        "mermaid_chart": "graph TD; A[Mulai] --> B[Isi];", 
        "question": "Satu pertanyaan pilihan ganda",
        "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
        "correctIndex": number
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const jsonResult = JSON.parse(responseText);

    // Handle tolakan AI
    if (jsonResult.valid === false) {
        return NextResponse.json({ error: jsonResult.error_msg || "Gagal menganalisa konten." }, { status: 400 });
    }

    return NextResponse.json(jsonResult);

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: 'AI sedang sibuk. Coba lagi.' }, { status: 500 });
  }
}