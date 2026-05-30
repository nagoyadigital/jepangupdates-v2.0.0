import { Footer } from "@/components/Footer";
import { StickySiteHeader } from "@/components/StickySiteHeader";

export const metadata = {
  title: "Tentang Kami - Japan Populer",
  description: "Mengenal lebih dekat portal berita Japan Populer untuk komunitas Indonesia di Jepang.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <StickySiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-[#1B5DAF]">Tentang Kami</h1>
        <p className="mt-2 text-sm text-slate-500">Portal Berita Jepang Berbahasa Indonesia</p>

        <div className="mt-8 space-y-8 text-[15px] leading-7 text-[#111827]">
          <section>
            <h2 className="text-xl font-black text-[#111827]">Siapa Kami?</h2>
            <p className="mt-3">
              <strong className="font-black text-[#1B5DAF]">Japan Populer</strong> (japanpopuler.com) adalah portal berita dan informasi berbahasa Indonesia yang didedikasikan untuk komunitas Indonesia di Jepang. Kami hadir sebagai jembatan informasi bagi pekerja, pelajar, pelaku bisnis, dan seluruh diaspora Indonesia yang tinggal atau memiliki ketertarikan dengan Negeri Sakura.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Visi</h2>
            <p className="mt-3">
              Menjadi portal berita terdepan dan terpercaya bagi komunitas Indonesia di Jepang, menyajikan informasi yang akurat, relevan, dan bermanfaat untuk mendukung kehidupan diaspora Indonesia di Jepang.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Misi</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Menyajikan berita terkini seputar kehidupan di Jepang yang relevan bagi komunitas Indonesia.</li>
              <li>Memberikan informasi praktis tentang visa, pekerjaan, pendidikan, dan kehidupan sehari-hari di Jepang.</li>
              <li>Mempererat hubungan antar komunitas Indonesia di berbagai wilayah Jepang.</li>
              <li>Mendukung kegiatan positif komunitas melalui liputan event, budaya, dan olahraga.</li>
              <li>Menjadi platform kolaborasi antara komunitas, bisnis, dan organisasi Indonesia di Jepang.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Apa yang Kami Liput?</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-black text-[#1B5DAF]">📰 Berita & News</p>
                <p className="mt-1 text-sm text-slate-600">Update terkini seputar Jepang dan komunitas Indonesia.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-black text-[#1B5DAF]">📚 Pendidikan</p>
                <p className="mt-1 text-sm text-slate-600">Beasiswa, ujian SSW, Tokutei Ginou, dan peluang belajar.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-black text-[#1B5DAF]">💼 Bisnis & Pekerjaan</p>
                <p className="mt-1 text-sm text-slate-600">Peluang kerja, tips karier, dan informasi bisnis di Jepang.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-black text-[#1B5DAF]">🎵 Entertainment & Music</p>
                <p className="mt-1 text-sm text-slate-600">Event, konser, festival, dan hiburan komunitas.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-black text-[#1B5DAF]">⚽ Bola & Sports</p>
                <p className="mt-1 text-sm text-slate-600">Kompetisi futsal, sepak bola, dan olahraga komunitas.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-black text-[#1B5DAF]">🍜 Food & Travel</p>
                <p className="mt-1 text-sm text-slate-600">Kuliner halal, wisata, dan pengalaman hidup di Jepang.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Jangkauan Kami</h2>
            <p className="mt-3">
              Japan Populer melayani pembaca di seluruh wilayah Jepang, dengan fokus utama di kota-kota besar seperti Tokyo, Osaka, Nagoya, Fukuoka, dan Sapporo. Kami juga menjangkau pembaca di Indonesia yang berencana bekerja, belajar, atau berkunjung ke Jepang.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Dikembangkan Oleh</h2>
            <p className="mt-3">
              Japan Populer dikembangkan oleh <a href="https://nagoyadigital.com" className="font-bold text-[#1B5DAF] hover:underline">Nagoya Digital</a>, perusahaan teknologi dan media digital yang berbasis di Jepang, yang berfokus pada pengembangan platform digital untuk komunitas Indonesia di luar negeri.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Hubungi Kami</h2>
            <p className="mt-3">
              Email: <a href="mailto:redaksi@japanpopuler.com" className="font-bold text-[#1B5DAF] hover:underline">redaksi@japanpopuler.com</a><br />
              Instagram: <a href="https://instagram.com/japanpopuler" className="font-bold text-[#1B5DAF] hover:underline">@japanpopuler</a><br />
              Facebook: <a href="https://facebook.com/japanpopuler" className="font-bold text-[#1B5DAF] hover:underline">Japan Populer</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
