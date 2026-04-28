### **Product Requirement Documen (PRD): Web Portofolio Pribadi Crispian**

**1. Tujuan Strategis**
Platform ini bertujuan mendemonstrasikan penguasaan teknis, otonomi, dan komunikasi yang jelas bagi *software engineer* yang menargetkan pekerjaan *remote* global. Sistem ini berfungsi sebagai validasi teknis melalui performa tinggi, desain antarmuka yang mutakhir, dan manajemen konten yang otonom.

**2. Arsitektur Teknis & Framework**
Aplikasi ini memanfaatkan teknologi modern yang mendukung kinerja cepat dan visual yang dinamis:
*   **Frontend:** Next.js 15 dengan *App Router* dan *React Server Components* (RSC) untuk optimasi muatan klien.
*   **Styling & Theming:** **Tailwind CSS** dipadukan dengan pustaka manajemen tema (seperti `next-themes`) untuk mengatur utilitas warna dan fungsionalitas mode gelap/terang.
*   **Animasi:** **Framer Motion** digunakan untuk memberikan interaktivitas tingkat lanjut dan animasi yang mulus tanpa membebani kinerja.
*   **Backend:** Supabase (Database PostgreSQL, Auth, Storage, dan Edge Functions).

**3. Spesifikasi UI/UX & Desain Visual**
Integrasi desain ini berfokus pada estetika modern yang interaktif namun tetap menjaga keterbacaan (*readability*) yang tinggi.

*   **A. Konsep Visual Utama**
    *   **Gaya Desain:** *Modern Glassmorphism*.
    *   **Karakteristik Glassmorphism:** Diimplementasikan melalui utilitas Tailwind CSS dengan kombinasi `bg-opacity`, efek `backdrop-blur-md`, dan garis tepi `border-white/20`. Efek ini diterapkan secara konsisten pada komponen *cards*, *navbar*, dan *modal*.
    *   **Layout:** Mengadopsi prinsip *responsive design* dengan pendekatan *mobile-first*. Perpindahan antar-bagian (*section*) dirancang dengan transisi yang halus.

*   **B. Skema Warna & Tema (Theming)**
    Sistem mendukung peralihan tema secara dinamis dengan durasi transisi **300ms**:
    *   **Mode Terang (Light Mode):** Palet warna yang *colorful* dan harmonis. Gradasi warna cerah (*vibrant blue to purple* atau *sunset orange*) digunakan sebagai aksen latar belakang/dekoratif. Teks dijaga agar memiliki kontras tinggi (`text-slate-900`) di atas elemen berwarna.
    *   **Mode Gelap (Dark Mode):** Latar belakang solid gelap (`bg-slate-950`). Komponen *glassmorphism* menyesuaikan dengan `bg-black/30` agar menyatu natural dengan latar gelap.

*   **C. Animasi & Interaktivitas**
    *   **Animasi 3D Ringan:** Integrasi **Framer Motion** untuk memberikan efek *floating 3D* pada elemen dekoratif.
    *   **Visualisasi Roadmap:** Perjalanan karier/proyek menggunakan visualisasi *roadmap* dengan animasi garis yang muncul saat *scrolling* (*scroll-triggered animation*).

