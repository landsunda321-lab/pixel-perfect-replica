import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileText, Mail, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { canonicalLinks, site } from "@/data/site";

export const Route = createFileRoute("/ajukan-naskah")({
  head: () => ({
    meta: [
      { title: "Ajukan Naskah — Griya Pustaka Mandiri" },
      { name: "description", content: "Panduan pengajuan naskah buku kepada Griya Pustaka Mandiri." },
    ],
    links: canonicalLinks("/ajukan-naskah"),
  }),
  component: SubmissionPage,
});

const REQUIREMENTS = [
  "Judul sementara dan tema utama naskah.",
  "Sinopsis atau ringkasan isi dan sasaran pembaca.",
  "Daftar isi atau kerangka bab.",
  "Profil singkat penulis dan informasi kontak yang dapat dihubungi.",
  "Keterangan orisinalitas naskah serta status hak cipta atau publikasi sebelumnya.",
];

function SubmissionPage() {
  const hasEmail = Boolean(site.contact.email);
  return (
    <div>
      <section className="bg-mist"><div className="shell py-16 lg:py-20"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-azure">Untuk Penulis dan Akademisi</p><h1 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">Ajukan Naskah</h1><p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Pelajari persiapan awal sebelum mengajukan naskah kepada Griya Pustaka Mandiri.</p></div></section>
      <section className="shell py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div><SectionHeading eyebrow="Panduan Pengajuan" title="Siapkan informasi naskah" description="Agar proses peninjauan awal berjalan efektif, penulis dapat menyiapkan informasi berikut." />
            <ul className="mt-7 space-y-4">{REQUIREMENTS.map((item) => <li key={item} className="flex gap-3 rounded-xl border border-border bg-card p-4"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-azure" aria-hidden="true" /><span className="text-sm leading-relaxed text-foreground">{item}</span></li>)}</ul>
          </div>
          <aside className="h-fit rounded-3xl border border-border bg-card p-7 shadow-card sm:p-8">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><FileText className="size-6" aria-hidden="true" /></span>
            <h2 className="mt-5 font-display text-xl font-semibold text-primary">Kanal pengajuan</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Silakan hubungi penerbit untuk memperoleh arahan kanal pengiriman naskah. Formulir unggah belum tersedia, sehingga halaman ini tidak meminta atau menyimpan berkas Anda.</p>
            {hasEmail ? <a href={`mailto:${site.contact.email}?subject=Pengajuan%20Naskah`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-navy-deep"><Mail className="size-4" aria-hidden="true" /> Kirim email pengajuan</a> : <Link to="/kontak" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-navy-deep">Lihat kanal kontak</Link>}
            <div className="mt-6 flex gap-3 rounded-xl bg-mist p-4"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-azure" aria-hidden="true" /><p className="text-xs leading-relaxed text-muted-foreground">Jangan mengirimkan naskah rahasia atau dokumen sensitif melalui kanal yang belum dikonfirmasi sebagai kanal resmi penerbit.</p></div>
          </aside>
        </div>
      </section>
    </div>
  );
}
