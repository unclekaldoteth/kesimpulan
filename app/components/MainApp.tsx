const handleShareResult = () => {
    // 1. Siapkan Teks Caption
    const rawTopic = quizData?.summary || "topik ini";
    // Ambil kalimat pertama yang "daging"
    const cleanTopic = rawTopic.split('.')[0].replace(/\n/g, " ").substring(0, 50) + "...";
    
    const shareText = `Ini ringkasannya ✨`; // Caption singkat aja karena gambar udah bicara

    // 2. SIAPKAN TEXT BUAT GAMBAR (Max 150 char biar muat di gambar)
    // Kita encode biar aman di URL
    const summaryForImage = encodeURIComponent(rawTopic.substring(0, 150));

    // 3. URL LINK SHARE (Dengan Parameter Summary)
    // Kita kirim teks summary lewat URL parameter 's'
    const embedUrl = `https://kesimpulan.vercel.app/?s=${summaryForImage}&t=${Date.now()}`; 
    
    sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${embedUrl}`);
  };