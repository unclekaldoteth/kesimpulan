"use client";

import { useState, useEffect, useCallback } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { 
  FileText, Trophy, User, Share2, Sparkles, 
  Search, Wallet, CheckCircle, XCircle
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
        if (context?.user) setUserContext(context.user);
      } catch (e) { console.error(e); }
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
    const text = `Gua baru aja baca ringkasan topik ini lewat @Kesimpulan. Cek sini 👇`;
    const embedUrl = "https://kesimpulan.vercel.app"; 
    sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${embedUrl}`);
  };

  const handleTip = () => { sdk.actions.openUrl("https://warpcast.com/unclekal"); };

  return (
    <main className="min-h-screen bg-[#F2F2F6] font-sans pb-32 text-slate-900 selection:bg-purple-200">
      
      {/* HEADER FIXED */}
      <div className="fixed top-0 w-full z-50 bg-[#F2F2F6]/90 backdrop-blur-sm pt-6 pb-2 px-5 flex justify-between items-center border-b border-slate-200">
         <h1 className="text-2xl font-bold tracking-tight text-[#1c1c1e]">
            Kesimpulan
         </h1>
         
         {/* --- FIX: PEMBUNGKUS GAMBAR BIAR GAK MELEDAK --- */}
         <button onClick={() => setActiveTab('profile')} className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border border-slate-200">
             {userContext?.pfpUrl ? (
                 <img 
                    src={userContext.pfpUrl} 
                    alt="pfp" 
                    className="w-full h-full object-cover" 
                    style={{width:'100%', height:'100%', objectFit:'cover'}} 
                 />
             ) : (
                 <User size={18} className="text-slate-400"/>
             )}
         </button>
      </div>

      {/* CONTAINER DENGAN PADDING ATAS (BIAR GAK KETUTUP HEADER) */}
      <div className="pt-24 px-4 max-w-md mx-auto">
        
        {/* === TAB 1: HOME / QUIZ === */}
        {activeTab === 'quiz' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {!quizData ? (
                <>
                   {/* Greeting Card */}
                   <div className="bg-white p-5 rounded-[20px] shadow-sm flex items-center gap-4">
                      <div className="w-14 h-14 min-w-[56px] bg-purple-100 rounded-full flex items-center justify-center text-[#6a61e3]">
                         <Sparkles size={24} strokeWidth={2.5}/>
                      </div>
                      <div className="overflow-hidden">
                         <h2 className="text-lg font-bold text-slate-800 truncate">Halo, {userContext?.username || "Guest"}!</h2>
                         <p className="text-xs text-slate-500 truncate">Apa yang mau diringkas hari ini?</p>
                      </div>
                   </div>

                   {/* Input Area */}
                   <div className="bg-white p-4 rounded-[24px] shadow-sm">
                      <div className="flex items-center gap-2 bg-[#F2F2F6] rounded-xl px-3 py-2 mb-3">
                          <Search size={16} className="text-slate-400"/>
                          <input 
                             type="text"
                             className="bg-transparent w-full outline-none text-sm py-1 placeholder:text-slate-400 text-slate-800"
                             placeholder="Tempel link artikel..."
                             value={inputText}
                             onChange={(e) => setInputText(e.target.value)}
                          />
                          {inputText && <button onClick={() => setInputText("")}><XCircle size={16} className="text-slate-400"/></button>}
                      </div>
                      
                      <textarea 
                        className="w-full p-2 bg-transparent outline-none h-24 text-sm text-slate-700 resize-none"
                        placeholder="Atau tempel teks panjang di sini..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                   </div>
                  
                  <button 
                    onClick={handleGenerate}
                    disabled={loading || !inputText}
                    className={`w-full py-4 rounded-[18px] font-bold text-white flex justify-center items-center gap-2 shadow-lg shadow-purple-200 transition-all active:scale-[0.98] ${
                        loading ? 'bg-slate-300' : 'bg-[#6a61e3]'
                    }`}
                  >
                    {loading ? <Sparkles className="animate-spin" size={20}/> : "Buat Ringkasan"}
                  </button>
                </>
            ) : (
                // --- RESULT VIEW ---
                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                    
                    {/* Mermaid Chart Card */}
                    <div className="bg-white rounded-[24px] shadow-sm overflow-hidden">
                         <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                             <div className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wide">
                                <Share2 size={12} /> Visual Map
                             </div>
                         </div>
                        <div className="p-4 flex justify-center bg-white overflow-x-auto">
                           <div className="mermaid-container w-full flex justify-center text-xs font-bold text-slate-800">
                               <Mermaid chart={quizData.mermaid_chart} />
                           </div>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white p-6 rounded-[24px] shadow-sm">
                        <h3 className="text-sm font-bold text-[#1c1c1e] mb-2">Intisari</h3>
                        <p className="text-[15px] leading-7 text-[#1c1c1e] whitespace-pre-line">
                           {quizData.summary}
                        </p>
                    </div>

                    {/* Quiz Section */}
                    <div className="bg-white p-6 rounded-[24px] shadow-sm">
                        <h3 className="font-bold text-lg mb-5 text-slate-900">{quizData.question}</h3>
                        <div className="space-y-2.5">
                            {quizData.options.map((opt: string, idx: number) => (
                                <button
                                    key={idx}
                                    disabled={selectedOption !== null}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full p-4 rounded-[16px] text-left text-[14px] font-medium border transition-all flex justify-between items-center ${
                                        selectedOption === idx 
                                        ? (isCorrect ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700')
                                        : 'bg-slate-50 border-transparent text-slate-600 active:bg-slate-100'
                                    }`}
                                >
                                    <span>{opt}</span>
                                    {selectedOption === idx && (isCorrect ? <CheckCircle size={18}/> : <XCircle size={18}/>)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={() => { setQuizData(null); setInputText(""); }}
                        className="w-full py-4 text-sm font-bold text-[#8e8e93] bg-white rounded-[18px] shadow-sm"
                    >
                        Mulai Baru
                    </button>
                </div>
            )}
          </div>
        )}

        {/* === TAB 2: LEADERBOARD === */}
        {activeTab === 'leaderboard' && (
             <div className="space-y-4 animate-in fade-in">
                <div className="bg-white p-5 rounded-[20px] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Komunitas</p>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">/base</h2>
                    </div>
                    <Trophy size={32} className="text-yellow-500 drop-shadow-sm" />
                </div>
             </div>
        )}

        {/* === TAB 3: PROFIL === */}
        {activeTab === 'profile' && (
            <div className="space-y-5 animate-in fade-in">
                <div className="bg-white p-6 rounded-[24px] shadow-sm text-center relative overflow-hidden">
                    <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-3 overflow-hidden border-4 border-slate-50">
                        {userContext?.pfpUrl ? (
                            <img 
                                src={userContext.pfpUrl} 
                                alt="pfp" 
                                className="w-full h-full object-cover" 
                                style={{width:'100%', height:'100%', objectFit:'cover'}}
                            />
                        ) : (
                            <User className="w-full h-full p-6 text-slate-300"/>
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">@{userContext?.username || "Guest"}</h2>
                    
                     <button 
                        onClick={handleAddFrame}
                        disabled={isFrameAdded}
                        className={`mt-4 px-6 py-2 rounded-full text-xs font-bold border transition-all ${isFrameAdded ? 'bg-green-50 text-green-600 border-green-200' : 'bg-[#6a61e3] text-white border-transparent'}`}
                    >
                        {isFrameAdded ? "Notifikasi Aktif" : "Aktifkan Notifikasi"}
                    </button>
                </div>
                
                <div className="space-y-2">
                    <button onClick={handleTip} className="bg-[#6a61e3] w-full p-4 rounded-[18px] flex items-center justify-between text-white shadow-lg shadow-indigo-200">
                        <div className="flex items-center gap-3"><Wallet size={20} /><span className="font-bold text-sm">Tip 1 USDC</span></div>
                    </button>
                </div>
            </div>
        )}

      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-100 py-2 px-6 pb-6 z-40 flex justify-around">
            <button onClick={() => setActiveTab('quiz')} className={`flex flex-col items-center gap-1 w-16 p-1 rounded-xl transition-all ${activeTab === 'quiz' ? 'text-[#6a61e3]' : 'text-slate-400'}`}>
                <FileText size={24} strokeWidth={activeTab === 'quiz' ? 2.5 : 2}/>
                <span className="text-[10px] font-bold">Ringkas</span>
            </button>
            <button onClick={() => setActiveTab('leaderboard')} className={`flex flex-col items-center gap-1 w-16 p-1 rounded-xl transition-all ${activeTab === 'leaderboard' ? 'text-[#6a61e3]' : 'text-slate-400'}`}>
                <Trophy size={24} strokeWidth={activeTab === 'leaderboard' ? 2.5 : 2}/>
                <span className="text-[10px] font-bold">Top</span>
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 w-16 p-1 rounded-xl transition-all ${activeTab === 'profile' ? 'text-[#6a61e3]' : 'text-slate-400'}`}>
                <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2}/>
                <span className="text-[10px] font-bold">Profil</span>
            </button>
      </nav>

    </main>
  );
}