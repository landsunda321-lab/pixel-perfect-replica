import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpenText, Mail, MapPin, Phone } from "lucide-react";
import { businessFieldLabel, site } from "@/data/site";

const LINKS = [
  { label: "Tentang Penerbit", to: "/tentang-penerbit" },
  { label: "Katalog Buku", to: "/katalog-buku" },
  { label: "Direktori Penulis", to: "/penulis" },
  { label: "Informasi Jurnal", to: "/jurnal" },
  { label: "Layanan Penerbitan", to: "/layanan-penerbitan" },
  { label: "Ajukan Naskah", to: "/ajukan-naskah" },
  { label: "Kontak", to: "/kontak" },
];
export function Footer() {
  const year = new Date().getFullYear();
  const { address, email, phone } = site.contact;
  return (
    <footer className="relative overflow-hidden bg-[#0b1b35] text-white">
      <div className="pointer-events-none absolute -right-32 -top-40 size-[28rem] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="shell relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_.8fr_1.1fr] lg:py-20">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15"><BookOpenText className="size-6 text-sky-200" /></span>
            <div><p className="font-display text-sm font-extrabold tracking-[.13em]">GRIYA PUSTAKA MANDIRI</p><p className="mt-1 text-[10px] tracking-[.25em] text-slate-400">PUBLISHING HOUSE</p></div>
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">{site.shortSummary}</p>
          <p className="mt-5 text-sm font-medium italic text-sky-200">“{site.tagline}”</p>
        </div>
        <nav aria-label="Navigasi footer">
          <h2 className="text-xs font-bold uppercase tracking-[.2em] text-sky-200">Jelajahi</h2>
          <ul className="mt-5 space-y-3">{LINKS.map(item => <li key={item.to}><Link to={item.to} className="text-sm text-slate-300 transition-colors hover:text-white">{item.label}</Link></li>)}</ul>
        </nav>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[.2em] text-sky-200">Terhubung dengan Kami</h2>
          <ul className="mt-5 space-y-4 text-sm text-slate-300">
            {address && <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-sky-300" /><span className="leading-6">{address}</span></li>}
            {email && <li className="flex gap-3"><Mail className="size-4 shrink-0 text-sky-300" /><a href={`mailto:${email}`} className="hover:text-white">{email}</a></li>}
            {phone && <li className="flex gap-3"><Phone className="size-4 shrink-0 text-sky-300" /><a href={`https://wa.me/62${phone.replace(/^0/, "").replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-white">{phone} · WhatsApp</a></li>}
          </ul>
          <div className="mt-7"><Link to="/kontak" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10">Informasi Kontak <ArrowUpRight className="size-4" /></Link></div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.legalName}. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-5"><Link to="/kebijakan-privasi" className="hover:text-white">Kebijakan Privasi</Link><Link to="/kebijakan-hak-cipta" className="hover:text-white">Kebijakan Hak Cipta</Link></div>
          <p>{businessFieldLabel()}</p>
        </div>
      </div>
    </footer>
  );
}
