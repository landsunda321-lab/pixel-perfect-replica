import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenText, ClipboardCheck, Scale, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { canonicalLinks } from "@/data/site";

export const Route = createFileRoute("/jurnal")({
  head: () => ({
    meta: [
      { title: "Jurnal dan Publikasi Ilmiah — Griya Pustaka Mandiri" },
      { name: "description", content: "Informasi pengembangan publikasi ilmiah dan prinsip etika penerbitan Griya Pustaka Mandiri." },
    ],
    links: canonicalLinks("/jurnal"),
  }),
  component: JournalsPage,
});

const PRINCIPLES = [
  { icon: ClipboardCheck, title: "Penelaahan yang bertanggung jawab", text: "Naskah ilmiah perlu melalui pemeriksaan substansi dan proses penilaian yang sesuai dengan kebijakan publikasi masing-masing." },
  { icon: ShieldCheck, title: "Integritas akademik", text: "Penulis bertanggung jawab atas orisinalitas, ketepatan data, sitasi, dan pengungkapan konflik kepentingan." },
  { icon: Scale, title: "Etika dan transparansi", text: "Kebijakan editorial, proses koreksi, serta penanganan dugaan pelanggaran harus dijelaskan secara terbuka sebelum publikasi." },
];

function JournalsPage() {
  return (
    <div>
      <section className="bg-mist">
        <div className="shell py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-azure">Publikasi Ilmiah</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">Jurnal</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Informasi pengembangan publikasi ilmiah dan komitmen terhadap mutu serta etika akademik.</p>
        </div>
      </section>
      <section className="shell py-14 lg:py-20">
        <SectionHeading eyebrow="Ruang Publikasi" title="Pengembangan publikasi ilmiah" description="Halaman ini menjadi pusat informasi jurnal dan publikasi ilmiah. Nama jurnal, ISSN, jadwal terbit, dan status akreditasi hanya akan dicantumkan setelah terdaftar dan terverifikasi secara resmi." />
        <div className="mt-9 rounded-3xl border border-border bg-card p-7 shadow-card sm:p-9">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><BookOpenText className="size-6" aria-hidden="true" /></span>
          <h2 className="mt-5 font-display text-xl font-semibold text-foreground">Informasi jurnal sedang dipersiapkan</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">Saat ini belum ada identitas jurnal atau nomor ISSN yang ditampilkan pada situs. Informasi akan diperbarui setelah pengelolaan jurnal dan registrasi resminya tersedia.</p>
        </div>
        <div className="mt-14">
          <SectionHeading eyebrow="Prinsip Editorial" title="Etika publikasi ilmiah" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PRINCIPLES.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-card"><span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Icon className="size-5" aria-hidden="true" /></span><h3 className="mt-4 font-display font-semibold text-foreground">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Pedoman etika ini merupakan prinsip umum; ketentuan operasional setiap jurnal akan dipublikasikan secara khusus sebelum penerimaan artikel dibuka.</p>
        </div>
        <div className="mt-12 rounded-2xl bg-mist p-7 sm:flex sm:items-center sm:justify-between sm:gap-6"><div><h2 className="font-display text-lg font-semibold text-primary">Memiliki gagasan publikasi?</h2><p className="mt-1 text-sm text-muted-foreground">Hubungi penerbit untuk mendiskusikan rencana buku atau publikasi ilmiah.</p></div><Link to="/kontak" className="mt-4 inline-flex shrink-0 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-navy-deep sm:mt-0">Hubungi Penerbit</Link></div>
      </section>
    </div>
  );
}
