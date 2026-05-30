import { Footer } from "@/components/Footer";
import { StickySiteHeader } from "@/components/StickySiteHeader";

export const metadata = {
  title: "Media Partner - Japan Populer",
  description: "Kerjasama media partner dengan Japan Populer untuk event dan kegiatan komunitas Indonesia di Jepang.",
};

export default function MediaPartnerPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <StickySiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-[#1B5DAF]">Media Partner</h1>
        <p className="mt-2 text-sm text-slate-500">Kerjasama Liputan & Publikasi Event</p>

        <div className="mt-8 space-y-8 text-[15px] leading-7 text-[#111827]">
          <section>
            <h2 className="text-xl font-black text-[#111827]">Tentang Media Partner</h2>
            <p className="mt-3">
              Japan Populer membuka kerjasama media partner untuk event,
 kegiatan komunitas, festival, turnamen olahraga, dan acara budaya Indonesia di Jepang. Sebagai portal berita terkemuka untuk diaspora Indonesia, kami siap membantu mempublikasikan dan meliput acara Anda secara profesional.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Apa yang Kami Tawarkan?</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-slate-200 p-5">
                <p className="font-black text-[#1B5DAF]">📰 Liputan Pre-Event</p>
                <p className="mt-1 text-sm text-slate-600">Publikasi artikel pra-acara untuk membangun awareness dan menarik peserta. Termasuk informasi jadwal, line-up, dan detail event.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5">
                <p className="font-black text-[#1B5DAF]">📸 Liputan On-The-Spot</p>
                <p className="mt-1 text-sm text-slate-600">Tim kami hadir langsung di lokasi event untuk dokumentasi foto, video, dan penulisan artikel liputan real-time.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5">
                <p className="font-black text-[#1B5DAF]">✍️ Artikel Post-Event</p>
                <p className="mt-1 text-sm text-slate-600">Publikasi artikel pasca-acara lengkap dengan foto dokumentasi dan highlight momen penting.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5">
                <p className="font-black text-[#1B5DAF]">📱 Promosi Media Sosial</p>
                <p className="mt-1 text-sm text-slate-600">Publikasi di seluruh platform media sosial Japan Populer (Instagram, Facebook, TikTok, YouTube) untuk jangkauan maksimal.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-5">
                <p className="font-black text-[#1B5DAF]">🎥 Konten Video</p>
                <p className="mt-1 text-sm text-slate-600">Pembuatan konten video highlight, interview, dan behind-the-scene untuk YouTube dan media sosial.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Event yang Pernah Kami Liput</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-black">🎶 Cirebon Pride Japan</p>
                <p className="mt-1 text-sm text-slate-600">Anniversary & Festival Musik di Nagoya</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-black">⚽ Kansai Elite Cup</p>
                <p className="mt-1 text-sm text-slate-600">Turnamen Futsal Komunitas Indonesia</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-black">🎤 Pantura Japan Kansai</p>
                <p className="mt-1 text-sm text-slate-600">Anniversary & Konser Dangdut di Jepang</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-black">💰 DCOM Money Express</p>
                <p className="mt-1 text-sm text-slate-600">Partnership Layanan Pengiriman Uang</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-black">🎵 Festival Sumber Bahagia</p>
                <p className="mt-1 text-sm text-slate-600">Event Musik Indonesia di Jepang</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-black">🎊 Halal Bihalal Pantura Japan</p>
                <p className="mt-1 text-sm text-slate-600">Gathering Komunitas di RAD HALL Nagoya</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Paket Media Partner</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border-2 border-slate-200 p-5 text-center">
                <p className="text-sm font-bold text-slate-500">Basic</p>
                <p className="mt-2 text-2xl font-black text-[#1B5DAF]">Silver</p>
                <ul className="mt-4 space-y-2 text-left text-sm">
                  <li>✅ 1 Artikel Pre-Event</li>
                  <li>✅ 1 Artikel Post-Event</li>
                  <li>✅ Share di Media Sosial</li>
                  <li>✅ Logo di Artikel</li>
                </ul>
              </div>
              <div className="rounded-lg border-2 border-[#1B5DAF] p-5 text-center">
                <p className="text-sm font-bold text-[#1B5DAF]">Recommended</p>
                <p className="mt-2 text-2xl font-black text-[#1B5DAF]">Gold</p>
                <ul className="mt-4 space-y-2 text-left text-sm">
                  <li>✅ Semua paket Silver</li>
                  <li>✅ Liputan On-The-Spot</li>
                  <li>✅ Foto Dokumentasi</li>
                  <li>✅ Instagram Story & Reels</li>
                  <li>✅ Banner di Homepage</li>
                </ul>
              </div>
              <div className="rounded-lg border-2 border-slate-200 p-5 text-center">
                <p className="text-sm font-bold text-slate-500">Premium</p>
                <p className="mt-2 text-2xl font-black text-[#1B5DAF]">Platinum</p>
                <ul className="mt-4 space-y-2 text-left text-sm">
                  <li>✅ Semua paket Gold</li>
                  <li>✅ Video Highlight</li>
                  <li>✅ YouTube Coverage</li>
                  <li>✅ Live Report</li>
                  <li>✅ Exclusive Interview</li>
                  <li>✅ Newsletter Feature</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Syarat Media Partner</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Event bersifat positif dan tidak melanggar hukum Jepang maupun Indonesia.</li>
              <li>Pengajuan minimal 2 minggu sebelum hari-H event.</li>
              <li>Menyediakan informasi lengkap: nama event, tanggal, lokasi, line-up, dan kontak PIC.</li>
              <li>Bersedia mencantumkan logo Japan Populer sebagai media partner.</li>
              <li>Menyediakan akses press/media untuk tim liputan kami.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Ajukan Media Partner</h2>
            <p className="mt-3">
              Untuk mengajukan kerjasama media partner, silakan hubungi kami dengan menyertakan proposal atau informasi event:
            </p>
            <div className="mt-4 rounded-lg bg-slate-50 p-5">
              <p className="font-black">Tim Media Partner</p>
              <p className="mt-2 text-sm text-slate-600">
                Email: <a href="mailto:mediapartner@japanpopuler.com" className="font-bold text-[#1B5DAF] hover:underline">mediapartner@japanpopuler.com</a><br />
                WhatsApp: <a href="https://wa.me/818072870349" className="font-bold text-[#1B5DAF] hover:underline">+81 80-7287-0349</a><br />
                Instagram DM: <a href="https://instagram.com/japanpopuler" className="font-bold text-[#1B5DAF] hover:underline">@japanpopuler</a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
