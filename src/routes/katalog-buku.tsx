import { createFileRoute, Link } from "@tanstack/react-router";
import { Library, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { BookCard } from "@/components/BookCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getCatalogCategories, getCatalogYears, getValidatedBooks } from "@/data/books";
import { canonicalLinks } from "@/data/site";

export const Route = createFileRoute("/katalog-buku")({
  head: () => ({
    meta: [
      { title: "Katalog Buku — Griya Pustaka Mandiri" },
      {
        name: "description",
        content:
          "Katalog publikasi Griya Pustaka Mandiri: buku akademik, ilmiah, pendidikan, sosial dan pemberdayaan masyarakat, serta buku praktis dan digital.",
      },
      { property: "og:title", content: "Katalog Buku — Griya Pustaka Mandiri" },
      {
        property: "og:description",
        content:
          "Telusuri publikasi Griya Pustaka Mandiri berdasarkan judul, penulis, kategori, dan tahun terbit.",
      },
      { property: "og:type", content: "website" },
    ],
    links: canonicalLinks("/katalog-buku"),
  }),
  component: CatalogPage,
});

type SortKey = "judul-asc" | "judul-desc" | "tahun-terbaru" | "tahun-terlama";

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "judul-asc", label: "Judul A–Z" },
  { value: "judul-desc", label: "Judul Z–A" },
  { value: "tahun-terbaru", label: "Tahun Terbaru" },
  { value: "tahun-terlama", label: "Tahun Terlama" },
];

const CONTROL_CLASSES =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm transition-colors focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring";

function CatalogPage() {
  const books = useMemo(() => getValidatedBooks(), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("semua");
  const [year, setYear] = useState("semua");
  const [sort, setSort] = useState<SortKey>("judul-asc");

  const categories = useMemo(() => getCatalogCategories(books), [books]);
  const years = useMemo(() => getCatalogYears(books), [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = books.filter((book) => {
      const matchesCategory = category === "semua" || book.category === category;
      const matchesYear = year === "semua" || String(book.publicationYear ?? "") === year;
      const matchesQuery =
        q === "" || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
      return matchesCategory && matchesYear && matchesQuery;
    });

    switch (sort) {
      case "judul-asc":
        return result.sort((a, b) => a.title.localeCompare(b.title, "id"));
      case "judul-desc":
        return result.sort((a, b) => b.title.localeCompare(a.title, "id"));
      case "tahun-terbaru":
        return result.sort((a, b) => (b.publicationYear ?? 0) - (a.publicationYear ?? 0));
      case "tahun-terlama":
        return result.sort((a, b) => (a.publicationYear ?? 0) - (b.publicationYear ?? 0));
    }
  }, [books, query, category, year, sort]);

  if (books.length === 0) {
    return (
      <div className="flex flex-col">
        <section className="bg-mist">
          <div className="shell py-16 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-azure">Katalog</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">
              Katalog Buku
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Daftar seluruh publikasi Griya Pustaka Mandiri.
            </p>
          </div>
        </section>
        <section className="shell py-16 lg:py-20">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-mist px-6 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Library className="size-6" aria-hidden="true" />
            </span>
            <p className="text-base leading-relaxed text-muted-foreground">
              Katalog buku sedang dipersiapkan. Informasi buku akan ditampilkan setelah data
              publikasi tersedia.
            </p>
            <Link
              to="/akses-distribusi"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Lihat Akses dan Distribusi Buku
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="bg-mist">
        <div className="shell py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-azure">Katalog</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">
            Katalog Buku
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Telusuri publikasi berdasarkan judul, penulis, kategori, dan tahun terbit.
          </p>
        </div>
      </section>

      <section className="shell py-12 lg:py-16">
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          role="search"
          aria-label="Pencarian dan filter katalog"
        >
          <div className="relative sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="catalog-search"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Cari judul atau penulis
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="catalog-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mis. judul buku, nama penulis"
                className={`${CONTROL_CLASSES} pl-9`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="catalog-category"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Kategori
            </label>
            <select
              id="catalog-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={CONTROL_CLASSES}
            >
              <option value="semua">Semua kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="catalog-year"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Tahun terbit
            </label>
            <select
              id="catalog-year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={CONTROL_CLASSES}
            >
              <option value="semua">Semua tahun</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="catalog-sort"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Urutkan
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className={CONTROL_CLASSES}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          Menampilkan {filtered.length} dari {books.length} buku.
        </p>

        {filtered.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-mist px-6 py-14 text-center">
            <Search className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-base text-muted-foreground">
              Tidak ada buku yang cocok dengan pencarian atau filter Anda.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("semua");
                setYear("semua");
              }}
              className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Atur ulang filter
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
