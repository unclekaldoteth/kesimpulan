"use client";

import { useState, useEffect, useCallback } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { 
  BookOpen, CheckCircle, XCircle, FileText, 
  Trophy, User, Wallet, Share2, Bell, Zap, Sparkles, ChevronRight,
  ArrowRight
} from 'lucide-react';
import Mermaid from 'react-mermaid2';

type TabType = 'quiz' | 'leaderboard' | 'profile';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('quiz');
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userContext, setUserContext] = useState<any>(null);
  const [isFrameAdded, setIsFrameAdded] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await sdk.actions.ready();
        const context = await sdk.context;
        if (context?.user) {
            setUserContext(context.user);
        }
      } catch (e) {
        console.error("Farcaster Init Error", e);
      }
    };
    initialize();
  }, []);

  const handleAddFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
      setIsFrameAdded(true);
    } catch (error) { console.error(error); }
  }, []);

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
      if (data.error) alert(data.error);
      else setQuizData(data);
    } catch (e) {
      alert("Gagal memproses. Cek koneksi internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    setIsCorrect(index === quizData.correctIndex);
  };

  const handleShareResult = () => {
    const text = `Gua baru aja baca ringkasan topik ini lewat @Kesimpulan. Hemat waktu banget! ⚡️🇮🇩\n\nCek ringkasannya di sini 👇`;
    const embedUrl = "https://kesimpulan.vercel.app"; 
    sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${embedUrl}`);
  };

  const handleTip = () => {
    sdk.actions.openUrl("https://warpcast.com/unclekal"); 
  };

  return (
    // BACKGROUND UTAMA: Gelap Pekat dengan text putih
    <main className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30">
      
      {/* --- HEADER PREMIUM --- */}
      {/* Menggunakan backdrop-blur agar transparan tapi tetap terbaca */}
      <header className="fixed top-0 w-full z-30 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Logo dengan efek glow halus */}
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-cyan-500/20">
                 <FileText className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Kesimpulan<span className="text-cyan-400">.</span>
              </h1>
            </div>
            {userContext && (
                // Badge username
                <div className="text-[11px] font-bold text-cyan-300 bg-cyan-950/50 border border-cyan-900/80 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                    @{userContext.username}
                </div>
            )}
        </div>
      </header>

      {/* --- CONTAINER UTAMA (Dikasih padding atas pt-28 biar gak ketutupan header) --- */}
      <div className="pt-28 pb-32 px-6 max-w-md mx-auto relative z-10">
        
        {/* TAB 1: RINGKAS (HOME) */}
        {activeTab === 'quiz' && (
          <div className="space-y-8">
            {!quizData ? (
                // === STATE INPUT ===
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   
                   {/* Hero Text dengan Gradasi */}
                   <div className="text-center space-y-3">
                      <h2 className="text-4xl font-black bg-gradient-to-r from-white via-cyan-100 to-slate-400 bg-clip-text text-transparent leading-tight">
                        Malas Baca Panjang?
                      </h2>
                      <p className="text-slate-400 text-base font-medium leading-relaxed px-4">
                        Tempel link artikel atau Cast.<br/>Kami buatkan <span className="text-cyan-400 font-bold">Ringkasan Visual</span> instan.
                      </p>
                   </div>

                   {/* Input Area Modern (Gelap & Rounded) */}
                   <div className="relative group">
                     {/* Efek Glow di belakang input */}
                     <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-[20px] blur-md opacity-20 group-hover:opacity-40 transition duration-500"></div>
                     <textarea 
                      className="relative w-full p-5 bg-[#0f172a] rounded-2xl border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none h-44 text-[15px] placeholder-slate-500 transition-all text-slate-200 resize-none shadow-xl font-medium leading-relaxed"
                      placeholder="Contoh: https://warpcast.com/..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                    {inputText && (
                        <button onClick={() => setInputText("")} className="absolute top-5 right-5 text-slate-500 hover:text-white bg-slate-800/80 backdrop-blur rounded-full p-1.5 z-20 transition-colors">
                            <XCircle size={18} />
                        </button>
                    )}
                   </div>
                  
                  {/* Tombol Utama (Gradasi Cerah) */}
                  <button 
                    onClick={handleGenerate}
                    disabled={loading || !inputText}
                    className={`w-full py-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-3 shadow-xl transition-all active:scale-[0.98] relative overflow-hidden ${
                        loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:brightness-110 text-white shadow-cyan-500/30'
                    }`}
                  >
                    {loading ? (
                        <span className="flex items-center gap-3"><Sparkles className="animate-spin" size={22}/> Menganalisa...</span>
                    ) : (
                        <span className="flex items-center gap-2">Buat Kesimpulan Sekarang <ArrowRight size={22} /></span>
                    )}
                  </button>
                </div>
            ) : (
                // === STATE HASIL ===
                <div className="space-y-8 animate-in zoom-in duration-500">
                    
                    {/* Hasil 1: Diagram Mermaid (Container Putih biar jelas) */}
                    <div className="rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl relative bg-white group">
                         <div className="absolute top-0 left-0 w-full bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center z-10">
                             <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Share2 size={14} className="text-cyan-600" /> Alur Pikir Visual
                             </div>
                         </div>
                        <div className="flex justify-center pt-14 pb-8 px-4 bg-white min-h-[220px] items-center">
                           {/* Wrapper untuk styling mermaid */}
                           <div className="mermaid-container text-slate-900 text-sm font-bold [&_g.node_rect]:!fill-cyan-50 [&_g.node_rect]:!stroke-cyan-200 [&_g.edgePath_path]:!stroke-slate-400 [&_g.marker>path]:!fill-slate-400">
                               <Mermaid chart={quizData.mermaid_chart} />
                           </div>
                        </div>
                    </div>

                    {/* Hasil 2: Ringkasan Teks (Card Gelap Glassmorphism) */}
                    <div className="bg-[#0f172a]/80 backdrop-blur-xl p-7 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                        {/* Dekorasi background blur */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-[50px] -z-10"></div>
                        
                        <h3 className="text-sm font-black text-cyan-400 uppercase mb-5 flex items-center gap-3 tracking-widest border-b border-slate-800/50 pb-3">
                            <BookOpen size={18} /> Intisari Materi
                        </h3>
                        <p className="text-[15px] leading-8 text-slate-300 whitespace-pre-line font-medium relative z-10">
                           {quizData.summary}
                        </p>
                    </div>

                    {/* Hasil 3: Kuis Interaktif */}
                    <div className="pt-4">
                        <div className="flex items-center justify-between px-2 mb-4">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Zap size={16} className="text-yellow-500"/> Cek Pemahaman</h2>
                        </div>
                        
                        <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800 shadow-lg">
                            <h3 className="font-bold text-lg leading-snug mb-6 text-white">{quizData.question}</h3>
                            
                            <div className="grid gap-3">
                                {quizData.options.map((opt: string, idx: number) => (
                                    <button
                                        key={idx}
                                        disabled={selectedOption !== null}
                                        onClick={() => handleAnswer(idx)}
                                        className={`p-5 rounded-2xl text-left text-[15px] font-semibold border-2 transition-all active:scale-[0.99] ${
                                            selectedOption === idx 
                                            ? (isCorrect ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-red-500/20 border-red-500 text-red-300')
                                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center gap-4">
                                            <span className="leading-snug">{opt}</span>
                                            {selectedOption === idx && (isCorrect ? <CheckCircle className="text-green-500 shrink-0" size={20}/> : <XCircle className="text-red-500 shrink-0" size={20}/>)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tombol Share (Muncul kalau benar) */}
                    {isCorrect && (
                        <div className="fixed bottom-28 left-0 w-full px-6 z-30 animate-in slide-in-from-bottom-10 fade-in duration-500">
                            <button 
                                onClick={handleShareResult}
                                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black rounded-2xl hover:brightness-110 transition-all flex justify-center items-center gap-3 shadow-xl shadow-green-500/20 text-lg active:scale-[0.98]"
                            >
                                <Share2 size={22} strokeWidth={2.5} /> Bagikan Hasil Ini
                            </button>
                        </div>
                    )}
                    
                    <div className="h-4"></div> {/* Spacer */}
                    
                    <button 
                        onClick={() => { setQuizData(null); setInputText(""); }}
                        className="w-full text-slate-500 text-sm font-bold py-4 hover:text-white hover:bg-slate-900 rounded-2xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Sparkles size={16}/> Buat Kesimpulan Baru
                    </button>
                </div>
            )}
          </div>
        )}

        {/* TAB 2: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
             <div className="space-y-6 animate-in fade-in pt-4">
                <div className="bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-950 p-8 rounded-[30px] border border-slate-800 text-center relative overflow-hidden shadow-2xl">
                    {/* Efek cahaya di background */}
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,rgba(0,0,0,0)_70%)]"></div>
                    
                    <div className="relative z-10">
                        <Trophy className="mx-auto text-yellow-500 mb-6 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" size={64} strokeWidth={1.5} />
                        <h2 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Komunitas Paling Pintar</h2>
                        <div className="text-6xl font-black text-white tracking-tighter mb-4">/base</div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-950/50 border border-cyan-900/50 rounded-full">
                            <Zap size={16} className="text-cyan-400" fill="currentColor"/>
                            <p className="text-sm text-cyan-300 font-bold font-mono">12,403 Points</p>
                        </div>
                    </div>
                </div>
             </div>
        )}

        {/* TAB 3: PROFIL */}
        {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in pt-6">
                <div className="text-center space-y-5">
                    <div className="relative inline-block">
                        {/* Foto Profil dengan Border Glow */}
                        <div className="w-28 h-28 bg-slate-900 rounded-full flex items-center justify-center border-[3px] border-slate-800 shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden p-1">
                            <div className="w-full h-full rounded-full overflow-hidden bg-slate-800">
                                {userContext?.pfpUrl ? (
                                    <img src={userContext.pfpUrl} alt="pfp" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-slate-600 m-auto mt-4" />
                                )}
                            </div>
                        </div>
                        {/* Status Online */}
                        <div className="absolute bottom-1 right-1 bg-green-500 w-7 h-7 rounded-full border-[4px] border-[#020617] shadow-sm"></div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">@{userContext?.username || "Guest"}</h2>
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
                            <Trophy size={14} className="text-yellow-500" /> Level 1 Explorer
                        </div>
                    </div>
                    
                    {/* Tombol Notifikasi */}
                     <button 
                        onClick={handleAddFrame}
                        disabled={isFrameAdded}
                        className={`mx-auto px-6 py-3 rounded-full text-sm font-bold border flex items-center gap-2 transition-all active:scale-95 shadow-lg ${isFrameAdded ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-600'}`}
                    >
                        {!isFrameAdded ? <><Bell size={16} /> Aktifkan Notifikasi</> : <><CheckCircle size={16} /> Notifikasi Aktif</>}
                    </button>
                </div>

                {/* Card Donasi Premium */}
                <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-8 rounded-[30px] border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -z-10"></div>
                    
                    <h3 className="font-black text-white mb-3 flex items-center gap-3 text-lg">
                        <Wallet size={24} className="text-blue-400" /> Dukung Developer
                    </h3>
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">
                        Aplikasi ini gratis. Dukungan kamu via Base (USDC/ETH) sangat berarti untuk biaya server.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={handleTip} className="py-4 bg-blue-600 rounded-2xl text-sm font-bold hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                            Tip $1 <ChevronRight size={16} className="text-blue-200"/>
                        </button>
                        <button onClick={handleTip} className="py-4 bg-slate-800 rounded-2xl text-sm font-bold hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-[0.98] transition-all">
                            Tip $5
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* --- NAVIGASI BAWAH STANDAR (FIXED FULL WIDTH) --- */}
      {/* Kembali ke desain standar yang lebih rapi dan tidak melayang sembarangan */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#020617]/90 backdrop-blur-xl border-t border-slate-800/80 pb-8 pt-3 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
        <div className="grid grid-cols-3 max-w-md mx-auto">
            <button onClick={() => setActiveTab('quiz')} className="group flex flex-col items-center gap-1.5 p-2 transition-all">
                <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'quiz' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    <FileText size={24} strokeWidth={activeTab === 'quiz' ? 2.5 : 2} />
                </div>
                <span className={`text-[11px] font-bold transition-all ${activeTab === 'quiz' ? 'text-cyan-400' : 'text-slate-500'}`}>Ringkas</span>
            </button>
            
            <button onClick={() => setActiveTab('leaderboard')} className="group flex flex-col items-center gap-1.5 p-2 transition-all">
                 <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'leaderboard' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    <Trophy size={24} strokeWidth={activeTab === 'leaderboard' ? 2.5 : 2} />
                </div>
                <span className={`text-[11px] font-bold transition-all ${activeTab === 'leaderboard' ? 'text-cyan-400' : 'text-slate-500'}`}>Top</span>
            </button>
            
            <button onClick={() => setActiveTab('profile')} className="group flex flex-col items-center gap-1.5 p-2 transition-all">
                 <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
                </div>
                <span className={`text-[11px] font-bold transition-all ${activeTab === 'profile' ? 'text-cyan-400' : 'text-slate-500'}`}>Saya</span>
            </button>
        </div>
      </nav>

    </main>
  );
}