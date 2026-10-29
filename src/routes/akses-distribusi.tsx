import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ExternalLink, Globe2, Library, ShieldCheck, TabletSmartphone } from "lucide-react";
import { useMemo } from "react";

import { BookCard } from "@/components/BookCard";
import { SectionHeading } from "@/components/SectionHeading";
import { isPublished, getValidatedBooks } from "@/data/books";
import { site } from "@/data/site";

export const Route = createFileRoute("/akses-distribusi")({
  head: () => ({
    meta: [
      { title: "Akses dan Distribusi Buku — Griya Pustaka Mandiri" },
      {
        name: "description",
        content:
          "Informasi ketersediaan, format, dan akses terhadap publikasi Griya Pustaka Mandiri — format cetak dan digital sesuai ketersediaan masing-masing judul.",
      },
      { property: "og:title", content: "Akses dan Distribusi Buku — Griya Pustaka Mandiri" },
      {
        property: "og:description",
        content:
          "Temukan informasi mengenai ketersediaan, format, dan akses terhadap publikasi Griya Pustaka Mandiri.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AccessDistributionPage,
});

function AccessDistributionPage() {
  const books = useMemo(() => getValidatedBooks(), []);
  const availableBooks = books.filter(isPublished);

  return (
    <div className="flex flex-col">
      {/* Bagian A — Hero */}
      <section className="bg-mist">
        <div className="shell py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-azure">
            Informasi Publikasi
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">
            Akses dan Distribusi Buku
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Temukan informasi mengenai ketersediaan, format, dan akses terhadap publikasi Griya
            Pustaka Mandiri.
          </p>
        </div>
      </section>

      {/* Bagian B — Format publikasi */}
      <section className="shell py-16 lg:py-20">
        <SectionHeading
          eyebrow="Format Publikasi"
          title="Format Cetak dan Digital"
          description="Format berikut dapat disediakan sesuai ketersediaan masing-masing judul. Tidak setiap judul tersedia dalam kedua format."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <BookOpen className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">Format Cetak</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Buku cetak disediakan untuk judul-judul tertentu sesuai rencana penerbitan.
              Ketersediaan dan informasi pemesanan ditampilkan pada halaman buku apabila layanan
              tersebut benar-benar tersedia.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <TabletSmartphone className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">Format Digital</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Beberapa judul dapat tersedia dalam format digital (PDF atau e-book) melalui tautan
              akses resmi. Tautan hanya ditampilkan jika sumbernya sah dan terkonfirmasi.
            </p>
          </div>
        </div>
      </section>

      {/* Bagian C — Daftar publikasi */}
      <section className="bg-mist py-16 lg:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Daftar Publikasi"
            title="Publikasi yang Tersedia"
            description="Buku dengan status publikasi dan akses yang sudah dikonfirmasi."
          />
          {availableBooks.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {availableBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Library className="size-6" aria-hidden="true" />
              </span>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                Belum ada publikasi yang tersedia. Informasi ketersediaan buku akan ditampilkan
                setelah data publikasi terkonfirmasi — tidak ada klaim publikasi yang sudah terbit
                sebelum benar-benar terbit.
              </p>
              <Link
                to="/katalog-buku"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Buka Katalog Buku
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Bagian D — Akses digital */}
      <section className="shell py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,420px)]">
          <div>
            <SectionHeading
              eyebrow="Akses Digital"
              title="Tautan Baca dan Distribusi Resmi"
              description="Apabila sebuah judul tersedia secara digital, tautan baca digital, PDF, atau e-book yang sah akan ditampilkan pada halaman detail buku tersebut. Kami tidak menyediakan tautan palsu, tidak membuka akses ke file internal tanpa izin, dan tidak mengunggah buku berhak cipta tanpa kewenangan."
            />
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Globe2 className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold text-foreground">
              Ketentuan Tautan
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>• Hanya tautan HTTPS dari sumber resmi yang digunakan.</li>
              <li>• Tautan akses muncul pada halaman detail masing-masing buku.</li>
              <li>• Tidak ada tautan unduhan menuju file yang tidak ada.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bagian E — Distribusi cetak */}
      <section className="bg-mist py-16 lg:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Distribusi Cetak"
            title="Pemesanan Buku Cetak"
            description="Informasi pemesanan atau ketersediaan buku cetak ditampilkan apabila layanan tersebut benar-benar tersedia untuk judul terkait. Untuk pertanyaan mengenai ketersediaan buku cetak, silakan hubungi kami melalui halaman kontak."
          />
        </div>
      </section>

      {/* Bagian F — Hak cipta */}
      <section className="shell py-16 lg:py-20">
        <div className="rounded-3xl bg-navy p-8 text-white shadow-soft lg:p-10">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-sky">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold">Hak Cipta</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-sky/85 sm:text-base">
            Seluruh buku yang diterbitkan oleh {site.legalName} dilindungi hak cipta. Penggunaan,
            penggandaan, atau distribusi ulang materi buku harus mengikuti izin dari pemegang hak
            cipta. Untuk permohonan izin penggunaan, silakan menghubungi kami melalui halaman
            kontak.
          </p>
          <Link
            to="/kebijakan-hak-cipta"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sky transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Baca Kebijakan Hak Cipta
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
