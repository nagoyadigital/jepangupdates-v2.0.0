import { Footer } from "@/components/Footer";
import { StickySiteHeader } from "@/components/StickySiteHeader";

export const metadata = {
  title: "Kontak - Japan Populer",
  description: "Hubungi tim Japan Populer untuk pertanyaan, kerjasama, atau saran.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <StickySiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-[#1B5DAF]">Kontak</h1>
        <p className="mt-2 text-sm text-slate-500">Hubungi Kami</p>

        <div className="mt-8 space-y-8 text-[15px] leading-7 text-[#111827]">
          <section>
            <h2 className="text-xl font-black text-[#111827]">Informasi Kontak</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <a href="mailto:redaksi@japanpopuler.com" className="flex items-center gap-4 rounded-lg bg-slate-50 p-5 transition hover:bg-blue-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B5DAF]/10">
                  <IconEmail />
                </div>
                <div>
                  <p className="font-black text-[#1B5DAF]">Email Redaksi</p>
                  <p className="mt-0.5 text-sm text-slate-600">redaksi@japanpopuler.com</p>
                </div>
              </a>
              <a href="mailto:iklan@japanpopuler.com" className="flex items-center gap-4 rounded-lg bg-slate-50 p-5 transition hover:bg-blue-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B5DAF]/10">
                  <IconBriefcase />
                </div>
                <div>
                  <p className="font-black text-[#1B5DAF]">Email Iklan & Bisnis</p>
                  <p className="mt-0.5 text-sm text-slate-600">iklan@japanpopuler.com</p>
                </div>
              </a>
              <a href="https://wa.me/818072870349" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-lg bg-slate-50 p-5 transition hover:bg-green-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366]/10">
                  <IconWhatsApp />
                </div>
                <div>
                  <p className="font-black text-[#25D366]">WhatsApp</p>
                  <p className="mt-0.5 text-sm text-slate-600">+81 80-7287-0349</p>
                </div>
              </a>
              <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6372E]/10">
                  <IconLocation />
                </div>
                <div>
                  <p className="font-black text-[#E6372E]">Lokasi</p>
                  <p className="mt-0.5 text-sm text-slate-600">Nagoya, Aichi, Japan</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Media Sosial</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a href="https://instagram.com/japanpopuler" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 transition hover:border-[#E4405F] hover:bg-pink-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]">
                  <IconInstagram />
                </div>
                <div>
                  <p className="font-black text-[#111827]">Instagram</p>
                  <p className="text-sm text-slate-500">@japanpopuler</p>
                </div>
              </a>
              <a href="https://facebook.com/japanpopuler" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 transition hover:border-[#1877F2] hover:bg-blue-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1877F2]">
                  <IconFacebook />
                </div>
                <div>
                  <p className="font-black text-[#111827]">Facebook</p>
                  <p className="text-sm text-slate-500">Japan Populer</p>
                </div>
              </a>
              <a href="https://youtube.com/@japanpopuler" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 transition hover:border-[#FF0000] hover:bg-red-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF0000]">
                  <IconYouTube />
                </div>
                <div>
                  <p className="font-black text-[#111827]">YouTube</p>
                  <p className="text-sm text-slate-500">@japanpopuler</p>
                </div>
              </a>
              <a href="https://tiktok.com/@japanpopuler" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 transition hover:border-[#111827] hover:bg-slate-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111827]">
                  <IconTikTok />
                </div>
                <div>
                  <p className="font-black text-[#111827]">TikTok</p>
                  <p className="text-sm text-slate-500">@japanpopuler</p>
                </div>
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Kirim Pesan</h2>
            <p className="mt-3">Gunakan formulir di bawah untuk mengirim pesan langsung ke tim kami.</p>
            <form className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="rounded-md border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#1B5DAF] focus:ring-1 focus:ring-[#1B5DAF]" placeholder="Nama Lengkap" />
                <input className="rounded-md border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#1B5DAF] focus:ring-1 focus:ring-[#1B5DAF]" placeholder="Email" type="email" />
              </div>
              <input className="rounded-md border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#1B5DAF] focus:ring-1 focus:ring-[#1B5DAF]" placeholder="Subjek" />
              <textarea className="min-h-36 rounded-md border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#1B5DAF] focus:ring-1 focus:ring-[#1B5DAF]" placeholder="Tulis pesan Anda di sini..." />
              <button className="h-12 rounded-md bg-[#1B5DAF] px-6 font-black text-white transition hover:bg-[#164a8a]" type="submit">
                Kirim Pesan
              </button>
            </form>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827]">Untuk Keperluan</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li><strong>Kerjasama Iklan & Sponsorship</strong> — hubungi iklan@japanpopuler.com</li>
              <li><strong>Kontribusi Artikel & Jurnalis</strong> — kirim portofolio ke redaksi@japanpopuler.com</li>
              <li><strong>Hak Jawab & Klarifikasi</strong> — email ke redaksi@japanpopuler.com</li>
              <li><strong>Liputan Event Komunitas</strong> — hubungi via WhatsApp atau email redaksi</li>
              <li><strong>Pertanyaan Umum</strong> — gunakan formulir di atas</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// --- SVG Icons (official brand colors & shapes) ---

function IconEmail() {
  return (
    <svg className="h-5 w-5 text-[#1B5DAF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg className="h-5 w-5 text-[#1B5DAF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M12 12h.01" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg className="h-5 w-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function IconLocation() {
  return (
    <svg className="h-5 w-5 text-[#E6372E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
    </svg>
  );
}

function IconYouTube() {
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.1v-3.5a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15.7a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.4a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.83Z" />
    </svg>
  );
}
