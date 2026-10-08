// Koneksi Supabase untuk server (Server Component, Server Action, Route Handler).
// Memakai SUPABASE_SECRET_KEY karena pengunjung tidak login dan RLS menolak akses publik.
// Jangan dipakai di file yang memakai "use client".
import { createClient } from "@supabase/supabase-js";

export function createServerSupabase() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diisi di .env.local"
    );
  }

  return createClient(url, secretKey);
}