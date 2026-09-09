# 💍 The Wedding of Karim Gharba - Luxury Digital Wedding Invitation

Aplikasi web undangan pernikahan digital islami (*Luxury Islamic Digital Wedding Invitation*) bertema **Deep Royal Navy & Champagne Gold** dengan fitur interaktif lengkap, pemutar audio otomatis, personalisasi nama tamu undangan dinamis, integrasi Google Maps & Calendar, serta sistem RSVP / Buku Tamu persisten dan tersinkronisasi secara *real-time* berbasis **Firebase Realtime Database (Cloud Database)**.

---

## ✨ Fitur Unggulan

- 🎨 **Desain Mewah & Responsif**: Palet warna *Royal Navy* (`#04081c`) & *Champagne Gold* (`#d4af37`), tipografi kaligrafi Arab (*Amiri, Noto Naskh Arabic*) & font modern (*Cinzel, Great Vibes, Poppins*).
- ✨ **Animasi Sparkles**: Efek partikel gemerlap emas melayang (*floating sparkles*) di latar belakang.
- ✉️ **Cover Gate Interaktif**: Sampul pembuka dengan animasi pita divider dan tombol sentuh *"TOUCH TO OPEN / اِفْتَحِ الدَّعْوَةَ"*.
- 🎵 **Background Audio Player**: Musik instrumen pengiring otomatis saat undangan dibuka, dilengkapi tombol kontrol mengambang (*floating toggle button*).
- 🏷️ **Personalisasi Tamu Dinamis**: Mendukung parameter query URL (`?to=...`, `?p=...`, `?c=...`) untuk menampilkan nama tamu dan nomor undangan secara otomatis di sampul dan formulir.
- ⏳ **Live Countdown Timer**: Penghitung waktu mundur akurat menuju 26 September 2026 pukul 19:00 WIB.
- 📅 **Integrasi Google Calendar**: Tombol 1-klik *"Save The Date"* untuk menambahkan agenda langsung ke Google Calendar tamu.
- 📍 **Lokasi & Peta Interaktif**: Peta Google Maps tersemat (*embedded*) ke *The Ritz-Carlton Jakarta, Mega Kuningan* beserta tombol direct link navigasi.
- 💳 **Amplop Digital (Digital Gift)**: Informasi rekening BCA a.n. Karim Gharba dengan fitur 1-klik salin nomor rekening (*copy to clipboard*) dan notifikasi *toast*.
- 💬 **Buku Tamu & RSVP Realtime Cloud (Firebase)**: 
  - Terhubung ke **Firebase Realtime Database** untuk penyimpanan data global lintas-pengguna secara permanen.
  - **Live Synchronization**: Setiap ada ucapan baru, feed ucapan dan statistik (*Attending* / *Unable*) di layar seluruh tamu akan terupdate secara instan tanpa perlu reload.
  - **State Handling & UX**: Dilengkapi animasi loading spinner pada tombol submit dan toast feedback interaktif.
  - Dilengkapi perlindungan sanitasi XSS (*Cross-Site Scripting*).

---

## 📁 Struktur Direktori

```text
kariminvitation/
├── index.html        # Struktur markup halaman, seksi acara, dan SEO meta tags
├── style.css         # Desain tampilan visual, animasi CSS, & tata letak responsif
├── script.js         # Logika interaktif (Audio, Countdown, Firebase RSVP, URL Parser)
├── bg.jpg            # Gambar latar belakang pernikahan
├── karim.jpg         # Foto profil mempelai pria (Karim Gharba)
├── server.js         # Server lokal opsional (Development preview)
└── README.md         # Dokumentasi proyek
```

---

## 🔥 Panduan Konfigurasi Firebase Realtime Database

Untuk menghubungkan buku tamu ke Firebase project Anda sendiri:

