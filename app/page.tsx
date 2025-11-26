"use client";

import { useState, useEffect, useCallback } from "react";
import sdk from "@farcaster/miniapp-sdk";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  FileText,
  Trophy,
  User,
  Wallet,
  Share2,
  Bell,
  Zap,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Mermaid from "react-mermaid2";

type TabType = "quiz" | "leaderboard" | "profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("quiz");
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

    const isUrl = inputText.trim().startsWith("http");
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    const text =
      "Gua baru aja baca ringkasan topik ini lewat @Kesimpulan. Hemat waktu banget! ⚡️🇮🇩\n\nCek ringkasannya di sini 👇";
    const embedUrl = "https://kesimpulan.vercel.app";
    sdk.actions.openUrl(
      `https://warpcast.com/~/compose?text=${encodeURIComponent(
        text
      )}&embeds[]=${embedUrl}`
    );
  };

  const handleTip = () => {
    sdk.actions.openUrl("https://warpcast.com/unclekal");
  };

  const isUrlInput = inputText.trim().startsWith("http");

  return (
    <main className="min-h-screen bg-[#020617] text-slate-50 font-sans pb-28 selection:bg-cyan-500/30">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-20 bg-[#020617]/80 backdrop-blur-lg border-b border-slate-800/60">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.55)]">
              <FileText size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight">
                  Kesimpulan<span className="text-cyan-400">.id</span>
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
                  <Zap size={10} /> Beta
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                1-tap summary for any Cast or article.
              </p>
            </div>
          </div>

          {userContext && (
            <button
              className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:border-cyan-500/50 transition-colors"
              onClick={() =>
                sdk.actions.openUrl(`https://warpcast.com/${userContext.username}`)
              }
            >
              <div className="h-6 w-6 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
                {userContext.pfpUrl ? (
                  <img
                    src={userContext.pfpUrl}
                    alt={userContext.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={14} className="text-slate-500" />
                )}
              </div>
              <span>@{userContext.username}</span>
            </button>
          )}
        </div>
      </header>

      <div className="pt-24 px-5 max-w-md mx-auto space-y-6">
        {/* TAB: RINGKAS */}
        {activeTab === "quiz" && (
          <>
            {/* INPUT & HERO */}
            <section className="space-y-4">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 border border-slate-800">
                  <Sparkles size={12} className="text-cyan-300" />
                  Hemat waktu baca panjang
                </span>
                <span className="text-slate-500">🇮🇩 Bahasa Indonesia first</span>
              </div>

              <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-xl space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Tempel link, dapat{" "}
                    <span className="text-cyan-300">alur &amp; intisari</span>.
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Masukkan link Cast, artikel, atau teks mentah. Kami ubah jadi
                    rangkuman visual + kuis singkat.
                  </p>
                </div>

                {/* TEXTAREA */}
                <div className="relative group mt-2">
                  <div className="absolute -inset-[1.5px] rounded-2xl bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-sky-400/40 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                  <div className="relative rounded-2xl border border-slate-700 bg-slate-950/90">
                    <textarea
                      className="w-full resize-none rounded-2xl bg-transparent px-4 pt-4 pb-10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0"
                      rows={4}
                      placeholder="Paste link (https://...) atau teks panjang di sini..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                    {inputText && (
                      <button
                        onClick={() => setInputText("")}
                        className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
                      >
                        <XCircle size={16} />
                      </button>
                    )}

                    {/* FOOTER TEXTAREA */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-2 border-t border-slate-800/70 bg-slate-950/80 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 border text-[10px] ${
                            isUrlInput
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                              : "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                          }`}
                        >
                          {isUrlInput ? "Link terdeteksi" : "Teks manual"}
                        </span>
                        <span className="text-slate-500">
                          ~2–3 detik per ringkasan
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <BookOpen size={12} />
                        Auto-quiz
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleGenerate}
                  disabled={loading || !inputText}
                  className={`mt-1 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold tracking-tight shadow-lg transition-all active:scale-[0.98] ${
                    loading || !inputText
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-cyan-500/30"
                  }`}
                >
                  {loading ? (
                    <>
                      <Sparkles size={16} className="animate-spin" />
                      Memproses ringkasan...
                    </>
                  ) : (
                    <>
                      <ChevronRight size={16} />
                      Buat Kesimpulan
                    </>
                  )}
                </button>
              </div>

              {/* 3 MINI CARDS (HANYA SAAT BELUM ADA HASIL) */}
              {!quizData && (
                <div className="grid grid-cols-3 gap-3 text-[11px]">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-1">
                    <p className="font-semibold text-slate-100">Cast</p>
                    <p className="text-slate-500">
                      Ringkasan diskusi ramai tanpa harus scroll timeline.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-1">
                    <p className="font-semibold text-slate-100">Artikel</p>
                    <p className="text-slate-500">
                      Blog, thread, newsletter—jadi poin-poin inti.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-1">
                    <p className="font-semibold text-slate-100">Belajar</p>
                    <p className="text-slate-500">
                      Kuis singkat buat cek, sudah paham atau belum.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* HASIL RINGKASAN */}
            {quizData && (
              <section className="space-y-6 animate-in fade-in-10 duration-500">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 border border-slate-800">
                    <Sparkles size={12} className="text-cyan-300" />
                    Ringkasan siap
                  </span>
                  <span>3 blok: Diagram • Intisari • Kuis</span>
                </div>

                {/* BLOK 1: DIAGRAM */}
                <div className="rounded-3xl border border-slate-800/70 bg-slate-950/95 shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
                      <Share2 size={12} />
                      Alur pikir
                    </div>
                    <span className="text-[10px] text-slate-500">
                      auto-generated diagram
                    </span>
                  </div>
                  <div className="bg-white px-3 pb-4 pt-7">
                    <div className="mermaid-container text-slate-900 text-xs font-medium">
                      <Mermaid chart={quizData.mermaid_chart} />
                    </div>
                  </div>
                </div>

                {/* BLOK 2: INTISARI */}
                <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-xl relative overflow-hidden">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                    <BookOpen size={13} />
                    Intisari singkat
                  </h3>
                  <p className="relative z-10 whitespace-pre-line text-sm leading-relaxed text-slate-200">
                    {quizData.summary}
                  </p>
                </div>

                {/* BLOK 3: KUIS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                    <span className="font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Kuis 30 detik
                    </span>
                    <span>jawab sekali, tidak bisa diulang</span>
                  </div>

                  <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-xl">
                    <h3 className="mb-5 text-base font-semibold leading-snug text-slate-50">
                      {quizData.question}
                    </h3>
                    <div className="space-y-2">
                      {quizData.options.map((opt: string, idx: number) => (
                        <button
                          key={idx}
                          disabled={selectedOption !== null}
                          onClick={() => handleAnswer(idx)}
                          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.98] ${
                            selectedOption === idx
                              ? isCorrect
                                ? "border-emerald-500 bg-emerald-500/15 text-emerald-200"
                                : "border-rose-500 bg-rose-500/15 text-rose-200"
                              : "border-slate-800 bg-slate-900/80 text-slate-200 hover:border-slate-600"
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedOption === idx &&
                            (isCorrect ? (
                              <CheckCircle
                                size={18}
                                className="text-emerald-400"
                              />
                            ) : (
                              <XCircle size={18} className="text-rose-400" />
                            ))}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SHARE CTA */}
                {activeTab === "quiz" && isCorrect && (
                  <div className="fixed bottom-24 left-0 w-full px-5 z-30 animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <button
                      onClick={handleShareResult}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:bg-slate-100 transition-colors"
                    >
                      <Share2 size={18} />
                      Bagikan hasil ke Warpcast
                    </button>
                  </div>
                )}

                {/* RESET */}
                <button
                  onClick={() => {
                    setQuizData(null);
                    setInputText("");
                    setSelectedOption(null);
                    setIsCorrect(null);
                  }}
                  className="w-full rounded-2xl border border-slate-800 bg-transparent py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 hover:text-slate-100 hover:bg-slate-900/80 transition-colors"
                >
                  Ringkas topik lain
                </button>
              </section>
            )}
          </>
        )}

        {/* TAB: LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <section className="space-y-6 animate-in fade-in pt-2">
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-7 text-center shadow-xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
              <Trophy
                className="mx-auto mb-4 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.55)]"
                size={44}
                strokeWidth={1.7}
              />
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 mb-1">
                Komunitas paling sering pakai
              </p>
              <p className="text-4xl font-black tracking-tight text-slate-50">
                /base
              </p>
              <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] text-cyan-300 border border-cyan-700/60 font-mono">
                12,403
                <span className="text-slate-400">ringkasan dibuat</span>
              </p>
            </div>
          </section>
        )}

        {/* TAB: PROFILE */}
        {activeTab === "profile" && (
          <section className="space-y-6 animate-in fade-in pt-2">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-slate-800 bg-slate-900 shadow-xl overflow-hidden flex items-center justify-center">
                  {userContext?.pfpUrl ? (
                    <img
                      src={userContext.pfpUrl}
                      alt="pfp"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-slate-600" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-[#020617] bg-emerald-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-50">
                  @{userContext?.username || "Guest"}
                </h2>
                <p className="text-xs text-slate-400">Level 1 • Curious mind</p>
              </div>
              <button
                onClick={handleAddFrame}
                disabled={isFrameAdded}
                className={`mt-1 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold border transition-all active:scale-95 ${
                  isFrameAdded
                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                    : "border-transparent bg-white text-slate-950 hover:bg-slate-100"
                }`}
              >
                {isFrameAdded ? (
                  <>
                    <CheckCircle size={14} />
                    Notifikasi aktif
                  </>
                ) : (
                  <>
                    <Bell size={14} />
                    Aktifkan notifikasi Frame
                  </>
                )}
              </button>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-xl space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-50">
                <Wallet size={18} className="text-cyan-400" />
                Dukung biaya API &amp; server
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kesimpulan tetap gratis &amp; tanpa iklan. Kalau terbantu, kamu bisa
                kirim tip kecil untuk bantu biaya infra.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                <button
                  onClick={handleTip}
                  className="rounded-2xl bg-blue-600 px-3 py-3 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/30 active:translate-y-0.5 transition-all"
                >
                  Tip 1 USDC
                </button>
                <button
                  onClick={handleTip}
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-slate-200 hover:border-slate-500 active:translate-y-0.5 transition-all"
                >
                  Tip 5 USDC
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-6 left-1/2 z-40 w-[92%] max-w-[320px] -translate-x-1/2 rounded-full border border-slate-800 bg-[#020617]/90 px-6 py-2 shadow-[0_16px_40px_rgba(15,23,42,0.9)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              activeTab === "quiz"
                ? "bg-slate-50 text-slate-950 shadow-lg"
                : "text-slate-500 hover:text-slate-200"
            }`}
          >
            <FileText
              size={20}
              strokeWidth={activeTab === "quiz" ? 2.4 : 1.8}
            />
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              activeTab === "leaderboard"
                ? "bg-slate-50 text-slate-950 shadow-lg"
                : "text-slate-500 hover:text-slate-200"
            }`}
          >
            <Trophy
              size={20}
              strokeWidth={activeTab === "leaderboard" ? 2.4 : 1.8}
            />
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              activeTab === "profile"
                ? "bg-slate-50 text-slate-950 shadow-lg"
                : "text-slate-500 hover:text-slate-200"
            }`}
          >
            <User
              size={20}
              strokeWidth={activeTab === "profile" ? 2.4 : 1.8}
            />
          </button>
        </div>
      </nav>
    </main>
  );
}
