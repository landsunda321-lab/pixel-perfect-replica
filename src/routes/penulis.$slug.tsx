import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

type AuthorProfile = { id:string; slug:string; name:string; biography?:string; expertise?:string; photo_url?:string };
export const Route = createFileRoute("/penulis/$slug")({ component: AuthorDetailPage });
function AuthorDetailPage(){
  const {slug}=Route.useParams();
  const [author,setAuthor]=useState<AuthorProfile|null>(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let active=true;
    fetch("/api/cms?action=public-author&slug="+encodeURIComponent(slug))
      .then(async r=>{if(!r.ok)throw new Error("Profil tidak ditemukan");return r.json();})
      .then(d=>{if(active)setAuthor(d.item||null);})
      .catch(()=>{if(active)setAuthor(null);})
      .finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[slug]);
  return <main className="shell min-h-[65vh] py-14 lg:py-20">
    <Link to="/penulis" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-600"><ArrowLeft className="size-4"/> Kembali ke komunitas penulis</Link>
    {loading?<p className="py-20 text-center text-sm text-slate-500">Memuat profil penulis...</p>:
     author?<article className="mx-auto mt-10 grid max-w-4xl gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[260px_1fr] sm:p-10">
       <div className="overflow-hidden rounded-2xl bg-slate-100">{author.photo_url?<img src={author.photo_url} alt={author.name} className="aspect-[4/5] w-full object-cover"/>:<div className="flex aspect-[4/5] items-center justify-center"><UserRound className="size-20 text-slate-400"/></div>}</div>
       <div><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-700">Profil Penulis GPM</p><h1 className="mt-3 font-display text-3xl font-extrabold text-[#142b50] sm:text-4xl">{author.name}</h1>{author.expertise&&<p className="mt-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900">{author.expertise}</p>}<h2 className="mt-8 font-display text-lg font-bold text-[#142b50]">Tentang Penulis</h2><p className="mt-3 whitespace-pre-line text-sm leading-8 text-slate-600">{author.biography||"Profil penulis ini belum memiliki biografi publik."}</p></div>
     </article>:<div className="mx-auto mt-16 max-w-xl rounded-2xl border border-dashed border-slate-300 p-10 text-center"><UserRound className="mx-auto size-10 text-slate-400"/><h1 className="mt-4 text-xl font-bold text-slate-800">Profil penulis tidak ditemukan</h1><p className="mt-2 text-sm text-slate-500">Profil mungkin belum dipublikasikan atau telah dinonaktifkan.</p></div>}
  </main>;
}