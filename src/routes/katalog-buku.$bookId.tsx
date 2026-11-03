import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, CalendarDays, Check, Clipboard, Download, FileText, List, Share2, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CmsBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  synopsis?: string;
  cover_url?: string;
  isbn?: string;
  qrcbn?: string;
  publication_status: string;
};
type Tab = "abstract" | "contents" | "author" | "details";
const STATUS: Record<string,string> = {
  persiapan:"Dalam Persiapan",
  proses_isbn:"Proses ISBN",
  isbn_terbit:"ISBN Terbit",
  proses_cetak:"Proses Cetak",
  terbit:"Telah Terbit",
  arsip:"Arsip"
};

export const Route = createFileRoute("/katalog-buku/$bookId")({
  head: () => ({
    meta: [
      { title: "Detail Buku — Griya Pustaka Mandiri" },
      { name: "description", content: "Informasi buku, abstrak, dan data bibliografi terbitan Griya Pustaka Mandiri." }
    ]
  }),
  component: BookDetailPage
});

function BookDetailPage() {
  const { bookId } = Route.useParams();
  const [book,setBook] = useState<CmsBook | null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const [tab,setTab] = useState<Tab>("abstract");
  const [copied,setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/cms?action=public-book&id=" + encodeURIComponent(bookId))
      .then(async response => {
        const data = await response.json();
        if (!response.ok || !data.item) throw new Error(data.error || "Buku tidak ditemukan.");
        return data.item as CmsBook;
      })
      .then(item => { if (active) setBook(item); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Buku tidak dapat dimuat."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  },[bookId]);

  const citation = useMemo(() => {
    if (!book) return "";
    return book.author + ". (t.t.). " + book.title + ". PT Griya Pustaka Mandiri." + (book.isbn ? " ISBN " + book.isbn + "." : "");
  },[book]);

  async function copyText(value:string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false),1800);
    } catch {
      setError("Tidak dapat menyalin dari perangkat ini. Silakan salin secara manual.");
    }
  }

  async function shareBook() {
    if (!book) return;
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({title:book.title,text:"Informasi buku dari PT Griya Pustaka Mandiri",url});
      else await copyText(url);
    } catch {
      // Pengguna dapat membatalkan dialog berbagi.
    }
  }

  if (loading) return <main className="shell py-24 text-center text-sm text-muted-foreground">Memuat informasi buku...</main>;
  if (!book || error) return <main className="shell py-20">
    <div role="alert" className="rounded-xl bg-amber-50 p-6 text-sm text-amber-900">{error || "Buku tidak ditemukan."}</div>
    <Link to="/katalog-buku" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-800"><ArrowLeft className="size-4"/> Kembali ke katalog</Link>
  </main>;

  const tabs: {id:Tab;label:string;icon:typeof FileText}[] = [
    {id:"abstract",label:"Abstrak",icon:FileText},
    {id:"contents",label:"Daftar Isi",icon:List},
    {id:"author",label:"Tentang Penulis",icon:UserRound},
    {id:"details",label:"Detail Buku",icon:Clipboard}
  ];

  return <main className="min-h-screen bg-white">
    <div className="border-b border-blue-100 bg-gradient-to-r from-slate-50 to-blue-50/80">
      <div className="shell py-3 text-xs text-slate-600">
        <Link to="/" className="hover:text-blue-800">Beranda</Link>
        <span className="mx-2">/</span>
        <Link to="/katalog-buku" className="hover:text-blue-800">Katalog Buku</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{book.title}</span>
      </div>
    </div>

    <section className="shell grid items-start gap-8 py-7 lg:grid-cols-[minmax(0,1fr)_minmax(300px,415px)] lg:gap-9 lg:py-8">
      <div className="min-w-0">
        <div className="grid gap-7 md:grid-cols-[minmax(220px,330px)_minmax(0,1fr)] md:items-center">
          <div className="flex min-h-[250px] items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            {book.cover_url
              ? <img src={book.cover_url} alt={"Sampul buku " + book.title} width={1536} height={1024} className="max-h-[390px] w-full object-contain drop-shadow-xl"/>
              : <div className="flex aspect-[3/2] w-full flex-col items-center justify-center rounded-lg bg-[#10294f] p-6 text-center text-white"><BookOpen className="size-10 text-sky-200"/><p className="mt-4 font-display text-lg font-bold">{book.title}</p><p className="mt-2 text-sm text-sky-100">{book.author}</p></div>}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-900"><BookOpen className="size-4"/> Buku</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-900">{STATUS[book.publication_status] || book.publication_status}</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-[#10294f] sm:text-4xl">{book.title}</h1>
            <p className="mt-5 flex items-center gap-2 text-sm text-slate-600"><CalendarDays className="size-4 text-blue-800"/> Tanggal terbit belum dicantumkan</p>
            <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-slate-700"><UserRound className="mt-0.5 size-4 shrink-0 text-blue-800"/>{book.author}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              <button type="button" disabled className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-[#123d78] px-5 py-3 text-sm font-bold text-white opacity-60" title="Berkas PDF belum tersedia di CMS"><Download className="size-4"/> Download PDF</button>
              <button type="button" onClick={() => copyText(citation)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-[#10294f] hover:bg-blue-50">{copied ? <Check className="size-4"/> : <span className="text-lg leading-none">❝</span>}{copied ? "Tersalin" : "Cite This"}</button>
              <button type="button" onClick={shareBook} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-[#10294f] hover:bg-blue-50"><Share2 className="size-4"/> Share</button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-b border-blue-200">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(item => {
              const Icon = item.icon;
              return <button key={item.id} type="button" onClick={() => setTab(item.id)} className={"inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition " + (tab===item.id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-600 hover:text-blue-700")}>
                <Icon className="size-4"/>{item.label}
              </button>;
            })}
          </div>
        </div>

        <section className="min-h-[250px] py-6">
          {tab === "abstract" && <>
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-[#10294f]"><FileText className="size-6 text-blue-700"/> Abstrak</h2>
            <div className="mt-4 whitespace-pre-line text-[15px] leading-7 text-slate-700">{book.synopsis || "Abstrak buku belum ditambahkan oleh penerbit."}</div>
          </>}
          {tab === "contents" && <>
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-[#10294f]"><List className="size-6 text-blue-700"/> Daftar Isi</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">Daftar isi belum tersedia. Informasi ini dapat ditambahkan pada pengembangan CMS berikutnya.</p>
          </>}
          {tab === "author" && <>
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-[#10294f]"><UserRound className="size-6 text-blue-700"/> Tentang Penulis</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">{book.author}</p>
          </>}
          {tab === "details" && <>
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-[#10294f]"><Clipboard className="size-6 text-blue-700"/> Detail Buku</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">Informasi bibliografi buku ditampilkan pada panel di sisi kanan halaman.</p>
          </>}
        </section>
      </div>

      <aside className="space-y-4">
        <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-3 border-b border-blue-100 pb-3 font-display text-lg font-bold text-[#10294f]"><BookOpen className="size-5 text-blue-800"/> Informasi Bibliografi</h2>
          <dl className="mt-2 divide-y divide-slate-100 text-sm">
            <div className="grid grid-cols-[105px_12px_1fr] gap-2 py-2"><dt className="font-semibold text-slate-700">Kategori</dt><span>:</span><dd>{book.category || "—"}</dd></div>
            <div className="grid grid-cols-[105px_12px_1fr] gap-2 py-2"><dt className="font-semibold text-slate-700">Penerbit</dt><span>:</span><dd>PT Griya Pustaka Mandiri</dd></div>
            <div className="grid grid-cols-[105px_12px_1fr] gap-2 py-2"><dt className="font-semibold text-slate-700">Tahun Terbit</dt><span>:</span><dd>Belum tersedia</dd></div>
            <div className="grid grid-cols-[105px_12px_1fr] gap-2 py-2"><dt className="font-semibold text-slate-700">ISBN</dt><span>:</span><dd>{book.isbn || "Belum tersedia"}</dd></div>
            <div className="grid grid-cols-[105px_12px_1fr] gap-2 py-2"><dt className="font-semibold text-slate-700">QRCBN</dt><span>:</span><dd>{book.qrcbn || "Belum tersedia"}</dd></div>
            <div className="grid grid-cols-[105px_12px_1fr] gap-2 py-2"><dt className="font-semibold text-slate-700">Jumlah Halaman</dt><span>:</span><dd>Belum tersedia</dd></div>
            <div className="grid grid-cols-[105px_12px_1fr] gap-2 py-2"><dt className="font-semibold text-slate-700">Ukuran</dt><span>:</span><dd>Belum tersedia</dd></div>
            <div className="grid grid-cols-[105px_12px_1fr] gap-2 py-2"><dt className="font-semibold text-slate-700">Format</dt><span>:</span><dd>Belum tersedia</dd></div>
            <div className="grid grid-cols-[105px_12px_1fr] gap-2 py-2"><dt className="font-semibold text-slate-700">Bahasa</dt><span>:</span><dd>Indonesia</dd></div>
          </dl>
          {book.qrcbn && <div className="mt-4 rounded-xl bg-slate-50 p-4"><p className="font-bold text-[#10294f]">QRCBN</p><p className="mt-1 break-all text-xs text-slate-600">{book.qrcbn}</p><p className="mt-2 text-xs text-slate-500">Gunakan kode QRCBN resmi untuk verifikasi data buku.</p></div>}
        </section>

        <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display font-bold text-[#10294f]"><Clipboard className="size-5 text-blue-800"/> Sitasi (APA 7th)</h2>
            <button type="button" onClick={() => copyText(citation)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-[#10294f] hover:bg-blue-50">{copied ? <Check className="size-4"/> : <Clipboard className="size-4"/>} Salin</button>
          </div>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-6 text-slate-700">{citation}</p>
        </section>
      </aside>
    </section>
  </main>;
}
