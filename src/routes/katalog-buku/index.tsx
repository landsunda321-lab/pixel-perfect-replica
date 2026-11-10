import { createFileRoute, Link } from "@tanstack/react-router";
import { Library, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { canonicalLinks } from "@/data/site";

export const Route = createFileRoute("/katalog-buku/")({
  validateSearch: (search: Record<string, unknown>): { bookId?: string } => ({
    bookId: typeof search.bookId === "string" ? search.bookId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Katalog Buku — Griya Pustaka Mandiri" },
      { name: "description", content: "Katalog publikasi Griya Pustaka Mandiri." },
    ],
    links: canonicalLinks("/katalog-buku"),
  }),
  component: CatalogPage,
});

type CmsBook = {
  id: string; title: string; subtitle?: string; author: string; category: string;
  synopsis?: string; cover_url?: string; isbn?: string; publication_status: string; is_demo: boolean;
};
const CONTROL = "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm";
type PublicationGroup = "terbit" | "persiapan" | "isbn";
const PUBLICATION_GROUPS: { id: PublicationGroup; label: string; description: string }[] = [
  { id: "persiapan", label: "Buku dalam Persiapan", description: "Naskah dan buku yang masih dalam tahap persiapan penerbitan." },
  { id: "isbn", label: "Buku dalam Proses ISBN", description: "Buku yang sedang menjalani proses pengajuan atau penerbitan ISBN." },
  { id: "terbit", label: "Buku Terbit", description: "Buku yang telah resmi diterbitkan." },
];
function getPublicationGroup(status: string): PublicationGroup {
  if (status === "terbit") return "terbit";
  if (status === "proses_isbn" || status === "isbn_terbit") return "isbn";
  return "persiapan";
}
function CatalogPage() {
  const { bookId } = Route.useSearch();
  const [books, setBooks] = useState<CmsBook[]>([]);
  const [highlightedBookId, setHighlightedBookId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("semua");
  const [publicationGroup, setPublicationGroup] = useState<PublicationGroup>("terbit");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/cms?action=public-books")
      .then(async r => { if (!r.ok) throw new Error("Gagal memuat katalog"); return r.json(); })
      .then(d => { if (active) setBooks(Array.isArray(d.items) ? d.items : []); })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const categories = useMemo(() => [...new Set(books.map(b => b.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"id")), [books]);
  const groupCounts = useMemo(() => ({
    terbit: books.filter(b => getPublicationGroup(b.publication_status) === "terbit").length,
    persiapan: books.filter(b => getPublicationGroup(b.publication_status) === "persiapan").length,
    isbn: books.filter(b => getPublicationGroup(b.publication_status) === "isbn").length,
  }), [books]);
  const filtered = useMemo(() => books.filter(b =>
    getPublicationGroup(b.publication_status) === publicationGroup &&
    (category === "semua" || b.category === category) &&
    (!query.trim() || [b.title,b.author,b.subtitle||""].some(v=>v.toLowerCase().includes(query.trim().toLowerCase())))
  ), [books,category,query,publicationGroup]);
  useEffect(() => {
    if (!bookId || loading || !books.some((book) => book.id === bookId)) return;
    setCategory("semua");
    setPublicationGroup(getPublicationGroup(books.find((book) => book.id === bookId)?.publication_status || "terbit"));
    setQuery("");
    setHighlightedBookId(bookId);
  }, [bookId, books, loading]);
  useEffect(() => {
    if (!highlightedBookId || !filtered.some((book) => book.id === highlightedBookId)) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(`catalog-book-${highlightedBookId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => cancelAnimationFrame(frame);
  }, [highlightedBookId, filtered]);
  return <div className="flex flex-col">
    <section className="relative overflow-hidden bg-[#0c1e3a] text-white">
      <div className="shell relative py-16 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-sky-200">Katalog Penerbit</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">Katalog Buku</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">Publikasi dan karya yang dikelola oleh Griya Pustaka Mandiri.</p>
      </div>
    </section>
    <section className="shell py-10 lg:py-14">
      <div className="grid gap-3 md:grid-cols-3" role="tablist" aria-label="Kategori status penerbitan">
        {PUBLICATION_GROUPS.map(group => (
          <button key={group.id} type="button" role="tab" aria-selected={publicationGroup === group.id}
            onClick={() => setPublicationGroup(group.id)}
            className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${publicationGroup === group.id ? "border-blue-700 bg-blue-50 shadow-sm" : "border-border bg-card hover:border-blue-300 hover:bg-slate-50"}`}>
            <span className={`block text-sm font-bold ${publicationGroup === group.id ? "text-blue-950" : "text-foreground"}`}>{group.label}</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">{group.description}</span>
            <span className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-bold text-blue-900">{groupCounts[group.id]} buku</span>
          </button>
        ))}
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-medium text-muted-foreground">Cari judul, subjudul, atau penulis
          <span className="relative mt-1.5 block"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ketik kata kunci..." className={CONTROL+" pl-9"}/></span>
        </label>
        <label className="text-xs font-medium text-muted-foreground">Kategori
          <select value={category} onChange={e=>setCategory(e.target.value)} className={CONTROL+" mt-1.5"}><option value="semua">Semua kategori</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select>
        </label>
      </div>
      {loading ? <p className="py-16 text-center text-sm text-muted-foreground">Memuat katalog...</p> :
       failed ? <p role="alert" className="mt-8 rounded-xl bg-amber-50 p-5 text-sm text-amber-900">Katalog belum dapat dimuat. Silakan coba beberapa saat lagi.</p> :
       <><div className="mt-7 flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-display text-xl font-bold text-primary">{PUBLICATION_GROUPS.find(g => g.id === publicationGroup)?.label}</h2><p className="mt-1 text-sm text-muted-foreground">{PUBLICATION_GROUPS.find(g => g.id === publicationGroup)?.description}</p></div><p className="text-sm text-muted-foreground">Menampilkan {filtered.length} dari {groupCounts[publicationGroup]} buku.</p></div>
       {filtered.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{filtered.map(book=><Link key={book.id} id={`catalog-book-${book.id}`} to="/katalog-buku/$bookId" params={{bookId:book.id}} aria-label={"Lihat detail "+book.title} className={`group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${highlightedBookId === book.id ? "border-blue-500 ring-4 ring-blue-200 shadow-xl" : "border-border"}`}>
         <div className="flex aspect-[3/2] items-center justify-center overflow-hidden bg-[#10294f]">{book.cover_url ? <img src={book.cover_url} alt={"Sampul "+book.title} className="h-full w-full object-contain bg-gradient-to-br from-slate-100 to-blue-100 p-3 transition duration-300 group-hover:scale-[1.03]" loading="lazy" width={1536} height={1024}/> : <div className="px-6 text-center"><Library className="mx-auto mb-4 size-8 text-sky-200"/><p className="font-display text-lg font-semibold text-white">{book.title}</p><p className="mt-3 text-xs text-sky-200">{book.author}</p></div>}</div>
         <div className="flex flex-1 flex-col gap-3 p-5"><h2 className="line-clamp-3 min-h-[4.5rem] font-display text-lg font-bold leading-snug text-primary group-hover:text-blue-700">{book.title}</h2><p className="line-clamp-2 text-sm text-muted-foreground">Oleh: {book.author}</p><div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3"><span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-900">Status: {book.publication_status.replaceAll("_"," ")}</span><span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-blue-800">Lihat detail <span aria-hidden="true">→</span></span></div></div></Link>)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-border bg-mist px-6 py-14 text-center"><Library className="mx-auto size-8 text-muted-foreground"/><p className="mt-3 text-sm text-muted-foreground">Belum ada buku pada kategori ini yang ditampilkan. Buku akan muncul sesuai status penerbitannya di CMS.</p></div>}</>}
    </section>
  </div>;
}