1. **Buka Firebase Console**: Kunjungi [https://console.firebase.google.com/](https://console.firebase.google.com/) dan buat project baru (misalnya `karim-wedding-invitation`).
2. **Aktifkan Realtime Database**:
   - Di menu samping, klik **Build > Realtime Database**.
   - Klik **Create Database**, pilih lokasi server (misalnya `Singapore (asia-southeast1)`).
   - Pilih **Start in test mode** atau atur **Rules** ke:
     ```json
     {
       "rules": {
         "wishes": {
           ".read": true,
           ".write": true,
           ".indexOn": ["createdAt"]
         }
       }
     }
     ```
3. **Dapatkan Kredensial Web App**:
   - Masuk ke **Project Settings** (ikon gerigi) > **General** > **Your apps** > Pilih ikon **Web (`</>`)**.
   - Salin objek `firebaseConfig`.
4. **Pasang Kredensial ke `script.js`**:
   - Buka berkas [`script.js`](script.js), lalu perbarui variabel `firebaseConfig`:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

---

## 🚀 Cara Menjalankan & Deployment

### 1. Menjalankan di Komputer Lokal (Localhost)
- Cukup buka berkas [`index.html`](index.html) di browser, atau
- Jalankan `node server.js` lalu akses `http://localhost:8080`.

### 2. Deploy ke Hosting Gratis (Vercel / Netlify / GitHub Pages)
Karena arsitektur frontend sekarang adalah **Pure Static Web App + Cloud Database**, Anda dapat langsung mendeploy proyek ini ke:
- **Vercel**: `vercel deploy --prod` atau import repository GitHub di dashboard Vercel.
- **Netlify**: Drag & drop folder proyek ke [app.netlify.com/drop](https://app.netlify.com/drop).
- **GitHub Pages**: Aktifkan GitHub Pages pada repository di tab **Settings > Pages > Branch: main**.

---

## 🔗 Panduan Format Link Personalisasi Tamu

Anda dapat membuat link khusus untuk dibagikan kepada keluarga, rekan, atau tamu kehormatan melalui parameter URL:

| Parameter | Keterangan | Contoh Nilai |
|---|---|---|
| `to` / `name` | Nama lengkap tamu | `Ahmad Fauzi` / `Dr. Irfan` |
| `p` / `prefix` | Sapaan / gelar pembuka *(default: Bapak & Ibu)* | `Bapak & Keluarga`, `Saudara` |
| `c` / `guest` | Nomor urut / kode tamu | `0012` |

### Contoh Format URL:

- **Undangan Umum (Public)**:
  ```text
  https://nama-domain-anda.com/
  ```
- **Undangan Personal Sederhana**:
  ```text
  https://nama-domain-anda.com/?to=Ahmad+Fauzi
  ```
- **Undangan Personal Lengkap dengan Gelar & Nomor Tamu**:
  ```text
  https://nama-domain-anda.com/?to=Muhammad+Al-Mansoor&p=Bapak&c=0024
  ```

---

## 🛠️ Spesifikasi Teknologi

- **Frontend**: HTML5, Vanilla CSS3 (Custom Properties, Animations, Responsive Design), Vanilla JavaScript (ES6+).
- **Cloud Database**: Firebase Realtime Database SDK v10 (Compat Web).
- **Typography**: Google Fonts (*Amiri*, *Cinzel*, *Great Vibes*, *Cormorant Garamond*, *Poppins*, *Noto Naskh Arabic*).
- **Icons**: Font Awesome 6.

---

## ⚙️ Panduan Kustomisasi Data Acara

- **Mengubah Tanggal & Waktu Acara**:
  - Ubah teks tanggal di [`index.html`](index.html) pada bagian `#hero`.
  - Ubah target countdown di [`script.js`](script.js) pada baris:
    ```javascript
    const targetDate = new Date('2026-09-26T19:00:00+07:00').getTime();
    ```
- **Mengubah Nomor Rekening / Hadiah Digital**:
  - Edit nomor rekening dan nama bank di seksi `#hadiah` pada [`index.html`](index.html).
  - Sesuaikan atribut `data-account` pada tombol copy.
- **Mengubah Lagu Musik Pengiring**:
  - Ubah tag `<source src="...">` pada elemen `<audio id="bg-music">` di [`index.html`](index.html).

---

## 📜 Lisensi

Hak Cipta © 2026 **Karim Gharba**. Semua hak dilindungi undang-undang.
