import { createFileRoute, Link } from "@tanstack/react-router";
import { canonicalLinks, site } from "@/data/site";

export const Route = createFileRoute("/kebijakan-privasi")({
  head: () => ({ meta: [
    { title: "Kebijakan Privasi — Griya Pustaka Mandiri" },
    { name: "description", content: "Kebijakan pengelolaan data pribadi pengunjung website resmi Griya Pustaka Mandiri." },
    { property: "og:title", content: "Kebijakan Privasi — Griya Pustaka Mandiri" },
    { property: "og:type", content: "website" },
  ], links: canonicalLinks("/kebijakan-privasi") }),
  component: PrivacyPolicyPage,
});
function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-8"><h2 className="font-display text-xl font-semibold text-foreground">{title}</h2><div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div></section>;
}
function PrivacyPolicyPage() {
  return <div className="shell max-w-3xl py-16 lg:py-20">
    <p className="text-xs font-semibold uppercase tracking-[.2em] text-azure">Informasi Pengguna</p>
    <h1 className="mt-3 font-display text-3xl font-bold text-primary sm:text-4xl">Kebijakan Privasi</h1>
    <p className="mt-3 text-sm text-muted-foreground">Kebijakan ini menjelaskan pengelolaan informasi ketika Anda mengakses website resmi {site.brandName} ({site.domain.host}).</p>
    <PolicySection title="Informasi yang Dikumpulkan"><p>Jika Anda menggunakan formulir kontak, informasi yang diminta meliputi nama, alamat email, subjek, dan isi pesan. Informasi tersebut diberikan secara langsung oleh Anda untuk memungkinkan penerbit menanggapi pertanyaan atau permohonan informasi.</p><p>Ketika mengakses website, sistem hosting dan infrastruktur teknis dapat memproses informasi teknis dasar seperti alamat IP, jenis peramban, waktu permintaan, dan catatan keamanan untuk menjaga ketersediaan serta keamanan layanan. Informasi teknis tersebut dikelola sesuai kemampuan dan kebijakan penyedia infrastruktur yang digunakan.</p></PolicySection>
    <PolicySection title="Tujuan Penggunaan"><p>Informasi digunakan untuk menanggapi korespondensi, memberikan informasi layanan penerbitan, menindaklanjuti pertanyaan, menjaga keamanan website, serta memenuhi kewajiban hukum apabila diperlukan.</p><p>Data formulir tidak digunakan untuk mengirim promosi berkala tanpa dasar atau persetujuan yang sesuai.</p></PolicySection>
    <PolicySection title="Penyimpanan dan Perlindungan"><p>Informasi korespondensi disimpan selama diperlukan untuk menindaklanjuti komunikasi, dokumentasi layanan, dan pemenuhan kewajiban yang berlaku. Akses terhadap data dibatasi kepada personel yang memerlukannya untuk menjalankan tugas penerbitan dan administrasi.</p><p>Penerbit menerapkan langkah pengamanan yang wajar. Namun, pengiriman informasi melalui internet tetap memiliki risiko dan tidak dapat dijamin sepenuhnya bebas dari gangguan.</p></PolicySection>
    <PolicySection title="Pengungkapan kepada Pihak Lain"><p>Data tidak diperjualbelikan. Informasi hanya dapat diproses oleh penyedia infrastruktur atau layanan teknis yang mendukung operasional website, atau diungkapkan apabila diwajibkan oleh peraturan perundang-undangan maupun permintaan sah dari otoritas berwenang.</p></PolicySection>
    <PolicySection title="Cookie dan Teknologi Serupa"><p>Website dapat menggunakan penyimpanan teknis yang diperlukan agar fungsi dan keamanan layanan berjalan. Jika fitur analitik atau teknologi tambahan diterapkan di kemudian hari, informasi mengenai penggunaannya akan diperbarui pada halaman ini.</p></PolicySection>
    <PolicySection title="Hak dan Permintaan Pengguna"><p>Anda dapat meminta akses, koreksi, atau penghapusan data korespondensi yang pernah disampaikan, sepanjang tidak bertentangan dengan kewajiban penyimpanan atau ketentuan hukum. Untuk mengajukan permintaan, jelaskan identitas dan pesan terkait melalui kanal kontak resmi.</p></PolicySection>
    <PolicySection title="Perubahan Kebijakan"><p>Kebijakan dapat diperbarui untuk menyesuaikan perubahan layanan, teknologi, atau peraturan. Versi terbaru akan selalu ditampilkan pada halaman ini.</p></PolicySection>
    <p className="mt-10 text-sm text-muted-foreground">Pertanyaan mengenai privasi dapat disampaikan melalui <Link to="/kontak" className="font-medium text-azure hover:text-primary">halaman Kontak Penerbit</Link>.</p>
  </div>;
}