*   **D. Penanganan Aset Hero & Ilustrasi Karakter**
    *   **1. Detail Aset & Optimasi:** Aset utama untuk bagian *Hero* menggunakan file gambar `Gemini_Generated_Image_mtkygumtkygumtky.jpg` (ilustrasi karakter 3D/kartun). Untuk memaksimalkan performa pemuatan, developer wajib menggunakan komponen `<Image />` dari `next/image` dengan properti `priority={true}`. Hal ini memprioritaskan pemuatan gambar *above-the-fold* untuk mengoptimalkan metrik LCP (*Largest Contentful Paint*).
    *   **2. Penanganan Latar Belakang (Transparansi):** Karena gambar asli memiliki latar belakang putih solid, integrasi menggunakan CSS diperlukan. Pendekatan CSS yang digunakan adalah `mix-blend-mode: multiply` (efektif di mode terang) atau menggunakan utilitas `mask-image`/`clip-path` pada Tailwind CSS agar karakter menyatu dengan latar belakang situs.
        *   *Rekomendasi Alternatif:* Sangat disarankan agar *background* putih pada file asli dihapus secara permanen menggunakan aplikasi eksternal (seperti Photoshop atau layanan *remove-bg*), kemudian disimpan dalam format PNG transparan atau WebP sebelum ditempatkan di folder `public` untuk hasil paling optimal.
    *   **3. Tata Letak dan Responsivitas (Hero Section):**
        *   **Tampilan Desktop:** Karakter ditampilkan dominan dengan ukuran 60-70% tinggi layar (*viewport height*) dengan atribut `object-fit: contain`. Posisikan karakter di sebelah kanan layar, diatur agar bagian bawahnya terpotong natural di batas bawah *section* atau dilapisi di belakang kartu teks (*glassmorphism card*) untuk ilusi kedalaman.
        *   **Tampilan Mobile:** Karakter diposisikan di area tengah atas (di bawah *navbar* dan tepat di atas teks sambutan utama) dengan ukuran yang diskalakan secara proporsional dengan lebar layar perangkat.
    *   **4. Integrasi dengan Design System & Tema:**
        *   **Mode Terang (Colorful):** Terapkan elemen dekoratif abstrak (*gradient blobs*) berwarna cerah tepat di belakang karakter. Gunakan efek *backdrop-blur* (*glassmorphism*) di area sekitar karakter untuk menciptakan efek *3D layering*.
        *   **Mode Gelap (Dark Mode):** Aplikasikan bayangan menyala halus (*subtle outer glow* atau *drop-shadow* dengan warna terang) pada batas pinggiran karakter. Efek ini menjaga figur karakter tetap tajam dan menonjol di latar belakang yang gelap.
    *   **5. Interaksi dan Animasi (Framer Motion):**
        *   **Entrance Animation:** Gunakan transisi *fade-in* berdurasi lambat dengan efek *slide-up* ringan yang terpicu otomatis saat halaman pertama kali termuat.
        *   **Idle Animation:** Terapkan animasi pergerakan melayang tiada henti (*infinite floating*) berupa pergerakan naik-turun. Gunakan amplitudo pergeseran yang kecil dengan durasi pelan untuk mengesankan karakter yang hidup selagi pengguna membaca konten.

**4. Komponen Antarmuka Pengguna (UI Components)**
*   **Navbar:** *Sticky header* bergaya *glassmorphism* dengan tombol *toggle* tema.
*   **Section About:** Desain lapang dengan tipografi kuat pada profil kandidat.
*   **Section Skill:** Daftar keahlian pada kartu ringkas dengan efek *hover* yang memicu bayangan halus dan efek pembesaran (*scale up*).
*   **Section Contact:** Formulir kontak minimalis terintegrasi langsung dengan Supabase Edge Functions.

**5. Integrasi Data Visual & Pihak Ketiga**
*   **GitHub & Medium Slots:** Komponen kartu bergaya *Glassmorphism* untuk repositori populer dan artikel terbaru.
*   **Pengambilan Data:** Penarikan dinamis dari API GitHub dan Medium (melalui *rss-parser*), diamankan dengan strategi *Incremental Static Regeneration* (ISR) agar tercegah dari *rate limit* sekaligus menyajikan data terbarui.

**6. Pemodelan Data Backend (Supabase PostgreSQL)**
*   `profiles`: Data bio, avatar (Supabase Storage), lokasi, dan ketersediaan *remote*.
*   `projects`: Proyek berformat STAR, tumpukan teknologi, dan tautan *live*.
*   **Row Level Security (RLS)**: Data bersifat publik hanya untuk hak akses `SELECT`, dan akses pembaruan (`UPDATE`, `INSERT`, `DELETE`) eksklusif untuk sesi *auth.uid()* pemilik situs.

**7. Alur Deployment (CI/CD)**
*   Di-*deploy* secara otomatis ke Vercel di setiap dorongan kode ke *branch* utama, memastikan pengiriman *edge-cached* yang optimal dengan latensi global terendah.