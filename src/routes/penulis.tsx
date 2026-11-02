import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, UserRound, BookOpen, HeartHandshake, GraduationCap, Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
import { canonicalLinks } from "@/data/site";

export const Route = createFileRoute("/penulis")({
  head: () => ({ meta: [
    { title: "Komunitas Penulis — Griya Pustaka Mandiri" },
    { name: "description", content: "Ruang kolaborasi penulis untuk menyebarluaskan karya dan pengetahuan bersama Griya Pustaka Mandiri." },
  ], links: canonicalLinks("/penulis") }),
  component: AuthorsPage,
});
type CmsAuthor = { id:string; slug:string; name:string; biography?:string; expertise?:string; photo_url?:string; is_demo:boolean };
function initials(name:string){return name.split(/\\s+/).map(v=>v[0]).slice(0,2).join("").toUpperCase();}
function AuthorPortrait({author}:{author:CmsAuthor}) {
  return <div className="author-photo-frame">
    <div className="author-photo-inner">
      {author.photo_url ? <img src={author.photo_url} alt={author.name} loading="lazy"/> :
        <div className="author-initials">{initials(author.name)}</div>}
    </div>
  </div>;
}
function AuthorsPage() {
  const [authors,setAuthors]=useState<CmsAuthor[]>([]);
  const [loading,setLoading]=useState(true);
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    let active=true;
    fetch("/api/cms?action=public-authors")
      .then(async r=>{if(!r.ok) throw new Error("Gagal memuat penulis"); return r.json();})
      .then(d=>{if(active)setAuthors(Array.isArray(d.items)?d.items:[]);})
      .catch(()=>{if(active)setFailed(true);})
      .finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[]);
  const loopAuthors = [...authors,...authors];
  return <div>
    <section className="relative overflow-hidden bg-[#102544] text-white">
      <div className="shell relative py-16 lg:py-24">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-sky-200">Author Community · Griya Pustaka Mandiri</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">Menulis untuk Berbagi,<br/><span className="text-sky-300">Berkarya untuk Mengabdi.</span></h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-200">Kami membuka ruang kolaborasi bagi akademisi, peneliti, pendidik, mahasiswa, praktisi, dan masyarakat umum untuk mengembangkan serta mempublikasikan karya tulis sebagai sumbangsih akademis dan kontribusi intelektual bagi masyarakat.</p>
        <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">Buku</span><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">Book Chapter</span><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">Jurnal</span><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">Modul</span>
        </div>
      </div>
    </section>
    <section className="shell py-14 lg:py-20">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">Filosofi Publikasi</p>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-[#142b50]">Kontribusi Bersama, Pengetahuan untuk Semua.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">Penulis berkontribusi terhadap biaya operasional penerbitan sesuai jenis dan kebutuhan layanan. Kontribusi ini mendukung pengelolaan editorial, penyuntingan, tata letak, produksi, dan penyebarluasan karya.</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">Karya yang telah dipublikasikan dapat diakses dan dibaca secara gratis oleh masyarakat sesuai lisensi, hak cipta, dan ketentuan masing-masing publikasi. Pembayaran biaya tidak menjamin naskah diterima; setiap karya tetap melalui seleksi dan proses editorial.</p>
        </div>
        <div className="rounded-3xl bg-[#edf4fc] p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">Ruang Karya</p>
          <div className="mt-5 space-y-4">
            {[[BookOpen,"Buku","Akademik, referensi, monograf, dan buku umum."],[GraduationCap,"Book Chapter","Karya kolaboratif dalam satu tema buku."],[Globe2,"Artikel Jurnal","Penelitian dan kajian ilmiah sesuai ruang lingkup jurnal."],[HeartHandshake,"Modul","Modul pembelajaran, pelatihan, dan panduan praktis."]].map(([Icon,title,desc]:any)=><div className="flex gap-3" key={title}><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-800"><Icon className="size-5"/></span><div><h3 className="text-sm font-bold text-[#17345d]">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{desc}</p></div></div>)}
          </div>
        </div>
      </div>
      <div className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">Komunitas GPM</p><h2 className="mt-2 font-display text-3xl font-extrabold text-[#142b50]">Kenali Para Penulis Kami</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Foto penulis bergerak otomatis dari kanan ke kiri. Pilih foto untuk membaca profil dan bidang kepakarannya.</p></div><span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-900">{authors.length} penulis terpublikasi</span></div>
        {loading?<p className="py-16 text-center text-sm text-slate-500">Memuat komunitas penulis...</p>:
         failed?<p role="alert" className="mt-8 rounded-2xl bg-amber-50 p-5 text-sm text-amber-900">Foto dan profil penulis belum dapat dimuat. Silakan coba kembali.</p>:
         authors.length?<div className="author-marquee-shell mt-8" aria-label="Foto penulis Griya Pustaka Mandiri bergerak dari kanan ke kiri">
           <div className="author-marquee-track">
             {loopAuthors.map((author,index)=><Link key={author.id+"-"+index} to="/penulis/$slug" params={{slug:author.slug}} className="author-marquee-card" aria-label={"Lihat profil "+author.name}>
               <AuthorPortrait author={author}/>
               <span className="mt-3 block text-center text-sm font-bold text-[#17345d]">{author.name}</span>
               {author.expertise&&<span className="mt-1 block text-center text-xs text-slate-500">{author.expertise}</span>}
             </Link>)}
           </div>
         </div>:<div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center"><UserRound className="mx-auto size-9 text-slate-400"/><p className="mt-3 text-sm text-slate-600">Belum ada penulis yang dipublikasikan. Profil akan muncul otomatis setelah ditambahkan melalui CMS dan diaktifkan untuk publik.</p></div>}
      </div>
      <div className="mt-16 rounded-3xl bg-[#102544] p-8 text-white sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-sky-200">Bergabung Bersama Kami</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold">Punya gagasan untuk dibagikan?</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">Kirimkan naskah dan biodata Anda melalui email penerbit. Tim kami akan mencatat pengajuan, melakukan seleksi, dan menyampaikan informasi kontribusi biaya operasional setelah naskah dinyatakan layak diproses.</p>
        <a href="mailto:griyapustakamandiri@gmail.com?subject=Pengajuan%20Naskah%20-%20PT%20Griya%20Pustaka%20Mandiri" className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-300 px-6 py-3 text-sm font-extrabold text-[#102544] hover:bg-white">Kirim Pengajuan melalui Email <ArrowRight className="size-4"/></a>
      </div>
    </section>
  </div>;
}
