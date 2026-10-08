"use client";

import { useActionState, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAIAction } from "@/app/admin/actions";

// US-08 (tambah produk), US-09 (ubah produk), US-14 (deskripsi dibuat AI)
export default function FormProduk({ action, produk = {}, labelTombol = "Simpan" }) {
  const [state, formAction, isPending] = useActionState(action, null);

  const [nama, setNama] = useState(produk.nama ?? "");
  const [kategori, setKategori] = useState(produk.kategori ?? "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi ?? "");
  const [sedangGenerateAI, setSedangGenerateAI] = useState(false);
  const [pesanAI, setPesanAI] = useState("");

  const handleBuatDeskripsiAI = async () => {
    if (!nama.trim()) {
      setPesanAI("Isi nama produk terlebih dahulu.");
      return;
    }
    setSedangGenerateAI(true);
    setPesanAI("");
    try {
      const res = await buatDeskripsiAIAction(nama, kategori);
      if (res?.error) {
        setPesanAI(res.error);
      } else if (res?.deskripsi) {
        setDeskripsi(res.deskripsi);
        setPesanAI("Deskripsi berhasil dibuat oleh AI!");
      }
    } catch {
      setPesanAI("Gagal membuat deskripsi dengan AI.");
    } finally {
      setSedangGenerateAI(false);
    }
  };

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {state?.error && (
        <div
          role="alert"
          className="rounded-lg border border-bahaya bg-permukaan px-4 py-3 text-sm text-bahaya"
        >
          {state.error}
        </div>
      )}

      {produk.id && <input type="hidden" name="id" value={produk.id} />}

      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />

      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga ?? ""}
        required
      />

      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        placeholder="Contoh: Minuman, Camilan, Bumbu"
      />

      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url ?? ""}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Deskripsi</span>
          {/* US-14: Tombol AI untuk generate deskripsi otomatis */}
          <button
            type="button"
            onClick={handleBuatDeskripsiAI}
            disabled={sedangGenerateAI}
            className="inline-flex items-center gap-1 rounded-md bg-permukaan px-2.5 py-1 text-xs font-semibold text-utama hover:bg-garis disabled:opacity-50"
          >
            {sedangGenerateAI ? "⏳ Menulis..." : "✨ Buat deskripsi dengan AI"}
          </button>
        </div>
        {pesanAI && (
          <p className="text-xs text-teks-lembut">
            {pesanAI}
          </p>
        )}
        <Input
          label=""
          name="deskripsi"
          textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Jelaskan keunggulan dan rasa produk..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
