import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { site } from "@/data/site";

const MAIN_LINKS = [
  { label: "Beranda", to: "/" },
  { label: "Tentang Penerbit", to: "/tentang-penerbit" },
  { label: "Katalog Buku", to: "/katalog-buku" },
  { label: "Akses dan Distribusi Buku", to: "/akses-distribusi" },
  { label: "Kontak Penerbit", to: "/kontak" },
] as const;

const POLICY_LINKS = [
  { label: "Kebijakan Privasi", to: "/kebijakan-privasi" },
  { label: "Kebijakan Hak Cipta", to: "/kebijakan-hak-cipta" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  const { address, email, phone } = site.contact;

  return (
    <footer className="bg-navy-deep text-sky/90">
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <p className="font-display text-lg font-bold tracking-wide text-white">{site.brandName}</p>
          <p className="text-sm italic text-sky/80">“{site.tagline}”</p>
          <p className="text-sm leading-relaxed text-sky/70">{site.shortSummary}</p>
        </div>

        <nav aria-label="Tautan situs">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            Navigasi
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {MAIN_LINKS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sky/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            Kontak Resmi
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-sky/80">
            {address ? (
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{address}</span>
              </li>
            ) : null}
            {email ? (
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {email}
                </a>
              </li>
            ) : null}
            {phone ? (
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{phone}</span>
              </li>
            ) : null}
            {!address && !email && !phone ? (
              <li className="text-sky/70">
                Data kontak resmi akan ditampilkan setelah dikonfirmasi dari dokumen legalitas
                perusahaan.
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
            Badan Usaha
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-sky/80">
            <li>{site.legalName}</li>
            <li>{site.entityForm}</li>
            <li>{site.businessField}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sky/15">
        <div className="shell flex flex-col gap-3 py-5 text-xs text-sky/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {POLICY_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sky/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
