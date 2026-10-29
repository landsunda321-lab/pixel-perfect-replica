import { Link } from "@tanstack/react-router";
import { ArrowRight, BookText } from "lucide-react";

import { canShowIsbn, type Book, type BookStatus } from "@/data/books";

const STATUS_BADGE: Record<BookStatus, string> = {
  "Dalam Persiapan": "bg-secondary text-secondary-foreground",
  Terbit: "bg-primary text-primary-foreground",
  "Tersedia dalam format digital": "bg-accent text-accent-foreground",
  "Tersedia dalam format cetak": "bg-accent text-accent-foreground",
  "Tidak tersedia": "bg-muted text-muted-foreground",
};

export function BookCard({ book }: { book: Book }) {
  const detailParams = { slug: book.slug } as const;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
      <Link
        to="/buku/$slug"
        params={detailParams}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label={`Lihat detail buku ${book.title}`}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-navy-deep">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={`Sampul buku ${book.title}`}
              className="h-full w-full object-cover"
              loading="lazy"
              width={600}
              height={800}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-navy-deep to-navy px-6 text-center">
              <BookText className="size-8 text-sky/70" aria-hidden="true" />
              <p className="font-display text-lg font-semibold leading-snug text-sky">{book.title}</p>
              <p className="text-xs uppercase tracking-widest text-sky/60">{book.author}</p>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground">
            {book.category}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`rounded-full px-2.5 py-1 font-medium ${STATUS_BADGE[book.availabilityStatus]}`}
          >
            {book.availabilityStatus}
          </span>
          {book.publicationYear ? (
            <span className="text-muted-foreground">Terbit {book.publicationYear}</span>
          ) : null}
        </div>

        <h3 className="font-display text-base font-semibold text-foreground">
          <Link
            to="/buku/$slug"
            params={detailParams}
            className="transition-colors hover:text-azure focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {book.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        {canShowIsbn(book) ? (
          <p className="text-xs text-muted-foreground">ISBN {book.isbn}</p>
        ) : null}

        <div className="mt-auto pt-3">
          <Link
            to="/buku/$slug"
            params={detailParams}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-azure transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Lihat Detail
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
