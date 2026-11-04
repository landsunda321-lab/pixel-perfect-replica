import { createFileRoute } from "@tanstack/react-router";

import { canonicalLinks, site } from "@/data/site";

export const Route = createFileRoute("/kebijakan-privasi")({
  head: () => ({
    meta: [
      { title: "Kebijakan Privasi — Griya Pustaka Mandiri" },
      {
        name: "description",
        content:
          "Kebijakan privasi website penerbit Griya Pustaka Mandiri: data yang dikumpulkan dan cara penggunaannya.",
      },
      { property: "og:title", content: "Kebijakan Privasi — Griya Pustaka Mandiri" },
      { property: "og:type", content: "website" },
    ],
    links: canonicalLinks("/kebijakan-privasi"),
  }),
  component: PrivacyPolicyPage,
});

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function PrivacyPolicyPage() {
  return (
    <div className="shell max-w-3xl py-16 lg:py-20">
      <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
        Kebijakan Privasi
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Berlaku untuk website resmi {site.brandName}.
      </p>

      <PolicySection title="Data yang Kami Kumpulkan">
        <p>
          Melalui formulir kontak pada website ini, kami mengumpulkan nama, alamat email, subjek,
          dan isi pesan yang Anda kirimkan. Data tersebut digunakan semata-mata untuk
          menindaklanjuti pertanyaan atau permohonan Anda.
        </p>
        <p>
          Website ini tidak menggunakan pelacakan iklan pihak ketiga dan tidak menjual atau
          membagikan data kontak Anda kepada pihak lain.
        </p>
      </PolicySection>

      <PolicySection title="Penggunaan dan Penyimpanan Data">
        <p>
          Pesan yang dikirim melalui formulir kontak disimpan pada basis data penerbit dan hanya
          dapat diakses oleh pihak yang berwenang di lingkungan {site.brandName} untuk keperluan
          tindak lanjut korespondensi.
        </p>
      </PolicySection>

      <PolicySection title="Hak Anda">
        <p>
          Jika Anda ingin meminta koreksi atau penghapusan pesan yang pernah Anda kirimkan, silakan
          sampaikan melalui formulir kontak pada halaman Kontak Penerbit.
        </p>
      </PolicySection>

      <PolicySection title="Pembaruan Kebijakan">
        <p>
          Kebijakan ini dapat diperbarui sewaktu-waktu mengikuti perkembangan layanan dan regulasi
          yang berlaku. Pembaruan akan dipublikasikan pada halaman ini.
        </p>
      </PolicySection>
    </div>
  );
}
