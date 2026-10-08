import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// US-06: proteksi halaman admin di server
// US-07: daftar produk di halaman admin diambil dari database Supabase
export default async function HalamanAdmin() {
  const supabase = await createAdminSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data produk admin:", error);
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      <TabelProduk daftarProduk={daftarProduk ?? []} />
    </div>
  );
}
