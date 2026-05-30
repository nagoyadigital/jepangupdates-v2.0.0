import { Footer } from "@/components/Footer";
import { StickySiteHeader } from "@/components/StickySiteHeader";

export const metadata = {
  title: "Pedoman Media Siber - Japan Populer",
  description: "Pedoman pemberitaan media siber Japan Populer sesuai standar jurnalistik.",
};

export default function PedomanMediaSiber() {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <StickySiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-[#1B5DAF]">Pedoman Media Siber</h1>
        <p className="mt-2 text-sm text-slate-500">Mengacu pada Pedoman Pemberitaan Media Siber Dewan Pers</p>

        <div className="mt-8 space-y-8 text-[15px] leading-7 text-[#111827]">
          {/* Pedoman Pembuka */}
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-black text-[#1B5DAF]">Pedoman JEPANG UPDATES</h2>
            <div className="mt-4 space-y-4">
              <p>
                Kemerdekaan berpendapat, kemerdekaan berekspresi, dan kemerdekaan pers adalah hak asasi manusia yang dijamin oleh Pancasila, Undang-Undang Dasar 1945, serta Deklarasi Universal Hak Asasi Manusia Perserikatan Bangsa-Bangsa (PBB).
              </p>
              <p>
                Sebagai bagian dari media siber yang hadir untuk menyampaikan informasi seputar Jepang kepada masyarakat Indonesia dan diaspora, <strong>JEPANG UPDATES</strong> turut menjunjung tinggi nilai-nilai kebebasan berekspresi dan bertanggung jawab atas informasi yang disampaikan kepada publik.
              </p>
              <p>
                Karena media siber memiliki karakteristik khusus—terkait kecepatan distribusi, interaktivitas, serta jangkauan global—maka diperlukan pedoman etik dan profesionalisme dalam pengelolaannya. Pedoman ini menjadi landasan bagi <strong>JEPANG UPDATES</strong> untuk menjalankan fungsi jurnalistik secara independen, akurat, berimbang, serta sesuai dengan prinsip-prinsip Undang-Undang Nomor 40 Tahun 1999 tentang Pers dan Kode Etik Jurnalistik Indonesia, serta memperhatikan norma dan hukum yang berlaku di Jepang.
              </p>
              <p>
                Dengan pedoman ini, <strong>JEPANG UPDATES</strong> berharap dapat menjadi media informasi yang dapat dipercaya, edukatif, dan menjembatani pemahaman lintas budaya antara Jepang dan Indonesia.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">1. Ruang Lingkup</h2>
            <p className="mt-3">
              Japan Populer adalah media siber berbahasa Indonesia yang menyajikan informasi seputar kehidupan komunitas Indonesia di Jepang, meliputi berita, pendidikan, pekerjaan, hiburan, olahraga, dan budaya. Pedoman ini mengatur prinsip-prinsip jurnalistik yang kami terapkan dalam setiap pemberitaan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">2. Verifikasi dan Akurasi</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Setiap berita wajib melalui proses verifikasi fakta sebelum dipublikasikan.</li>
              <li>Sumber berita harus jelas dan dapat dipertanggungjawabkan.</li>
              <li>Berita yang bersifat klaim atau opini harus diberi label yang jelas.</li>
              <li>Kesalahan faktual akan segera dikoreksi dengan mencantumkan catatan koreksi.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">3. Keberimbangan</h2>
            <p className="mt-3">
              Japan Populer menerapkan prinsip keberimbangan (cover both sides) dalam pemberitaan. Pihak yang diberitakan secara negatif diberikan kesempatan untuk memberikan klarifikasi atau tanggapan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">4. Konten Buatan Pengguna (User Generated Content)</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Komentar dan konten dari pengguna bukan merupakan tanggung jawab redaksi.</li>
              <li>Redaksi berhak menghapus konten yang melanggar norma, hukum, atau etika.</li>
              <li>Konten pengguna yang mengandung SARA, pornografi, fitnah, atau ujaran kebencian akan dihapus tanpa pemberitahuan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">5. Ralat, Koreksi, dan Hak Jawab</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Ralat dan koreksi dilakukan sesegera mungkin setelah kesalahan diketahui.</li>
              <li>Hak jawab diberikan kepada pihak yang merasa dirugikan oleh pemberitaan.</li>
              <li>Permintaan hak jawab dapat disampaikan melalui email redaksi.</li>
              <li>Hak jawab akan dimuat dalam waktu maksimal 3 hari kerja setelah diterima.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">6. Pencabutan Berita</h2>
            <p className="mt-3">
              Berita yang terbukti tidak akurat atau melanggar kode etik jurnalistik dapat dicabut dari publikasi. Pencabutan akan disertai penjelasan alasan pencabutan di halaman yang sama.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">7. Iklan dan Konten Bersponsor</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Konten iklan dan advertorial diberi label jelas untuk membedakan dari konten editorial.</li>
              <li>Redaksi memiliki independensi penuh dari kepentingan pengiklan.</li>
              <li>Iklan yang menyesatkan atau melanggar hukum tidak akan ditayangkan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">8. Perlindungan Privasi</h2>
            <p className="mt-3">
              Japan Populer menghormati privasi narasumber dan subjek berita. Identitas korban kejahatan, anak di bawah umur, dan pihak yang meminta perlindungan identitas akan dirahasiakan sesuai ketentuan hukum yang berlaku.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">9. Kontak Redaksi</h2>
            <p className="mt-3">
              Pengaduan, saran, dan permintaan hak jawab dapat disampaikan ke:<br />
              Email: <a href="mailto:redaksi@japanpopuler.com" className="font-bold text-[#1B5DAF] hover:underline">redaksi@japanpopuler.com</a><br />
              Atau melalui halaman <a href="/kontak" className="font-bold text-[#1B5DAF] hover:underline">Kontak</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
