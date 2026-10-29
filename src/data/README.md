# Panduan Data Situs Griya Pustaka Mandiri

Dua berkas berisi seluruh data yang tampil di situs:

| Berkas              | Isi                                                                    |
| ------------------- | ---------------------------------------------------------------------- |
| `src/data/site.ts`  | Identitas penerbit, domain, kontak resmi, visi/misi, bidang penerbitan |
| `src/data/books.ts` | Katalog buku (`BOOKS`)                                                 |

Tidak ada data yang disimpan di dalam komponen UI. Semua halaman membaca dari dua berkas ini.

## 1. Katalog buku (`books.ts`)

### Cara menambahkan buku

Tambahkan satu objek ke dalam array `BOOKS`. Setiap objek divalidasi dengan `bookSchema`
(zod) saat halaman dibuka; entri yang tidak valid dilewati dan muncul sebagai peringatan di
log server, bukan sebagai halaman rusak.

**Aturan wajib:**

- Jangan mengisi katalog dengan buku fiktif. Kosongkan `BOOKS` (`[]`) selama belum ada
  judul yang benar-benar diterbitkan — halaman katalog sudah menampilkan empty state yang jujur.
- `isbn` hanya diisi **setelah** nomor ISBN diberikan secara resmi. Selama `null`, ISBN tidak
  ditampilkan di mana pun. Jangan mengisi angka yang menyerupai ISBN.
- `accessUrl` hanya untuk tautan resmi yang sudah dibuka dan berfungsi. Wajib `https://`.
  Biarkan `null` jika belum ada; tombol akses tidak akan dirender.
- `availabilityStatus` harus menggambarkan keadaan sebenarnya. Judul yang belum terbit memakai
  `"Dalam Persiapan"` dan tidak boleh mengisi `publicationYear`, `isbn`, atau `accessUrl`
  seolah sudah terbit.
- `publisher` harus konsisten: `"PT Griya Pustaka Mandiri"` (atau `"GRIYA PUSTAKA MANDIRI"`).
  Nilai lain akan ditolak skema agar nama penerbit tidak berubah antar-halaman.
- `slug` unik, huruf kecil, dipisahkan tanda hubung (`judul-buku`). Slug menjadi URL permanen:
  `/buku/<slug>`.

### Field

| Field                     | Wajib | Keterangan                                                                                                           |
| ------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------- |
| `id`                      | ya    | Kunci unik internal (mis. `buku-001`)                                                                                |
| `slug`                    | ya    | `^[a-z0-9]+(-[a-z0-9]+)*$`, unik                                                                                     |
| `title`                   | ya    | Judul buku                                                                                                           |
| `subtitle`                | tidak | Subjudul, boleh `null`                                                                                               |
| `author`                  | ya    | Nama penulis                                                                                                         |
| `editor`                  | tidak | Penyunting, boleh `null`                                                                                             |
| `category`                | ya    | Kategori (dipakai filter katalog), mis. satu dari bidang penerbitan                                                  |
| `description`             | ya    | Deskripsi/kalimat belakang buku                                                                                      |
| `coverImage`              | tidak | Path aset diawali `/` (simpan di `public/covers/…`) atau URL http(s). `null` → kartu memakai sampul generik otomatis |
| `publicationYear`         | tidak | Tahun terbit numerik, hanya jika sudah terbit                                                                        |
| `publisher`               | ya    | Nama resmi penerbit (lihat aturan di atas)                                                                           |
| `isbn`                    | tidak | Hanya nomor ISBN resmi, selain itu `null`                                                                            |
| `format`                  | tidak | Mis. `"Cetak"`, `"Digital (PDF)"`, `"Cetak dan digital"`                                                             |
| `language`                | tidak | Bahasa                                                                                                               |
| `pages`                   | tidak | Jumlah halaman                                                                                                       |
| `price`                   | tidak | Harga dalam rupiah, `null` bila belum ditentukan                                                                     |
| `availabilityStatus`      | ya    | Salah satu dari `BOOK_STATUSES`                                                                                      |
| `accessUrl`               | tidak | Tautan baca/unduh resmi ber-HTTPS yang sudah dikonfirmasi                                                            |
| `createdAt` / `updatedAt` | ya    | Tanggal ISO (`YYYY-MM-DD`)                                                                                           |

