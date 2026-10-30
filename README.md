# Situs pribadi Galih Fajar Fahreza

Situs statis satu halaman untuk tugas mata kuliah Bahasa Inggris (HTML, CSS, dan JavaScript biasa). Tidak ada framework, tidak ada build step, dan tidak ada dependensi yang perlu di-install. Situs ini di-host di GitHub Pages dan dibuka langsung di browser (tidak lagi disematkan ke Google Sites).

Panduan ini ditulis berurutan. Ikuti dari langkah 1 sampai 8.

---

## 1. Menjalankan di komputer sendiri (Live Server)

1. Buka folder proyek ini di VS Code (**File > Open Folder...**).
2. VS Code akan menawarkan ekstensi yang direkomendasikan. Pasang **Live Server** (ritwickdey.LiveServer). Kalau tawaran itu tidak muncul, buka tab Extensions (`Ctrl+Shift+X`), cari "Live Server", lalu klik Install.
3. Klik kanan `index.html`, pilih **Open with Live Server**.
4. Browser akan terbuka di `http://127.0.0.1:5500/`. Setiap kali file disimpan, halaman memuat ulang sendiri.

Cara lain kalau tidak memakai VS Code:

- Klik dua kali `index.html`. Halaman tetap jalan dari `file://` karena data dimuat dengan tag `<script src>` biasa, bukan `fetch`.
- Atau jalankan server kecil dari terminal di folder proyek:

  ```bash
  python -m http.server 8000
  ```

  lalu buka `http://localhost:8000/`.

---

## 2. File mana mengatur apa

| File / folder | Isinya |
| --- | --- |
| `index.html` | Kerangka halaman dan teks tetap: hero (nama sebagai entri kamus), Self-introduction video (bingkai video saja), kerangka bagian CV, esai e-commerce (introduction, advantages, disadvantages, conclusion), judul bagian, dan footer. Urutan halaman: Home, Intro video, CV, E-commerce, Journals. |
| `css/style.css` | Semua tampilan: warna (token di bagian `:root`), font, tata letak, dan efek hover/pressed. Aturan di bawah `.js-motion` hanya aktif kalau animasi berjalan. |
| `js/main.js` | Isi dan perilaku: video perkenalan (klik untuk memuat), garis bawah menu sesuai bagian yang sedang dibaca, foto di hero, poin e-commerce dan timbangan, filter jurnal, proyek, dan link kontak. Semuanya tetap jalan tanpa animasi. |
| `js/cv.js` | Bagian CV: 13 langkah panduan, tab peran, planner, checklist, dan CV contoh beserta tombol versinya. Semua teksnya diambil dari `data/cv-guide.js` dan `data/cv.js`. |
| `js/motion.js` | Semua animasi (GSAP). Lihat langkah 7. |
| `js/vendor/` | GSAP dan plugin-nya (ScrollTrigger, Flip, SplitText) serta Lenis (scroll halus), di-host sendiri. Jangan diedit. |
| `data/journals.js` | Daftar lima jurnal (array `JOURNALS`). |
| `data/config.js` | Link kontak (GitHub, LinkedIn, portfolio, email), foto di hero, video perkenalan, dan PDF CV. Yang dibiarkan `""` tidak akan tampil. |
| `data/cv.js` | CV lengkap: pengantar, kontak, pendidikan, pengalaman, lima versi (Master, Full-stack, Cybersecurity, QA, IT support), checklist akhir, dan baris format. |
| `fonts/` | Font Anybody (judul, bisa melebar/menyempit) dan Newsreader (teks), file woff2 yang di-host sendiri beserta lisensinya (SIL Open Font License). |
| `assets/favicon.svg` | Ikon tab browser. |
| `_inbox/` | Folder kerja pribadi. Tercantum di `.gitignore`, jadi tidak ikut ter-upload ke GitHub. |
| `.nojekyll` | Memberi tahu GitHub Pages agar tidak memproses situs dengan Jekyll. Jangan dihapus. |
| `CLAUDE.md` | Instruksi untuk sesi Claude Code berikutnya (dalam bahasa Inggris). |

