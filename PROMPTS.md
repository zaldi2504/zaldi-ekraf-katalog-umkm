# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca docs/user-stories.md bagian US-01. Hubungkan app/page.jsx dengan tabel "produk" di Supabase menggunakan Server Component dan fungsi createServerSupabase di lib/supabase/server. Ambil semua kolom produk, urutkan berdasarkan created_at ascending, format harga dengan format rupiah, dan tampilkan kartu produk atau pesan kosong jika belum ada data.

**Hasil:**
Halaman utama / berhasil menampilkan seluruh produk secara dinamis dari database Supabase di sisi server.

**Perbaikan:**
Menambahkan penanganan error try/catch dan pesan fallback jika query database mengalami kendala.

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

## US-07 List produk di halaman admin dari database [SENDIRI]

**Prompt:**
Ubah app/admin/page.jsx agar mengambil daftar produk dari tabel "produk" di Supabase menggunakan createAdminSupabase, bukan menggunakan produkContoh dari lib/data-contoh.js. Pastikan hanya admin terautentikasi yang bisa mengakses halaman. Tampilkan data tersebut di TabelProduk.

**Hasil:**
Daftar produk di halaman dashboard admin terintegrasi penuh ke database Supabase dan menampilkan data produk secara realtime.

**Perbaikan:**
Mengganti impor `produkContoh` dengan query Supabase serta menambahkan server-side auth guard.

## US-08 Tambah produk (harus terkunci login) [SENDIRI]

**Prompt:**
Buat Server Action tambahProdukAction di app/admin/actions.js yang memeriksa otentikasi admin, memvalidasi input nama dan harga, lalu menyimpan produk baru ke database Supabase. Hubungkan ke form di app/admin/produk/baru/page.jsx dan hapus CatatanBelumAktif.

**Hasil:**
Admin dapat menambahkan produk baru langsung dari halaman /admin/produk/baru yang tersimpan ke Supabase dan dialihkan kembali ke /admin.

**Perbaikan:**
Menambahkan validasi di server dan revalidatePath untuk cache Next.js.

## US-09 Ubah produk (harus terkunci login) [SENDIRI]

**Prompt:**
Perbarui app/admin/produk/[id]/ubah/page.jsx untuk mengambil data produk berdasarkan id dari database Supabase dan menampilkannya di FormProduk. Buat Server Action ubahProdukAction di app/admin/actions.js untuk memperbarui data produk di Supabase dengan proteksi login admin.

**Hasil:**
Admin dapat mengedit nama, harga, kategori, foto, dan deskripsi produk yang sudah ada di database.

**Perbaikan:**
Menghubungkan form edit ke database asli dan menghapus CatatanBelumAktif.

## US-10 Hapus produk (harus terkunci login) [SENDIRI]

**Prompt:**
Buat Server Action hapusProdukAction di app/admin/actions.js yang menghapus produk dari database Supabase jika admin sudah login. Tambahkan konfirmasi konfirmasi dialog sebelum menghapus di komponen TabelProduk.

**Hasil:**
Tombol Hapus meminta konfirmasi pengguna dan menghapus produk dari database dengan aman.

**Perbaikan:**
Membuat komponen TombolHapusProduk dengan konfirmasi browser dan useTransition.

## US-11 Filter kategori atau pencarian [SENDIRI]

**Prompt:**
Buat komponen KatalogInteraktif di components/KatalogInteraktif.jsx yang memungkinkan pengunjung memfilter produk berdasarkan kategori (pills) dan melakukan pencarian teks berdasarkan nama produk secara instan. Pasang di app/page.jsx.

**Hasil:**
Pengunjung dapat mencari produk dan menyaring produk berdasarkan kategori secara reaktif dan interaktif.

**Perbaikan:**
Menyediakan state kata kunci, daftar kategori dinamis dari database, dan pesan jika produk tidak ditemukan.

## US-12 Pilih jumlah atau varian [SENDIRI]

**Prompt:**
Tingkatkan components/TombolWhatsApp.jsx agar pengunjung di halaman detail produk dapat memilih jumlah produk (counter + / -) dan memilih varian (Original, Dingin, Hangat) sebelum memesan, serta menghitung total harga yang otomatis dimasukkan ke dalam template pesan WhatsApp.

**Hasil:**
Pengunjung dapat memilih varian dan kuantitas, dengan pesan WhatsApp yang otomatis terisi detail pesanan dan total rupiah.

**Perbaikan:**
Menambahkan state interaktif pada TombolWhatsApp dan perhitungan harga otomatis.

## US-13 Bisa di-install di HP (PWA) [SENDIRI]

**Prompt:**
Buat konfigurasi Web App Manifest di app/manifest.js dan public/manifest.json dengan ikon dari public/icons (icon-192.png dan icon-512.png). Tambahkan meta tag PWA, appleWebApp, dan theme-color di app/layout.jsx.

**Hasil:**
Aplikasi katalog UMKM kini memenuhi standar PWA dan dapat di-install di layar utama smartphone.

**Perbaikan:**
Menambahkan link manifest dan Apple touch icon di layout utama.

## US-14 Deskripsi produk dibuat AI [SENDIRI]

**Prompt:**
Buat Server Action buatDeskripsiAIAction di app/admin/actions.js yang menggunakan Gemini API untuk membuat deskripsi produk secara otomatis berdasarkan nama dan kategori produk. Tambahkan tombol 'Buat deskripsi dengan AI' di components/FormProduk.jsx.

**Hasil:**
Admin dapat menekan tombol AI saat menambah atau mengubah produk untuk membuat deskripsi produk yang menarik secara otomatis.

**Perbaikan:**
Menyediakan integrasi Gemini API dengan fallback template deskripsi cerdas jika API key belum dikonfigurasi.
