# ARTO (Aplikasi Realitas Teraugmentasi & Observasi Anatomi)

## 1. Deskripsi Singkat Aplikasi
**ARTO** adalah platform laboratorium anatomi digital berbasis web yang dirancang inklusif untuk mahasiswa kedokteran di Indonesia. Aplikasi ini mengintegrasikan visualisasi anatomi 3D interaktif, teknologi *Augmented Reality* (AR) melalui protokol WebXR, dan Kecerdasan Buatan. ARTO hadir sebagai solusi inovatif untuk mengatasi tantangan kelangkaan kadaver, risiko paparan formalin, serta kesenjangan aksesibilitas fasilitas laboratorium medis berkualitas, khususnya di daerah tertinggal, terdepan, dan terluar (3T).
Link Demo Aplikasi:
https://arto-ten.vercel.app/

## 2. Fitur Utama
* 🌟 **Atlas3D (Eksplorasi 3D Interaktif):** Viewport 3D untuk memvisualisasikan sistem kerangka dan organ manusia secara spasial dan mendetail yang bisa diputar dan diperbesar.
* 📱 **Proyeksi Augmented Reality (AR):** Memungkinkan mahasiswa memproyeksikan model anatomi 3D ke lingkungan dunia nyata (di atas meja belajar) melalui kamera perangkat seluler tanpa perlu aplikasi tambahan.
* 🔬 **ARTOLab (Smart AI Scan):** Laboratorium radiologi digital berbasis *computer vision* yang mampu mendeteksi dan melabeli struktur anatomis atau anomali pada citra medis (seperti CT Scan/MRI) secara otomatis.
* 🤖 **Tomy AI Assistant:** Tutor diagnostik pendamping cerdas yang siap menjawab pertanyaan klinis dan anatomi mahasiswa secara *real-time*.
* 📝 **ARTOCurriculum (Adaptive Quiz):** Evaluasi pembelajaran dengan kuis pilihan ganda spesifik dan berbasis studi kasus klinis yang di-generate langsung oleh AI berdasarkan tingkat pemahaman pengguna.
* 📊 **Portal Dosen:** Dasbor manajemen untuk dosen guna memonitor metrik progres belajar, rata-rata kelulusan, dan riwayat kuis mahasiswa secara komprehensif.

## 3. Teknologi yang Digunakan
Aplikasi ini dibangun menggunakan ekosistem teknologi modern berbasis web:
* **Frontend:** React.js, TypeScript, Vite
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **3D & AR Engine:** Three.js, React Three Fiber, WebXR API
* **Kecerdasan Buatan (AI):** *Cloud-based Generative AI & Vision*. Sistem cerdas aplikasi ini tidak sekadar menggunakan API eksternal, melainkan membangun layer logika di atas *Large Language Model (LLM)* Google Gemini. Kami merancang arsitektur *prompt* khusus (*System Instructions & Context-Aware Prompting*) untuk membatasi halusinasi AI, menjaga akurasi klinis, dan memaksa model menghasilkan *output* terstruktur (JSON) agar dapat dibaca langsung oleh sistem antarmuka ARTO secara *real-time*.
* **Backend, Database, & Auth:** Firebase (Authentication, Cloud Firestore)
* **Routing:** React Router DOM

## 4. Cara Menjalankan Aplikasi
Berikut adalah langkah-langkah untuk menjalankan aplikasi ARTO di *environment* lokal Anda:

### Prasyarat:
* Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 18 atau terbaru).
* Dapatkan API Key dari Google Gemini (Google AI Studio) dan Firebase.

### Langkah-langkah:
1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/username-anda/arto-app.git
   cd arto-app
   
2. **Instal dependensi (packages):**
```bash
npm install
```

3. **Atur Environment Variables:**
Buat file bernama `.env` di *root folder* proyek, lalu salin dan sesuaikan variabel berikut (sesuaikan dengan kredensial API yang Anda gunakan di source code):
```env
VITE_GEMINI_API_KEY=masukkan_api_key_gemini_anda_di_sini
VITE_FIREBASE_API_KEY=masukkan_api_key_firebase_anda_di_sini
VITE_FIREBASE_AUTH_DOMAIN=domain_firebase_anda
VITE_FIREBASE_PROJECT_ID=project_id_firebase_anda
```

4. **Jalankan *Development Server*:**
```bash
npm run dev
```

5. **Akses Aplikasi:**
Buka *browser* Anda dan kunjungi tautan yang muncul di terminal (biasanya http://localhost:3000 atau http://localhost:5173).
