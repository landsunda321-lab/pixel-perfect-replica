import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, BookOpen, BookText, CheckCircle2,
  ClipboardCheck, Feather, FileCheck2, FileText, GraduationCap, Handshake,
  Lightbulb, Mail, PenLine, ShieldCheck, Sparkles, Users, Wallet,
} from "lucide-react";
import { canonicalLinks } from "@/data/site";

export const Route = createFileRoute("/penulis")({
  head: () => ({
    meta: [
      { title: "Ruang Penulis — Inspirasi, Panduan, dan Penerbitan Karya" },
      { name: "description", content: "Temukan inspirasi menulis, kenali jenis karya, pelajari perjalanan menjadi penulis Griya Pustaka Mandiri, dan ajukan naskah Anda." },
    ],
    links: canonicalLinks("/penulis"),
  }),
  component: AuthorsPage,
});

type CmsAuthor = {
  id: string;
  name: string;
  biography?: string;
  expertise?: string;
  photo_url?: string;
  is_demo: boolean;
};

const WORKS = [
  { icon: BookOpen, title: "Buku", text: "Karya utuh yang mengembangkan gagasan, hasil kajian, pengalaman, atau pengetahuan dalam susunan yang sistematis." },
  { icon: BookText, title: "Book chapter", text: "Tulisan dalam buku bunga rampai atau buku kolaboratif yang disusun bersama penulis lain." },
  { icon: GraduationCap, title: "Artikel jurnal", text: "Naskah ilmiah yang disiapkan mengikuti fokus, ruang lingkup, dan standar editorial jurnal yang dituju." },
  { icon: FileText, title: "Modul", text: "Bahan pembelajaran atau panduan praktis yang disusun dengan tujuan, materi, dan langkah penggunaan yang jelas." },
];

const PRINCIPLES = [
  { icon: Wallet, title: "Kontribusi penulis", text: "Penulis berpartisipasi dalam pembiayaan operasional penerbitan berdasarkan jenis karya dan kebutuhan layanan." },
  { icon: ShieldCheck, title: "Transparansi biaya", text: "Besaran dan komponen kontribusi disampaikan setelah naskah lolos seleksi dan sebelum penulis menyetujui proses penerbitan." },
  { icon: ClipboardCheck, title: "Seleksi independen", text: "Keputusan penerimaan naskah didasarkan pada penilaian substansi dan kelayakan. Pembayaran tidak menjamin naskah diterima atau diterbitkan." },
  { icon: Users, title: "Akses terbuka", text: "Karya yang telah diterbitkan dapat dibaca secara gratis sesuai lisensi, perjanjian penerbitan, dan ketentuan hak cipta." },
];

const JOURNEY = [
  ["01", "Kenali jenis karya", "Pilih bentuk karya yang sesuai dengan gagasan dan tujuan penulisan: buku, book chapter, artikel jurnal, atau modul."],
  ["02", "Siapkan naskah", "Susun naskah yang orisinal, lengkap, serta mengikuti pedoman dan kaidah penulisan yang relevan."],
  ["03", "Ajukan naskah", "Kirimkan naskah beserta sinopsis, kerangka atau daftar isi, dan profil singkat penulis melalui kanal pengajuan."],
  ["04", "Pemeriksaan administrasi", "Naskah diperiksa kelengkapan identitas, berkas, kesesuaian format, dan persyaratan awal."],
  ["05", "Seleksi dan penelaahan", "Naskah dinilai dari sisi kesesuaian tema, substansi, orisinalitas, dan kelayakan editorial."],
  ["06", "Hasil seleksi dan informasi kontribusi", "Jika dinyatakan lolos, penulis menerima hasil seleksi serta rincian kontribusi biaya operasional untuk dipertimbangkan."],
  ["07", "Persetujuan dan penerbitan", "Setelah ketentuan disepakati, proses berlanjut ke penyuntingan, tata letak, produksi, dan publikasi."],
  ["08", "Karya menjangkau pembaca", "Karya yang terbit disebarluaskan agar dapat diakses pembaca secara gratis sesuai ketentuan hak cipta dan lisensi."],
];

