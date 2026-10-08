"use client";

import { useState, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

// US-11: Filter kategori dan pencarian produk
export default function KatalogInteraktif({ daftarProduk = [] }) {
  const [kataKunci, setKataKunci] = useState("");
  const [kategoriDipilih, setKategoriDipilih] = useState("Semua");

  const daftarKategori = useMemo(() => {
    const unik = new Set();
    daftarProduk.forEach((p) => {
      if (p.kategori && p.kategori.trim()) {
        unik.add(p.kategori.trim());
      }
    });
    return ["Semua", ...Array.from(unik)];
  }, [daftarProduk]);

  const produkTersaring = useMemo(() => {
    return daftarProduk.filter((p) => {
      const cocokKategori =
        kategoriDipilih === "Semua" ||
        (p.kategori && p.kategori.toLowerCase() === kategoriDipilih.toLowerCase());

      const cocokKataKunci =
        !kataKunci.trim() ||
        (p.nama && p.nama.toLowerCase().includes(kataKunci.toLowerCase())) ||
        (p.deskripsi && p.deskripsi.toLowerCase().includes(kataKunci.toLowerCase()));

      return cocokKategori && cocokKataKunci;
    });
  }, [daftarProduk, kategoriDipilih, kataKunci]);

  return (
    <div className="flex flex-col gap-6">
      {/* Kontrol Pencarian & Filter Kategori */}
      <div className="flex flex-col gap-4">
        {/* Input Pencarian */}
        <div className="relative">
          <input
            type="text"
            value={kataKunci}
            onChange={(e) => setKataKunci(e.target.value)}
            placeholder="Cari nama produk..."
            className="w-full rounded-xl border border-garis bg-latar px-4 py-2.5 pl-10 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          <svg
            className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-teks-lembut"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {kataKunci && (
            <button
              type="button"
              onClick={() => setKataKunci("")}
              className="absolute right-3 top-2.5 text-xs text-teks-lembut hover:text-teks"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Tombol Filter Kategori (Pills) */}
        {daftarKategori.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            {daftarKategori.map((kategori) => {
              const aktif = kategoriDipilih === kategori;
              return (
                <button
                  key={kategori}
                  type="button"
                  onClick={() => setKategoriDipilih(kategori)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    aktif
                      ? "bg-utama text-white"
                      : "border border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
                  }`}
                >
                  {kategori}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid Produk */}
      {produkTersaring.length === 0 ? (
        <div className="rounded-xl border border-dashed border-garis bg-permukaan p-8 text-center text-sm text-teks-lembut">
          Tidak ada produk yang cocok dengan pencarian atau filter yang dipilih.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTersaring.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}
