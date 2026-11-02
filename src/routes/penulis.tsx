import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GraduationCap, UserRound } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { canonicalLinks } from "@/data/site";

export const Route = createFileRoute("/penulis")({
  head: () => ({
    meta: [
      { title: "Penulis — Griya Pustaka Mandiri" },
      { name: "description", content: "Kenali profil penulis dan kontributor Griya Pustaka Mandiri." },
    ],
    links: canonicalLinks("/penulis"),
  }),
  component: AuthorsPage,
});

// DATA DUMMY: seluruh nama, gelar, bidang, dan biografi di bawah ini hanya
// contoh visual. Ganti/hapus sebelum situs dipublikasikan sebagai data faktual.
const SAMPLE_AUTHORS = [
  {
    name: "Nadia Pratama",
    initials: "NP",
    role: "Penulis & Akademisi",
    focus: "Pendidikan dan Literasi",
    bio: "Contoh profil penulis dengan minat pada pengembangan pendidikan, budaya literasi, dan pembelajaran sepanjang hayat.",
    works: "Buku pendidikan · Referensi",
    tone: "from-sky-100 to-blue-200",
  },
  {
    name: "Raka Wicaksana",
    initials: "RW",
    role: "Penulis & Praktisi",
    focus: "Pekerjaan Sosial",
    bio: "Contoh profil praktisi yang mengangkat praktik pekerjaan sosial, pendampingan, dan penguatan keberfungsian sosial.",
    works: "Pekerjaan sosial · Praktik",
    tone: "from-indigo-100 to-sky-200",
  },
  {
    name: "Alya Maheswari",
    initials: "AM",
    role: "Penulis & Peneliti",
    focus: "Pemberdayaan Masyarakat",
    bio: "Contoh profil peneliti dengan perhatian pada pembangunan komunitas, partisipasi warga, dan pemberdayaan lokal.",
    works: "Pemberdayaan · Pembangunan",
    tone: "from-cyan-100 to-teal-200",
  },
  {
    name: "Dimas Adinugraha",
    initials: "DA",
    role: "Penulis & Konsultan",
    focus: "Kebijakan Publik",
    bio: "Contoh profil penulis yang membahas analisis kebijakan, tata kelola, dan inovasi pelayanan publik.",
    works: "Kebijakan · Administrasi publik",
    tone: "from-blue-100 to-indigo-200",
  },
  {
    name: "Sinta Puspitasari",
    initials: "SP",
    role: "Penulis & Editor",
    focus: "Komunikasi dan Sosial",
    bio: "Contoh profil editor dengan minat pada komunikasi sosial, penulisan populer, dan penyebarluasan pengetahuan.",
    works: "Komunikasi · Ilmu sosial",
    tone: "from-violet-100 to-blue-200",
  },
  {
    name: "Bima Santoso",
    initials: "BS",
    role: "Penulis & Fasilitator",
    focus: "Pengembangan Masyarakat",
    bio: "Contoh profil fasilitator yang menaruh perhatian pada pengorganisasian masyarakat dan pengembangan kapasitas komunitas.",
    works: "Komunitas · Pengembangan kapasitas",
    tone: "from-sky-100 to-cyan-200",
  },
];

function AuthorsPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-mist">
        <div className="shell relative py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-azure">Kolaborasi Pengetahuan</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-primary sm:text-5xl">Penulis</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Berkenalan dengan para pemikir, akademisi, dan praktisi yang menghadirkan gagasan melalui karya tulis.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2"><UserRound className="size-4 text-azure" aria-hidden="true" /> 6 profil contoh</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2"><BookOpen className="size-4 text-azure" aria-hidden="true" /> Beragam bidang keilmuan</span>
          </div>
        </div>
      </section>

      <section className="shell py-12 lg:py-16">
        <div role="note" className="mb-10 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100"><GraduationCap className="size-4" aria-hidden="true" /></span>
          <div>
            <p className="text-sm font-bold">Tampilan demonstrasi — seluruh profil adalah data dummy</p>
            <p className="mt-1 text-sm leading-relaxed text-amber-900">Nama, peran, bidang, dan biografi pada halaman ini dibuat sebagai contoh desain, bukan identitas penulis atau kontributor sebenarnya. Data ini harus diganti atau dihapus sebelum publikasi final.</p>
          </div>
        </div>

        <SectionHeading
          eyebrow="Direktori Penulis"
          title="Gagasan besar lahir dari beragam perspektif"
          description="Contoh tata letak direktori untuk menampilkan profil, bidang kepakaran, dan jenis karya para penulis."
        />

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_AUTHORS.map((author, index) => (
            <article key={author.initials} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft">
              <div className="flex items-start justify-between border-b border-border bg-mist/70 px-5 py-4">
                <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">Dummy · {String(index + 1).padStart(2, "0")}</span>
                <span className="text-xs font-medium text-muted-foreground">Profil contoh</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className={`flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br ${author.tone} font-display text-2xl font-bold text-primary shadow-sm ring-4 ring-white`}>
                  {author.initials}
                </div>
                <h2 className="mt-5 font-display text-xl font-bold text-primary">{author.name}</h2>
                <p className="mt-1 text-sm font-medium text-azure">{author.role}</p>
                <div className="mt-4 inline-flex w-fit rounded-full bg-accent/70 px-3 py-1.5 text-xs font-semibold text-accent-foreground">{author.focus}</div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{author.bio}</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Contoh bidang karya</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{author.works}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-navy p-8 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky">Berkolaborasi dengan Kami</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Punya gagasan untuk diterbitkan?</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-sky/85">Kami membuka ruang diskusi bagi penulis, akademisi, dan praktisi yang ingin mengembangkan karya tulis.</p>
          </div>
          <Link to="/ajukan-naskah" className="mt-6 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-sky sm:mt-0">Ajukan Naskah <ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
