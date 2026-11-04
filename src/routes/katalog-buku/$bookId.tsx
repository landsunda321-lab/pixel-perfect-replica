import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, CalendarDays, Check, Clipboard, Download, FileText, Share2, UserRound, BookMarked } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { site } from "@/data/site";

type CmsBook = {
  id: string; title: string; author: string; category: string; synopsis?: string; abstract?: string;
  keywords?: string; kata_pengantar?: string; latar_belakang?: string; glosarium?: string; daftar_pustaka?: string; cover_url?: string; isbn?: string; qrcbn?: string;
  publication_status: string; publisher?: string; publication_year?: number | null;
  publication_date?: string | null; publication_city?: string | null; edition?: string; page_count?: number | null;
  book_size?: string; book_format?: string; language?: string; pdf_url?: string;
  allow_pdf_download?: boolean; print_available?: boolean; print_price?: number | null;
  digital_available?: boolean; digital_access_type?: "paid" | "free" | "none"; digital_price?: number | null;
  open_access?: boolean; order_url?: string | null; digital_access_url?: string | null;
};
type Tab = "abstract" | "foreword" | "background" | "glossary" | "references";
const STATUS: Record<string, string> = {
  persiapan: "Dalam Persiapan", proses_isbn: "Proses ISBN", isbn_terbit: "ISBN Terbit",
  proses_cetak: "Proses Cetak", terbit: "Telah Terbit", arsip: "Arsip",
};
const dateLabel = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

export const Route = createFileRoute("/katalog-buku/$bookId")({
  head: () => ({ meta: [
    { title: "Detail Buku — Griya Pustaka Mandiri" },
    { name: "description", content: "Informasi bibliografi, abstrak, dan detail terbitan Griya Pustaka Mandiri." },
  ] }),
  component: BookDetailPage,
});

