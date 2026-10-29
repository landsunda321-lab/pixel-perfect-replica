import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  GraduationCap,
  HandHeart,
  Library,
  MonitorSmartphone,
  type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";

import heroBooks from "@/assets/hero-books.jpg";
import { BookCard } from "@/components/BookCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getValidatedBooks } from "@/data/books";
import { principles, publishingAreas, site } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Griya Pustaka Mandiri — Menerbitkan Gagasan, Mengembangkan Pengetahuan" },
      {
        name: "description",
        content:
          "Griya Pustaka Mandiri menghadirkan karya tulis akademik, ilmiah, pendidikan, dan praktis untuk mendukung pengembangan pengetahuan serta pemberdayaan masyarakat.",
      },
      {
        property: "og:title",
        content: "Griya Pustaka Mandiri — Menerbitkan Gagasan, Mengembangkan Pengetahuan",
      },
      {
        property: "og:description",
        content:
          "Karya tulis akademik, ilmiah, pendidikan, dan praktis dari penerbit buku Griya Pustaka Mandiri.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

const AREA_ICONS: LucideIcon[] = [GraduationCap, HandHeart, BookMarked, MonitorSmartphone];

const PRIMARY_CTA =
  "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:bg-navy-deep hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const SECONDARY_CTA =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function HomePage() {
  const books = useMemo(() => getValidatedBooks(), []);
  const featuredBooks = books.slice(0, 8);

  return (
    <div className="flex flex-col">
      {/* Bagian A — Hero */}
      <section className="relative overflow-hidden bg-mist">
        <div className="shell grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              {site.legalName}
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-primary sm:text-5xl">
              {site.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Griya Pustaka Mandiri menghadirkan karya tulis akademik, ilmiah, pendidikan, dan
              praktis untuk mendukung pengembangan pengetahuan serta pemberdayaan masyarakat.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/katalog-buku" className={PRIMARY_CTA}>
                Jelajahi Katalog Buku
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link to="/tentang-penerbit" className={SECONDARY_CTA}>
                Tentang Penerbit
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div
              aria-hidden="true"
              className="absolute -right-4 -top-4 h-full w-full rounded-3xl border-2 border-sky"
            />
            <img
              src={heroBooks}
              alt="Tumpukan buku berhardcover navy di atas meja studio yang bersih"
              className="relative w-full rounded-3xl object-cover shadow-soft"
              width={1024}
              height={1024}
            />
          </div>
        </div>
      </section>

      {/* Bagian B — Pengantar penerbit */}
      <section className="shell py-16 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Pengantar"
            title="Ruang bagi Gagasan dan Pengetahuan"
            description={site.shortSummary}
          />
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-muted-foreground">
              Kami mendukung penulis, akademisi, praktisi, dan masyarakat dalam menghasilkan karya
              yang bernilai ilmiah, edukatif, dan bermanfaat bagi pengembangan pengetahuan — melalui
              proses penerbitan yang terencana dan penyuntingan yang cermat.
            </p>
            <Link
              to="/tentang-penerbit"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-azure transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Kenali penerbit lebih dekat
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bagian C — Bidang penerbitan */}
      <section className="bg-mist py-16 lg:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Bidang Penerbitan"
            title="Fokus Penerbitan Kami"
            description="Empat arah penerbitan yang menjadi perhatian utama Griya Pustaka Mandiri."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {publishingAreas.map((area, index) => {
              const Icon = AREA_ICONS[index % AREA_ICONS.length]!;
              return (
                <Link
                  key={area.title}
                  to={area.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {area.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-azure transition-colors group-hover:text-primary">
                    Lihat katalog
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bagian D — Pilihan buku */}
      <section className="shell py-16 lg:py-20">
        <SectionHeading
          eyebrow="Katalog"
          title="Pilihan Buku"
          description="Karya yang telah dan akan diterbitkan oleh Griya Pustaka Mandiri."
        />
        {featuredBooks.length > 0 ? (
          <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/katalog-buku" className={PRIMARY_CTA}>
                Lihat Semua Buku
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-mist px-6 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Library className="size-6" aria-hidden="true" />
            </span>
            <p className="max-w-xl text-base text-muted-foreground">
              Katalog buku sedang dipersiapkan. Informasi buku akan ditampilkan setelah data
              publikasi tersedia.
            </p>
            <Link to="/katalog-buku" className={SECONDARY_CTA}>
              Buka Halaman Katalog
            </Link>
          </div>
        )}
      </section>

      {/* Bagian E — Komitmen penerbit */}
      <section className="bg-mist py-16 lg:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Komitmen"
            title="Prinsip yang Kami Jaga"
            description="Tiga prinsip yang menjadi landasan setiap proses penerbitan."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map((principle, index) => (
              <div
                key={principle.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <p className="font-display text-3xl font-bold text-sky">{`0${index + 1}`}</p>
                <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                  {principle.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bagian F — Akses buku */}
      <section className="shell py-16 lg:py-20">
        <div className="grid items-center gap-8 rounded-3xl border border-border bg-card p-8 shadow-card lg:grid-cols-[1fr_auto] lg:p-10">
          <div>
            <SectionHeading
              eyebrow="Akses Buku"
              title="Cara Mengakses dan Memperoleh Buku"
              description="Informasi ketersediaan, format cetak dan digital, serta tautan akses resmi untuk setiap judul dapat dilihat pada halaman Akses dan Distribusi Buku."
            />
          </div>
          <Link to="/akses-distribusi" className={PRIMARY_CTA}>
            Akses dan Distribusi Buku
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Bagian G — CTA penutup */}
      <section className="bg-navy py-16 lg:py-20">
        <div className="shell flex flex-col items-center gap-6 text-center">
          <BookOpen className="size-10 text-sky" aria-hidden="true" />
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Temukan Karya dan Gagasan Baru
          </h2>
          <p className="max-w-xl text-base text-sky/80">
            Telusuri publikasi Griya Pustaka Mandiri dan ikuti perkembangan katalog kami.
          </p>
          <Link
            to="/katalog-buku"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky px-6 py-3 text-sm font-semibold text-navy-deep transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Jelajahi Katalog
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
