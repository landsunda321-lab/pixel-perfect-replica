import { describe, expect, it, vi } from "vitest";

import {
  BOOKS,
  BOOK_STATUSES,
  canShowIsbn,
  getValidatedBooks,
  isPublished,
  bookSchema,
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
});
