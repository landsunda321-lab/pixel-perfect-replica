import { describe, expect, it, vi } from "vitest";

import {
  BOOKS,
  BOOK_STATUSES,
  bookSchema,
  canShowIsbn,
  getValidatedBooks,
  isAvailable,
  isPublished,
  type Book,
} from "@/data/books";

describe("Aturan katalog buku", () => {
  it("tidak mengarang buku fiktif: katalog awal kosong", () => {
    expect(BOOKS).toEqual([]);
    expect(getValidatedBooks()).toEqual([]);
  });

  it("menyembunyikan ISBN untuk buku Dalam Persiapan meskipun field terisi", () => {
    const draft = {
      id: "b1",
      slug: "buku-persiapan",
      title: "Buku Dalam Persiapan",
      author: "Penulis",
      category: "Akademik",
      description: "Deskripsi",
      publisher: "GRIYA PUSTAKA MANDIRI",
      isbn: "978-0-00000-000-0",
      availabilityStatus: "Dalam Persiapan",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };
    const parsed = bookSchema.parse(draft);
    expect(canShowIsbn(parsed)).toBe(false);
    expect(isPublished(parsed)).toBe(false);
  });

  it("menampilkan ISBN hanya jika diberikan resmi dan buku sudah terbit", () => {
    const published = {
      id: "b2",
      slug: "buku-terbit",
      title: "Buku Terbit",
      author: "Penulis",
      category: "Akademik",
      description: "Deskripsi",
      publisher: "GRIYA PUSTAKA MANDIRI",
      isbn: "978-0-00000-001-7",
      availabilityStatus: "Terbit",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };
    const parsed = bookSchema.parse(published);
    expect(canShowIsbn(parsed)).toBe(true);
    expect(isPublished(parsed)).toBe(true);
  });

  it("menolak ISBN tanpa nomor resmi (null) pada schema", () => {
    const withoutIsbn = {
      id: "b3",
      slug: "buku-tanpa-isbn",
      title: "Buku Tanpa ISBN",
      author: "Penulis",
      category: "Akademik",
      description: "Deskripsi",
      publisher: "GRIYA PUSTAKA MANDIRI",
      isbn: null,
      availabilityStatus: "Dalam Persiapan",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };
    expect(() => bookSchema.parse(withoutIsbn)).not.toThrow();
    expect(BOOK_STATUSES).toContain("Dalam Persiapan");
  });

  it("menolak tautan akses selain HTTPS", () => {
    const base = {
      id: "b4",
      slug: "buku-tautan",
      title: "Buku",
      author: "Penulis",
      category: "Akademik",
      description: "Deskripsi",
      publisher: "PT Griya Pustaka Mandiri",
      availabilityStatus: "Tersedia dalam format digital",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };
    expect(bookSchema.safeParse({ ...base, accessUrl: "http://example.com/buku" }).success).toBe(
      false,
    );
    expect(bookSchema.safeParse({ ...base, accessUrl: "https://example.com/buku" }).success).toBe(
      true,
    );
    expect(bookSchema.safeParse({ ...base, accessUrl: null }).success).toBe(true);
  });

  it("menolak nama penerbit yang tidak konsisten", () => {
    const base = {
      id: "b5",
      slug: "buku-penerbit",
      title: "Buku",
      author: "Penulis",
      category: "Akademik",
      description: "Deskripsi",
      availabilityStatus: "Terbit",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };
    expect(bookSchema.safeParse({ ...base, publisher: "PT Griya Pustaka Mandiri" }).success).toBe(
      true,
    );
    expect(bookSchema.safeParse({ ...base, publisher: "GRIYA PUSTAKA MANDIRI" }).success).toBe(
      true,
    );
    expect(bookSchema.safeParse({ ...base, publisher: "Penerbit Lain" }).success).toBe(false);
  });

  it("menerima cover berupa path aset lokal atau URL", () => {
    const base = {
      id: "b6",
      slug: "buku-sampul",
      title: "Buku",
      author: "Penulis",
      category: "Akademik",
      description: "Deskripsi",
      publisher: "PT Griya Pustaka Mandiri",
      availabilityStatus: "Dalam Persiapan",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };
    expect(bookSchema.safeParse({ ...base, coverImage: "/covers/buku.jpg" }).success).toBe(true);
    expect(bookSchema.safeParse({ ...base, coverImage: "buku.jpg" }).success).toBe(false);
  });

  it("melewati entri dengan slug ganda agar URL detail tetap unik", () => {
    const draft: Book = {
      id: "b7",
      slug: "buku-sama",
      title: "Buku",
      author: "Penulis",
      category: "Akademik",
      description: "Deskripsi",
      publisher: "PT Griya Pustaka Mandiri",
      availabilityStatus: "Dalam Persiapan",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = getValidatedBooks([draft, { ...draft, id: "b8" }]);
    warn.mockRestore();
    expect(result).toHaveLength(1);
    expect(result[0]!.slug).toBe("buku-sama");
  });

  it("tidak menganggap buku berstatus Tidak tersedia tersedia untuk didistribusikan", () => {
    const base = {
      id: "b9",
      slug: "buku-tidak-tersedia",
      title: "Buku",
      author: "Penulis",
      category: "Akademik",
      description: "Deskripsi",
      publisher: "PT Griya Pustaka Mandiri",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };
    const unavailable = bookSchema.parse({ ...base, availabilityStatus: "Tidak tersedia" });
    const draft = bookSchema.parse({ ...base, availabilityStatus: "Dalam Persiapan" });
    const ready = bookSchema.parse({ ...base, availabilityStatus: "Terbit" });
    expect(isAvailable(unavailable)).toBe(false);
    expect(isAvailable(draft)).toBe(false);
    expect(isAvailable(ready)).toBe(true);
  });
});
