import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Ambil Top 10 User
export async function GET() {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(20); // Ambil top 20

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Tambah Skor User
export async function POST(req: Request) {
  const { fid, username, avatar_url, points } = await req.json();

  // 1. Cek apakah user sudah ada?
  const { data: existingUser } = await supabase
    .from('leaderboard')
    .select('score')
    .eq('fid', fid)
    .single();

  let result;
  
  if (existingUser) {
    // 2a. Kalau ada, update skor (tambah poin baru)
    const newScore = (existingUser.score || 0) + points;
    result = await supabase
      .from('leaderboard')
      .update({ score: newScore, username, avatar_url, updated_at: new Date() })
      .eq('fid', fid);
  } else {
    // 2b. Kalau belum ada, bikin baru
    result = await supabase
      .from('leaderboard')
      .insert([{ fid, username, score: points, avatar_url }]);
  }

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}