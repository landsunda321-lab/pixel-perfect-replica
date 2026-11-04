import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

const NAV_ITEMS = [
  { label: "Beranda", to: "/" },
  { label: "Tentang", to: "/tentang-penerbit" },
  { label: "Katalog", to: "/katalog-buku" },
  { label: "Penulis", to: "/penulis" },
  { label: "Jurnal", to: "/jurnal" },
  { label: "Layanan", to: "/layanan-penerbitan" },
  { label: "Kontak", to: "/kontak" },
  { label: "Login", to: "/login" },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setMenuOpen(false), [pathname]);
  const isActive = (to: string) => to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 shadow-[0_4px_24px_-20px_rgba(15,35,70,.3)] backdrop-blur-xl">
      <div className="shell flex min-h-[76px] items-center justify-between gap-5">
        <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label={`${site.brandName} — beranda`}>
          <img
            src="/gpm-mark.png"
            alt=""
            className="size-12 shrink-0 rounded-full object-contain sm:size-[52px]"
            width="52"
            height="52"
            fetchPriority="high"
          />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="text-[15px] font-extrabold tracking-tight text-[#12376b] sm:text-base">Griya Pustaka</span>
            <span className="text-[15px] font-extrabold tracking-tight text-[#087fc4] sm:text-base">Mandiri</span>
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className={`rounded-full px-3 py-2.5 text-[13px] font-semibold transition-all ${isActive(item.to) ? "bg-blue-50 text-blue-900" : "text-slate-600 hover:bg-slate-50 hover:text-blue-900"}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link to="/ajukan-naskah" className="hidden items-center gap-2 rounded-full bg-[#17396c] px-5 py-3 text-[13px] font-bold text-white shadow-lg shadow-blue-950/15 transition-all hover:-translate-y-0.5 hover:bg-[#0d274f] lg:inline-flex">
          Ajukan Naskah <ArrowUpRight className="size-4" />
        </Link>
        <button type="button" className="inline-flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 lg:hidden" aria-expanded={menuOpen} aria-controls="mobile-nav" aria-label={menuOpen ? "Tutup menu" : "Buka menu"} onClick={() => setMenuOpen(v => !v)}>
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {menuOpen && <nav id="mobile-nav" aria-label="Navigasi utama" className="border-t border-slate-200 bg-white lg:hidden">
        <ul className="shell grid gap-1 py-4">
          {NAV_ITEMS.map(item => <li key={item.to}><Link to={item.to} className={`block rounded-xl px-4 py-3 text-sm font-semibold ${isActive(item.to) ? "bg-blue-50 text-blue-900" : "text-slate-700 hover:bg-slate-50"}`}>{item.label}</Link></li>)}
          <li className="pt-2"><Link to="/ajukan-naskah" className="flex items-center justify-center gap-2 rounded-full bg-[#17396c] px-5 py-3.5 text-sm font-bold text-white">Ajukan Naskah <ArrowUpRight className="size-4" /></Link></li>
        </ul>
      </nav>}
    </header>
  );
}
