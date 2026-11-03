/**
 * Konfigurasi identitas situs — satu sumber kebenaran untuk data penerbit.
 *
 * PENTING: data kontak resmi (alamat, email, telepon) hanya diisi dari dokumen
 * legalitas yang dipakai untuk pendaftaran akun ISBN Perpusnas. Jangan mengisi
 * nilai contoh atau palsu — biarkan null sampai data resmi tersedia; UI akan
 * menyembunyikan baris yang belum ada datanya.
 *
 * Cara mengonfigurasi (lihat juga src/data/README.md):
 * - Alamat/email/telepon: tempelkan nilai persis dari dokumen legalitas ke
 *   site.contact; baris yang null otomatis tidak ditampilkan di mana pun.
 * - KBLI: cukup ubah site.klbiCode bila klasifikasi resmi berbeda.
 * - Domain: isi domain.host/domain.url, lalu ubah domain.verified menjadi true
 *   HANYA setelah DNS menyelesaikan dan HTTPS berhasil diverifikasi. Selama
 *   false, halaman menampilkan keterangan "domain yang direncanakan" dan
 *   canonical URL belum dikirim.
 */
export const site = {
  brandName: "GRIYA PUSTAKA MANDIRI",
  legalName: "PT Griya Pustaka Mandiri",
  entityForm: "Perseroan Perorangan",
  /** Klasifikasi baku kegiatan usaha penerbitan buku. */
  klbiCode: "58110",
  businessField: "Penerbitan Buku",
  tagline: "Menerbitkan Gagasan, Mengembangkan Pengetahuan",
  domain: {
    host: "griyapustakamandiri.my.id",
    url: "https://griyapustakamandiri.my.id",
    /**
     * true HANYA setelah domain terpasang dan terverifikasi (DNS + HTTPS
     * berhasil). Saat ini DNS domain belum memiliki rekaman, jadi tetap false.
     */
    verified: false,
  },
  shortSummary:
    "Penerbit yang berfokus pada buku akademik, ilmiah, pendidikan, dan praktis untuk mendukung pengembangan pengetahuan serta pemberdayaan masyarakat.",
  contact: {
    address: "Perumahan Taman Cileunyi Blok 2G7 No. 11 Cileunyi Kulon, Cileunyi, Kabupaten Bandung" as string | null,
    email: "griyapustakamandiri@gmail.com" as string | null,
    phone: "083185154984" as string | null,
    operatingHours: null as string | null,
  },
} as const;

/** Label bidang usaha lengkap dengan kode KBLI. */
export function businessFieldLabel(): string {
  return `${site.businessField} (KBLI ${site.klbiCode})`;
}

/**
 * Label domain untuk ditampilkan: menambahkan keterangan "direncanakan" hanya
 * selama domain belum terpasang, sehingga tidak ada klaim domain aktif.
 */
export function domainLabel(): string {
  return site.domain.verified ? site.domain.host : `${site.domain.host} (domain yang direncanakan)`;
}

/**
 * Tag canonical untuk sebuah path. Kosong selama domain belum terpasang agar
 * URL produksi yang belum ada tidak pernah diiklankan ke mesin pencari.
 */
export function canonicalLinks(path: string): Array<{ rel: string; href: string }> {
  if (!site.domain.verified) return [];
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return [{ rel: "canonical", href: `${site.domain.url}${normalized}` }];
}

/** True jika minimal satu kanal kontak resmi sudah diisi. */
export function hasOfficialContact(): boolean {
  return Boolean(site.contact.address || site.contact.email || site.contact.phone);
}

export interface PublishingArea {
  title: string;
  description: string;
  href: string;
}

