// app/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { 
  BookOpen, CheckCircle, XCircle, FileText, 
  Trophy, User, Wallet, Share2, Bell, Zap, Plus,
  Sparkles
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

  // --- INIT FARCASTER ---
  useEffect(() => {
    const initialize = async () => {
      try {
        // 1. Kasih log biar kita tau ini jalan di Inspect Element
        console.log("Mencoba inisialisasi Frame...");
        
        // 2. Panggil ready() DULUAN sebelum loading data lain
        // Ini perintah wajib biar splash screen ilang
        await sdk.actions.ready();
        console.log("Frame Ready! Splash screen harusnya hilang.");

        // 3. Baru ambil data user
        const context = await sdk.context;
        if (context?.user) {
            console.log("User terdeteksi:", context.user.username);
            setUserContext(context.user);
        } else {
            console.log("User context kosong (mungkin di browser biasa)");
        }
      } catch (e) {
        // Kalau error, catat di console tapi JANGAN biarkan app crash
        console.error("Gagal inisialisasi Farcaster:", e);
      }
    };

    initialize();
  }, []);

  const handleAddFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
      setIsFrameAdded(true);
      alert("Notifikasi aktif! Kami akan kirim ringkasan tren terbaru.");
    } catch (error) {
      console.error(error); 
    }
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
    // Branding baru di teks share
    const text = `Gua baru aja baca ringkasan topik ini lewat @Kesimpulan. Hemat waktu banget! ⚡️🇮🇩\n\nCek ringkasannya di sini 👇`;
    const embedUrl = "https://kesimpulan.vercel.app"; // Nanti sesuaikan domain
    sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${embedUrl}`);
  };

  const handleTip = () => {
    sdk.actions.openUrl("https://warpcast.com/unclekal"); 
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans pb-24 selection:bg-cyan-500/30">
      
      {/* HEADER BRANDING: KESIMPULAN */}
      <header className="flex justify-between items-center p-4 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {/* Logo Icon diganti FileText biar lebih 'Dokumen' banget */}
          <div className="bg-cyan-500/10 p-1.5 rounded-lg">
             <FileText className="text-cyan-400" size={18} />
          </div>
          <h1 className="text-lg font-black tracking-tight text-white">
            Kesimpulan
            <span className="text-cyan-500">.</span>
          </h1>
        </div>
        {userContext && (
            <div className="text-[10px] font-medium text-slate-400 border border-slate-800 bg-slate-900 px-3 py-1.5 rounded-full">
                @{userContext.username}
            </div>
        )}
      </header>

      <div className="p-4 max-w-md mx-auto">
        
        {/* TAB 1: RINGKAS (HOME) */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {!quizData ? (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
                   {/* Welcome Banner */}
                   <div className="text-center py-4">
                      <h2 className="text-2xl font-bold mb-2">Malas Baca Panjang?</h2>
                      <p className="text-slate-400 text-sm">
                        Tempel link artikel atau Cast apapun.<br/>
                        Kami buatkan <strong>Kesimpulan</strong> visual dalam 3 detik.
                      </p>
                   </div>

                   <div className="relative group">
                     <textarea 
                      className="w-full p-4 bg-slate-900 rounded-2xl border border-slate-800 focus:border-cyan-500 outline-none h-40 text-sm placeholder-slate-600 transition-all shadow-inner"
                      placeholder="Contoh: https://warpcast.com/..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                    {inputText && (
                        <button onClick={() => setInputText("")} className="absolute top-3 right-3 text-slate-500 hover:text-white bg-slate-800 rounded-full p-1">
                            <XCircle size={14} />
                        </button>
                    )}
                   </div>
                  
                  <button 
                    onClick={handleGenerate}
                    disabled={loading || !inputText}
                    className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg transition-all ${
                        loading ? 'bg-slate-800 text-slate-500' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/20'
                    }`}
                  >
                    {loading ? (
                        <span className="flex items-center gap-2"><Sparkles className="animate-spin" size={16}/> Meringkas...</span>
                    ) : (
                        <span className="flex items-center gap-2"><Zap size={18}/> Buat Kesimpulan</span>
                    )}
                  </button>
                </div>
            ) : (
                <div className="space-y-6 animate-in zoom-in duration-300">
                    
                    {/* Hasil: Diagram */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative">
                        <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Share2 size={12} /> Alur Pikir
                             </div>
                             <div className="text-[10px] text-cyan-500 font-mono">Mermaid.js Generated</div>
                        </div>
                        <div className="flex justify-center p-6 bg-slate-950">
                           <Mermaid chart={quizData.mermaid_chart} />
                        </div>
                    </div>

                    {/* Hasil: Ringkasan Teks */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative">
                         {/* Dekorasi kutip */}
                        <div className="absolute top-4 left-4 text-slate-800">
                             <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
                        </div>
                        <h3 className="text-xs font-bold text-cyan-500 uppercase mb-3 flex items-center gap-2 pl-8">
                            Intisari
                        </h3>
                        <p className="text-sm leading-7 text-slate-200 whitespace-pre-line pl-2 relative z-10 font-medium">
                           {quizData.summary}
                        </p>
                    </div>

                    {/* Tantangan Pemahaman */}
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-400 uppercase">Cek Pemahaman</h2>
                            <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-500">1 Pertanyaan</span>
                        </div>
                        
                        <h3 className="font-bold text-lg leading-snug">{quizData.question}</h3>
                        
                        <div className="grid gap-3">
                            {quizData.options.map((opt: string, idx: number) => (
                                <button
                                    key={idx}
                                    disabled={selectedOption !== null}
                                    onClick={() => handleAnswer(idx)}
                                    className={`p-4 rounded-xl text-left text-sm font-medium border transition-all ${
                                        selectedOption === idx 
                                        ? (isCorrect ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-red-500/10 border-red-500 text-red-400')
                                        : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{opt}</span>
                                        {selectedOption === idx && (isCorrect ? <CheckCircle size={16}/> : <XCircle size={16}/>)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {isCorrect && (
                        <div className="animate-bounce-in pt-4">
                            <button 
                                onClick={handleShareResult}
                                className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors flex justify-center items-center gap-2 shadow-xl shadow-white/5"
                            >
                                <Share2 size={18} /> Bagikan "Kesimpulan" Ini
                            </button>
                        </div>
                    )}
                    
                    <button 
                        onClick={() => { setQuizData(null); setInputText(""); }}
                        className="w-full text-slate-500 text-xs font-bold py-4 hover:text-white uppercase tracking-wider"
                    >
                        Buat Baru
                    </button>
                </div>
            )}
          </div>
        )}

        {/* TAB 2: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
             <div className="space-y-5 animate-in fade-in">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
                    <h2 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Channel Paling Rajin Membaca</h2>
                    <div className="text-4xl font-black text-cyan-400 tracking-tighter">/base</div>
                    <p className="text-xs text-slate-500 mt-2 font-mono">Total Kesimpulan: 1,240</p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-400 ml-1">Pembaca Teratas</h3>
                    {[1,2,3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${i===1 ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                    #{i}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-200">User_{i * 99}</div>
                                </div>
                            </div>
                            <div className="text-cyan-600 font-mono text-xs font-bold">{150 - (i*10)} Bacaan</div>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {/* TAB 3: PROFIL */}
        {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in">
                <div className="text-center space-y-3 py-8">
                     <div className="w-20 h-20 bg-slate-900 rounded-full mx-auto flex items-center justify-center border border-slate-800">
                        {userContext?.pfpUrl ? (
                            <img src={userContext.pfpUrl} alt="pfp" className="w-full h-full rounded-full" />
                        ) : (
                            <User size={32} className="text-slate-600" />
                        )}
                    </div>
                    <h2 className="text-xl font-bold">@{userContext?.username || "Guest"}</h2>
                    
                    {/* ADD FRAME BUTTON */}
                     <button 
                        onClick={handleAddFrame}
                        disabled={isFrameAdded}
                        className={`mx-auto px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2 ${isFrameAdded ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
                    >
                        {!isFrameAdded ? <><Bell size={12} /> Aktifkan Notifikasi</> : <><CheckCircle size={12} /> Notifikasi Aktif</>}
                    </button>
                </div>

                {/* TIPPING */}
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                        <Wallet size={16} className="text-cyan-500" /> Support Developer
                    </h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                        Aplikasi ini gratis supaya kita semua makin pinter. Dukung server lewat tip kecil di Base.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleTip} className="py-3 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 text-white">
                            Tip 1 USDC
                        </button>
                        <button onClick={handleTip} className="py-3 bg-slate-800 rounded-xl text-xs font-bold hover:bg-slate-700 text-slate-300 border border-slate-700">
                            Tip 5 USDC
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* NAVIGASI BAWAH */}
      <nav className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-900 p-2 pb-6 z-50">
        <div className="grid grid-cols-3 max-w-md mx-auto">
            <button onClick={() => setActiveTab('quiz')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'quiz' ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'}`}>
                <FileText size={20} />
                <span className="text-[10px] font-bold">Ringkas</span>
            </button>
            <button onClick={() => setActiveTab('leaderboard')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'leaderboard' ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'}`}>
                <Trophy size={20} />
                <span className="text-[10px] font-bold">Top</span>
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${activeTab === 'profile' ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'}`}>
                <User size={20} />
                <span className="text-[10px] font-bold">Saya</span>
            </button>
        </div>
      </nav>

    </main>
  );
}