Mengisi link kontak: buka `data/config.js`, isi nilai yang ingin ditampilkan, misalnya:

```js
window.CONFIG = {
  github: "https://github.com/username-kamu",
  linkedin: "",
  email: "",

  photo: "",
  photoAlt: "Portrait of Galih Fajar Fahreza"
};
```

Dengan isian di atas, footer hanya menampilkan link GitHub.

Menambahkan foto di hero:

1. Simpan foto ke folder `assets/`, misalnya `assets/photo.jpg`. Foto potret (tegak) paling cocok, karena tampilannya dipotong ke rasio 4:5. Usahakan ukurannya di bawah 300 KB supaya halaman tetap cepat.
2. Di `data/config.js`, isi `photo: "assets/photo.jpg"`. Tulis nama file persis sama, termasuk huruf besar/kecil, karena GitHub Pages membedakannya.
3. Kalau perlu, ubah `photoAlt` menjadi deskripsi singkat foto dalam bahasa Inggris (dibacakan oleh screen reader).

Selama `photo` kosong, slot foto tidak tampil. Kalau diisi, foto muncul miring di kolom kanan hero, di bawah tombol.

Mengubah teks: semua teks yang terlihat ada di `index.html`, kecuali daftar jurnal (`data/journals.js`) dan isi CV (`data/cv.js`). Tulis dalam bahasa Inggris dengan gaya yang sama: santai tapi sopan, kalimat aktif, dan tanpa tanda pisah panjang (em dash). Baca ulang setiap kalimat sebelum disimpan, karena ini tugas bahasa Inggris.

---

## 3. Pengalaman dan proyek

Situs tidak lagi punya bagian Experience terpisah. Semua pengalaman dan proyek (skripsi, website Muara Sikabaluan, EDM, V-Code, KPU FTI, Smart Comp, Bug hunter) ada di CV, dan diedit di `data/cv.js` (lihat langkah 4b). Galeri foto Muara Sikabaluan dan EDM ikut tampil di entri CV-nya masing-masing.

---

## 4. Video perkenalan, panduan CV, dan bug bounty

Ketiga bagian ini membaca isinya dari file di folder `data/`. Selama datanya masih kosong, halaman menampilkan keadaan "coming soon" yang sudah didesain, jadi situs tetap terlihat rapi.

### 4a. Menambahkan video perkenalan

Pilih salah satu cara, lalu isi bagian `video` di `data/config.js`.

**Cara 1: YouTube (disarankan)**

1. Unggah video ke YouTube dan atur visibilitasnya ke **Unlisted** (hanya yang punya link yang bisa menonton).
2. Salin ID videonya, yaitu 11 karakter setelah `watch?v=`. Contoh: dari `https://www.youtube.com/watch?v=AbCdEfGhIjK`, ID-nya `AbCdEfGhIjK`.
3. Isi:

   ```js
   video: {
     provider: "youtube",
     id: "AbCdEfGhIjK",
     ...
   }
   ```

Player YouTube baru dimuat setelah pengunjung menekan tombol play (lewat `youtube-nocookie.com`), jadi halaman tetap ringan dan video tidak pernah berputar sendiri.

**Cara 2: file mp4 sendiri**

1. Simpan video di `assets/video/`, misalnya `assets/video/intro.mp4`. Usahakan ukurannya kecil (di bawah sekitar 25 MB), karena GitHub Pages bukan layanan video.
2. Isi `provider: "file"` dan `src: "assets/video/intro.mp4"`.
3. Opsional: `poster` (gambar sampul) dan `captions` (file subtitle `.vtt`, sangat disarankan).

Dengan file mp4, titik merah REC, penghitung waktu, dan equalizer di bingkai bergerak hanya saat video benar-benar diputar.

**Naskah video:** tidak ditampilkan di halaman. Simpan naskahmu sendiri (draf ada di `_inbox/CONTENT_CV_Video.md`, bagian E).

