import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Info } from "lucide-react";

import { canShowIsbn, getBookBySlug } from "@/data/books";
import { canonicalLinks } from "@/data/site";

export const Route = createFileRoute("/buku/$slug")({
  loader: ({ params }) => {
    const book = getBookBySlug(params.slug);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.book.title} — Griya Pustaka Mandiri`
          : "Detail Buku — Griya Pustaka Mandiri",
      },
      {
        name: "description",
        content: loaderData
          ? loaderData.book.description.slice(0, 155)
          : "Informasi detail bibliografis publikasi Griya Pustaka Mandiri.",
      },
      {
        property: "og:title",
        content: loaderData ? loaderData.book.title : "Detail Buku — Griya Pustaka Mandiri",
      },
      {
        property: "og:description",
        content: loaderData
          ? loaderData.book.description.slice(0, 155)
          : "Informasi detail bibliografis publikasi Griya Pustaka Mandiri.",
      },
      { property: "og:type", content: "book" },
    ],
    links: loaderData ? canonicalLinks(`/buku/${loaderData.book.slug}`) : [],
  }),
  component: BookDetailPage,
  notFoundComponent: BookNotFound,
});

function BookNotFound() {
  return (
    <div className="shell flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <BookOpen className="size-10 text-muted-foreground" aria-hidden="true" />
      <h1 className="font-display text-3xl font-bold text-primary">Buku tidak ditemukan</h1>
      <p className="max-w-md text-base text-muted-foreground">
        Buku yang Anda cari tidak tersedia dalam katalog kami saat ini.
      </p>
      <Link
        to="/katalog-buku"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Kembali ke Katalog
      </Link>
    </div>
  );
}

function BookDetailPage() {
  const { book } = Route.useLoaderData();

  const metaRows: Array<{ label: string; value: string }> = [
    { label: "Kategori", value: book.category },
    ...(book.publicationYear
      ? [{ label: "Tahun Terbit", value: String(book.publicationYear) }]
      : []),
    { label: "Penerbit", value: book.publisher },
    ...(book.pages ? [{ label: "Jumlah Halaman", value: `${book.pages} halaman` }] : []),
    ...(book.language ? [{ label: "Bahasa", value: book.language }] : []),
    ...(book.format ? [{ label: "Format", value: book.format }] : []),
    ...(canShowIsbn(book) ? [{ label: "ISBN", value: book.isbn! }] : []),
    { label: "Status Publikasi", value: book.availabilityStatus },
  ];

  return (
    <div className="flex flex-col">
      <section className="bg-mist">
        <div className="shell py-10 lg:py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link
              to="/katalog-buku"
              className="transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Katalog Buku
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="text-foreground">{book.title}</span>
          </nav>
        </div>
      </section>

      <section className="shell py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div>
            <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-navy-deep shadow-soft">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`Sampul buku ${book.title}`}
                  className="h-full w-full object-cover"
                  width={600}
                  height={800}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-navy-deep to-navy px-8 text-center">
                  <BookOpen className="size-10 text-sky/70" aria-hidden="true" />
                  <p className="font-display text-2xl font-semibold leading-snug text-sky">
                    {book.title}
                  </p>
                  <p className="text-sm uppercase tracking-widest text-sky/60">{book.author}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              {book.category}
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-primary sm:text-4xl">
              {book.title}
            </h1>
            {book.subtitle ? (
              <p className="mt-2 text-lg text-muted-foreground">{book.subtitle}</p>
            ) : null}
            <p className="mt-4 text-base font-medium text-foreground">
              Ditulis oleh {book.author}
              {book.editor ? ` · Disunting oleh ${book.editor}` : ""}
            </p>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {book.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {book.accessUrl ? (
                <a
                  href={book.accessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Baca atau Akses Buku
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              ) : null}
              <a
                href="#informasi-buku"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Info className="size-4" aria-hidden="true" />
                Informasi Buku
              </a>
              <Link
                to="/katalog-buku"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Kembali ke Katalog
              </Link>
            </div>

            <div id="informasi-buku" className="mt-10 scroll-mt-24">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Informasi Bibliografis
              </h2>
              <dl className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
                <div className="divide-y divide-border">
                  {metaRows.map((row) => (
                    <div
                      key={row.label}
                      className="grid gap-1 px-5 py-3 sm:grid-cols-[180px_1fr] sm:gap-4"
                    >
                      <dt className="text-sm text-muted-foreground">{row.label}</dt>
                      <dd className="text-sm font-medium text-foreground">{row.value}</dd>
                    </div>
                  ))}
                </div>
              </dl>
              <p className="mt-4 text-sm text-muted-foreground">
                {book.accessUrl
                  ? "Buku ini dapat diakses melalui tautan resmi yang tersedia di atas."
                  : "Informasi akses atau distribusi buku ini akan ditampilkan setelah tersedia. Lihat halaman Akses dan Distribusi Buku untuk informasi umum."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
