// app/api/generate-quiz/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { text, url } = await req.json();
    let contentToAnalyze = text;

    // --- 1. SCRAPING (Tetap sama, teknik ini sudah bagus) ---
    if (url) {
      try {
        const response = await fetch(url, {
            headers: { 
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36" 
            }
        });

        if (!response.ok) throw new Error(`Failed to fetch`);
        const html = await response.text();
        const $ = cheerio.load(html);

        $('script, style, nav, footer, header, svg, button').remove();
        
        let bodyText = $('body').text().replace(/\s+/g, ' ').trim();
        
        // Fallback ke Metadata kalau body kosong (Penting buat link Farcaster)
        if (bodyText.length < 200) {
            const metaDesc = $('meta[name="description"]').attr('content');
            const ogDesc = $('meta[property="og:description"]').attr('content');
            const ogTitle = $('meta[property="og:title"]').attr('content');
            const twitterDesc = $('meta[name="twitter:description"]').attr('content');
            
            bodyText = [ogTitle, ogDesc, twitterDesc, metaDesc].filter(Boolean).join(". ");
        }
        
        contentToAnalyze = bodyText;
      } catch (e) {
        return NextResponse.json({ error: 'Gagal membaca link. Coba copy-paste teksnya saja.' }, { status: 400 });
      }
    }

    if (!contentToAnalyze || contentToAnalyze.length < 10) {
        return NextResponse.json({ error: 'Konten terlalu pendek atau kosong.' }, { status: 400 });
    }

    // --- 2. GEMINI 2.0 DENGAN INSTRUKSI INDONESIA ---
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Cari bagian "const prompt = ..." dan GANTI dengan ini:

    const prompt = `
      Anda adalah AI Tutor edukatif.

      TEKS SUMBER: 
      "${contentToAnalyze.substring(0, 6000)}"

      INSTRUKSI:
      1. Pelajari TEKS SUMBER.
      2. Buat Diagram Mermaid.js yang SANGAT SEDERHANA (Flowchart TD).
         - HANYA gunakan node kotak biasa (A[Teks]).
         - JANGAN gunakan tanda kurung () di dalam teks label.
         - JANGAN gunakan simbol aneh (kutip, titik dua) di dalam teks label.
         - Format: graph TD; A[Mulai] --> B[Proses];
      
      FORMAT OUTPUT (JSON MURNI):
      {
        "summary": "Ringkasan 3 poin utama (Bahasa Indonesia yang santai & padat)",
        "mermaid_chart": "graph TD; A[Konsep Inti] --> B[Detail 1]; B --> C[Detail 2]; C --> D[Kesimpulan];", 
        "question": "Satu pertanyaan pilihan ganda yang relevan",
        "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
        "correctIndex": number
      }
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Bersihin format Markdown kalau Gemini "kesopanannya" kumat
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
        const jsonResult = JSON.parse(responseText);
        return NextResponse.json(jsonResult);
    } catch (parseError) {
        console.error("JSON Parse Error:", responseText);
        return NextResponse.json({ error: 'Terjadi kesalahan saat memproses jawaban AI.' }, { status: 500 });
    }

  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: 'Server sedang sibuk. Coba lagi nanti.' }, { status: 500 });
  }
}