**Selama video belum diisi**, bingkai di bagian "Self-introduction video" hanya menampilkan placeholder "Introduction video coming soon" dengan tombol play yang nonaktif. Untuk menampilkan video, isi `id` (YouTube) atau `src` (file mp4) di bagian `video` pada `data/config.js`, seperti langkah di atas. Tidak ada catatan lain yang muncul di halaman.

### 4b. Mengedit CV

Semua isi CV ada di `data/cv.js` (sumbernya `_inbox/CONTENT_CV_Informatics_v2.md`). Bagian CV mengikuti urutan panduan dosen (Step 3 sampai 10), dan ada lima tab versi.

- Entri pengalaman ditulis sekali di `experience`. Setiap versi memilih dan mengurutkan entri lewat id, misalnya `["muara", "edm", "vcode"]`. Variasi kalimat untuk versi tertentu ditulis di `variants` (contoh `smartcomp:short`).
- `profile`, `skills`, dan `portfolio` ditulis per versi.
- Foto di CV memakai slot dari `data/photos.js` (lihat langkah 4e), misalnya logo V-Code dan sertifikat.
- Desa Cisempur dan link GitHub sengaja belum dimasukkan. Tambahkan kalau sudah kamu putuskan.
- Jangan pernah menulis nomor HP atau email.

Foto untuk CV dan bagian lain diatur di langkah 4e.

### 4c. Mengisi pengalaman bug bounty

Pengalaman bug bounty sekarang hanya tampil di CV, sebagai entri "Bug hunter" di `data/cv.js` (`experience.bounty`). 

Isinya untuk sementara masih **DUMMY** (lihat checklist "Ganti sebelum publish" di bawah). Untuk menggantinya:

1. Tulis catatanmu di `_inbox/bug-bounty.md` (folder ini tidak ikut ter-upload): periode, platform yang boleh disebut, hasil, skill dan tools, serta cerita singkat yang sudah disamarkan.
2. Ganti teks di `experience.bounty` (`summary`, `scope`, `bullets`, `story`, `chips`) dengan fakta aslimu, atau minta Claude Code membacanya dari `_inbox/`.
3. Hapus `placeholder: true` dan komentar `// DUMMY` setelah semuanya asli.

### Ganti sebelum publish

Item di bawah ini berisi teks **DUMMY**: contoh yang masuk akal, tapi belum fakta. Semuanya ditandai `placeholder: true` dan komentar `// DUMMY: replace with real facts` di `data/cv.js`. Saat situs dibuka, console browser (F12, tab Console) juga menampilkan daftar item ini.

- [ ] `experience.bounty`, entri "Bug hunter": `summary`, `scope`, ketiga `bullets`, `story`, dan `chips`. Tampil di tab Master CV.
- [ ] `variants["bounty:short"]`, versi singkat (ringkasan dan chips saja). Tampil di tab Cybersecurity analyst dan Software tester (QA).
- [ ] Setelah diganti, hapus `placeholder: true` dan komentar `// DUMMY`, lalu cek console: daftarnya harus kosong.

Keamanan: jangan pernah menulis nama target, nama program yang tidak boleh disebut, langkah eksploitasi, endpoint, payload, atau apa pun yang dilarang aturan disclosure program.

### 4d. Menambahkan CV dalam bentuk PDF

1. Buat versi PDF yang aman untuk publik: **hapus nomor HP dan email** dari PDF terlebih dahulu.
2. Simpan di `assets/cv/`, misalnya `assets/cv/Galih-Fajar-Fahreza-CV.pdf`.
3. Isi `cvPdf: "assets/cv/Galih-Fajar-Fahreza-CV.pdf"` di `data/config.js`. Tombol "Download CV (PDF)" langsung muncul di atas CV contoh.

### 4e. Foto

Semua foto diatur di `data/photos.js`. Selama `src` masih kosong, setiap slot menampilkan placeholder yang sudah didesain: rasio yang benar, ikon kamera, lokasi file tujuan, ukuran yang disarankan, dan ide caption. Begitu foto ada, isi `src` dan halaman langsung menampilkan fotonya.

**Letak tiap foto**

