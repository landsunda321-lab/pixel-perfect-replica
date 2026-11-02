
# PT GRIYA PUSTAKA MANDIRI

Website resmi PT Griya Pustaka Mandiri, perusahaan yang bergerak di bidang penerbitan buku, publikasi jurnal ilmiah, dan layanan literasi digital.

## Project Overview

Website ini dikembangkan sebagai platform digital penerbitan untuk menampilkan profil perusahaan, katalog buku, publikasi, layanan penerbitan, serta informasi kontak.

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Start
- Node.js
- npm

## Requirements

Pastikan perangkat telah memiliki:

- Node.js versi 20 atau lebih baru
- npm
- Git

## Installation

Clone repository:

```bash
git clone https://github.com/landsunda321-lab/pixel-perfect-replica.git
```

Masuk ke direktori proyek:

```bash
cd pixel-perfect-replica
```

Install dependencies:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

## Production Build

Jalankan pemeriksaan TypeScript dan build sesuai konfigurasi proyek:

```bash
npm run build
```

Jangan mengubah konfigurasi build tanpa memeriksa konfigurasi Vite dan TanStack Start yang digunakan proyek.

## Deployment on Vercel

Project ini terhubung dengan Vercel melalui GitHub.

Deployment dilakukan melalui:

1. Push perubahan ke branch `main`.
2. Vercel mendeteksi commit baru.
3. Vercel menjalankan proses instalasi dependencies.
4. Vercel menjalankan production build.
5. Jika build berhasil dan kebijakan deployment terpenuhi, Vercel menerbitkan deployment.

### Deployment Configuration

- Git Provider: GitHub
- Repository: `landsunda321-lab/pixel-perfect-replica`
- Production Branch: `main`
- Hosting: Vercel

Pastikan konfigurasi build dan environment variables pada dashboard Vercel sesuai kebutuhan aplikasi.

## Project Structure

Struktur direktori mengikuti arsitektur aplikasi yang sudah tersedia di repository.

Jangan menghapus atau mengganti konfigurasi berikut tanpa pemeriksaan:

- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `tsconfig.json`
- `src/`
- `public/`

## Development Guidelines

- Pertahankan struktur aplikasi yang sudah berjalan.
- Hindari perubahan yang tidak diperlukan.
- Jangan menyimpan API keys atau credentials di repository.
- Gunakan environment variables untuk konfigurasi rahasia.
- Pastikan perubahan telah diuji sebelum deployment produksi.

## Repository

GitHub:
https://github.com/landsunda321-lab/pixel-perfect-replica

Vercel:
https://vercel.com/sundaland/pixel-perfect-replica

## Copyright

© 2026 PT Griya Pustaka Mandiri. All Rights Reserved.
