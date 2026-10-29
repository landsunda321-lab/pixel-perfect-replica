import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Copyright, FileText, PenLine, ShieldCheck } from "lucide-react";

import editorialDesk from "@/assets/editorial-desk.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { commitments, mission, profileParagraphs, publishingAreas, site, vision } from "@/data/site";

export const Route = createFileRoute("/tentang-penerbit")({
  head: () => ({
    meta: [
      { title: "Tentang Penerbit — Griya Pustaka Mandiri" },
      {
        name: "description",
        content:
          "Profil PT Griya Pustaka Mandiri: penerbit buku yang berfokus pada pengembangan dan penyebarluasan karya tulis akademik, ilmiah, pendidikan, dan praktis.",
      },
      { property: "og:title", content: "Tentang Griya Pustaka Mandiri" },
      {
        property: "og:description",
        content: "Penerbitan Buku dan Pengembangan Pengetahuan — profil, visi, misi, dan komitmen penerbit.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { address, email, phone } = site.contact;

  const identityRows: Array<{ label: string; value: string }> = [
    { label: "Nama Penerbit", value: site.brandName },
    { label: "Bentuk Badan Usaha", value: site.entityForm },
    { label: "Bidang Usaha", value: site.businessField },
    ...(address ? [{ label: "Alamat Resmi", value: address }] : []),
    ...(email ? [{ label: "Email Resmi", value: email }] : []),
    ...(phone ? [{ label: "Nomor Telepon Resmi", value: phone }] : []),
    { label: "Website Resmi", value: `${site.plannedDomain.replace("https://", "")} (domain yang direncanakan)` },
  ];

  const COMMITMENT_ICONS = [ShieldCheck, Copyright, FileText, PenLine, Building2];

  return (
    <div className="flex flex-col">
      {/* Bagian A — Hero */}
      <section className="bg-mist">
        <div className="shell py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-azure">Profil Penerbit</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">
            Tentang Griya Pustaka Mandiri
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Penerbitan Buku dan Pengembangan Pengetahuan
          </p>
        </div>
      </section>

      {/* Bagian B — Profil */}
      <section className="shell py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Profil" title="Penerbit yang Berfokus pada Karya Tulis" />
            <div className="mt-6 space-y-4">
              {profileParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-base leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <img
            src={editorialDesk}
            alt="Buku terbuka di atas meja kerja editorial yang bersih dan terang"
            className="w-full rounded-3xl object-cover shadow-soft"
            loading="lazy"
            width={1024}
            height={1024}
          />
        </div>
      </section>

      {/* Bagian C & D — Visi dan Misi */}
      <section className="bg-mist py-16 lg:py-20">
        <div className="shell grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl bg-navy p-8 text-white shadow-soft lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">Visi</p>
            <p className="mt-4 font-display text-xl leading-relaxed sm:text-2xl">{vision}</p>
          </div>
          <div>
            <SectionHeading eyebrow="Misi" title="Langkah yang Kami Kerjakan" />
            <ol className="mt-6 space-y-3">
              {mission.map((item, index) => (
                <li
                  key={item}
                  className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-card"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground">{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Bagian E — Bidang penerbitan */}
      <section className="shell py-16 lg:py-20">
        <SectionHeading
          eyebrow="Bidang Penerbitan"
          title="Fokus dan Ruang Lingkup"
          description="Bidang penerbitan meliputi buku akademik dan ilmiah; buku pendidikan dan referensi; pekerjaan sosial dan rehabilitasi sosial; pembangunan dan pemberdayaan masyarakat; kebijakan publik dan ilmu sosial; serta buku panduan praktis dan publikasi digital."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {publishingAreas.map((area) => (
            <div
              key={area.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <h3 className="font-display text-base font-semibold text-foreground">{area.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bagian F — Komitmen */}
      <section className="bg-mist py-16 lg:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Komitmen"
            title="Komitmen Penerbit"
            description="Komitmen kami terhadap keaslian karya, hak cipta, etika akademik, kualitas penyuntingan, dan informasi bibliografis yang akurat."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {commitments.map((item, index) => {
              const Icon = COMMITMENT_ICONS[index % COMMITMENT_ICONS.length];
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-card"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bagian G — Identitas perusahaan */}
      <section className="shell py-16 lg:py-20">
        <SectionHeading eyebrow="Identitas" title="Identitas Perusahaan" />
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <dl className="divide-y divide-border">
            {identityRows.map((row) => (
              <div
                key={row.label}
                className="grid gap-1 px-6 py-4 sm:grid-cols-[220px_1fr] sm:gap-4 sm:px-8"
              >
                <dt className="text-sm font-medium text-muted-foreground">{row.label}</dt>
                <dd className="text-sm font-medium text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {!address || !email || !phone ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Alamat, email, dan nomor telepon resmi akan ditampilkan setelah data tersebut
            dikonfirmasi dari dokumen legalitas perusahaan.
          </p>
        ) : null}
      </section>
    </div>
  );
}
