import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { canonicalLinks } from "@/data/site";

export const Route = createFileRoute("/penulis")({
  head: () => ({
    meta: [
      { title: "Penulis — Griya Pustaka Mandiri" },
      { name: "description", content: "Kenali profil penulis dan kontributor Griya Pustaka Mandiri." },
    ],
    links: canonicalLinks("/penulis"),
  }),
  component: AuthorsPage,
});
type CmsAuthor = { id:string; name:string; biography?:string; expertise?:string; photo_url?:string; is_demo:boolean };
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
  return <div>
    <section className="relative overflow-hidden bg-mist"><div className="shell relative py-16 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-azure">Kolaborasi Pengetahuan</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">Penulis</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Berkenalan dengan para akademisi, praktisi, dan kontributor yang menghadirkan gagasan melalui karya tulis.</p>
      <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-sm text-muted-foreground"><UserRound className="size-4 text-azure"/> {authors.length} profil penulis</div>
    </div></section>
    <section className="shell py-12 lg:py-16">
      <SectionHeading eyebrow="Direktori Penulis" title="Gagasan besar lahir dari beragam perspektif" description="Profil penulis yang telah dimasukkan dan dipublikasikan melalui sistem manajemen konten."/>
      {loading?<p className="py-16 text-center text-sm text-muted-foreground">Memuat profil penulis...</p>:
       failed?<p role="alert" className="mt-8 rounded-xl bg-amber-50 p-5 text-sm text-amber-900">Direktori penulis belum dapat dimuat. Silakan coba kembali.</p>:
       authors.length?<div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{authors.map(author=><article key={author.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card">
         {author.photo_url?<img src={author.photo_url} alt={author.name} className="size-20 rounded-2xl object-cover"/>:<div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 font-display text-2xl font-bold text-primary">{author.name.split(/\\s+/).map(v=>v[0]).slice(0,2).join("").toUpperCase()}</div>}
         <h2 className="mt-5 font-display text-xl font-bold text-primary">{author.name}</h2>
         {author.expertise&&<p className="mt-2 w-fit rounded-full bg-accent/70 px-3 py-1.5 text-xs font-semibold text-accent-foreground">{author.expertise}</p>}
         {author.biography&&<p className="mt-4 text-sm leading-relaxed text-muted-foreground">{author.biography}</p>}
         {author.is_demo&&<span className="mt-4 w-fit rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">Profil demonstrasi</span>}
       </article>)}</div>:<div className="mt-9 rounded-2xl border border-dashed border-border bg-mist px-6 py-14 text-center"><UserRound className="mx-auto size-8 text-muted-foreground"/><p className="mt-3 text-sm text-muted-foreground">Belum ada profil penulis yang dipublikasikan.</p></div>}
      <div className="mt-14 rounded-3xl bg-navy p-8 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky">Berkolaborasi dengan Kami</p><h2 className="mt-2 font-display text-2xl font-bold">Punya gagasan untuk diterbitkan?</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-sky/85">Kami membuka ruang diskusi bagi penulis, akademisi, dan praktisi yang ingin mengembangkan karya tulis.</p></div><Link to="/ajukan-naskah" className="mt-6 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-sky sm:mt-0">Ajukan Naskah <ArrowRight className="size-4"/></Link></div>
    </section>
  </div>;
}
