import { Footer } from "@/components/Footer";
import { StickySiteHeader } from "@/components/StickySiteHeader";

export const metadata = {
  title: "Pasang Iklan - Japan Populer",
  description: "Informasi pemasangan iklan dan kerjasama brand di portal berita Japan Populer.",
};

export default function AdsPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <StickySiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-[#1B5DAF]">Pasang Iklan</h1>
        <p className="mt-2 text-sm text-slate-500">Jangkau Komunitas Indonesia di Jepang</p>

        <div className="mt-8 space-y-8 text-[15px] leading-7 text-[#111827]">
          <section>
            <h2 className="text-xl font-black text-[#111827]">Mengapa Beriklan di Japan Populer?</h2>
            <p className="mt-3">
              Japan Populer adalah portal berita terkemuka untuk komunitas Indonesia di Jepang. Dengan ribuan pembaca aktif setiap hari, kami menawarkan platform yang tepat untuk menjangkau audiens Indonesia yang tinggal, bekerja, dan belajar di Jepang.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-[#1B5DAF] p-5 text-center text-white">
                <p className="text-3xl font-black">50K+</p>
                <p className="mt-1 text-sm font-bold text-white/70">Pembaca Bulanan</p>
              </div>
              <div className="rounded-lg bg-[#1B5DAF] p-5 text-center text-white">
                <p className="text-3xl font-black">80%</p>
                <p className="mt-1 text-sm font-bold text-white/70">Pembaca di Jepang</p>
              </div>
              <div className="rounded-lg bg-[#1B5DAF] p-5 text-center text-white">
                <p className="text-3xl font-black">20-45</p>
                <p className="mt-1 text-sm font-bold text-white/70">Usia Pembaca</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Jenis Iklan yang Tersedia</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-slate-200 p-5">
                <p className="font-black text-[#1B5DAF]">🖼️ Banner Header</p>
                <p className="mt-1 text-sm text-slate-600">Posisi paling atas halaman, terlihat oleh semua pengunjung. Ukuran responsif menyesuaikan desktop dan mobile.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5">
                <p className="font-black text-[#1B5DAF]">📐 Sidebar Ads</p>
                <p className="mt-1 text-sm text-slate-600">Iklan di sidebar kanan halaman utama dan artikel. Tersedia ukuran 4:5 dan 1:1.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5">
                <p className="font-black text-[#1B5DAF]">📝 In-Article Ads</p>
                <p className="mt-1 text-sm text-slate-600">Iklan yang muncul di tengah konten artikel, engagement tinggi karena pembaca sedang fokus membaca.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5">
                <p className="font-black text-[#1B5DAF]">📱 Mobile Parallax</p>
                <p className="mt-1 text-sm text-slate-600">Iklan fullscreen dengan efek parallax khusus untuk pengguna mobile. Impresi tinggi dan eye-catching.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5">
                <p className="font-black text-[#1B5DAF]">✍️ Advertorial / Sponsored Content</p>
                <p className="mt-1 text-sm text-slate-600">Artikel bersponsor yang ditulis oleh tim redaksi sesuai brief dari brand. Diberi label &ldquo;Sponsored&rdquo; untuk transparansi.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5">
                <p className="font-black text-[#1B5DAF]">📧 Newsletter Sponsorship</p>
                <p className="mt-1 text-sm text-slate-600">Penempatan brand di newsletter mingguan yang dikirim ke subscriber aktif.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Target Audiens</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Pekerja Indonesia di Jepang (Tokutei Ginou, Engineer, dll)</li>
              <li>Pelajar dan mahasiswa Indonesia di Jepang</li>
              <li>Pelaku bisnis dan UMKM Indonesia di Jepang</li>
              <li>Komunitas dan organisasi diaspora Indonesia</li>
              <li>Calon pekerja/pelajar yang berencana ke Jepang</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Cocok untuk Brand</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Layanan pengiriman uang (remittance)</li>
              <li>Agen tenaga kerja dan lembaga pelatihan</li>
              <li>Produk halal dan toko Indonesia di Jepang</li>
              <li>Event organizer dan promotor konser</li>
              <li>Layanan telekomunikasi dan SIM card</li>
              <li>Asuransi, perbankan, dan layanan keuangan</li>
              <li>Travel agent dan maskapai penerbangan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Hubungi Kami</h2>
            <p className="mt-3">
              Untuk informasi harga, media kit, dan kerjasama iklan, silakan hubungi tim bisnis kami:
            </p>
            <div className="mt-4 rounded-lg bg-slate-50 p-5">
              <p className="font-black">Tim Bisnis & Iklan</p>
              <p className="mt-2 text-sm text-slate-600">
                Email: <a href="mailto:iklan@japanpopuler.com" className="font-bold text-[#1B5DAF] hover:underline">iklan@japanpopuler.com</a><br />
                WhatsApp: <a href="https://wa.me/818072870349" className="font-bold text-[#1B5DAF] hover:underline">+81 80-7287-0349</a><br />
                Instagram: <a href="https://instagram.com/japanpopuler" className="font-bold text-[#1B5DAF] hover:underline">@japanpopuler</a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
