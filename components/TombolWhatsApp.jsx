"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

// US-03: Pesan via WhatsApp
// US-12: Pilih jumlah atau varian sebelum memesan
export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("Original");

  // Varian standar yang cocok untuk makanan/minuman/produk UMKM
  const daftarVarian = ["Original", "Dingin / Es", "Hangat / Panas"];

  const totalHarga = produk.harga * jumlah;

  const pesan = `Halo, saya ingin memesan ${produk.nama} (Varian: ${varian}, Jumlah: ${jumlah}) dengan total harga ${formatRupiah(totalHarga)}.`;
  const urlWa = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-garis bg-permukaan/40 p-4">
      {/* Pilihan Varian */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-teks-lembut">PILIH VARIAN</span>
        <div className="flex flex-wrap gap-2">
          {daftarVarian.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVarian(v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                varian === v
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks hover:border-utama"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Pilihan Jumlah */}
      <div className="flex items-center justify-between border-t border-garis pt-3">
        <span className="text-sm font-semibold">Jumlah pesanan</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-garis bg-latar text-base font-bold text-teks hover:bg-garis"
            aria-label="Kurangi jumlah"
          >
            -
          </button>
          <span className="w-6 text-center font-bold text-teks">{jumlah}</span>
          <button
            type="button"
            onClick={() => setJumlah((prev) => prev + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-garis bg-latar text-base font-bold text-teks hover:bg-garis"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
      </div>

      {/* Total & Tombol Order WhatsApp */}
      <div className="flex flex-col gap-3 border-t border-garis pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-teks-lembut">Total pembayaran</p>
          <p className="text-lg font-extrabold text-harga">{formatRupiah(totalHarga)}</p>
        </div>
        <a
          href={urlWa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-utama px-6 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap"
        >
          Pesan via WhatsApp
        </a>
      </div>
    </div>
  );
}
