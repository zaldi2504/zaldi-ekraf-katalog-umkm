import { createServerSupabase } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";
import KatalogInteraktif from "@/components/KatalogInteraktif";

// US-01: daftar produk diambil dari tabel "produk" di Supabase, di sisi server.
// US-11: filter kategori dan pencarian nama produk.
export const dynamic = "force-dynamic";

export default async function HalamanKatalog() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("produk")
      .select("id, nama, harga, deskripsi, foto_url, kategori")
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    daftarProduk = data ?? [];
  } catch (err) {
    console.error("Gagal mengambil daftar produk:", err);
    pesanError =
      "Gagal memuat daftar produk. Coba muat ulang halaman, atau hubungi pemilik toko.";
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>
        {pesanError ? (
          <p
            role="alert"
            className="rounded-lg border border-bahaya bg-permukaan px-3 py-2 text-sm text-bahaya"
          >
            {pesanError}
          </p>
        ) : daftarProduk.length === 0 ? (
          <p className="rounded-lg border border-dashed border-garis bg-permukaan px-3 py-2 text-sm text-teks-lembut">
            Belum ada produk
          </p>
        ) : (
          <KatalogInteraktif daftarProduk={daftarProduk} />
        )}
      </section>
    </>
  );
}