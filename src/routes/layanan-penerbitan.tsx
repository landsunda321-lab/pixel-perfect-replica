import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, FileCheck2, Files, LayoutTemplate, MessageCircle, PencilRuler } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { canonicalLinks } from "@/data/site";

export const Route = createFileRoute("/layanan-penerbitan")({
  head: () => ({
    meta: [
      { title: "Layanan Penerbitan — Griya Pustaka Mandiri" },
      { name: "description", content: "Informasi layanan konsultasi dan pendampingan penerbitan buku Griya Pustaka Mandiri." },
    ],
    links: canonicalLinks("/layanan-penerbitan"),
  }),
  component: ServicesPage,
});

const SERVICES = [
  { icon: MessageCircle, title: "Konsultasi naskah", text: "Diskusi awal mengenai gagasan, sasaran pembaca, jenis buku, dan kesiapan naskah." },
  { icon: PencilRuler, title: "Penyuntingan", text: "Pendampingan penyuntingan bahasa, konsistensi istilah, struktur, dan keterbacaan naskah." },
  { icon: LayoutTemplate, title: "Desain dan tata letak", text: "Penyiapan rancangan sampul, tipografi, serta tata letak isi sesuai karakter naskah." },
  { icon: FileCheck2, title: "Persiapan administrasi penerbitan", text: "Pemeriksaan kelengkapan metadata dan dokumen pendukung. ISBN hanya dicantumkan setelah diterbitkan secara resmi." },
  { icon: Files, title: "Pengembangan materi", text: "Pendampingan pengembangan kerangka, struktur bab, dan kelengkapan materi buku." },
  { icon: BookOpen, title: "Penilaian kesesuaian", text: "Peninjauan awal kesesuaian topik naskah dengan fokus dan ruang lingkup penerbit." },
];

function ServicesPage() {
  return (
    <div>
      <section className="bg-mist"><div className="shell py-16 lg:py-20"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-azure">Dukungan untuk Penulis</p><h1 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">Layanan Penerbitan</h1><p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Pendampingan proses penerbitan dari gagasan hingga naskah siap dipublikasikan.</p></div></section>
      <section className="shell py-14 lg:py-20">
        <SectionHeading eyebrow="Ruang Lingkup Layanan" title="Mendampingi proses penerbitan" description="Kebutuhan setiap naskah berbeda. Ruang lingkup, jadwal, biaya, dan hasil pekerjaan akan dibahas serta disepakati terlebih dahulu sebelum layanan dimulai." />
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{SERVICES.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-card"><span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Icon className="size-5" aria-hidden="true" /></span><h2 className="mt-4 font-display font-semibold text-foreground">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div>
        <div className="mt-12 rounded-3xl bg-navy p-8 text-white sm:p-10"><h2 className="font-display text-2xl font-bold">Mulai dengan konsultasi</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-sky/85">Sampaikan gambaran naskah dan kebutuhan penerbitan. Tim penerbit akan menindaklanjuti melalui kanal komunikasi resmi yang tersedia.</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/ajukan-naskah" className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary hover:bg-sky">Ajukan Naskah</Link><Link to="/kontak" className="inline-flex rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Kontak Penerbit</Link></div></div>
      </section>
    </div>
  );
}
