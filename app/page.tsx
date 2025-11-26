"use client";

import { useState, useEffect, useCallback } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { 
  Trophy, User, Sparkles, Share2, ArrowRight, Zap, 
  CheckCircle, XCircle, Wallet, Clipboard, Loader2, Heart
} from 'lucide-react';
import Mermaid from 'react-mermaid2';

type TabType = 'quiz' | 'leaderboard' | 'profile';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('quiz');
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [quizData, setQuizData] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userContext, setUserContext] = useState<any>(null);
  const [isFrameAdded, setIsFrameAdded] = useState(false);
  
  // State Toast
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success'|'error'}>({
    show: false, message: '', type: 'success'
  });

  const loadingTexts = ["Membaca konten...", "Mencari poin penting...", "Menyusun diagram visual...", "Membuat kuis pemahaman..."];

  // --- INIT FARCASTER & CEK SHARE CONTEXT ---
  useEffect(() => {
    const initialize = async () => {
      try {
        await sdk.actions.ready();
        const context = await sdk.context;
        
        if (context) {
            // 1. Set User Data
            if (context.user) setUserContext(context.user);

            const ctx = context as any;

            // 2. LOGIKA MAGIC: Cek apakah dibuka dari "Share Extension"?
            // Sesuai Docs: context.location akan berisi tipe 'cast' jika dari share
            if (ctx.location && ctx.location.type === 'cast' && ctx.location.cast) {
                const cast = ctx.location.cast;
                
                // Kita rakit ulang Link Cast-nya
                const castUrl = `https://warpcast.com/${cast.author.username}/${cast.hash.substring(0, 10)}`;
                
                // Otomatis tempel ke input
                setInputText(castUrl);
                
                // Kasih notif biar user tau
                showToast(`Menganalisa Cast dari @${cast.author.username}...`);
            }
        }
      } catch (e) { console.error(e); }
    };
    initialize();
  }, []);

  // --- LOGIC LAINNYA TETAP SAMA ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => setLoadingStep((prev) => (prev + 1) % loadingTexts.length), 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleAddFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
      setIsFrameAdded(true);
      showToast("Notifikasi berhasil diaktifkan!");
    } catch (error) { }
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) { setInputText(text); showToast("Link ditempel!"); }
      else { showToast("Clipboard kosong", 'error'); }
    } catch (err) { showToast("Gagal membaca clipboard", 'error'); }
  };

  const handleGenerate = async () => {
    if (!inputText) return;
    setLoading(true);
    setQuizData(null);
    setSelectedOption(null);
    setIsCorrect(null);

    const isUrl = inputText.trim().startsWith('http');
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isUrl ? { url: inputText } : { text: inputText }),
      });
      const data = await res.json();
      if (data.error) { showToast(data.error, 'error'); } 
      else { setQuizData(data); showToast("Selesai! Silakan pelajari."); }
    } catch (e) { showToast("Gagal memproses. Cek koneksi.", 'error'); } 
    finally { setLoading(false); }
  };

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    const correct = index === quizData.correctIndex;
    setIsCorrect(correct);
    if (correct) showToast("Jawaban Benar! 🎉");
    else showToast("Kurang tepat, coba lagi.", 'error');
  };

        const handleShareResult = (data: any) => {
    if (!data) return;

    // 1. Siapkan Teks Caption (Buat pancingan di feed)
    const rawTopic = data.summary || "topik ini";
    const cleanTopic = rawTopic.split('.')[0].replace(/\n/g, " ").substring(0, 50) + "...";
    
    // 2. Siapkan Teks Gambar (Buat dilukis di OG Image)
    // Kita potong max 180 karakter biar gambarnya gak penuh sesak
    const summaryForImage = rawTopic.replace(/\n/g, " ").substring(0, 180);

    // 3. Deteksi Username (Opsional, kayak tadi)
    const farcasterRegex = /(warpcast\.com|farcaster\.xyz)\/([^\/]+)/;
    const match = inputText.match(farcasterRegex);
    let shareText = "";
    
    if (match && match[2]) {
        shareText = `Baru aja dapet ringkasan visual cast @${match[2]}: "${cleanTopic}" ✨`;
    } else {
        shareText = `Baru aja dapet ringkasan visual dari Mini App: Kesimpulan tentang "${cleanTopic}" ✨`;
    }

    const fullText = `${shareText}\n\nCek ringkasan lengkapnya di gambar 👇`;

    // 4. RAKIT URL SHARE (Arahkan ke /share dengan parameter summary)
    const embedUrl = `https://kesimpulan.vercel.app/share?summary=${encodeURIComponent(summaryForImage)}`;

    sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(fullText)}&embeds[]=${encodeURIComponent(embedUrl)}`);
  };

  const handleTip = async (amountEth: string) => {
    const devWallet = "0x0d2834025917Eb1975ab3c4c2e2627bE1899E730"; 
    const amountWei = amountEth === '1' ? BigInt(300000000000000) : BigInt(1500000000000000);
    const hexValue = "0x" + amountWei.toString(16);

    try {
      showToast("Membuka dompet...", 'success');
      const provider = (sdk.wallet as any).ethProvider;
      if (!provider) { showToast("Wallet tidak ditemukan", 'error'); return; }

      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [{ to: devWallet, value: hexValue, data: "0x" }],
      });

      if (txHash) showToast("Terima kasih supportnya! ❤️");
    } catch (e) { showToast("Transaksi dibatalkan", 'error'); }
  };

  return (
    <main className="min-h-screen font-sans pb-32 text-white selection:bg-orange-500/30 relative overflow-x-hidden" style={{backgroundColor: '#000000'}}>
      
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
          <div className={`px-6 py-3 rounded-full shadow-2xl border backdrop-blur-md flex items-center gap-2 font-bold text-sm ${toast.type === 'success' ? 'bg-green-900/90 border-green-500/50 text-white' : 'bg-red-900/90 border-red-500/50 text-white'}`}>
              {toast.type === 'success' ? <CheckCircle size={16}/> : <XCircle size={16}/>}
              {toast.message}
          </div>
      </div>

      <div className="fixed top-[-10%] left-[20%] w-[200px] h-[200px] bg-purple-900/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-10%] w-[150px] h-[150px] bg-blue-900/20 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="pt-4 px-4 sticky top-0 z-50 safe-area-padding">
         <div className="bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex justify-between items-center shadow-lg">
             <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white">Kesimpulan.</h1>
             </div>
             <button onClick={() => setActiveTab('profile')} className="rounded-full bg-[#222] flex items-center justify-center overflow-hidden border border-white/10" style={{width:'32px', height:'32px', minWidth:'32px'}}>
                 {userContext?.pfpUrl ? <img src={userContext.pfpUrl} alt="pfp" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <User size={16} className="text-gray-400"/>}
             </button>
         </div>
      </div>

      <div className="px-4 pt-6 max-w-md mx-auto space-y-6 relative z-10">
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {!quizData ? (
                <>
                   <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-1 relative overflow-hidden">
                      <div className="bg-[#0f0f0f] rounded-[20px] p-6 space-y-5 relative z-10">
                          <div className="text-center space-y-2">
                             <h2 className="text-2xl font-bold text-white">Ringkas Apapun.</h2>
                             <p className="text-sm text-gray-400 leading-relaxed">Tempel link artikel atau Cast.<br/>Dapatkan visualisasi instan.</p>
                          </div>
                          <div className="relative">
                            <textarea 
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-[15px] text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-all h-32 resize-none"
                                placeholder="Tempel link (https://...) di sini..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            {!inputText && (
                                <button onClick={handlePaste} className="absolute bottom-3 right-3 bg-[#333] hover:bg-[#444] text-xs text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-white/10">
                                    <Clipboard size={12} /> Tempel
                                </button>
                            )}
                            {inputText && <button onClick={() => setInputText("")} className="absolute top-3 right-3 text-gray-500 hover:text-white"><XCircle size={18} /></button>}
                          </div>
                          <button onClick={handleGenerate} disabled={loading || !inputText} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2 ${loading ? 'bg-[#222] text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:brightness-110'}`}>
                            {loading ? <><Loader2 className="animate-spin" size={18}/><span className="text-sm">{loadingTexts[loadingStep]}</span></> : <>Check Kesimpulan <ArrowRight size={20}/></>}
                          </button>
                      </div>
                   </div>
                   
                   <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-5 text-center space-y-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Support Developer</p>
                      <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => sdk.actions.openUrl("https://warpcast.com/unclekal")} className="py-3 bg-[#1a1a1a] hover:bg-[#222] rounded-xl text-xs font-bold text-white border border-white/10 transition-colors">Follow</button>
                          <button onClick={() => handleTip('5')} className="py-3 bg-[#1a1a1a] hover:bg-[#222] rounded-xl text-xs font-bold text-white border border-white/10 transition-colors flex justify-center items-center gap-1">Tip <span className="text-red-500">❤️</span></button>
                      </div>
                   </div>
                </>
            ) : (
                // RESULT VIEW (Sama)
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                    <div className="bg-white rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                         <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Share2 size={12} className="text-orange-500"/> Alur Pikir</div>
                         </div>
                        <div className="p-6 flex justify-center bg-white items-center overflow-x-auto">
                           <div className="mermaid-container text-black w-full flex justify-center text-xs font-bold"><Mermaid chart={quizData.mermaid_chart} /></div>
                        </div>
                    </div>
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-red-500"></div>
                        <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Intisari Materi</h3>
                        <p className="text-[15px] leading-7 text-gray-200 whitespace-pre-line font-medium">{quizData.summary}</p>
                    </div>
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-5"><Zap size={16} className="text-yellow-500"/><h3 className="text-sm font-bold text-white">Cek Pemahaman</h3></div>
                        <h3 className="font-bold text-lg mb-6 text-white leading-snug">{quizData.question}</h3>
                        <div className="space-y-3">
                            {quizData.options.map((opt: string, idx: number) => (
                                <button key={idx}disabled={isCorrect === true} 
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full p-4 rounded-xl text-left text-[14px] font-medium border transition-all flex justify-between items-center ${
                                        selectedOption === idx 
                                        ? (isCorrect ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-red-500/10 border-red-500 text-red-400')
                                        : 'bg-[#1a1a1a] border-white/5 text-gray-300 hover:border-white/20'
                                    }`}
                                >
                                    <span>{opt}</span>
                                    {selectedOption === idx && (isCorrect ? <CheckCircle size={18}/> : <XCircle size={18}/>)}
                                </button>
                            ))}
                        </div>

                        {/* TOMBOL "COBA LAGI" (Hanya muncul kalau sudah jawab DAN salah) */}
                        {selectedOption !== null && isCorrect === false && (
                            <button 
                                onClick={() => {
                                    setSelectedOption(null);
                                    setIsCorrect(null);
                                }}
                                className="mt-4 w-full py-3 rounded-xl text-sm font-bold text-white bg-[#222] border border-white/10 hover:bg-[#333] transition-colors flex justify-center items-center gap-2"
                            >
                                🔄 Coba Lagi
                            </button>
                        )}
                    </div>
                    {isCorrect && (
                        <div className="flex flex-col gap-3 animate-pulse">
                            <button onClick={() => handleShareResult(quizData)} className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg flex justify-center items-center gap-2"><Share2 size={18} /> Bagikan Hasil</button>
                            <button onClick={() => { navigator.clipboard.writeText(quizData.summary); showToast("Ringkasan disalin!"); }} className="w-full py-3 rounded-xl font-bold text-gray-400 bg-[#1a1a1a] border border-white/5 hover:bg-[#222] flex justify-center items-center gap-2"><Clipboard size={16} /> Salin Ringkasan</button>
                        </div>
                    )}
                    <button onClick={() => { setQuizData(null); setInputText(""); }} className="w-full py-4 rounded-xl text-sm font-bold text-gray-500 hover:text-white transition-colors bg-[#111] border border-white/5">Mulai Baru</button>
                </div>
            )}
          </div>
        )}

        {/* TAB 2 & 3 SAMA SAJA (Tetap dipertahankan) */}
        {activeTab === 'leaderboard' && <div className="space-y-6 animate-in fade-in"><div className="bg-[#111] border border-white/10 rounded-3xl p-8 text-center relative"><p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Komunitas Terpintar</p><h2 className="text-4xl font-black text-white tracking-tighter">/base</h2><div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 font-mono"><Trophy size={12} className="text-yellow-500"/> 14,203 Pts</div></div></div>}
        {activeTab === 'profile' && <div className="space-y-6 animate-in fade-in"><div className="bg-[#111] border border-white/10 rounded-3xl p-8 text-center"><div className="w-24 h-24 bg-[#1a1a1a] rounded-full mx-auto mb-5 overflow-hidden border-4 border-[#222] flex items-center justify-center" style={{width:'96px', height:'96px'}}>{userContext?.pfpUrl ? <img src={userContext.pfpUrl} alt="pfp" style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <User size={40} className="text-gray-600"/>}</div><h2 className="text-2xl font-bold text-white mb-1">@{userContext?.username || "Guest"}</h2><button onClick={handleAddFrame} disabled={isFrameAdded} className={`mt-4 w-full py-3 rounded-xl text-sm font-bold border transition-all ${isFrameAdded ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-white text-black border-white'}`}>{isFrameAdded ? "Notifikasi Aktif" : "Aktifkan Notifikasi"}</button></div><div className="bg-[#111] border border-white/10 rounded-2xl p-5"><div className="flex items-center gap-2 mb-4"><Heart size={16} className="text-red-500" fill="currentColor"/><h3 className="text-sm font-bold text-white">Support Creator</h3></div><div className="grid grid-cols-2 gap-3"><button onClick={() => handleTip('1')} className="bg-[#1a1a1a] hover:bg-[#222] border border-white/5 rounded-xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95"><Wallet size={20} className="text-blue-400"/><span className="text-xs font-bold text-white">Tip ~ $1</span></button><button onClick={() => handleTip('5')} className="bg-[#1a1a1a] hover:bg-[#222] border border-white/5 rounded-xl p-4 flex flex-col items-center gap-2 transition-all active:scale-95"><Sparkles size={20} className="text-yellow-400"/><span className="text-xs font-bold text-white">Tip ~ $5</span></button></div></div></div>}
      </div>

      <nav className="fixed bottom-0 w-full bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 py-2 px-6 pb-6 z-40 flex justify-around safe-area-padding"><button onClick={() => setActiveTab('quiz')} className={`flex flex-col items-center gap-1 w-16 p-1 rounded-xl transition-all ${activeTab === 'quiz' ? 'text-orange-500' : 'text-gray-600'}`}><Sparkles size={24} strokeWidth={2.5}/><span className="text-[10px] font-bold mt-1">Home</span></button><button onClick={() => setActiveTab('leaderboard')} className={`flex flex-col items-center gap-1 w-16 p-1 rounded-xl transition-all ${activeTab === 'leaderboard' ? 'text-orange-500' : 'text-gray-600'}`}><Trophy size={24} strokeWidth={2.5}/><span className="text-[10px] font-bold mt-1">Rank</span></button><button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 w-16 p-1 rounded-xl transition-all ${activeTab === 'profile' ? 'text-orange-500' : 'text-gray-600'}`}><User size={24} strokeWidth={2.5}/><span className="text-[10px] font-bold mt-1">Me</span></button></nav>
    </main>
  );
}