import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, UserRound } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { canonicalLinks } from "@/data/site";

export const Route = createFileRoute("/penulis")({
  head: () => ({
    meta: [
      { title: "Penulis — Griya Pustaka Mandiri" },
      { name: "description", content: "Direktori penulis dan kontributor Griya Pustaka Mandiri." },
    ],
    links: canonicalLinks("/penulis"),
  }),
  component: AuthorsPage,
});

function AuthorsPage() {
  return (
    <div>
      <section className="bg-mist">
        <div className="shell py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-azure">Kolaborasi Pengetahuan</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">Penulis</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Ruang untuk mengenal para penulis, akademisi, praktisi, dan kontributor yang berkarya bersama Griya Pustaka Mandiri.</p>
        </div>
      </section>
      <section className="shell py-14 lg:py-20">
        <SectionHeading eyebrow="Direktori Penulis" title="Gagasan berawal dari para penulis" description="Profil akan ditampilkan setelah data biografi, karya, dan persetujuan publikasi dikonfirmasi." />
        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-dashed border-border bg-card p-8 text-center sm:p-12">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><UserRound className="size-7" aria-hidden="true" /></span>
          <h2 className="mt-5 font-display text-xl font-semibold text-foreground">Direktori sedang disiapkan</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Belum ada profil penulis yang dipublikasikan pada halaman ini. Kami tidak menampilkan nama atau biografi tanpa verifikasi dan persetujuan yang diperlukan.</p>
          <Link to="/ajukan-naskah" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-navy-deep"><BookOpen className="size-4" aria-hidden="true" /> Mulai kolaborasi naskah</Link>
        </div>
      </section>
    </div>
  );
}
