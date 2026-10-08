import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import TombolHapusProduk from "@/components/TombolHapusProduk";

export default function TabelProduk({ daftarProduk }) {
  if (!daftarProduk || daftarProduk.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-garis bg-permukaan p-8 text-center text-sm text-teks-lembut">
        Belum ada produk di database. Klik tombol "Tambah produk" untuk menambahkan.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-garis">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-permukaan text-teks-lembut">
          <tr>
            <th className="px-4 py-3 font-semibold">Produk</th>
            <th className="px-4 py-3 font-semibold">Kategori</th>
            <th className="px-4 py-3 font-semibold">Harga</th>
            <th className="px-4 py-3 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {daftarProduk.map((produk) => (
            <tr key={produk.id} className="border-t border-garis hover:bg-permukaan/50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={produk.foto_url || "/produk/kopi.svg"}
                    alt={produk.nama}
                    className="h-10 w-10 rounded-md object-cover bg-permukaan"
                  />
                  <span className="font-semibold">{produk.nama}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-teks-lembut">{produk.kategori || "-"}</td>
              <td className="px-4 py-3 font-medium">{formatRupiah(produk.harga)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {/* US-09: Ubah produk */}
                  <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                    Ubah
                  </Tombol>
                  {/* US-10: Hapus produk dengan konfirmasi */}
                  <TombolHapusProduk id={produk.id} nama={produk.nama} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