| Slot | Muncul di | File | Ukuran |
| --- | --- | --- | --- |
| `portrait` | Hero (kartu miring 4:5) | `assets/images/profile/portrait.jpg` | 1200 x 1500 |
| `cv-photo` | Kepala CV (opsional) | `assets/images/profile/portrait.jpg` | 600 x 800 |
| `edm-01` s.d. `edm-06` | Galeri EDM di entri EDM pada CV | `assets/images/edm/` | 1600 x 1067 |
| `muara-*` | Mockup desktop, HP, dan screenshot Muara Sikabaluan di entri CV-nya | `assets/images/projects/muara-sikabaluan/` | 1600 x 1000 (HP 780 x 1690) |
| `vcode-logo` | Entri V-Code di CV | `assets/images/brand/vcode-logo.svg` | persegi |
| `codelamp-cert` | Sertifikat di CV | `assets/images/certs/codelamp-mobile-pentest.jpg` | 1600 x 1200 |
| `cyber-setup` | Tab Cybersecurity di CV | `assets/images/cyber/setup.jpg` | 1600 x 1067 |
| `video-poster` | Sampul video | `assets/video/poster.jpg` | 1600 x 900 |
| `kpu-fti` | (disembunyikan, `hidden: true`) | `assets/images/activities/kpu-fti-01.jpg` | 1600 x 1067 |

**Cara mengisi:** simpan file di lokasi tadi, lalu di `data/photos.js` isi `src` dengan path yang sama, misalnya `src: "assets/images/edm/edm-01.jpg"`. Sesuaikan `width` dan `height` dengan ukuran asli file, dan cek `alt` (deskripsi singkat dalam bahasa Inggris). Untuk membuang slot yang tidak perlu, tulis `hidden: true`.

**Format dan ukuran:** JPEG atau WebP, sisi terpanjang 1600 px (potret 1200 x 1500), sekitar 150 sampai 400 KB per foto. Nama file huruf kecil dengan tanda hubung, tanpa spasi.

