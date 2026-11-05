import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { canonicalLinks, site } from "@/data/site";

type DistributionBook = {
  id: string; title: string; author: string; cover_url?: string | null; isbn?: string | null;
  publication_status: string; print_available?: boolean; print_price?: number | null;
  digital_available?: boolean; digital_access_type?: string; digital_price?: number | null;
  open_access?: boolean; pdf_url?: string | null; allow_pdf_download?: boolean;
  digital_access_url?: string | null; order_url?: string | null;
};
export const Route = createFileRoute("/akses-distribusi")({
  head: () => ({ meta: [
    { title: "Akses dan Distribusi Buku — Griya Pustaka Mandiri" },
    { name: "description", content: "Cara memperoleh buku cetak dan digital terbitan Griya Pustaka Mandiri, termasuk informasi pemesanan, akses, dan unduhan." },
  ], links: canonicalLinks("/akses-distribusi") }),
  component: AccessDistributionPage,
});
function whatsappUrl(message: string) {
  const number = (site.contact.mobile || site.contact.phone || "").replace(/\D/g, "").replace(/^0/, "62");
  return number ? "https://wa.me/" + number + "?text=" + encodeURIComponent(message) : "mailto:" + site.contact.email;
}
function AccessDistributionPage() {
  const [books, setBooks] = useState<DistributionBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/cms?action=public-books").then(async r => {
      if (!r.ok) throw new Error("Gagal memuat publikasi");
      return r.json();
    }).then(d => {
      if (active) setBooks(Array.isArray(d.items)
        ? d.items.filter((b: DistributionBook) => b.publication_status === "terbit" && b.publication_status !== "arsip")
        : []);
    }).catch(() => { if (active) setFailed(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return <main className="min-h-screen bg-white">
    <section className="bg-[#0c1e3a] text-white"><div className="shell py-16 lg:py-20">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-sky-200">Informasi Publikasi</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Akses dan Distribusi Buku</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-300">Temukan cara memperoleh buku terbitan Griya Pustaka Mandiri. Pilihan pemesanan dan akses ditampilkan berdasarkan ketersediaan yang dicatat pada katalog penerbit.</p>
    </div></section>
    <section className="shell py-12">
      <div className="grid gap-5 md:grid-cols-3">
        <Link to="/distribusi/buku-cetak" className="group rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><h2 className="font-bold text-[#10294f] group-hover:text-blue-700">Buku Cetak <span aria-hidden="true">→</span></h2><p className="mt-2 text-sm leading-6 text-slate-600">Lihat katalog buku fisik, harga, informasi ketersediaan, dan cara pemesanan kepada penerbit.</p><span className="mt-4 inline-flex text-sm font-bold text-blue-800">Lihat buku cetak</span></Link>
        <Link to="/distribusi/buku-digital" className="group rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><h2 className="font-bold text-[#10294f] group-hover:text-blue-700">Buku Digital <span aria-hidden="true">→</span></h2><p className="mt-2 text-sm leading-6 text-slate-600">Temukan buku elektronik berbayar maupun gratis, lengkap dengan informasi harga dan tautan akses.</p><span className="mt-4 inline-flex text-sm font-bold text-blue-800">Lihat buku digital</span></Link>
        <Link to="/distribusi/open-access" className="group rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><h2 className="font-bold text-[#10294f] group-hover:text-blue-700">Open Access <span aria-hidden="true">→</span></h2><p className="mt-2 text-sm leading-6 text-slate-600">Jelajahi buku akses terbuka yang dapat dibaca publik dan diunduh jika izin unduh tersedia.</p><span className="mt-4 inline-flex text-sm font-bold text-blue-800">Lihat koleksi Open Access</span></Link>
      </div>
      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold text-[#10294f]">Buku yang telah terbit</h2>
        <p className="mt-2 text-sm text-slate-600">Daftar ini hanya menampilkan judul dengan status telah terbit. Pilihan distribusi mengikuti data setiap judul.</p>
        {loading ? <p className="py-10 text-sm text-slate-500">Memuat informasi publikasi...</p>
          : failed ? <p role="alert" className="mt-6 rounded-xl bg-amber-50 p-5 text-sm text-amber-900">Informasi distribusi belum dapat dimuat. Silakan muat ulang halaman atau hubungi penerbit.</p>
          : books.length === 0 ? <p className="mt-6 rounded-xl border border-dashed p-8 text-sm text-slate-600">Belum ada buku berstatus telah terbit yang ditampilkan pada halaman ini. Informasi akan muncul setelah status dan data distribusi diperbarui melalui CMS.</p>
          : <div className="mt-6 divide-y rounded-2xl border">{books.map(book => <article key={book.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
            {book.cover_url && <img src={book.cover_url} alt={"Sampul " + book.title} className="h-32 w-24 rounded-lg bg-slate-50 object-contain" />}
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-[#10294f]">{book.title}</h3><p className="mt-1 text-sm text-slate-600">Oleh: {book.author}</p>
              {book.isbn && <p className="mt-1 text-xs text-slate-500">ISBN: {book.isbn}</p>}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {book.print_available && <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-900">Cetak tersedia{book.print_price != null ? " · Rp " + Number(book.print_price).toLocaleString("id-ID") : ""}</span>}
                {book.digital_available && <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-900">{book.digital_access_type === "paid" ? "Digital berbayar" : book.digital_access_type === "free" ? "Digital gratis" : "Digital tersedia"}{book.digital_price != null && book.digital_access_type === "paid" ? " · Rp " + Number(book.digital_price).toLocaleString("id-ID") : ""}</span>}
                {book.open_access && book.pdf_url && book.allow_pdf_download && <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-900">Open Access · PDF</span>}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {book.print_available && <a href={book.order_url || whatsappUrl("Halo Griya Pustaka Mandiri, saya ingin memesan buku cetak: " + book.title)} target="_blank" rel="noreferrer" className="rounded-lg bg-[#123d78] px-4 py-2.5 text-sm font-bold text-white">{book.order_url ? "Pesan buku cetak" : "Tanyakan pemesanan"}</a>}
                {book.digital_available && book.digital_access_url && <a href={book.digital_access_url} target="_blank" rel="noreferrer" className="rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-bold text-[#123d78]">Akses buku digital</a>}
                {book.open_access && book.pdf_url && book.allow_pdf_download && <a href={book.pdf_url} target="_blank" rel="noreferrer" className="rounded-lg border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-800">Unduh PDF</a>}
                <Link to="/katalog-buku/$bookId" params={{ bookId: book.id }} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Detail buku</Link>
              </div>
              {!book.print_available && !book.digital_available && !(book.open_access && book.pdf_url && book.allow_pdf_download) && <p className="mt-3 text-xs text-slate-500">Informasi cara memperoleh buku ini belum tersedia. Silakan hubungi penerbit.</p>}
            </div>
          </article>)}</div>}
      </div>
      <div className="mt-12 rounded-2xl bg-[#10294f] p-6 text-white"><h2 className="font-display text-xl font-bold">Butuh informasi lebih lanjut?</h2><p className="mt-2 text-sm leading-6 text-slate-300">Hubungi penerbit untuk menanyakan ketersediaan, harga, metode pembayaran, pengiriman, atau akses digital suatu judul.</p><a href={whatsappUrl("Halo Griya Pustaka Mandiri, saya ingin bertanya mengenai ketersediaan buku.")} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-lg bg-sky-300 px-5 py-3 text-sm font-bold text-[#10294f]">Hubungi penerbit</a></div>
    </section>
  </main>;
}
