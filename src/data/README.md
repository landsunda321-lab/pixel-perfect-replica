# Panduan Data Situs Griya Pustaka Mandiri

## Sumber data publik

Katalog buku dan direktori penulis yang tampil pada situs publik bersumber dari CMS dan database Neon:

- **Buku:** menu CMS **Buku** → tabel `gpm_cms_books`.
- **Penulis:** menu CMS **Penulis** → tabel `gpm_cms_authors`.
- Data hanya ditampilkan pada situs jika opsi **Tampilkan di website publik** aktif.
- Entri dengan status demonstrasi tetap diberi penanda; jangan masukkan data fiktif sebagai publikasi atau profil faktual.
- Akun Super Admin, Admin, dan Editor memiliki akses pengelolaan buku serta penulis sesuai hak akses masing-masing. Author hanya mengelola naskah miliknya.

Berkas `src/data/books.ts` dipertahankan untuk tipe, validasi, dan halaman lama yang masih memerlukan struktur data buku. Array lokal `BOOKS` sengaja kosong. Jangan menambahkan data dummy atau menggunakannya sebagai sumber katalog publik.

## Identitas dan kontak (`src/data/site.ts`)

- `brandName`, `legalName`, `entityForm` — identitas penerbit.
- `contact.address`, `contact.email`, `contact.phone`, dan `contact.operatingHours` hanya diisi dari dokumen resmi.
- Jangan mengarang alamat, email, nomor telepon, ISBN, penulis, atau tautan distribusi.

## Prosedur pengelolaan katalog

1. Login ke `/login`.
2. Buka dashboard `/admin`.
3. Pilih menu **Buku** atau **Penulis**.
4. Masukkan data yang benar dan dapat diverifikasi.
5. Aktifkan **Tampilkan di website publik** setelah data siap dipublikasikan.
6. Simpan dan periksa halaman publik `/katalog-buku` atau `/penulis`.

ISBN hanya diisi setelah nomor resmi diterbitkan. Tautan akses hanya boleh diisi dengan tautan HTTPS yang sah dan telah diuji.
