import { Footer } from "@/components/Footer";
import { StickySiteHeader } from "@/components/StickySiteHeader";

export const metadata = {
  title: "Redaksi - Japan Populer",
  description: "Susunan redaksi dan tim editorial portal berita Japan Populer.",
};

export default function EditorialPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <StickySiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-[#1B5DAF]">Redaksi</h1>
        <p className="mt-2 text-sm text-slate-500">Susunan Tim Redaksi Japan Populer</p>

        <div className="mt-8 space-y-8 text-[15px] leading-7 text-[#111827]">
          <section>
            <h2 className="text-xl font-black text-[#111827]">Tentang Redaksi</h2>
            <p className="mt-3">
              Tim redaksi Japan Populer terdiri dari jurnalis, kontributor, dan editor yang memiliki pengalaman langsung tinggal dan bekerja di Jepang. Kami berkomitmen menyajikan berita yang akurat, berimbang, dan relevan bagi komunitas Indonesia di Jepang.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Susunan Redaksi</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-500">Pemimpin Redaksi</p>
                <p className="mt-1 text-lg font-black">Japan Populer</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-500">Editor</p>
                <p className="mt-1 text-lg font-black">Tim Editorial Japan Populer</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-500">Reporter & Kontributor</p>
                <p className="mt-1 text-lg font-black">Kontributor Komunitas Indonesia di Jepang</p>
                <p className="mt-1 text-sm text-slate-600">Tersebar di Tokyo, Osaka, Nagoya, Fukuoka, dan kota-kota lainnya.</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-500">Pengembang & Teknologi</p>
                <p className="mt-1 text-lg font-black">Nagoya Digital</p>
                <p className="mt-1 text-sm text-slate-600">Bertanggung jawab atas pengembangan platform dan infrastruktur digital.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Prinsip Editorial</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li><strong>Akurasi</strong> — Setiap berita melalui proses verifikasi sebelum dipublikasikan.</li>
              <li><strong>Keberimbangan</strong> — Kami menyajikan berita dari berbagai sudut pandang.</li>
              <li><strong>Independensi</strong> — Redaksi independen dari kepentingan pengiklan dan pihak ketiga.</li>
              <li><strong>Relevansi</strong> — Konten difokuskan pada kebutuhan nyata komunitas Indonesia di Jepang.</li>
              <li><strong>Transparansi</strong> — Konten bersponsor dan advertorial diberi label yang jelas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Bergabung dengan Kami</h2>
            <p className="mt-3">
              Kami selalu membuka kesempatan bagi kontributor dan jurnalis warga yang ingin berkontribusi. Jika Anda tinggal di Jepang dan memiliki passion di bidang jurnalistik atau penulisan, silakan hubungi kami.
            </p>
            <p className="mt-3">
              Kirim portofolio dan CV ke: <a href="mailto:redaksi@japanpopuler.com" className="font-bold text-[#1B5DAF] hover:underline">redaksi@japanpopuler.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Kontak Redaksi</h2>
            <p className="mt-3">
              Untuk pertanyaan editorial, klarifikasi, hak jawab, atau pengaduan:<br />
              Email: <a href="mailto:redaksi@japanpopuler.com" className="font-bold text-[#1B5DAF] hover:underline">redaksi@japanpopuler.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