**Hapus EXIF (lokasi GPS) dan kompres:** foto dari HP menyimpan koordinat GPS, termasuk foto dari Mentawai. Pilih salah satu:
- Dengan ImageMagick: `magick in.jpg -resize 1600x -strip -quality 82 out.jpg`. Untuk satu folder sekaligus: `tools/optimize-images.sh assets/images/edm` (jalankan di Git Bash).
- Tanpa instal apa pun: buka [squoosh.app](https://squoosh.app), atur lebar 1600 px dan kualitas sekitar 80, lalu simpan. Squoosh juga membuang metadata.

**Izin dan privasi:**
- Minta izin sebelum menampilkan orang yang bisa dikenali, dan lebih hati-hati lagi untuk siswa dan anak-anak. Lewati foto wajah yang tidak ada izinnya.
- Jangan tampilkan nomor identitas, nomor sertifikat, QR code, chat pribadi, atau kredensial. Blur dulu.
- Screenshot cybersecurity tidak boleh memuat nama target.

**Pratinjau link (og-image):** `assets/images/og-image.jpg` sekarang berisi placeholder yang dibuat otomatis. Ganti dengan gambar 1200 x 630 milikmu dengan nama yang sama. Setelah situs online, ubah `content` pada `<meta property="og:image">` di `index.html` menjadi URL lengkap, misalnya `https://USERNAME.github.io/REPO/assets/images/og-image.jpg`, karena WhatsApp dan Facebook membutuhkan alamat lengkap.

---

## 5. Publikasi ke GitHub Pages

1. Masuk ke [github.com](https://github.com), klik **New repository**.
   - Isi nama repo, misalnya `portofolio`.
   - Pilih **Public**. Di akun gratis, GitHub Pages hanya bisa dipakai untuk repo publik.
   - Jangan centang "Add a README" (README sudah ada di folder ini).
2. Buka terminal di folder proyek (di VS Code: **Terminal > New Terminal**), lalu jalankan:

   ```bash
   git init
   git add .
   git commit -m "First version of my site"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```

   Ganti `USERNAME` dan `REPO` dengan milikmu. Kalau diminta login, ikuti petunjuk dari Git atau GitHub.
3. Di halaman repo, buka **Settings > Pages**.
4. Pada **Build and deployment**, pilih **Source: Deploy from a branch**.
5. Pilih branch **main** dan folder **/ (root)**, lalu klik **Save**.
6. Tunggu satu sampai beberapa menit. Progresnya terlihat di tab **Actions**.
7. Situs akan tersedia di:

   ```
   https://USERNAME.github.io/REPO/
   ```

   Contoh: username `galihff` dan repo `portofolio` menghasilkan `https://galihff.github.io/portofolio/`.

Setiap ada perubahan, cukup jalankan:

```bash
git add .
git commit -m "Jelaskan perubahannya"
git push
```

GitHub Pages akan memperbarui situs secara otomatis.

---

## 6. Troubleshooting

**Muncul halaman 404 dari GitHub**
- Pastikan GitHub Pages sudah aktif (Settings > Pages menampilkan "Your site is live at ...") dan repo bersifat Public.
- Tunggu beberapa menit setelah push pertama.
- Cek URL-nya: harus `https://USERNAME.github.io/REPO/`, termasuk nama repo dan huruf besar/kecil yang persis sama.
- Pastikan `index.html` ada di folder paling atas repo, bukan di dalam subfolder.

**Perubahan tidak muncul (cache lama)**
- Cek tab **Actions** di GitHub: tunggu sampai deploy terbaru berwarna hijau.
- Tekan `Ctrl+F5` (atau `Cmd+Shift+R` di Mac) untuk memuat ulang tanpa cache.
- Kalau masih membandel, buka URL dengan tambahan versi, misalnya `https://USERNAME.github.io/REPO/?v=2`.

**Scroll terasa "melayang" atau terlalu halus**
- Itu efek Lenis (scroll halus untuk roda mouse). Keyboard, scrollbar, dan layar sentuh tetap memakai scroll bawaan browser.
- Untuk mengatur kehalusannya, ubah `lerp: 0.12` di `js/motion.js` (makin besar, makin cepat dan kurang halus). Untuk mematikannya saja, hapus baris `js/vendor/lenis.min.js` di `index.html`; animasi lain tetap jalan.

**Alternatif kalau GitHub Pages bermasalah**
- **Netlify**: buka [app.netlify.com/drop](https://app.netlify.com/drop), lalu seret folder proyek ke halaman itu. URL `https://nama-acak.netlify.app` langsung jadi. (Hapus dulu folder `_inbox/` dari salinan yang diunggah, karena drag-and-drop tidak membaca `.gitignore`.)
- **Cloudflare Pages**: hubungkan repo GitHub, kosongkan "Build command", isi "Build output directory" dengan `/`. URL-nya berbentuk `https://nama-proyek.pages.dev`.

---

## 7. Animasi: cara kerjanya dan cara mematikannya

Semua gerakan ada di satu file, `js/motion.js`, terpisah dari `js/main.js`. Library-nya GSAP (dengan plugin ScrollTrigger, Flip, dan SplitText) ditambah Lenis untuk scroll halus, semuanya di-host sendiri di `js/vendor/` dan dimuat dengan tag `<script>` biasa, tanpa CDN.

**Urutannya:**

1. Saat halaman dibuka: huruf "Galih", "Fajar", dan "Fahreza" naik satu per satu sambil melebar dan menebal sampai ketiga baris sama lebar, lalu tiga definisi muncul dengan efek sapuan, stiker "pop", dan terakhir navigasi muncul. Total sekitar 1,6 detik (lebih singkat di HP). Klik atau tekan tombol apa saja untuk melewatinya.
2. Saat menggulir layar pertama: ketiga baris nama bergeser ke arah yang berlawanan sambil meregang, dan pita kata (marquee) berjalan sedikit lebih cepat kalau halaman digulir cepat.
3. Judul tiap bagian muncul baris demi baris, stabilo di About tergambar dari kiri ke kanan, dan pita warna menyapu di antara bagian. Masing-masing hanya sekali.
5. Poin e-commerce membuka dengan tinggi yang halus, timbangan miring sesuai jumlah poin yang terbuka, dan filter jurnal memindahkan baris dengan animasi FLIP.
6. Di desktop dengan mouse: scroll halus (Lenis), tombol "magnetis", dan kursor lingkaran yang membesar di atas link. Di HP semuanya tidak aktif.
7. Bingkai video di bagian Self-introduction video: bingkai tergambar sekali saat pertama terlihat, sudut viewfinder merapat, cincin warna dan lencana "Hello, I'm Galih" berputar pelan, stiker kecil melayang, dan bingkai sedikit miring mengikuti mouse (maksimal 5 derajat). Putaran dan lencana hanya berjalan saat bagian itu terlihat di layar.

**Mengubah durasi:** buka `js/motion.js`, cari objek `TIME` di bagian atas. Semua durasi (dalam detik) ada di situ, misalnya `letters: 0.6` untuk huruf nama, atau `marqueeLoop: 32` untuk kecepatan pita kata (makin besar, makin lambat). Dua jenis easing didaftarkan dengan nama `enter` (untuk yang muncul) dan `exit` (untuk yang hilang). Ubah di baris `gsap.registerEase` kalau ingin karakter gerak yang lain.

**Mematikan animasi:**

- Untuk pengunjung: kalau sistem operasinya memakai pengaturan "kurangi gerakan" (Reduce motion di iOS/macOS, atau Settings > Accessibility > Visual effects > Animation effects di Windows), semua animasi otomatis dilewati dan halaman langsung tampil lengkap.
- Untuk kamu: hapus baris `<script src="js/motion.js"></script>` di bagian bawah `index.html`. Halaman tetap utuh dan semua fitur (buka-tutup poin, timbangan, filter) tetap berfungsi, hanya tanpa gerakan. Kalau ingin lebih ringan lagi, hapus juga lima baris `js/vendor/...`.

**Aturan yang dijaga:** scroll tidak pernah "menjebak": scrollbar, keyboard (Page Down, spasi, panah), link di dalam halaman, dan layar sentuh tetap bekerja normal. Animasi hanya memakai transform, opacity, dan clip-path, dan kalau GSAP gagal dimuat semua konten tetap terlihat.

---

## 8. Checklist sebelum dikumpulkan

- [ ] Nama, NIM (2300018254), dan "Informatics, Universitas Ahmad Dahlan" di footer sudah benar.
- [ ] Tidak ada email pribadi, nomor telepon, atau data pribadi lain yang tidak ingin dipublikasikan.
- [ ] `data/config.js` hanya berisi link yang memang ingin ditampilkan.
- [ ] Foto di hero tampil (kalau `photo` diisi) dan nama filenya cocok persis.
- [ ] Esai e-commerce sudah dibaca ulang dengan suara keras: tata bahasa, ejaan, dan alurnya enak didengar.
- [ ] Animasi pembuka berjalan di laptop dan HP, dan halaman tetap bisa dibaca kalau animasinya dilewati.
- [ ] Video perkenalan sudah diisi (atau sengaja dibiarkan "coming soon"), dan naskahnya sudah dicek tata bahasanya.
- [ ] `data/cv.js` sudah dicek, tanpa nomor HP, email, atau tanda `[CONFIRM]`.
- [ ] PDF CV (kalau ada) sudah dihapus nomor HP dan emailnya.
- [ ] Isi bug bounty tidak menyebut target, endpoint, atau detail celah keamanan, dan tidak ada lagi item `placeholder: true` di `data/cv.js`.
- [ ] Semua link jurnal (Download PDF, Article page, DOI) bisa dibuka.
- [ ] Folder `_inbox/` tidak ikut ter-upload (cek daftar file di repo GitHub).
- [ ] `https://USERNAME.github.io/REPO/` bisa dibuka di jendela incognito.
- [ ] Situs sudah dicoba di laptop dan di HP, termasuk membuka beberapa poin e-commerce.
- [ ] Link GitHub Pages sudah dicoba dari perangkat lain (misalnya HP teman).
