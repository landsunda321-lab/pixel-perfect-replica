import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpenText, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { site } from "@/data/site";

const NAV_ITEMS = [
  { label: "Beranda", to: "/" },
  { label: "Tentang", to: "/tentang-penerbit" },
  { label: "Katalog Buku", to: "/katalog-buku" },
  { label: "Penulis", to: "/penulis" },
  { label: "Jurnal", to: "/jurnal" },
  { label: "Layanan", to: "/layanan-penerbitan" },
  { label: "Kontak", to: "/kontak" },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="shell flex min-h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" aria-label={`${site.brandName} — ke beranda`}>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-card">
            <BookOpenText className="size-5" aria-hidden="true" />
          </span>
          <span className="font-display text-sm font-bold tracking-wide text-primary sm:text-base">{site.brandName}</span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-0.5 xl:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className={`rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${isActive(item.to) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden xl:block">
          <Link to="/ajukan-naskah" className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            Ajukan Naskah
          </Link>
        </div>

        <button type="button" className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring xl:hidden" aria-expanded={menuOpen} aria-controls="mobile-nav" aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"} onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Navigasi utama" className="border-t border-border bg-background xl:hidden">
          <ul className="shell flex flex-col gap-1 py-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${isActive(item.to) ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent/60"}`}>{item.label}</Link>
              </li>
            ))}
            <li className="pt-2">
              <Link to="/ajukan-naskah" className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Ajukan Naskah</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
