"use client";

import { useTransition } from "react";
import Tombol from "@/components/Tombol";
import { hapusProdukAction } from "@/app/admin/actions";

// US-10: Hapus produk dengan konfirmasi
export default function TombolHapusProduk({ id, nama }) {
  const [isPending, startTransition] = useTransition();

  const handleHapus = () => {
    if (window.confirm(`Yakin ingin menghapus produk "${nama}"?`)) {
      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.append("id", id);
          await hapusProdukAction(formData);
        } catch (err) {
          alert("Gagal menghapus produk: " + err.message);
        }
      });
    }
  };

  return (
    <Tombol
      type="button"
      varian="bahaya"
      onClick={handleHapus}
      disabled={isPending}
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </Tombol>
  );
}

