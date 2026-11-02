import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, BookOpenCheck, Feather, GraduationCap, HandHeart, Library, PenLine, Sparkles } from "lucide-react";
import heroBooks from "@/assets/hero-books.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { getValidatedBooks } from "@/data/books";
import { canonicalLinks, principles, publishingAreas, site } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Griya Pustaka Mandiri — Penerbit Buku Akademik dan Ilmiah" },
      { name: "description", content: "Penerbitan buku akademik, ilmiah, pendidikan, dan praktis. Temukan ruang untuk menerbitkan gagasan dan mengembangkan pengetahuan bersama Griya Pustaka Mandiri." },
      { property: "og:title", content: "Griya Pustaka Mandiri — Menerbitkan Gagasan" },
      { property: "og:description", content: "Penerbit buku akademik, ilmiah, pendidikan, dan praktis." },
      { property: "og:type", content: "website" },
    ],
    links: canonicalLinks("/"),
  }),
  component: HomePage,
});

const iconSet = [GraduationCap, HandHeart, BookOpenCheck, Library];
function HomePage() {
  const books = getValidatedBooks();
  return (
    <div className="overflow-hidden bg-[#fbfcff]">
      <section className="relative isolate bg-[#0c1e3a] text-white">
        <div className="absolute inset-0 -z-10">
          <img src={heroBooks} alt="" className="h-full w-full object-cover opacity-25 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09172d] via-[#10294d]/95 to-[#10294d]/65" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(105,164,255,.24),transparent_35%)]" />
        </div>
        <div className="shell relative grid min-h-[620px] items-center gap-12 py-20 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.2em] text-sky-100 backdrop-blur"><Sparkles className="size-3.5" /> Independent Publishing House</span>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[.28em] text-sky-200">{site.legalName}</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[4.4rem]">Setiap gagasan besar <span className="text-sky-300">layak menemukan</span> pembacanya.</h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">Kami membuka ruang bagi karya akademik, ilmiah, pendidikan, dan gagasan praktis untuk tumbuh menjadi pengetahuan yang dapat dibagikan.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/ajukan-naskah" className="inline-flex items-center gap-3 rounded-full bg-sky-300 px-7 py-4 text-sm font-extrabold text-[#10284b] shadow-xl shadow-black/20 transition-all hover:-translate-y-1 hover:bg-white">Mulai Terbitkan Naskah <ArrowUpRight className="size-4" /></Link>
              <Link to="/katalog-buku" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15">Jelajahi Katalog <ArrowRight className="size-4" /></Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-xs font-medium tracking-wide text-slate-300"><span className="flex items-center gap-2"><BookOpen className="size-4 text-sky-300" /> Buku akademik & ilmiah</span><span className="flex items-center gap-2"><Feather className="size-4 text-sky-300" /> Pendampingan naskah</span></div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-[470px] lg:block">
            <div className="absolute -inset-5 rounded-[2.5rem] border border-white/15 rotate-3" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur">
              <img src={heroBooks} alt="Tumpukan buku sebagai representasi karya penerbitan" className="aspect-[4/5] w-full rounded-[1.4rem] object-cover" />
              <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/20 bg-[#0c1e3a]/80 p-5 backdrop-blur-xl">
                <p className="text-[10px] font-bold uppercase tracking-[.22em] text-sky-200">Our publishing philosophy</p>
                <p className="mt-2 font-display text-xl font-bold leading-snug text-white">Menerbitkan Gagasan,<br />Mengembangkan Pengetahuan.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />
      </section>

      <section className="relative z-10 -mt-1 bg-white py-7">
        <div className="shell grid gap-5 sm:grid-cols-3">
          {[
            ["01", "Editorial", "Naskah ditata dengan perhatian pada struktur dan keterbacaan."],
            ["02", "Kolaboratif", "Ruang tumbuh bagi penulis, akademisi, dan praktisi."],
            ["03", "Bertanggung jawab", "Mengutamakan etika, keaslian, dan akurasi publikasi."],
          ].map(([n, title, desc]) => <div key={n} className="flex gap-4 border-b border-slate-100 py-4 sm:border-b-0 sm:border-r sm:py-3 last:border-0"><span className="font-display text-2xl font-extrabold text-blue-200">{n}</span><div><h2 className="text-sm font-bold text-[#172e52]">{title}</h2><p className="mt-1 text-xs leading-6 text-slate-500">{desc}</p></div></div>)}
        </div>
      </section>

      <section className="shell py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div><p className="text-xs font-extrabold uppercase tracking-[.24em] text-blue-700">Tentang Penerbit</p><h2 className="mt-4 max-w-xl font-display text-3xl font-extrabold leading-tight text-[#142b50] sm:text-4xl">Membawa karya baik lebih dekat kepada pembaca.</h2></div>
          <div><p className="max-w-2xl text-base leading-8 text-slate-600">{site.shortSummary} Kami mendukung proses penerbitan yang terencana agar setiap karya memiliki penyajian yang jelas, tertata, dan bermanfaat.</p><Link to="/tentang-penerbit" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-800 hover:text-blue-600">Kenali Griya Pustaka Mandiri <ArrowUpRight className="size-4" /></Link></div>
        </div>
      </section>

      <section className="bg-[#f1f5fb] py-20 lg:py-24">
        <div className="shell">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.24em] text-blue-700">Area Publikasi</p><h2 className="mt-3 font-display text-3xl font-extrabold text-[#142b50] sm:text-4xl">Ruang lingkup penerbitan</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Beragam disiplin dan pengalaman yang memperkaya khazanah pengetahuan.</p></div><Link to="/layanan-penerbitan" className="inline-flex items-center gap-2 text-sm font-bold text-blue-800">Lihat layanan <ArrowUpRight className="size-4" /></Link></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {publishingAreas.map((area, i) => { const Icon = iconSet[i % iconSet.length]!; return <Link key={area.title} to={area.href} className="group rounded-3xl border border-slate-200/80 bg-white p-7 shadow-[0_12px_35px_-28px_rgba(14,39,78,.3)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"><span className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-800 transition-colors group-hover:bg-[#17396c] group-hover:text-white"><Icon className="size-5" /></span><h3 className="mt-6 font-display text-lg font-bold text-[#172e52]">{area.title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{area.description}</p><span className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-blue-800">Jelajahi <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link>; })}
          </div>
        </div>
      </section>

      <section className="shell py-20 lg:py-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.24em] text-blue-700">Katalog</p><h2 className="mt-3 font-display text-3xl font-extrabold text-[#142b50] sm:text-4xl">Karya yang diterbitkan</h2><p className="mt-3 text-sm leading-7 text-slate-600">Jelajahi judul dan informasi publikasi yang tersedia.</p></div><Link to="/katalog-buku" className="inline-flex items-center gap-2 text-sm font-bold text-blue-800">Lihat katalog lengkap <ArrowUpRight className="size-4" /></Link></div>
        {books.length ? <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{books.slice(0,4).map(book => <div key={book.id} className="rounded-2xl"><Link to="/katalog-buku" className="block"><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="font-semibold text-[#17396c]">{book.title}</p></div></Link></div>)}</div> : <div className="mt-10 flex flex-col items-center rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><span className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-800"><Library className="size-6" /></span><h3 className="mt-5 font-display text-xl font-bold text-[#172e52]">Katalog sedang dipersiapkan</h3><p className="mt-2 max-w-lg text-sm leading-7 text-slate-500">Informasi buku akan ditampilkan setelah data publikasi resmi tersedia. Kami menjaga agar informasi judul, penulis, dan ISBN yang tampil tetap akurat.</p><Link to="/kontak" className="mt-6 rounded-full bg-[#17396c] px-6 py-3 text-sm font-bold text-white hover:bg-[#0d274f]">Tanyakan informasi buku</Link></div>}
      </section>

      <section className="bg-[#10284b] py-20 text-white lg:py-24">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-extrabold uppercase tracking-[.24em] text-sky-200">Kolaborasi</p><h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">Punya naskah yang ingin dibagikan kepada dunia?</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">Mari mulai percakapan tentang gagasan, proses editorial, dan rencana penerbitan karya Anda.</p></div><Link to="/ajukan-naskah" className="inline-flex items-center justify-center gap-3 rounded-full bg-sky-300 px-7 py-4 text-sm font-extrabold text-[#10284b] hover:bg-white">Diskusikan Naskah <ArrowUpRight className="size-4" /></Link></div>
      </section>
    </div>
  );
}
