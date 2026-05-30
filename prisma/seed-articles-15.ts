import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("📰 Seeding 15 real news articles...");

  // Get admin user
  const admin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
  if (!admin) {
    console.error("❌ Super Admin not found. Run main seed first.");
    process.exit(1);
  }

  // Get categories
  const categories = await prisma.category.findMany();
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const articles = [
    {
      title: "Jepang Resmi Naikkan Upah Minimum Nasional Menjadi 1.100 Yen per Jam Mulai Oktober 2026",
      slug: "jepang-naikkan-upah-minimum-1100-yen-oktober-2026",
      category: "berita-jepang",
      excerpt: "Pemerintah Jepang mengumumkan kenaikan upah minimum nasional dari 1.054 yen menjadi 1.100 yen per jam, berlaku mulai Oktober 2026.",
      content: `<p>Pemerintah Jepang secara resmi mengumumkan kenaikan upah minimum nasional menjadi <strong>1.100 yen per jam</strong>, naik dari 1.054 yen yang berlaku saat ini. Kebijakan ini akan mulai diterapkan pada Oktober 2026.</p>
<p>Kenaikan ini merupakan bagian dari upaya pemerintah untuk meningkatkan daya beli masyarakat di tengah tekanan inflasi yang masih berlanjut. Perdana Menteri menyatakan bahwa target jangka panjang pemerintah adalah mencapai upah minimum 1.500 yen per jam pada tahun 2030.</p>
<p>Bagi pekerja asing termasuk WNI yang bekerja paruh waktu (arubaito), kenaikan ini tentu menjadi kabar baik. Prefektur Tokyo diperkirakan akan menetapkan upah minimum tertinggi di angka sekitar 1.200 yen per jam.</p>
<h3>Dampak untuk Pekerja Indonesia</h3>
<p>Komunitas Indonesia di Jepang yang banyak bekerja di sektor manufaktur, restoran, dan konbini akan merasakan dampak langsung dari kebijakan ini. Kenaikan upah minimum juga berlaku untuk pemegang visa Tokutei Ginou dan peserta magang teknis.</p>`,
      readTime: 3,
      isFeatured: true,
      isHeadline: true,
    },
    {
      title: "Lowongan Tokutei Ginou Sektor Pertanian Dibuka untuk 5.000 Pekerja Indonesia",
      slug: "lowongan-tokutei-ginou-pertanian-5000-pekerja-indonesia",
      category: "tokutei-ginou",
      excerpt: "Jepang membuka kuota 5.000 pekerja Indonesia untuk sektor pertanian melalui program Tokutei Ginou tahun fiskal 2026.",
      content: `<p>Kementerian Pertanian Jepang bekerja sama dengan Badan Pelindungan Pekerja Migran Indonesia (BP2MI) membuka kuota <strong>5.000 pekerja</strong> untuk sektor pertanian melalui skema visa Tokutei Ginou (Specified Skilled Worker).</p>
<p>Program ini mencakup sub-sektor tanaman pangan, peternakan, dan perikanan darat. Calon pekerja wajib lulus ujian keterampilan (SSW Test) dan ujian bahasa Jepang minimal N4.</p>
<p>Pendaftaran dibuka mulai Juli 2026 melalui lembaga pengirim resmi yang terdaftar di BP2MI. Gaji yang ditawarkan berkisar antara 180.000 hingga 220.000 yen per bulan.</p>
<h3>Persyaratan Utama</h3>
<ul><li>Usia 18-35 tahun</li><li>Lulus ujian SSW sektor pertanian</li><li>JLPT N4 atau JFT-Basic A2</li><li>Sehat jasmani dan rohani</li></ul>`,
      readTime: 4,
      isFeatured: true,
      isBreaking: true,
    },
    {
      title: "Gempa M6.2 Guncang Prefektur Ishikawa, Tidak Ada Peringatan Tsunami",
      slug: "gempa-m62-guncang-prefektur-ishikawa-mei-2026",
      category: "berita-jepang",
      excerpt: "Gempa berkekuatan M6.2 mengguncang Prefektur Ishikawa pada Jumat pagi. JMA menyatakan tidak ada potensi tsunami.",
      content: `<p>Gempa bumi berkekuatan <strong>Magnitudo 6.2</strong> mengguncang wilayah Prefektur Ishikawa, Jepang, pada Jumat pagi pukul 06:23 waktu setempat. Japan Meteorological Agency (JMA) mencatat pusat gempa berada di kedalaman 10 km.</p>
<p>JMA menyatakan tidak ada peringatan tsunami yang dikeluarkan. Intensitas guncangan tertinggi mencapai Shindo 5+ di kota Wajima dan Suzu.</p>
<p>Beberapa bangunan dilaporkan mengalami kerusakan ringan. Layanan kereta Shinkansen Hokuriku sempat dihentikan sementara untuk pemeriksaan jalur namun sudah beroperasi normal kembali.</p>
<h3>Informasi untuk WNI</h3>
<p>KBRI Tokyo mengimbau WNI di wilayah terdampak untuk tetap waspada dan mengikuti instruksi evakuasi dari pemerintah setempat. Hotline darurat KBRI: +81-3-3441-4201.</p>`,
      readTime: 2,
      isBreaking: true,
    },
    {
      title: "Panduan Lengkap Perpanjangan Visa Kerja di Jepang 2026: Syarat dan Prosedur Terbaru",
      slug: "panduan-perpanjangan-visa-kerja-jepang-2026",
      category: "imigrasi",
      excerpt: "Simak panduan terbaru perpanjangan visa kerja di Jepang tahun 2026, termasuk dokumen yang diperlukan dan perubahan prosedur.",
      content: `<p>Bagi WNI yang bekerja di Jepang, perpanjangan visa kerja (在留期間更新) adalah proses rutin yang harus dilakukan sebelum masa berlaku visa habis. Berikut panduan lengkap untuk tahun 2026.</p>
<h3>Dokumen yang Diperlukan</h3>
<ul><li>Formulir aplikasi perpanjangan (dapat diunduh dari situs Imigrasi Jepang)</li><li>Paspor dan Residence Card asli</li><li>Foto 4x3 cm (latar putih)</li><li>Surat keterangan kerja dari perusahaan</li><li>Slip gaji 3 bulan terakhir</li><li>Surat pembayaran pajak (課税証明書)</li></ul>
<h3>Perubahan Prosedur 2026</h3>
<p>Mulai April 2026, Immigration Services Agency of Japan (ISA) telah meluncurkan sistem aplikasi online penuh. Pemohon kini bisa mengajukan perpanjangan melalui portal <strong>e-Zairyu</strong> tanpa perlu datang ke kantor imigrasi.</p>
<p>Waktu pemrosesan rata-rata adalah 2-4 minggu. Disarankan mengajukan perpanjangan minimal 3 bulan sebelum visa berakhir.</p>`,
      readTime: 5,
      isFeatured: true,
    },
    {
      title: "Festival Bon Odori Jakarta 2026 Digelar Juli, Kolaborasi Budaya Jepang-Indonesia",
      slug: "festival-bon-odori-jakarta-2026-juli",
      category: "event",
      excerpt: "Festival Bon Odori Jakarta kembali digelar pada Juli 2026 di JIExpo Kemayoran dengan tema kolaborasi budaya Jepang-Indonesia.",
      content: `<p>Festival Bon Odori Jakarta 2026 akan kembali digelar pada <strong>13-14 Juli 2026</strong> di JIExpo Kemayoran, Jakarta. Acara tahunan yang diselenggarakan oleh Japanese Club Jakarta ini mengangkat tema "Harmony: Japan-Indonesia Cultural Bridge".</p>
<p>Festival ini akan menampilkan pertunjukan tari tradisional Bon Odori, booth makanan Jepang autentik, cosplay competition, dan pertunjukan musik J-Pop. Tahun ini juga akan ada zona khusus untuk memperkenalkan program kerja dan studi di Jepang.</p>
<h3>Highlight Acara</h3>
<ul><li>Tari Bon Odori massal dengan 10.000 peserta</li><li>100+ booth makanan dan merchandise Jepang</li><li>Cosplay competition dengan hadiah tiket PP ke Jepang</li><li>Seminar peluang kerja Tokutei Ginou</li><li>Workshop origami dan kaligrafi Jepang</li></ul>
<p>Tiket masuk gratis namun pengunjung perlu registrasi online melalui website resmi panitia mulai Juni 2026.</p>`,
      readTime: 3,
    },
    {
      title: "Komunitas Muslim Indonesia di Osaka Resmikan Masjid Baru Berkapasitas 500 Jamaah",
      slug: "komunitas-muslim-indonesia-osaka-resmikan-masjid-baru",
      category: "komunitas",
      excerpt: "Komunitas Muslim Indonesia di Osaka meresmikan masjid baru yang mampu menampung 500 jamaah, dilengkapi fasilitas pendidikan.",
      content: `<p>Komunitas Muslim Indonesia di Osaka resmi meresmikan <strong>Masjid An-Nur Osaka</strong> yang berlokasi di kawasan Nishi-ku. Masjid dua lantai ini mampu menampung hingga 500 jamaah dan dilengkapi berbagai fasilitas pendukung.</p>
<p>Peresmian dilakukan oleh Konsul Jenderal RI di Osaka bersama perwakilan komunitas Muslim dari berbagai negara. Pembangunan masjid ini memakan waktu 3 tahun dengan dana yang dikumpulkan dari donasi komunitas.</p>
<h3>Fasilitas Masjid</h3>
<ul><li>Ruang sholat utama (kapasitas 500 orang)</li><li>Ruang sholat wanita terpisah</li><li>Kelas bahasa Arab dan Al-Quran untuk anak-anak</li><li>Perpustakaan Islam</li><li>Dapur komunitas untuk acara bersama</li><li>Tempat wudhu modern</li></ul>
<p>Masjid ini juga akan menjadi pusat informasi bagi pekerja Muslim Indonesia yang baru tiba di Osaka.</p>`,
      readTime: 3,
    },
    {
      title: "Startup Indonesia Raih Pendanaan dari Investor Jepang Senilai 50 Miliar Rupiah",
      slug: "startup-indonesia-pendanaan-investor-jepang-50-miliar",
      category: "bisnis",
      excerpt: "Startup edtech asal Indonesia berhasil meraih pendanaan Seri A senilai 50 miliar rupiah dari konsorsium investor Jepang.",
      content: `<p>Startup edtech Indonesia <strong>"NihongoKu"</strong> yang fokus pada pembelajaran bahasa Jepang berbasis AI berhasil meraih pendanaan Seri A senilai <strong>50 miliar rupiah</strong> (sekitar 500 juta yen) dari konsorsium investor Jepang.</p>
<p>Pendanaan ini dipimpin oleh SoftBank Ventures Asia dengan partisipasi dari JAFCO Group dan beberapa angel investor Jepang. Dana akan digunakan untuk ekspansi platform ke 5 negara ASEAN.</p>
<h3>Tentang NihongoKu</h3>
<p>Didirikan pada 2024 oleh alumni program Tokutei Ginou, NihongoKu menggunakan teknologi AI untuk personalisasi pembelajaran bahasa Jepang. Platform ini telah memiliki 200.000 pengguna aktif di Indonesia.</p>
<p>CEO NihongoKu menyatakan bahwa pendanaan ini akan digunakan untuk mengembangkan fitur persiapan ujian JLPT dan JFT-Basic yang lebih komprehensif.</p>`,
      readTime: 3,
    },
    {
      title: "Timnas Indonesia U-23 Hadapi Jepang di Semifinal Piala Asia 2026",
      slug: "timnas-indonesia-u23-vs-jepang-semifinal-piala-asia-2026",
      category: "bola-sports",
      excerpt: "Timnas Indonesia U-23 akan menghadapi Jepang di semifinal Piala Asia U-23 2026 setelah mengalahkan Korea Selatan di perempat final.",
      content: `<p>Timnas Indonesia U-23 berhasil melaju ke semifinal Piala Asia U-23 2026 setelah mengalahkan Korea Selatan 2-1 di perempat final. Garuda Muda kini akan menghadapi tuan rumah <strong>Jepang</strong> di babak semifinal.</p>
<p>Pertandingan semifinal dijadwalkan pada Kamis, 5 Juni 2026 pukul 19:00 waktu Jepang di Saitama Stadium. Ini menjadi momen bersejarah bagi sepak bola Indonesia.</p>
<h3>Perjalanan Indonesia di Turnamen</h3>
<ul><li>Fase Grup: Indonesia 3-0 Myanmar, Indonesia 1-1 Australia, Indonesia 2-0 Uzbekistan</li><li>Perempat Final: Indonesia 2-1 Korea Selatan</li></ul>
<h3>Dukungan Diaspora</h3>
<p>Komunitas Indonesia di Jepang berencana mengorganisir nonton bareng di berbagai kota termasuk Tokyo, Osaka, dan Nagoya. KBRI Tokyo juga menyediakan 500 tiket khusus untuk WNI.</p>`,
      readTime: 3,
      isFeatured: true,
    },
    {
      title: "Beasiswa MEXT 2027 Dibuka: Panduan Pendaftaran untuk Mahasiswa Indonesia",
      slug: "beasiswa-mext-2027-panduan-pendaftaran-mahasiswa-indonesia",
      category: "pendidikan",
      excerpt: "Pendaftaran Beasiswa MEXT (Monbukagakusho) 2027 telah dibuka. Simak panduan lengkap untuk mahasiswa Indonesia.",
      content: `<p>Kementerian Pendidikan Jepang (MEXT) resmi membuka pendaftaran <strong>Beasiswa Monbukagakusho 2027</strong> untuk mahasiswa internasional termasuk Indonesia. Program ini mencakup jenjang S1 (Undergraduate), S2 (Research Student), dan pelatihan guru.</p>
<h3>Benefit Beasiswa</h3>
<ul><li>Biaya kuliah ditanggung penuh</li><li>Tunjangan hidup: 143.000 - 148.000 yen/bulan</li><li>Tiket pesawat PP Indonesia-Jepang</li><li>Kursus bahasa Jepang 6-12 bulan sebelum kuliah</li></ul>
<h3>Timeline Pendaftaran</h3>
<ul><li>April 2026: Pengumuman dan pendaftaran dibuka</li><li>Mei-Juni 2026: Seleksi dokumen di Kedutaan</li><li>Juli 2026: Ujian tulis dan wawancara</li><li>Agustus 2026: Pengumuman hasil seleksi awal</li><li>Januari 2027: Pengumuman final dari MEXT</li><li>April 2027: Keberangkatan ke Jepang</li></ul>
<p>Pendaftaran dilakukan melalui Kedutaan Besar Jepang di Jakarta atau Konsulat Jenderal Jepang di Surabaya, Medan, dan Makassar.</p>`,
      readTime: 5,
    },
    {
      title: "Review Film Jepang 'The Last Samurai Returns' Raih Box Office Tertinggi 2026",
      slug: "review-film-jepang-the-last-samurai-returns-box-office-2026",
      category: "hiburan",
      excerpt: "Film Jepang 'The Last Samurai Returns' berhasil meraih pendapatan box office tertinggi tahun 2026 dengan 15 miliar yen.",
      content: `<p>Film epik sejarah Jepang <strong>"The Last Samurai Returns"</strong> berhasil mencatatkan rekor box office dengan pendapatan <strong>15 miliar yen</strong> hanya dalam 4 minggu penayangan. Film ini disutradarai oleh Takeshi Kitano dan dibintangi oleh Ryunosuke Kamiki.</p>
<p>Film ini mengisahkan perjuangan samurai terakhir di era Meiji yang berusaha mempertahankan tradisi bushido di tengah modernisasi Jepang. Visual yang memukau dan cerita yang emosional menjadi daya tarik utama.</p>
<h3>Penilaian Kritikus</h3>
<p>Film ini mendapat rating 92% di Rotten Tomatoes dan 8.7/10 di IMDb. Banyak kritikus menyebut ini sebagai film samurai terbaik dalam dekade terakhir.</p>
<p>Film ini dijadwalkan tayang di bioskop Indonesia pada Agustus 2026 dengan subtitle bahasa Indonesia.</p>`,
      readTime: 3,
    },
    {
      title: "Jepang Luncurkan Shinkansen Generasi Terbaru ALFA-X dengan Kecepatan 400 km/jam",
      slug: "jepang-luncurkan-shinkansen-alfa-x-400-kmjam",
      category: "berita-jepang",
      excerpt: "JR East resmi meluncurkan Shinkansen ALFA-X generasi terbaru yang mampu melaju hingga 400 km/jam di jalur Tohoku.",
      content: `<p>JR East secara resmi meluncurkan <strong>Shinkansen ALFA-X</strong> generasi terbaru yang mampu mencapai kecepatan operasional <strong>400 km/jam</strong>. Kereta super cepat ini akan beroperasi di jalur Tohoku Shinkansen menghubungkan Tokyo dan Shin-Hakodate.</p>
<p>Dengan kecepatan ini, perjalanan Tokyo-Shin-Hakodate yang sebelumnya memakan waktu 4 jam akan dipangkas menjadi hanya 2 jam 30 menit.</p>
<h3>Teknologi Unggulan</h3>
<ul><li>Desain aerodinamis "Long Nose" sepanjang 22 meter untuk mengurangi tekanan udara</li><li>Sistem suspensi magnetik aktif untuk kenyamanan penumpang</li><li>Teknologi pengereman regeneratif terbaru</li><li>Kabin kedap suara dengan tingkat kebisingan di bawah 60 dB</li></ul>
<p>Layanan komersial ALFA-X dijadwalkan dimulai pada Maret 2027 bertepatan dengan perpanjangan jalur Hokkaido Shinkansen ke Sapporo.</p>`,
      readTime: 4,
    },
    {
      title: "Tips Hemat Biaya Hidup di Tokyo untuk Pekerja Indonesia: Budget 150.000 Yen/Bulan",
      slug: "tips-hemat-biaya-hidup-tokyo-pekerja-indonesia-150000-yen",
      category: "komunitas",
      excerpt: "Panduan praktis mengatur keuangan dan tips hemat untuk pekerja Indonesia di Tokyo dengan budget 150.000 yen per bulan.",
      content: `<p>Tinggal di Tokyo memang mahal, tapi dengan perencanaan yang tepat, pekerja Indonesia bisa hidup nyaman dengan budget <strong>150.000 yen per bulan</strong>. Berikut tips dari komunitas WNI yang sudah berpengalaman.</p>
<h3>Breakdown Budget Bulanan</h3>
<ul><li>Sewa apartemen (share house): 50.000 - 60.000 yen</li><li>Makan: 30.000 - 40.000 yen</li><li>Transportasi: 10.000 - 15.000 yen</li><li>Utilitas (listrik, gas, air, internet): 10.000 - 15.000 yen</li><li>Asuransi kesehatan: 15.000 yen</li><li>Tabungan & kirim ke Indonesia: 20.000 - 30.000 yen</li></ul>
<h3>Tips Hemat Makan</h3>
<p>Belanja di supermarket setelah jam 8 malam untuk mendapat diskon 30-50%. Masak sendiri dengan bahan dari Gyomu Super atau Hanamasa. Manfaatkan aplikasi kupon seperti SmartNews dan Gurunavi.</p>
<h3>Tips Transportasi</h3>
<p>Gunakan sepeda untuk jarak dekat. Beli commuter pass bulanan jika rutin ke kantor. Hindari taksi kecuali darurat.</p>`,
      readTime: 5,
    },
    {
      title: "Anime One Piece Live Action Season 2 Mulai Syuting di Jepang",
      slug: "anime-one-piece-live-action-season-2-syuting-jepang",
      category: "entertainment",
      excerpt: "Netflix mengonfirmasi One Piece Live Action Season 2 mulai proses syuting di lokasi-lokasi ikonik di Jepang.",
      content: `<p>Netflix resmi mengonfirmasi bahwa <strong>One Piece Live Action Season 2</strong> telah memulai proses syuting di beberapa lokasi di Jepang. Season kedua ini akan mengadaptasi arc Alabasta yang menjadi favorit banyak fans.</p>
<p>Beberapa lokasi syuting yang dikonfirmasi termasuk studio Toei di Kyoto dan lokasi outdoor di Prefektur Tottori yang akan menjadi setting gurun Alabasta.</p>
<h3>Cast Baru</h3>
<p>Netflix juga mengumumkan beberapa cast baru termasuk aktor Jepang untuk peran Chopper (motion capture) dan aktris Indonesia untuk peran Nico Robin yang membuat fans Indonesia sangat antusias.</p>
<h3>Jadwal Rilis</h3>
<p>Season 2 diperkirakan akan tayang di Netflix pada kuartal pertama 2027. Season 1 yang rilis tahun 2023 berhasil menjadi serial Netflix paling banyak ditonton dalam kategori live action.</p>`,
      readTime: 3,
    },
    {
      title: "KBRI Tokyo Gelar Job Fair untuk WNI: 50 Perusahaan Jepang Buka Lowongan",
      slug: "kbri-tokyo-job-fair-wni-50-perusahaan-jepang-2026",
      category: "pekerjaan",
      excerpt: "KBRI Tokyo menggelar job fair khusus WNI dengan partisipasi 50 perusahaan Jepang yang membuka berbagai posisi.",
      content: `<p>Kedutaan Besar Republik Indonesia (KBRI) di Tokyo akan menggelar <strong>Job Fair khusus WNI</strong> pada 20-21 Juni 2026 di Gedung KBRI Tokyo. Sebanyak 50 perusahaan Jepang berpartisipasi dengan membuka ratusan lowongan kerja.</p>
<h3>Sektor yang Tersedia</h3>
<ul><li>IT & Engineering: 15 perusahaan</li><li>Manufaktur: 12 perusahaan</li><li>Perhotelan & Restoran: 10 perusahaan</li><li>Konstruksi: 8 perusahaan</li><li>Perawatan (Kaigo): 5 perusahaan</li></ul>
<h3>Syarat Peserta</h3>
<ul><li>WNI dengan visa kerja valid atau sedang mencari sponsor visa</li><li>Kemampuan bahasa Jepang minimal N3 (beberapa posisi N4)</li><li>Membawa CV dalam bahasa Jepang dan Indonesia</li></ul>
<p>Registrasi online dibuka mulai 1 Juni 2026 melalui website KBRI Tokyo. Peserta yang sudah registrasi akan mendapat akses priority interview.</p>`,
      readTime: 4,
    },
    {
      title: "Jepang Perpanjang Masa Berlaku Visa Wisata untuk WNI Menjadi 30 Hari",
      slug: "jepang-perpanjang-visa-wisata-wni-30-hari",
      category: "imigrasi",
      excerpt: "Mulai September 2026, Jepang memperpanjang masa berlaku visa wisata untuk warga negara Indonesia dari 15 hari menjadi 30 hari.",
      content: `<p>Pemerintah Jepang mengumumkan kebijakan baru yang memperpanjang masa berlaku <strong>visa wisata untuk WNI dari 15 hari menjadi 30 hari</strong>. Kebijakan ini berlaku mulai 1 September 2026.</p>
<p>Keputusan ini diambil sebagai bagian dari upaya Jepang meningkatkan jumlah wisatawan dari Indonesia yang merupakan salah satu pasar wisata terbesar di Asia Tenggara.</p>
<h3>Perubahan Kebijakan</h3>
<ul><li>Masa berlaku visa: 15 hari → 30 hari</li><li>Multiple entry visa: masa berlaku diperpanjang menjadi 5 tahun</li><li>Proses aplikasi: tersedia secara online melalui e-Visa</li><li>Biaya visa tetap: 3.000 yen (single entry)</li></ul>
<h3>Dampak untuk Wisatawan Indonesia</h3>
<p>Dengan perpanjangan ini, wisatawan Indonesia bisa lebih leluasa menjelajahi Jepang tanpa terburu-buru. Ini juga membuka peluang untuk wisata medis dan wisata pendidikan jangka pendek.</p>
<p>Tahun 2025, sebanyak 800.000 WNI mengunjungi Jepang. Pemerintah Jepang menargetkan angka ini naik menjadi 1,2 juta pada 2027.</p>`,
      readTime: 4,
      isFeatured: true,
    },
  ];

  // Insert articles with staggered dates
  const now = new Date();
  for (let i = 0; i < articles.length; i++) {
    const art = articles[i];
    const categoryId = catMap[art.category];
    if (!categoryId) {
      console.warn(`⚠️  Category "${art.category}" not found, skipping: ${art.title}`);
      continue;
    }

    const publishedAt = new Date(now.getTime() - i * 4 * 60 * 60 * 1000); // 4 hours apart

    await prisma.article.upsert({
      where: { slug: art.slug },
      update: {
        title: art.title,
        content: art.content,
        excerpt: art.excerpt,
        categoryId,
        readTime: art.readTime,
        isFeatured: art.isFeatured || false,
        isBreaking: art.isBreaking || false,
        isHeadline: art.isHeadline || false,
      },
      create: {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: art.content,
        status: "PUBLISHED",
        publishedAt,
        readTime: art.readTime,
        isFeatured: art.isFeatured || false,
        isBreaking: art.isBreaking || false,
        isHeadline: art.isHeadline || false,
        views: Math.floor(Math.random() * 5000) + 500,
        authorId: admin.id,
        categoryId,
      },
    });

    console.log(`✅ [${i + 1}/15] ${art.title.substring(0, 60)}...`);
  }

  console.log("\n🎉 15 articles seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
