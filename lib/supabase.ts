import { createClient } from '@supabase/supabase-js';

// Ambil URL & Key, kalau kosong kasih string dummy biar gak crash pas build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://esolvhnpvfoavgycrwgy.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzb2x2aG5wdmZvYXZneWNyd2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzI1MDIsImV4cCI6MjA3OTcwODUwMn0.5Ftxio_WD-2dRhBmMVosu_fYFxjXjhimxLMhZtgHSnY";

// Cek validitas URL sebelum init
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Hanya buat client kalau URL valid (atau saat runtime di browser)
export const supabase = createClient(
  isValidUrl(supabaseUrl) ? supabaseUrl : "https://esolvhnpvfoavgycrwgy.supabase.co",
  supabaseKey
);