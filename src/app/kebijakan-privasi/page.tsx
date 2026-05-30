import { Footer } from "@/components/Footer";
import { StickySiteHeader } from "@/components/StickySiteHeader";

export const metadata = {
  title: "Kebijakan Privasi - Japan Populer",
  description: "Kebijakan privasi portal berita Japan Populer untuk komunitas Indonesia di Jepang.",
};

export default function KebijakanPrivasi() {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <StickySiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-[#1B5DAF]">Kebijakan Privasi</h1>
        <p className="mt-2 text-sm text-slate-500">Terakhir diperbarui: 1 Mei 2026</p>

        <div className="mt-8 space-y-8 text-[15px] leading-7 text-[#111827]">
          <section>
            <h2 className="text-xl font-black text-[#111827]">1. Pendahuluan</h2>
            <p className="mt-3">
              Japan Populer (japanpopuler.com) berkomitmen melindungi privasi pengunjung dan pengguna layanan kami. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda saat mengakses portal berita kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">2. Informasi yang Kami Kumpulkan</h2>
            <p className="mt-3">Kami dapat mengumpulkan informasi berikut:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Informasi identitas: nama, alamat email saat berlangganan newsletter atau mengirim komentar.</li>
              <li>Data teknis: alamat IP, jenis browser, sistem operasi, halaman yang dikunjungi, dan durasi kunjungan.</li>
              <li>Cookie dan teknologi pelacakan: untuk meningkatkan pengalaman pengguna dan analitik situs.</li>
              <li>Informasi dari media sosial: jika Anda berinteraksi melalui akun sosial media kami.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">3. Penggunaan Informasi</h2>
            <p className="mt-3">Informasi yang dikumpulkan digunakan untuk:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Menyediakan dan meningkatkan layanan konten berita.</li>
              <li>Mengirimkan newsletter dan informasi terkait komunitas Indonesia di Jepang.</li>
              <li>Menganalisis trafik dan perilaku pengguna untuk pengembangan situs.</li>
              <li>Menampilkan iklan yang relevan melalui mitra periklanan.</li>
              <li>Merespons pertanyaan dan permintaan dari pengguna.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">4. Penyimpanan dan Keamanan Data</h2>
            <p className="mt-3">
              Kami menyimpan data pribadi Anda selama diperlukan untuk tujuan yang disebutkan di atas. Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar untuk melindungi data dari akses tidak sah, perubahan, pengungkapan, atau penghancuran.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">5. Berbagi Informasi dengan Pihak Ketiga</h2>
            <p className="mt-3">Kami tidak menjual informasi pribadi Anda. Namun, kami dapat membagikan data dengan:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Penyedia layanan analitik (Google Analytics).</li>
              <li>Mitra periklanan untuk penayangan iklan yang relevan.</li>
              <li>Otoritas hukum jika diwajibkan oleh peraturan yang berlaku.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">6. Hak Pengguna</h2>
            <p className="mt-3">Anda memiliki hak untuk:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Mengakses data pribadi yang kami simpan tentang Anda.</li>
              <li>Meminta koreksi atau penghapusan data pribadi.</li>
              <li>Menolak penggunaan data untuk tujuan pemasaran.</li>
              <li>Menarik persetujuan kapan saja.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">7. Cookie</h2>
            <p className="mt-3">
              Situs kami menggunakan cookie untuk meningkatkan pengalaman browsing. Anda dapat mengatur preferensi cookie melalui pengaturan browser. Menonaktifkan cookie dapat mempengaruhi fungsionalitas tertentu di situs kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">8. Kontak</h2>
            <p className="mt-3">
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui email di <a href="mailto:redaksi@japanpopuler.com" className="font-bold text-[#1B5DAF] hover:underline">redaksi@japanpopuler.com</a> atau melalui halaman <a href="/kontak" className="font-bold text-[#1B5DAF] hover:underline">Kontak</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
