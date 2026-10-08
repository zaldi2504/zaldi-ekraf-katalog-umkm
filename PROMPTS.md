# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:** (Telah dikerjakan sebelumnya)

**Hasil:** (Telah dikerjakan sebelumnya)

**Perbaikan:** (Telah dikerjakan sebelumnya)

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02. Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:** 
Aplikasi berhasil mengambil data detail dari database Supabase dan menampilkan komponennya dengan benar. Jika ID salah, halaman akan memunculkan "tidak ditemukan".

**Perbaikan:** 
Menghapus komponen `CatatanBelumAktif` yang tidak dipakai dan mengoptimalkan pemanggilan di server component.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)". Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
Tombol WA kini merujuk pada format URL WhatsApp Api resmi. Variabel yang diteruskan ter-*encode* secara aman dan tampil di WA sesuai target produk dan harganya.

**Perbaikan:**
- Mengubah tag `<button>` menjadi `<a>` dengan properti tambahan `target="_blank"` dan `rel="noopener noreferrer"`.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04. Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi.

**Hasil:**
Proses otentikasi login admin berhasil dengan Server Actions, dan sesi (cookie) admin berhasil disimpan.

**Perbaikan:**
- Mengubah `app/admin/login/page.jsx` menjadi *Client Component* untuk mendukung `useActionState`.
- Menyiapkan modul `lib/supabase/admin.js` khusus untuk koneksi SSR (Server-Side Rendering).

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05. Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Admin dapat berhasil mengganti password mereka jika mematuhi validasi > 8 karakter. Pesan error / success ditampilkan dengan jelas.

**Perbaikan:**
- Penambahan fungsi pembaruan password dan validasinya melalui Supabase Auth.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06. Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
Proteksi URL untuk direktori `/admin` berfungsi menggunakan `proxy.js` (pengganti `middleware.js` di Next 16). Jika user belum terautentikasi, otomatis dialihkan kembali ke form login. Server Action diamankan dari akses tanpa otentikasi (mencocokkan ulang sesi di backend sebelum pembaruan).

**Perbaikan:**
- Membetulkan eksport nama fungsi dari `middleware` menjadi `proxy` sesuai Next 16 API `middleware-to-proxy`.
- Menghilangkan `CatatanBelumAktif` di dashboard admin.

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
