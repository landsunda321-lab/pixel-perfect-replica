import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { canonicalLinks, site } from "@/data/site";

type DistributionBook = {
  id:string; title:string; author:string; cover_url?:string|null; isbn?:string|null;
  publication_status:string; print_available?:boolean; print_price?:number|null;
  digital_available?:boolean; digital_access_type?:string; digital_price?:number|null;
  open_access?:boolean; pdf_url?:string|null; allow_pdf_download?:boolean;
  digital_access_url?:string|null; order_url?:string|null;
};
export const Route = createFileRoute("/akses-distribusi")({
  head:()=>({meta:[
    {title:"Akses dan Distribusi Buku — Griya Pustaka Mandiri"},
    {name:"description",content:"Informasi pemesanan buku cetak, buku digital berbayar, dan akses terbuka publikasi Griya Pustaka Mandiri."}
  ],links:canonicalLinks("/akses-distribusi")}),
  component:AccessDistributionPage,
});
function AccessDistributionPage(){
 const [books,setBooks]=useState<DistributionBook[]>([]);
 const [loading,setLoading]=useState(true);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{let active=true;fetch("/api/cms?action=public-books").then(async r=>{if(!r.ok)throw new Error("Gagal memuat publikasi");return r.json();}).then(d=>{if(active)setBooks(Array.isArray(d.items)?d.items.filter((b:DistributionBook)=>b.publication_status!=="arsip"):[]);}).catch(()=>{if(active)setFailed(true);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
 const contact=site.contact.phone?"https://wa.me/62"+site.contact.phone.replace(/^0/,"").replace(/\\D/g,""):"mailto:"+site.contact.email;
 return <main className="min-h-screen bg-white">
  <section className="bg-[#0c1e3a] text-white"><div className="shell py-16 lg:py-20"><p className="text-xs font-bold uppercase tracking-[.2em] text-sky-200">Informasi Publikasi</p><h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Akses dan Distribusi Buku</h1><p className="mt-4 max-w-2xl leading-7 text-slate-300">Griya Pustaka Mandiri menyediakan pemesanan buku cetak secara langsung, pilihan buku digital berbayar maupun gratis, serta akses naskah lengkap untuk judul Open Access yang telah diaktifkan.</p></div></section>
  <section className="shell py-12"><div className="grid gap-5 md:grid-cols-3">
   <article className="rounded-2xl border p-5"><h2 className="font-bold text-[#10294f]">Buku cetak</h2><p className="mt-2 text-sm leading-6 text-slate-600">Pemesanan dilakukan langsung kepada penerbit. Harga dan ketersediaan mengikuti informasi setiap judul.</p></article>
   <article className="rounded-2xl border p-5"><h2 className="font-bold text-[#10294f]">Buku digital</h2><p className="mt-2 text-sm leading-6 text-slate-600">Setiap judul dapat ditandai digital berbayar atau digital gratis. Akses hanya ditampilkan jika tautan atau berkasnya benar-benar tersedia.</p></article>
   <article className="rounded-2xl border p-5"><h2 className="font-bold text-[#10294f]">Open Access</h2><p className="mt-2 text-sm leading-6 text-slate-600">Buku yang tidak diperjualbelikan disediakan dalam bentuk naskah lengkap PDF untuk akses publik setelah penerbit mengaktifkannya.</p></article>
  </div>
  <div className="mt-12"><h2 className="font-display text-2xl font-bold text-[#10294f]">Ketersediaan per judul</h2><p className="mt-2 text-sm text-slate-600">Informasi berikut berasal dari katalog CMS dan ditampilkan sesuai pengaturan masing-masing buku.</p>
  {loading?<p className="py-10 text-sm text-slate-500">Memuat informasi publikasi...</p>:failed?<p role="alert" className="mt-6 rounded-xl bg-amber-50 p-5 text-sm text-amber-900">Informasi distribusi belum dapat dimuat. Silakan coba kembali.</p>:books.length===0?<p className="mt-6 rounded-xl border border-dashed p-8 text-sm text-slate-600">Belum ada publikasi yang ditampilkan. Informasi akan muncul setelah data buku diaktifkan melalui CMS.</p>:<div className="mt-6 divide-y rounded-2xl border">{books.map(book=><article key={book.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
   {book.cover_url&&<img src={book.cover_url} alt={"Sampul "+book.title} className="h-28 w-20 rounded-lg object-contain bg-slate-50"/>}
   <div className="min-w-0 flex-1"><h3 className="font-bold text-[#10294f]">{book.title}</h3><p className="mt-1 text-sm text-slate-600">Oleh: {book.author}</p><div className="mt-3 flex flex-wrap gap-2 text-xs">{book.print_available&&<span className="rounded-full bg-blue-50 px-3 py-1 text-blue-900">Cetak tersedia</span>}{book.digital_available&&<span className="rounded-full bg-sky-50 px-3 py-1 text-sky-900">{book.digital_access_type==="paid"?"Digital berbayar":book.digital_access_type==="free"?"Digital gratis":"Digital"}</span>}{book.open_access&&book.pdf_url&&book.allow_pdf_download&&<span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-900">Open Access</span>}</div></div>
   <Link to="/katalog-buku/$bookId" params={{bookId:book.id}} className="shrink-0 rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-semibold text-[#123d78] hover:bg-blue-50">Lihat detail</Link>
  </article>)}</div>}
  </div><div className="mt-12 rounded-2xl bg-[#10294f] p-6 text-white"><h2 className="font-display text-xl font-bold">Pertanyaan pemesanan dan akses</h2><p className="mt-2 text-sm leading-6 text-slate-300">Untuk menanyakan ketersediaan judul yang belum memiliki tautan pemesanan atau akses digital, hubungi penerbit.</p><a href={contact} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-lg bg-sky-300 px-5 py-3 text-sm font-bold text-[#10294f]">Hubungi penerbit</a></div></section>
 </main>;
}
