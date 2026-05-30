import { Footer } from "@/components/Footer";
import { StickySiteHeader } from "@/components/StickySiteHeader";

export const metadata = {
  title: "Syarat dan Ketentuan - Japan Populer",
  description: "Syarat dan ketentuan penggunaan portal berita Japan Populer.",
};

export default function SyaratKetentuan() {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <StickySiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-[#1B5DAF]">Syarat dan Ketentuan</h1>
        <p className="mt-2 text-sm text-slate-500">Terakhir diperbarui: 1 Mei 2026</p>

        <div className="mt-8 space-y-8 text-[15px] leading-7 text-[#111827]">
          <section>
            <h2 className="text-xl font-black text-[#111827]">1. Ketentuan Umum</h2>
            <p className="mt-3">
              Dengan mengakses dan menggunakan situs Japan Populer (japanpopuler.com), Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak menyetujui ketentuan ini, mohon untuk tidak menggunakan layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">2. Hak Kekayaan Intelektual</h2>
            <p className="mt-3">
              Seluruh konten yang dipublikasikan di Japan Populer, termasuk namun tidak terbatas pada artikel, foto, grafis, logo, dan desain, merupakan hak cipta milik Japan Populer atau pemberi lisensi kami. Dilarang menyalin, mendistribusikan, atau mereproduksi konten tanpa izin tertulis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">3. Penggunaan Konten</h2>
            <p className="mt-3">Pengguna diperbolehkan untuk:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Membaca dan membagikan tautan artikel melalui media sosial.</li>
              <li>Mengutip sebagian kecil konten dengan mencantumkan sumber dan tautan ke artikel asli.</li>
            </ul>
            <p className="mt-3">Pengguna dilarang untuk:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Menyalin seluruh atau sebagian besar artikel tanpa izin.</li>
              <li>Menggunakan konten untuk tujuan komersial tanpa perjanjian tertulis.</li>
              <li>Mengubah, memodifikasi, atau mendistribusikan ulang konten.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">4. Komentar dan Interaksi Pengguna</h2>
            <p className="mt-3">
              Pengguna bertanggung jawab penuh atas komentar dan konten yang dikirimkan. Kami berhak menghapus komentar yang mengandung ujaran kebencian, SARA, pornografi, spam, atau konten yang melanggar hukum.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">5. Batasan Tanggung Jawab</h2>
            <p className="mt-3">
              Japan Populer menyediakan informasi untuk tujuan edukasi dan informasi umum. Kami berusaha menjaga akurasi konten, namun tidak menjamin bahwa semua informasi selalu terkini atau bebas dari kesalahan. Keputusan yang diambil berdasarkan informasi di situs ini sepenuhnya menjadi tanggung jawab pengguna.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">6. Tautan Eksternal</h2>
            <p className="mt-3">
              Situs kami mungkin memuat tautan ke situs pihak ketiga. Kami tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik situs-situs tersebut.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">7. Perubahan Ketentuan</h2>
            <p className="mt-3">
              Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini. Penggunaan berkelanjutan atas situs kami setelah perubahan dianggap sebagai persetujuan terhadap ketentuan yang diperbarui.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">8. Hukum yang Berlaku</h2>
            <p className="mt-3">
              Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum yang berlaku di Jepang dan Indonesia, sesuai dengan konteks operasional media Japan Populer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">9. Kontak</h2>
            <p className="mt-3">
              Untuk pertanyaan terkait syarat dan ketentuan, hubungi kami di <a href="mailto:redaksi@japanpopuler.com" className="font-bold text-[#1B5DAF] hover:underline">redaksi@japanpopuler.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
