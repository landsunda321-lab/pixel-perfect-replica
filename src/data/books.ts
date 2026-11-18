import { z } from "zod";

import { site } from "@/data/site";

/**
 * Data katalog buku — dipisahkan dari komponen UI agar mudah dikelola dan
 * dimigrasikan ke database kelak.
 *
 * ATURAN DATA:
 * - Jangan mengisi katalog dengan buku fiktif.
 * - Data bibliografis diisi hanya jika tersedia dan telah diverifikasi.
 * - Untuk buku "Dalam Persiapan", jangan mengisi publicationYear atau
 *   accessUrl seolah sudah terbit.
 * - accessUrl hanya untuk tautan resmi yang sudah dikonfirmasi berfungsi.
 * - Cara memasukkan data: lihat src/data/README.md.
 */

/** Nama penerbit yang diterima pada field `publisher` (konsisten di seluruh situs). */
const OFFICIAL_PUBLISHER_NAMES = new Set(["griya pustaka mandiri", "pt griya pustaka mandiri"]);

/** Nama penerbit yang disarankan untuk entri baru. */
export const DEFAULT_PUBLISHER = site.legalName;

export const BOOK_STATUSES = [
  "Dalam Persiapan",
  "Terbit",
  "Tersedia dalam format digital",
  "Tersedia dalam format cetak",
  "Tidak tersedia",
] as const;

export type BookStatus = (typeof BOOK_STATUSES)[number];

export const bookSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug format: huruf-kecil-dengan-tanda-hubung"),
  title: z.string().min(1),
  subtitle: z.string().min(1).nullable().optional(),
  author: z.string().min(1),
  editor: z.string().min(1).nullable().optional(),
  category: z.string().min(1),
  description: z.string().min(1),
  coverImage: z
    .string()
    .refine(
      (value) => value.startsWith("/") || /^https?:\/\//.test(value),
      "cover harus berupa path aset diawali / atau URL http(s)",
    )
    .nullable()
    .optional(),
  publicationYear: z.number().int().min(1900).max(2100).nullable().optional(),
  publisher: z
    .string()
    .min(1)
    .refine(
      (value) => OFFICIAL_PUBLISHER_NAMES.has(value.trim().toLowerCase()),
      "nama penerbit harus konsisten dengan nama resmi penerbit",
    ),
  format: z.string().min(1).nullable().optional(),
  language: z.string().min(1).nullable().optional(),
  pages: z.number().int().positive().nullable().optional(),
  price: z.number().nonnegative().nullable().optional(),
  availabilityStatus: z.enum(BOOK_STATUSES),
  accessUrl: z
    .string()
    .url()
    .refine((value) => value.startsWith("https://"), "tautan akses wajib HTTPS")
    .nullable()
    .optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type Book = z.infer<typeof bookSchema>;


/** Katalog lokal dinonaktifkan; sumber data publik sekarang adalah CMS/Neon. */
/**
 * Katalog lokal dinonaktifkan: sumber data publik sekarang adalah CMS/Neon.
 * Jangan menambahkan dummy atau data buku di berkas ini.
 */
export const BOOKS: Book[] = [];

/** Validasi field penting; entri yang tidak valid atau slug ganda dilewati dengan peringatan. */
export function getValidatedBooks(books: Book[] = BOOKS): Book[] {
  const seenSlugs = new Set<string>();
  return books.flatMap((book) => {
    const parsed = bookSchema.safeParse(book);
    if (!parsed.success) {
      console.warn(
        "[katalog] Data buku tidak valid dan dilewati:",
        "slug" in book ? String(book.slug) : "(tanpa slug)",
        parsed.error.issues,
      );
      return [];
    }
    if (seenSlugs.has(parsed.data.slug)) {
      console.warn("[katalog] Slug duplikat dilewati:", parsed.data.slug);
      return [];
    }
    seenSlugs.add(parsed.data.slug);
    return [parsed.data];
  });
}

export function getBookBySlug(slug: string): Book | undefined {
  return getValidatedBooks().find((book) => book.slug === slug);
}

/** Buku dianggap telah diterbitkan jika status publikasinya secara eksplisit menyatakan Terbit. */
export function isPublished(book: Book): boolean {
  return book.availabilityStatus === "Terbit";
}

/**
 * Buku benar-benar tersedia untuk diakses atau didistribusikan: sudah terbit
 * dan tidak berstatus "Tidak tersedia". Dipakai halaman Akses dan Distribusi
 * agar tidak mengklaim ketersediaan yang belum pasti.
 */
export function isAvailable(book: Book): boolean {
  return isPublished(book) && book.availabilityStatus !== "Tidak tersedia";
}

/** Tahun terbit unik dan terurut menurun, untuk filter katalog. */
export function getCatalogYears(books: Book[]): number[] {
  return [...new Set(books.flatMap((b) => (b.publicationYear ? [b.publicationYear] : [])))].sort(
    (a, b) => b - a,
  );
}

/** Kategori unik dan terurut abjad, untuk filter katalog. */
export function getCatalogCategories(books: Book[]): string[] {
  return [...new Set(books.map((b) => b.category))].sort((a, b) => a.localeCompare(b, "id"));
}