/** Empat bidang penerbitan yang ditampilkan pada beranda dan tentang penerbit. */
export const publishingAreas: PublishingArea[] = [
  {
    title: "Akademik dan Ilmiah",
    description:
      "Menerbitkan karya tulis akademik dan ilmiah yang memenuhi kaidah keilmuan serta bermanfaat bagi pengembangan disiplin ilmu.",
    href: "/katalog-buku",
  },
  {
    title: "Sosial dan Pemberdayaan Masyarakat",
    description:
      "Menghadirkan buku di bidang pekerjaan sosial, rehabilitasi sosial, pembangunan, dan pemberdayaan masyarakat.",
    href: "/katalog-buku",
  },
  {
    title: "Pendidikan dan Referensi",
    description:
      "Menyediakan buku pendidikan dan referensi yang informatif, terstruktur, dan relevan dengan kebutuhan pembaca.",
    href: "/katalog-buku",
  },
  {
    title: "Buku Praktis dan Digital",
    description:
      "Menerbitkan buku panduan praktis serta memanfaatkan teknologi digital untuk memperluas akses publikasi.",
    href: "/katalog-buku",
  },
];

export const vision =
  "Menjadi penerbit yang profesional, mandiri, dan terpercaya dalam mengembangkan serta menyebarluaskan pengetahuan melalui karya tulis yang berkualitas.";

export const mission: string[] = [
  "Menerbitkan buku akademik, ilmiah, pendidikan, dan praktis.",
  "Mendukung pengembangan karya penulis.",
  "Mendorong budaya literasi dan publikasi pengetahuan.",
  "Memanfaatkan teknologi digital untuk memperluas akses buku.",
  "Menjaga etika penerbitan dan penghormatan terhadap hak cipta.",
];

export const profileParagraphs: string[] = [
  "Griya Pustaka Mandiri merupakan penerbit yang berfokus pada pengembangan dan penyebarluasan karya tulis melalui penerbitan buku. Kami mendukung penulis, akademisi, praktisi, dan masyarakat dalam menghasilkan karya yang bernilai ilmiah, edukatif, dan bermanfaat bagi pengembangan pengetahuan.",
  "Melalui proses penerbitan yang terencana, kami berupaya menghadirkan buku yang informatif, berkualitas, dan relevan dengan kebutuhan pembaca.",
];

export interface Principle {
  title: string;
  description: string;
}

/** Tiga prinsip komitmen penerbit yang tampil di beranda. */
export const principles: Principle[] = [
  {
    title: "Integritas dan Etika Penerbitan",
    description:
      "Menjaga kejujuran publikasi, menghormati hak cipta, dan memastikan setiap karya diterbitkan sesuai etika penerbitan yang berlaku.",
  },
  {
    title: "Kualitas Editorial",
    description:
      "Menaliti dan menyunting naskah dengan cermat agar buku yang terbit rapi, akurat, dan layak dibaca.",
  },
  {
    title: "Penyebarluasan Pengetahuan",
    description:
      "Memperluas akses buku melalui format cetak dan digital agar karya penulis dapat dijangkau pembaca yang lebih luas.",
  },
];

export interface CommitmentItem {
  title: string;
  description: string;
}

/** Komitmen penerbit pada halaman Tentang Penerbit (Bagian F). */
export const commitments: CommitmentItem[] = [
  {
    title: "Keaslian Karya",
    description:
      "Menjaga keaslian setiap naskah yang diterbitkan dan tidak menerima praktik plagiarisme.",
  },
  {
    title: "Hak Cipta",
    description:
      "Menghormati hak cipta penulis dan pihak lain, termasuk penggunaan materi dengan izin yang sahih.",
  },
  {
    title: "Etika Akademik",
    description:
      "Menerapkan standar etika akademik dalam penerbitan karya tulis ilmiah dan akademik.",
  },
  {
    title: "Kualitas Penyuntingan",
    description:
      "Menyunting naskah secara profesional agar informasi tersaji jelas, runtut, dan tepat.",
  },
  {
    title: "Informasi Bibliografis yang Akurat",
    description:
      "Mencantumkan data bibliografis — termasuk ISBN resmi — secara benar dan hanya setelah diberikan secara resmi.",
  },
];
