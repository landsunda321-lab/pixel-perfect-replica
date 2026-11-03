import { createFileRoute, Link } from "@tanstack/react-router";

import { canonicalLinks, site } from "@/data/site";

export const Route = createFileRoute("/kebijakan-hak-cipta")({
  head: () => ({
    meta: [
      { title: "Kebijakan Hak Cipta — Griya Pustaka Mandiri" },
      {
        name: "description",
        content:
          "Kebijakan hak cipta website penerbit PT Griya Pustaka Mandiri: perlindungan karya dan tata cara permohonan izin penggunaan.",
      },
      { property: "og:title", content: "Kebijakan Hak Cipta — Griya Pustaka Mandiri" },
      { property: "og:type", content: "website" },
    ],
    links: canonicalLinks("/kebijakan-hak-cipta"),
  }),
  component: CopyrightPolicyPage,
});

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function CopyrightPolicyPage() {
  return (
    <div className="shell max-w-3xl py-16 lg:py-20">
      <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
        Kebijakan Hak Cipta
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Berlaku untuk seluruh konten pada website resmi {site.legalName}.
      </p>

      <PolicySection title="Perlindungan Karya">
        <p>
          Seluruh buku, naskah, sampul, dan materi lain yang diterbitkan oleh {site.legalName}
          dilindungi oleh hak cipta sesuai ketentuan peraturan perundang-undangan yang berlaku. Hak
          cipta atas isi karya tetap melekat pada pemegang hak sesuai perjanjian penerbitan
          masing-masing judul.
        </p>
      </PolicySection>

      <PolicySection title="Penggunaan Materi">
        <p>
          Penggandaan, distribusi ulang, atau penggunaan materi buku — baik secara cetak maupun
          digital — harus memperoleh izin dari pemegang hak cipta. Kutipan terbatas untuk keperluan
          ilmiah atau ulasan tetap tunduk pada kaidah kutipan yang berlaku dengan mencantumkan
          sumber secara lengkap.
        </p>
      </PolicySection>

      <PolicySection title="Materi Pihak Ketiga">
        <p>
          Kami menghormati hak cipta pihak lain. Materi pihak ketiga yang digunakan dalam penerbitan
          selalu disertai izin atau dasar penggunaan yang sahih. Apabila Anda menemukan materi yang
          diduga melanggar hak cipta pada website ini, silakan laporkan kepada kami melalui formulir
          pada halaman Kontak Penerbit beserta uraian dan bukti kepemilikan hak.
        </p>
      </PolicySection>

      <PolicySection title="Data Bibliografis">
        <p>
          Informasi bibliografis seperti ISBN dicantumkan secara akurat dan hanya setelah nomor
          tersebut diberikan secara resmi oleh lembaga yang berwenang.
        </p>
      </PolicySection>

      <p className="mt-10 text-sm">
        <Link
          to="/kontak"
          className="font-medium text-azure transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Hubungi kami melalui halaman Kontak Penerbit →
        </Link>
      </p>
    </div>
  );
}
