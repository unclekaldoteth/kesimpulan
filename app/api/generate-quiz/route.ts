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

    const prompt = `
      Anda adalah AI Tutor khusus untuk pengguna Indonesia di aplikasi Farcaster.

      TEKS SUMBER (Bisa bahasa apapun): 
      "${contentToAnalyze.substring(0, 6000)}"

      INSTRUKSI:
      1. Pelajari TEKS SUMBER di atas.
      2. Terjemahkan inti sarinya ke dalam **BAHASA INDONESIA**.
      3. Jelaskan dengan gaya bahasa yang santai tapi edukatif (cocok untuk komunitas crypto/tech Indonesia).
      4. Buat diagram alur (Mermaid.js) dengan label Bahasa Indonesia.

      FORMAT OUTPUT (WAJIB JSON MURNI):
      {
        "summary": "Ringkasan 3 poin utama (Wajib Bahasa Indonesia)",
        "mermaid_chart": "graph TD; A[Konsep Utama] --> B[Detail 1]; B --> C[Detail 2]; (Label dalam diagram WAJIB Bahasa Indonesia)",
        "question": "Satu pertanyaan pilihan ganda untuk menguji pemahaman (Wajib Bahasa Indonesia)",
        "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"] (Wajib Bahasa Indonesia),
        "correctIndex": number (Indeks jawaban benar 0-3)
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