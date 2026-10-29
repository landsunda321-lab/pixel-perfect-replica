import { z } from "zod";

/**
 * Data katalog buku — dipisahkan dari komponen UI agar mudah dikelola dan
 * dimigrasikan ke database kelak.
 *
 * ATURAN DATA:
 * - Jangan mengisi katalog dengan buku fiktif.
 * - ISBN hanya diisi setelah diberikan secara resmi (Perpusnas); isbn: null
 *   sampai nomor resmi tersedia. Jangan mengisi angka yang menyerupai ISBN.
 * - Untuk buku "Dalam Persiapan", jangan mengisi isbn, publicationYear, atau
 *   accessUrl seolah sudah terbit.
 */

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
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug format: huruf-kecil-dengan-tanda-hubung"),
  title: z.string().min(1),
  subtitle: z.string().min(1).nullable().optional(),
  author: z.string().min(1),
  editor: z.string().min(1).nullable().optional(),
  category: z.string().min(1),
  description: z.string().min(1),
  coverImage: z.string().url().nullable().optional(),
  publicationYear: z.number().int().min(1900).max(2100).nullable().optional(),
  publisher: z.string().min(1),
  isbn: z.string().min(10).max(17).nullable().optional(),
  format: z.string().min(1).nullable().optional(),
  language: z.string().min(1).nullable().optional(),
  pages: z.number().int().positive().nullable().optional(),
  price: z.number().nonnegative().nullable().optional(),
  availabilityStatus: z.enum(BOOK_STATUSES),
  accessUrl: z.string().url().nullable().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type Book = z.infer<typeof bookSchema>;

/** Katalog buku. Kosong sampai data publikasi resmi tersedia. */
export const BOOKS: Book[] = [];

/** Validasi field penting; entri yang tidak valid dilewati dengan peringatan. */
export function getValidatedBooks(): Book[] {
  return BOOKS.flatMap((book) => {
    const parsed = bookSchema.safeParse(book);
    if (!parsed.success) {
      console.warn(
        "[katalog] Data buku tidak valid dan dilewati:",
        "slug" in book ? String(book.slug) : "(tanpa slug)",
        parsed.error.issues,
      );
      return [];
    }
    return [parsed.data];
  });
}

export function getBookBySlug(slug: string): Book | undefined {
  return getValidatedBooks().find((book) => book.slug === slug);
}

/** ISBN hanya boleh ditampilkan jika benar-benar diberikan dan buku tidak dalam persiapan. */
export function canShowIsbn(book: Book): boolean {
  return book.isbn != null && book.availabilityStatus !== "Dalam Persiapan";
}

/** Buku dianggap sudah memiliki publikasi yang terkonfirmasi. */
export function isPublished(book: Book): boolean {
  return book.availabilityStatus !== "Dalam Persiapan";
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