### Template entri

Salin ke `BOOKS` lalu isi dengan data nyata dari dokumen penerbitan. Tanda `<…>` adalah
placeholder yang **wajib diganti**, bukan data contoh:

```ts
{
  id: "<ID-UNIK>",
  slug: "<slug-judul>",
  title: "<Judul Buku>",
  subtitle: null,
  author: "<Nama Penulis>",
  editor: null,
  category: "<Kategori>",
  description: "<Deskripsi resmi dari buku>",
  coverImage: "/covers/<file>.jpg",
  publicationYear: null, // isi hanya setelah buku benar-benar terbit
  publisher: "PT Griya Pustaka Mandiri",
  isbn: null, // isi hanya setelah ISBN resmi diterima
  format: null, // isi sesuai ketersediaan nyata
  language: "Indonesia",
  pages: null,
  price: null,
  availabilityStatus: "Dalam Persiapan",
  accessUrl: null, // isi hanya dengan tautan resmi yang sudah diverifikasi
  createdAt: "<YYYY-MM-DD>",
  updatedAt: "<YYYY-MM-DD>",
},
```

Setelah data ditambahkan, jalankan `bun run test` — tes aturan katalog akan memastikan tidak
ada ISBN dummy, tidak ada slug ganda, dan nama penerbit konsisten.

## 2. Identitas dan kontak (`site.ts`)

- `brandName`, `legalName`, `entityForm` — nama yang tampil di header, footer, dan semua meta.
- `klbiCode` + `businessField` — dirender sebagai `Penerbitan Buku (KBLI 58110)` di footer dan
  halaman Tentang Penerbit.
- `contact.address` / `contact.email` / `contact.phone` / `contact.operatingHours` — **biarkan
  `null`** sampai tersedia di dokumen legalitas. Baris yang `null` otomatis disembunyikan;
  jangan mengisi email atau telepon agar tidak ada data kontak palsu.

## 3. Konfigurasi domain `griyapustakamandiri.my.id`

Ada di `site.domain`:

```ts
domain: {
  host: "griyapustakamandiri.my.id",
  url: "https://griyapustakamandiri.my.id",
  verified: false, // ubah ke true HANYA setelah langkah di bawah berhasil
}
```

Saat `verified: false`:

- Halaman Tentang Penerbit menampilkan `(domain yang direncanakan)`.
- Tag `<link rel="canonical">` tidak dikirim sama sekali.

**Checklist verifikasi (saat ini belum dijalankan — DNS domain belum memiliki rekaman):**

1. Daftarkan/pastikan domain `my.id` aktif pada registrar.
2. Arahkan DNS: `A` (atau `ALIAS`) untuk `@` dan `CNAME` untuk `www` ke host penampung situs.
3. Tunggu propagasi, lalu cek: `dig +short griyapustakamandiri.my.id` harus kembali ke IP host.
4. Pastikan HTTPS aktif dan sertifikat valid (buka `https://griyapustakamandiri.my.id`).
5. Uji ulang: `curl -sI https://griyapustakamandiri.my.id` harus membalas `200`/`301` tanpa
   galat sertifikat.
6. Baru setelah langkah 3–5 berhasil, ubah `verified: true`. Label "domain yang direncanakan"
   akan hilang otomatis dan canonical URL aktif.

Jangan mengubah `verified` menjadi `true` sebelum langkah di atas benar-benar berhasil.

## 4. Formulir kontak

Formulir di `/kontak` mengirim `POST` ke `/api/public/kontak` (server route TanStack Start)
yang memvalidasi input dan menyimpan pesan ke tabel Supabase `contact_messages`.

- Bila penyimpanan gagal, formulir menampilkan **pesan galat** — tidak pernah klaim sukses palsu.
- Variabel yang dibutuhkan di lingkungan server: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  (dan `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` untuk klien browser).
- Tabel yang dibutuhkan: `contact_messages` dengan kolom `name`, `email`, `subject`, `message`.
