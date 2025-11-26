"use client";

import { useState, useEffect, useCallback } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { 
  BookOpen, CheckCircle, XCircle, FileText, 
  Trophy, User, Wallet, Share2, Bell, Zap, Sparkles, ChevronRight
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
    <main className="min-h-screen bg-[#0f172a] text-white font-sans pb-32 selection:bg-cyan-500/30">
      
      {/* HEADER MODERN */}
      <header className="fixed top-0 w-full z-20 bg-[#0f172a]/80 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-md mx-auto px-5 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="bg-cyan-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                 <FileText className="text-white" size={18} strokeWidth={3} />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Kesimpulan<span className="text-cyan-400">.</span>
              </h1>
            </div>
            {userContext && (
                <div className="text-[10px] font-bold text-cyan-200 bg-cyan-950/50 border border-cyan-900/50 px-3 py-1.5 rounded-full">
                    @{userContext.username}
                </div>
            )}
        </div>
      </header>

      <div className="pt-24 px-5 max-w-md mx-auto">
        
        {/* TAB 1: RINGKAS */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {!quizData ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   {/* Hero Section */}
                   <div className="text-center space-y-2 py-4">
                      <h2 className="text-3xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                        Malas Baca?
                      </h2>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        Tempel link artikel atau Cast apa saja.<br/>
                        Dapatkan ringkasan visual dalam sekejap.
                      </p>
                   </div>

                   {/* Input Area Cantik */}
                   <div className="relative group">
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                     <textarea 
                      className="relative w-full p-5 bg-slate-900 rounded-2xl border border-slate-800 focus:border-cyan-500/50 outline-none h-40 text-sm placeholder-slate-500 transition-all text-slate-200 resize-none shadow-xl"
                      placeholder="Paste link (https://...) atau teks di sini..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                    {inputText && (
                        <button onClick={() => setInputText("")} className="absolute top-4 right-4 text-slate-500 hover:text-white bg-slate-800/80 backdrop-blur rounded-full p-1 z-10 transition-colors">
                            <XCircle size={18} />
                        </button>
                    )}
                   </div>
                  
                  {/* Tombol Aksi */}
                  <button 
                    onClick={handleGenerate}
                    disabled={loading || !inputText}
                    className={`w-full py-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 shadow-xl transition-all active:scale-[0.98] ${
                        loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white shadow-cyan-500/20'
                    }`}
                  >
                    {loading ? (
                        <span className="flex items-center gap-2 text-base"><Sparkles className="animate-spin" size={20}/> Sedang Memproses...</span>
                    ) : (
                        <span className="flex items-center gap-2">Buat Kesimpulan <ChevronRight size={20} strokeWidth={3}/></span>
                    )}
                  </button>
                </div>
            ) : (
                <div className="space-y-8 animate-in zoom-in duration-500">
                    
                    {/* Hasil 1: Diagram Mermaid */}
                    <div className="rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative bg-white">
                         <div className="absolute top-0 left-0 w-full bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center z-10">
                             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                <Share2 size={12} /> Alur Pikir
                             </div>
                         </div>
                        <div className="flex justify-center pt-10 pb-6 px-4 bg-white min-h-[200px] items-center">
                           {/* Kita bungkus mermaid biar stylingnya masuk */}
                           <div className="mermaid-container text-slate-900 text-xs font-bold">
                               <Mermaid chart={quizData.mermaid_chart} />
                           </div>
                        </div>
                    </div>

                    {/* Hasil 2: Ringkasan Card */}
                    <div className="bg-gradient-to-b from-slate-900 to-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
                        <h3 className="text-xs font-black text-cyan-400 uppercase mb-4 flex items-center gap-2 tracking-widest">
                            <BookOpen size={14} /> Intisari Materi
                        </h3>
                        <p className="text-sm leading-8 text-slate-300 whitespace-pre-line font-medium relative z-10">
                           {quizData.summary}
                        </p>
                    </div>

                    {/* Hasil 3: Kuis */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tantangan Cepat</h2>
                        </div>
                        
                        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                            <h3 className="font-bold text-lg leading-snug mb-6">{quizData.question}</h3>
                            
                            <div className="grid gap-3">
                                {quizData.options.map((opt: string, idx: number) => (
                                    <button
                                        key={idx}
                                        disabled={selectedOption !== null}
                                        onClick={() => handleAnswer(idx)}
                                        className={`p-4 rounded-xl text-left text-sm font-semibold border-2 transition-all active:scale-[0.98] ${
                                            selectedOption === idx 
                                            ? (isCorrect ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-red-500/20 border-red-500 text-red-300')
                                            : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-300'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{opt}</span>
                                            {selectedOption === idx && (isCorrect ? <CheckCircle className="text-green-500" size={18}/> : <XCircle className="text-red-500" size={18}/>)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {isCorrect && (
                        <div className="fixed bottom-24 left-0 w-full px-5 z-30 animate-in slide-in-from-bottom-10 fade-in duration-500">
                            <button 
                                onClick={handleShareResult}
                                className="w-full py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-200 transition-colors flex justify-center items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] text-lg"
                            >
                                <Share2 size={20} strokeWidth={2.5} /> Bagikan Hasil Ini
                            </button>
                        </div>
                    )}
                    
                    <div className="h-8"></div> {/* Spacer */}
                    
                    <button 
                        onClick={() => { setQuizData(null); setInputText(""); }}
                        className="w-full text-slate-500 text-xs font-bold py-4 hover:text-white uppercase tracking-wider bg-slate-900/50 rounded-xl"
                    >
                        Mulai Baru
                    </button>
                </div>
            )}
          </div>
        )}

        {/* TAB 2: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
             <div className="space-y-6 animate-in fade-in pt-4">
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
                    <Trophy className="mx-auto text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" size={48} strokeWidth={1.5} />
                    <h2 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Komunitas Paling Pintar</h2>
                    <div className="text-5xl font-black text-white tracking-tighter mt-2 mb-1">/base</div>
                    <p className="text-xs text-cyan-500 font-mono bg-cyan-950/30 inline-block px-3 py-1 rounded-full">12,403 Knowledge Points</p>
                </div>
             </div>
        )}

        {/* TAB 3: PROFIL */}
        {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in pt-8">
                <div className="text-center space-y-4">
                    <div className="relative inline-block">
                        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-2xl overflow-hidden">
                            {userContext?.pfpUrl ? (
                                <img src={userContext.pfpUrl} alt="pfp" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-slate-600" />
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-[#0f172a]"></div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">@{userContext?.username || "Guest"}</h2>
                        <p className="text-slate-400 text-sm">Level 1 • Curious Mind</p>
                    </div>
                     <button 
                        onClick={handleAddFrame}
                        disabled={isFrameAdded}
                        className={`mx-auto px-6 py-2.5 rounded-full text-xs font-bold border flex items-center gap-2 transition-all active:scale-95 ${isFrameAdded ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-white text-slate-950 border-transparent hover:bg-slate-200'}`}
                    >
                        {!isFrameAdded ? <><Bell size={14} /> Aktifkan Notifikasi</> : <><CheckCircle size={14} /> Notifikasi Aktif</>}
                    </button>
                </div>

                <div className="bg-slate-900/80 backdrop-blur p-6 rounded-3xl border border-slate-800 shadow-xl">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                        <Wallet size={18} className="text-cyan-400" /> Dukung Server
                    </h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                        App ini gratis tanpa iklan. Dukungan kamu membantu kami membayar biaya API & Server.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleTip} className="py-3.5 bg-blue-600 rounded-xl text-xs font-bold hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 active:translate-y-0.5 transition-all">
                            Tip 1 USDC
                        </button>
                        <button onClick={handleTip} className="py-3.5 bg-slate-800 rounded-xl text-xs font-bold hover:bg-slate-700 text-slate-300 border border-slate-700 active:translate-y-0.5 transition-all">
                            Tip 5 USDC
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* FLOATING NAVIGASI BAWAH */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[300px] bg-[#1e293b]/90 backdrop-blur-xl border border-slate-700 rounded-full p-2 z-50 shadow-2xl flex justify-between items-center px-6">
            <button onClick={() => setActiveTab('quiz')} className={`flex flex-col items-center gap-1 p-2 rounded-full transition-all ${activeTab === 'quiz' ? 'text-cyan-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
                <FileText size={20} strokeWidth={activeTab === 'quiz' ? 3 : 2} />
            </button>
            <div className="w-px h-6 bg-slate-700"></div>
            <button onClick={() => setActiveTab('leaderboard')} className={`flex flex-col items-center gap-1 p-2 rounded-full transition-all ${activeTab === 'leaderboard' ? 'text-cyan-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
                <Trophy size={20} strokeWidth={activeTab === 'leaderboard' ? 3 : 2} />
            </button>
            <div className="w-px h-6 bg-slate-700"></div>
            <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 p-2 rounded-full transition-all ${activeTab === 'profile' ? 'text-cyan-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
                <User size={20} strokeWidth={activeTab === 'profile' ? 3 : 2} />
            </button>
      </nav>

    </main>
  );
}