function BookDetailPage() {
  const { bookId } = Route.useParams();
  const [book, setBook] = useState<CmsBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("abstract");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setNotFound(false);
    setBook(null);
    fetch("/api/cms?action=public-book&id=" + encodeURIComponent(bookId))
      .then(async (response) => {
        const data = await response.json().catch(() => ({})) as { item?: CmsBook; error?: string };
        if (response.status === 404) {
          if (active) setNotFound(true);
          return null;
        }
        if (!response.ok || !data.item) throw new Error(data.error || "Buku tidak dapat dimuat.");
        return data.item;
      })
      .then((item) => { if (active && item) setBook(item); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Buku tidak dapat dimuat."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [bookId]);

  const citation = useMemo(() => book
    ? book.author + ". (" + (book.publication_year || "t.t.") + "). " + book.title + ". " + (book.publisher || "Griya Pustaka Mandiri") + "."
    : "", [book]);

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Tidak dapat menyalin teks. Silakan salin secara manual.");
    }
  }

  async function shareBook() {
    if (!book) return;
    try {
      if (navigator.share) await navigator.share({ title: book.title, text: "Informasi buku dari Griya Pustaka Mandiri", url: window.location.href });
      else await copyText(window.location.href);
    } catch { /* Share dialog dismissed. */ }
  }

  if (loading) return <div className="shell flex min-h-[55vh] items-center justify-center text-sm text-muted-foreground">Memuat detail buku...</div>;

  if (notFound) return (
    <section className="shell flex min-h-[60vh] items-center justify-center py-20">
      <div className="max-w-lg text-center">
        <p className="font-display text-7xl font-extrabold text-[#10294f]">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-[#10294f]">Buku tidak ditemukan</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Buku dengan ID <span className="break-all font-medium text-slate-800">{bookId}</span> tidak
          tersedia di katalog kami atau belum dipublikasikan.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/katalog-buku" className="inline-flex items-center gap-2 rounded-lg bg-[#123d78] px-5 py-3 text-sm font-bold text-white hover:bg-[#0d2c59]"><ArrowLeft className="size-4" /> Kembali ke Katalog</Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-5 py-3 text-sm font-bold text-[#10294f] hover:bg-blue-50">Ke Beranda</Link>
        </div>
      </div>
    </section>
  );

  if (!book || error) return (
    <section className="shell flex min-h-[55vh] flex-col items-start justify-center py-16">
      <div role="alert" className="w-full rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">{error || "Buku tidak dapat dimuat. Silakan coba beberapa saat lagi."}</div>
      <Link to="/katalog-buku" className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-800"><ArrowLeft className="size-4" /> Kembali ke katalog</Link>
    </section>
  );

  const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
    { id: "abstract", label: "Abstrak", icon: FileText },
    { id: "foreword", label: "Kata Pengantar", icon: BookMarked },
    { id: "background", label: "Sinopsis", icon: BookOpen },
    { id: "glossary", label: "Glosarium", icon: Clipboard },
    { id: "references", label: "Daftar Pustaka", icon: BookMarked },
  ];
  const rows: [string, string | number | null | undefined][] = [
    ["Judul Buku", book.title],
    ["Penulis", book.author],
    ["Kategori", book.category],
    ["Penerbit", book.publisher || "Griya Pustaka Mandiri"],
    ["Kota Terbit / Cetak", book.publication_city || "Belum diisi"],
    ["Tahun Terbit", book.publication_year || "Belum diisi"],
    ["Tanggal Terbit", dateLabel(book.publication_date) || "Belum diisi"],
    ["Edisi / Cetakan", book.edition || "Belum diisi"],
    ["ISBN", book.isbn || "Belum tersedia"],
    ["QRCBN", book.qrcbn || "Belum tersedia"],
    ["Jumlah Halaman", book.page_count ? book.page_count + " halaman" : "Belum diisi"],
    ["Ukuran Buku", book.book_size || "Belum diisi"],
    ["Format Buku", book.book_format || "Belum diisi"],
    ["Bahasa", book.language || "Belum diisi"],
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-blue-100 bg-gradient-to-r from-slate-50 to-blue-50/80">
        <nav aria-label="Breadcrumb" className="shell flex flex-wrap items-center gap-2 py-3 text-sm text-slate-600">
          <Link to="/" className="hover:text-blue-800">Beranda</Link><span>/</span>
          <Link to="/katalog-buku" className="hover:text-blue-800">Katalog Buku</Link><span>/</span>
          <span className="font-medium text-slate-900">{book.title}</span>
        </nav>
      </div>

      <section className="shell grid items-start gap-7 py-7 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-9 lg:py-9">
        <div className="min-w-0">
          <div className="grid items-center gap-7 md:grid-cols-[minmax(220px,310px)_minmax(0,1fr)]">
            <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 p-4">
              {book.cover_url
                ? <img src={book.cover_url} alt={"Sampul buku " + book.title} className="max-h-[440px] w-full object-contain drop-shadow-xl" />
                : <div className="flex aspect-[3/4] w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-[#10294f] to-[#1760a6] p-6 text-center text-white"><BookOpen className="size-12 text-sky-200" /><p className="mt-5 font-display text-xl font-bold">{book.title}</p><p className="mt-3 text-sm text-sky-100">{book.author}</p></div>}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-900"><BookOpen className="size-4" /> Buku</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-900">{STATUS[book.publication_status] || book.publication_status}</span>
              </div>
              <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight text-[#10294f] sm:text-4xl">{book.title}</h1>
              {book.publication_date && <p className="mt-5 flex items-center gap-2 text-base text-slate-700"><CalendarDays className="size-5 text-blue-800" /> {dateLabel(book.publication_date)}</p>}
              <p className="mt-4 flex items-start gap-2 text-base leading-7 text-slate-700"><UserRound className="mt-1 size-5 shrink-0 text-blue-800" /> {book.author}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {book.pdf_url && book.allow_pdf_download ? <a href={book.pdf_url} target="_blank" rel="noreferrer" download className="inline-flex items-center gap-2 rounded-lg bg-[#123d78] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#0d2c59]"><Download className="size-5" /> Unduh PDF</a> : <span aria-disabled="true" title={!book.pdf_url ? "File PDF belum diunggah melalui CMS" : "Unduhan PDF belum diaktifkan melalui CMS"} className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-bold text-slate-400"><Download className="size-5" /> Unduh PDF</span>}
                <button type="button" onClick={() => copyText(citation)} className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-5 py-3 text-sm font-bold text-[#10294f] hover:bg-blue-50"><span className="text-lg">❝</span> {copied ? "Tersalin" : "Cite This"}</button>
                <button type="button" onClick={shareBook} className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-5 py-3 text-sm font-bold text-[#10294f] hover:bg-blue-50"><Share2 className="size-5" /> Share</button>
              </div>
            </div>
          </div>

          <div className="mt-9 border-b border-blue-200">
            <div className="flex gap-3 overflow-x-auto">
              {tabs.map((item) => {
                const Icon = item.icon;
                return <button key={item.id} type="button" onClick={() => setTab(item.id)} className={"inline-flex shrink-0 items-center gap-2 border-b-[3px] px-4 py-4 text-sm font-semibold transition-colors " + (tab === item.id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-700 hover:text-blue-700")}><Icon className="size-5" />{item.label}</button>;
              })}
            </div>
          </div>

          <section className="min-h-[280px] py-7">
            {tab === "abstract" && <><h2 className="flex items-center gap-3 font-display text-2xl font-bold text-[#10294f]"><FileText className="size-7 text-blue-700" /> Abstrak</h2><div className="mt-4 whitespace-pre-line text-base leading-7 text-slate-800">{book.abstract || book.synopsis || "Abstrak belum ditambahkan."}</div>{book.keywords && <p className="mt-5 text-sm text-slate-700"><strong>Kata kunci:</strong> {book.keywords}</p>}</>}
            {tab === "foreword" && <><h2 className="flex items-center gap-3 font-display text-2xl font-bold text-[#10294f]"><BookMarked className="size-7 text-blue-700" /> Kata Pengantar</h2><div className="mt-4 whitespace-pre-line text-base leading-7 text-slate-800">{book.kata_pengantar || "Kata pengantar belum ditambahkan."}</div></>}
            {tab === "background" && <><h2 className="flex items-center gap-3 font-display text-2xl font-bold text-[#10294f]"><BookOpen className="size-7 text-blue-700" /> Sinopsis</h2><div className="mt-4 whitespace-pre-line text-base leading-7 text-slate-800">{book.synopsis || "Sinopsis belum ditambahkan."}</div></>}
            {tab === "glossary" && <><h2 className="flex items-center gap-3 font-display text-2xl font-bold text-[#10294f]"><Clipboard className="size-7 text-blue-700" /> Glosarium</h2><div className="mt-4 whitespace-pre-line text-base leading-7 text-slate-800">{book.glosarium || "Glosarium belum ditambahkan."}</div></>}
            {tab === "references" && <><h2 className="flex items-center gap-3 font-display text-2xl font-bold text-[#10294f]"><BookMarked className="size-7 text-blue-700" /> Daftar Pustaka</h2><div className="mt-4 whitespace-pre-line text-base leading-7 text-slate-800">{book.daftar_pustaka || "Daftar pustaka belum ditambahkan."}</div></>}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-3 border-b border-blue-100 pb-4 font-display text-xl font-bold text-[#10294f]"><BookOpen className="size-6 text-blue-800" /> Informasi Bibliografi</h2>
            <dl className="mt-2 divide-y divide-slate-100 text-sm">
              {rows.filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "").map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(90px,115px)_10px_minmax(0,1fr)] gap-2 py-2.5"><dt className="font-semibold text-slate-800">{label}</dt><span>:</span><dd className="break-words text-slate-800">{value}</dd></div>)}
            </dl>
            {book.qrcbn && <div className="mt-4 rounded-xl bg-slate-100 p-4"><p className="font-display font-bold text-[#10294f]">Identitas QRCBN</p><p className="mt-1 break-all text-sm text-slate-700">{book.qrcbn}</p><p className="mt-2 text-xs text-slate-500">Gunakan kode ini untuk penelusuran identitas buku.</p></div>}
          </section>

          <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-bold text-[#10294f]">Ketersediaan dan Cara Memperoleh</h2>
            <div className="mt-4 space-y-4 text-sm">
              {book.print_available && <div><p className="font-semibold text-slate-900">Buku cetak</p><p className="mt-1 text-slate-600">{book.print_price != null ? "Harga: Rp " + Number(book.print_price).toLocaleString("id-ID") : "Harga dan ketersediaan dikonfirmasi saat pemesanan."}</p>{book.order_url ? <a href={book.order_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-lg bg-[#123d78] px-4 py-2.5 font-bold text-white">Pesan buku cetak</a> : <a href={site.contact.phone ? "https://wa.me/62" + site.contact.phone.replace(/^0/,"").replace(/\\D/g,"") + "?text=" + encodeURIComponent("Halo Griya Pustaka Mandiri, saya ingin memesan buku: " + book.title) : "mailto:" + site.contact.email} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-lg bg-[#123d78] px-4 py-2.5 font-bold text-white">Hubungi penerbit untuk memesan</a>}</div>}
              {book.digital_available && book.digital_access_type === "paid" && <div><p className="font-semibold text-slate-900">Buku digital berbayar</p><p className="mt-1 text-slate-600">{book.digital_price != null ? "Harga: Rp " + Number(book.digital_price).toLocaleString("id-ID") : "Harga dikonfirmasi melalui penerbit."}</p>{book.digital_access_url ? <a href={book.digital_access_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-lg border border-blue-200 px-4 py-2.5 font-bold text-[#123d78]">Akses pembelian digital</a> : <a href={site.contact.phone ? "https://wa.me/62" + site.contact.phone.replace(/^0/,"").replace(/\\D/g,"") + "?text=" + encodeURIComponent("Halo Griya Pustaka Mandiri, saya ingin memperoleh versi digital buku: " + book.title) : "mailto:" + site.contact.email} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-lg border border-blue-200 px-4 py-2.5 font-bold text-[#123d78]">Tanyakan akses digital</a>}</div>}
              {book.digital_available && book.digital_access_type === "free" && <div><p className="font-semibold text-slate-900">Buku digital gratis</p>{book.digital_access_url ? <a href={book.digital_access_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-lg border border-blue-200 px-4 py-2.5 font-bold text-[#123d78]">Baca / akses buku digital</a> : book.pdf_url && book.allow_pdf_download ? <a href={book.pdf_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-lg border border-blue-200 px-4 py-2.5 font-bold text-[#123d78]">Baca / unduh PDF</a> : <p className="mt-1 text-slate-600">Tautan akses belum tersedia. Silakan hubungi penerbit.</p>}</div>}
              {book.open_access && book.pdf_url && book.allow_pdf_download && <div className="rounded-xl bg-emerald-50 p-3"><p className="font-semibold text-emerald-900">Open Access — naskah lengkap</p><p className="mt-1 text-emerald-800">Buku ini dapat diakses publik tanpa biaya.</p><a href={book.pdf_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-lg bg-emerald-700 px-4 py-2.5 font-bold text-white"><Download className="mr-2 size-4"/>Unduh PDF lengkap</a></div>}
              {!book.print_available && !book.digital_available && !book.open_access && <p className="text-slate-600">Informasi distribusi belum dikonfirmasi untuk judul ini. Hubungi penerbit untuk menanyakan ketersediaan.</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 font-display text-lg font-bold text-[#10294f]"><Clipboard className="size-5 text-blue-800" /> Sitasi (APA 7th)</h2><button type="button" onClick={() => copyText(citation)} className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-[#10294f] hover:bg-blue-50">{copied ? <Check className="size-4" /> : <Clipboard className="size-4" />} Salin</button></div>
            <p className="mt-3 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-800">{citation}</p>
          </section>
        </aside>
      </section>
    </div>
  );
}