const WRITING_TOPICS = [
  { n: "01", title: "Menemukan dan membatasi ide", text: "Mengubah pengalaman, persoalan, dan hasil pengamatan menjadi gagasan tulisan yang fokus." },
  { n: "02", title: "Membangun kerangka tulisan", text: "Menyusun alur, bab, subbab, dan argumen agar naskah runtut serta mudah diikuti." },
  { n: "03", title: "Etika, sitasi, dan orisinalitas", text: "Mengutip sumber secara bertanggung jawab, menghindari plagiarisme, dan menjaga integritas karya." },
  { n: "04", title: "Menyunting sebelum mengirim", text: "Memeriksa konsistensi istilah, bahasa, data, referensi, dan kelengkapan naskah." },
];

function AuthorsPage() {
  const [authors, setAuthors] = useState<CmsAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/cms?action=public-authors")
      .then(async (r) => { if (!r.ok) throw new Error("Gagal memuat penulis"); return r.json(); })
      .then((d) => { if (active) setAuthors(Array.isArray(d.items) ? d.items.filter((a: CmsAuthor) => !a.is_demo) : []); })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const initials = (name: string) => name.trim().split(/\\s+/).slice(0, 2).map((v) => v[0]).join("").toUpperCase();

  return (
    <div className="overflow-hidden bg-[#fbfcff]">
      <style>{`
        @keyframes author-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .author-marquee-track { width: max-content; animation: author-marquee 38s linear infinite; }
        .author-marquee:hover .author-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .author-marquee-track { animation: none; } }
      `}</style>

      <section className="relative isolate overflow-hidden bg-[#10284b] text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_18%,rgba(125,183,255,.24),transparent_34%),linear-gradient(120deg,#0b1b35,#17396c)]" />
        <div className="shell relative grid min-h-[480px] items-center gap-10 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.2em] text-sky-100"><Feather className="size-4" /> Ruang Kepenulisan</p>
            <h1 className="mt-7 max-w-3xl font-display text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">Menulis untuk Berbagi, <span className="text-sky-300">Berkarya untuk Mengabdi.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">Setiap tulisan berawal dari gagasan. Kembangkan pengetahuan, dokumentasikan pengalaman, dan hadirkan karya yang memberi manfaat bagi pembaca.</p>
            <p className="mt-5 text-sm font-semibold tracking-wide text-sky-200">Kontribusi Bersama, Pengetahuan untuk Semua.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/ajukan-naskah" className="inline-flex items-center gap-2 rounded-full bg-sky-300 px-6 py-3.5 text-sm font-extrabold text-[#10284b] transition hover:bg-white">Mulai Perjalanan Menulis <ArrowUpRight className="size-4" /></Link>
              <a href="#perjalanan" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">Pelajari alurnya <ArrowDown className="size-4" /></a>
            </div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="absolute -inset-5 rotate-3 rounded-[2.5rem] border border-white/20" />
            <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-sky-300 text-[#10284b]"><PenLine className="size-8" /></div>
              <p className="mt-8 text-xs font-bold uppercase tracking-[.22em] text-sky-200">Mulai dari satu gagasan</p>
              <p className="mt-3 font-display text-3xl font-bold leading-tight">Tuliskan apa yang Anda ketahui. Bagikan apa yang bermanfaat.</p>
              <div className="mt-8 h-px bg-white/20" />
              <p className="mt-5 text-sm leading-7 text-slate-200">Ruang bagi akademisi, peneliti, pendidik, mahasiswa, praktisi, dan masyarakat umum.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell grid gap-10 py-16 lg:grid-cols-[.8fr_1.2fr] lg:py-24">
        <div><p className="text-xs font-extrabold uppercase tracking-[.22em] text-blue-700">Tentang Kepenulisan</p><h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-[#142b50] sm:text-4xl">Gagasan menjadi berarti ketika dituliskan dan dibagikan.</h2></div>
        <div className="space-y-5 text-[15px] leading-8 text-slate-600">
          <p>Menulis merupakan proses mengolah pemikiran, pengetahuan, pengalaman, dan hasil penelitian menjadi karya yang dapat dipelajari orang lain. Melalui tulisan, gagasan dapat didokumentasikan, diuji, dikembangkan, dan diwariskan lintas generasi.</p>
          <p>Halaman ini menjadi ruang bagi calon penulis dan penulis untuk mengenali ragam karya, mempelajari proses penerbitan, memahami hak serta tanggung jawab, dan mengembangkan keterampilan menulis.</p>
          <p>Penulis dapat berasal dari berbagai latar belakang. Hal terpenting adalah kesungguhan mengembangkan gagasan, menjaga keaslian karya, menghormati sumber, dan bertanggung jawab terhadap isi tulisan.</p>
        </div>
      </section>

      <section className="bg-[#f0f5fc] py-16 lg:py-20">
        <div className="shell">
          <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.22em] text-blue-700">Ragam Karya</p><h2 className="mt-3 font-display text-3xl font-extrabold text-[#142b50] sm:text-4xl">Apa yang dapat Anda tulis?</h2><p className="mt-4 text-sm leading-7 text-slate-600">Kenali bentuk karya dan pilih jalur penulisan yang paling sesuai dengan tujuan serta karakter naskah Anda.</p></div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WORKS.map((w) => <article key={w.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><span className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-800"><w.icon className="size-6" /></span><h3 className="mt-5 font-display text-lg font-bold text-[#172e52]">{w.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{w.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="shell py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div><p className="text-xs font-extrabold uppercase tracking-[.22em] text-blue-700">Menjadi Penulis GPM</p><h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-[#142b50] sm:text-4xl">Dari naskah yang Anda siapkan hingga karya diterbitkan.</h2><p className="mt-5 text-sm leading-7 text-slate-600">Calon penulis dapat mengajukan karya untuk dipertimbangkan melalui proses administrasi, seleksi, dan penelaahan. Pengajuan terbuka bagi penulis dengan karya yang sesuai dengan ruang lingkup penerbitan.</p><Link to="/ajukan-naskah" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17396c] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0d274f]">Lihat panduan pengajuan <ArrowRight className="size-4" /></Link></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Siapkan karya orisinal", "Pastikan naskah merupakan karya sendiri atau memiliki izin penggunaan yang sah."],
              ["Lengkapi informasi", "Sertakan identitas penulis, sinopsis, kerangka atau daftar isi, dan sasaran pembaca."],
              ["Terbuka pada proses editorial", "Bersedia mengikuti penelaahan, perbaikan, dan penyuntingan sesuai kebutuhan."],
              ["Pahami hak dan tanggung jawab", "Sepakati ketentuan penerbitan, hak cipta, lisensi, serta kontribusi operasional secara transparan."],
            ].map(([title, text]) => <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5"><CheckCircle2 className="size-5 text-blue-700" /><h3 className="mt-3 font-bold text-[#172e52]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section id="perjalanan" className="bg-[#10284b] py-16 text-white lg:py-24">
        <div className="shell">
          <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.22em] text-sky-200">Alur Menjadi Penulis</p><h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">Perjalanan naskah menuju publikasi</h2><p className="mt-4 text-sm leading-7 text-slate-300">Tahapan yang perlu diketahui calon penulis sejak menyiapkan karya hingga naskah dipublikasikan.</p></div>
          <div className="mt-10 grid gap-x-8 gap-y-7 md:grid-cols-2">
            {JOURNEY.map(([n, title, text]) => <article key={n} className="flex gap-5 border-b border-white/15 pb-6"><span className="font-display text-2xl font-extrabold text-sky-300">{n}</span><div><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-300">{text}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="shell py-16 lg:py-24">
        <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.22em] text-blue-700">Kebijakan Penerbitan</p><h2 className="mt-3 font-display text-3xl font-extrabold text-[#142b50] sm:text-4xl">Kontribusi yang transparan, seleksi yang independen.</h2><p className="mt-4 text-sm leading-7 text-slate-600">Proses penerbitan dijalankan dengan memperhatikan keseimbangan antara tanggung jawab penulis, kualitas editorial, keberlanjutan proses produksi, dan akses pengetahuan bagi pembaca.</p></div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => <article key={p.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><p.icon className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-wider text-blue-700">Prinsip 0{i + 1}</p><h3 className="mt-1 font-display text-lg font-bold text-[#172e52]">{p.title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{p.text}</p></div></article>)}
        </div>
        <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 text-sm leading-7 text-blue-950"><strong>Catatan penting:</strong> informasi kontribusi biaya operasional disampaikan setelah naskah dinyatakan lolos seleksi. Penulis berhak mempelajari rincian dan menyetujui ketentuannya sebelum proses penerbitan dilanjutkan.</div>
      </section>

      <section className="bg-[#f0f5fc] py-16 lg:py-20">
        <div className="shell">
          <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.22em] text-blue-700">Belajar Menulis</p><h2 className="mt-3 font-display text-3xl font-extrabold text-[#142b50] sm:text-4xl">Kembangkan keterampilan kepenulisan.</h2><p className="mt-4 text-sm leading-7 text-slate-600">Empat bekal awal untuk membangun naskah yang terarah, bertanggung jawab, dan siap ditelaah.</p></div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WRITING_TOPICS.map((t) => <article key={t.n} className="rounded-2xl border border-slate-200 bg-white p-6"><span className="font-display text-3xl font-extrabold text-blue-200">{t.n}</span><h3 className="mt-4 font-display text-lg font-bold text-[#172e52]">{t.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{t.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="shell py-16 lg:py-20">
        <div className="rounded-[2rem] bg-[#17396c] p-8 text-white sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-sky-200">Saatnya Mengirimkan Karya</p><h2 className="mt-3 max-w-2xl font-display text-2xl font-extrabold sm:text-3xl">Punya naskah yang siap dikembangkan?</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">Pelajari persyaratan dan siapkan berkas sebelum mengajukan naskah untuk ditinjau.</p></div>
          <Link to="/ajukan-naskah" className="mt-7 inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-[#17396c] transition hover:bg-sky-100 lg:mt-0">Panduan Pengajuan <ArrowUpRight className="size-4" /></Link>
        </div>
      </section>

      <section className="overflow-hidden border-t border-slate-200 bg-white py-14 lg:py-16">
        <div className="shell mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.22em] text-blue-700">Direktori Kontributor</p><h2 className="mt-2 font-display text-2xl font-extrabold text-[#142b50] sm:text-3xl">Mengenal para penulis</h2><p className="mt-2 text-sm text-slate-600">Para pemikir dan praktisi yang berbagi gagasan melalui karya tulis.</p></div><span className="text-xs font-semibold text-slate-500">{loading ? "Memuat profil..." : `${authors.length} penulis`}</span></div>
        {loading ? <p className="shell py-8 text-sm text-slate-500">Memuat galeri penulis...</p> : failed ? <p role="alert" className="shell py-8 text-sm text-amber-800">Galeri penulis belum dapat dimuat. Silakan coba kembali.</p> : authors.length ? <div className="author-marquee group relative overflow-hidden" aria-label="Galeri foto penulis bergerak"><div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-24" /><div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-24" /><div className="author-marquee-track flex w-max gap-5 px-3 group-hover:[animation-play-state:paused]">{[...authors, ...authors].map((author, i) => <article key={`${author.id}-${i}`} className="w-44 shrink-0 text-center sm:w-52"><div className="mx-auto size-28 overflow-hidden rounded-full border-4 border-blue-50 bg-gradient-to-br from-sky-100 to-blue-200 shadow-md sm:size-36">{author.photo_url ? <img src={author.photo_url} alt={`Foto ${author.name}`} loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center font-display text-3xl font-bold text-[#17396c]">{initials(author.name)}</div>}</div><h3 className="mt-4 line-clamp-1 font-display text-sm font-bold text-[#172e52] sm:text-base">{author.name}</h3><p className="mt-1 line-clamp-2 min-h-9 text-xs leading-5 text-slate-500">{author.expertise || "Penulis dan kontributor"}</p></article>)}</div></div> : <div className="shell py-8"><div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><Users className="mx-auto size-8 text-slate-400" /><p className="mt-3 text-sm text-slate-600">Profil penulis akan ditampilkan di sini setelah dipublikasikan melalui CMS.</p></div></div>}
      </section>
    </div>
  );
}
