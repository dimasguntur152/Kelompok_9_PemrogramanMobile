# Kedai Tong Djajakarta — Mobile Prototype UI/UX (React Native & Expo)

Aplikasi mobile prototype untuk pemesanan makanan dan minuman **Kedai Tong Djajakarta** yang berlokasi di **GKB 2 Basement, Kampus 3 Universitas Muhammadiyah Malang (UMM)**. 

Aplikasi ini berfokus **HANYA UNTUK CUSTOMER / PEMBELI** (mahasiswa, dosen, pegawai, dan civitas akademika Kampus 3 UMM) untuk memudahkan pemesanan tanpa harus lelah turun-naik tangga ke area basement.

---

## 🍗 Identitas Brand & Desain Visual

- **Nama Usaha:** Kedai Tong Djajakarta (Usaha Mahasiswa UMM lolos pendanaan P2MW F&B).
- **Lokasi Fisik:** GKB 2 Basement, Kampus 3 UMM.
- **Identitas Visual:** Menggunakan logo resmi ayam jago tradisional dalam mangkuk merah bernuansa hangat dan banner UMM PMW Entrepreneur Corner.
- **Warna Brand:**
  - **Warna Utama:** Merah Tua / Deep Red (`#901A1E`), Merah Brand (`#B91C1C`).
  - **Warna Pendukung:** Warm Cream (`#FAF6F0`), Off-White (`#FBF9F5`), Putih (`#FFFFFF`), Aksen Oranye (`#EA580C`).
  - **Warna Teks:** Charcoal Gelap (`#1C1917`) dengan kontras tinggi (WCAG AA/AAA).

---

## 📱 Alur & Fitur Aplikasi (Customer Only)

### 1. Bottom Navigation (Tepat 3 Menu)
1. **Beranda**: Halaman utama kedai dengan header logo & sapaan *"Halo, Tong Family!"*, cerita owner P2MW UMM (Naufal Atha) dengan tombol *"Baca Selengkapnya"*, lokasi kedai GKB 2 Basement, dan tombol CTA utama **"PESAN SEKARANG"**.
2. **Aktivitas**: Riwayat pesanan pengguna (`#TDJ-001`, `#TDJ-002`, dst.) yang dapat diklik untuk membuka Detail Pesanan.
3. **Profil**: Profil sederhana pengguna (`user@example.com`), Informasi Akun, Bantuan, dan Tentang Kedai Tong Djajakarta.

> **Catatan:** Bottom navigation secara ketat disembunyikan pada seluruh alur transaksi: Menu, Keranjang, Checkout, Pembayaran, Pesanan Berhasil, Detail Pesanan, Lacak Pesanan, Chat, dan Pesanan Selesai.

### 2. Alur Pemesanan Lengkap
1. **Beranda ➔ Pesan Sekarang**
2. **Halaman Menu**:
   - Subtitle: *"Pilihan menu Tong Djajakarta untuk menemani aktivitasmu."*
   - **Search Bar**: Berfungsi real-time melakukan filtering nama menu (e.g. `Americano`, `Kopi`, `Matcha`, `Mie`, `Nasi`, `Coklat`, dll).
   - **Filter Kategori Horizontal**: `Semua`, `Kopi`, `Non-Kopi`, `Makanan`, `Lainnya` dengan badge aktif merah utama.
   - **Format List Kompak**: Menampilkan nama produk, label badge (`FAVORIT!`, `BEST SELLER!`, `DARK SERIES`, `LIGHT SERIES`), harga Rupiah, dan quantity control `[-] count [+]`.
   - **Ketersediaan**: Menu yang berstatus `Habis` (e.g. *Kopi Baileys*) diberi badge "Habis" dan tombol `+` dinonaktifkan.
   - **Floating Cart Bar**: Muncul ringkasan item & subtotal secara kompak (`X item • RpXX.XXX` + tombol *"Lihat Keranjang"*).
3. **Keranjang**:
   - Rincian item yang dipilih, tombol penyesuaian kuantitas `[-]` dan `[+]`, subtotal, biaya pengantaran, dan grand total.
   - Tombol *"Lanjutkan Checkout"*.
4. **Checkout**:
   - Pilihan metode penerimaan:
     - **DIANTAR**: Muncul form input teks manual alamat pengantaran (*"Contoh: GKB 2 lantai 5, depan ruang 502"*) + catatan opsional (*"Contoh: Tunggu di depan kelas"*). Disertai keterangan: *"Hanya tersedia di area Kampus 3 UMM"*.
     - **AMBIL DI KEDAI**: Menampilkan info titik ambil di GKB 2 Basement, Kampus 3 UMM (tanpa meminta input alamat).
   - Validasi inline yang bersih jika lokasi belum diisi atau metode belum dipilih.
5. **Pembayaran (QRIS Only)**:
   - Menampilkan total tagihan, mock graphic QRIS resmi berstandar nasional, dan panduan langkah pembayaran scan e-wallet / mobile banking.
   - Tombol *"Saya Sudah Membayar"*.
6. **Konfirmasi Pembayaran**:
   - Modal konfirmasi memastikan customer telah membayar melalui QRIS sebelum pesanan dibuat.
7. **Pesanan Berhasil**:
   - Icon checkmark elegan, nomor pesanan (`#TDJ-00X`), status `Menunggu`, metode penerimaan, dan tombol *"Lihat Detail Pesanan"*.
8. **Detail Pesanan**:
   - Rincian lengkap pesanan dan tombol *"Lacak Pesanan"* (tidak menampilkan tombol chat di halaman ini).
9. **Lacak Pesanan (Tracking)**:
   - Progress timeline modern dengan icon, warna, dan status teks:
     - Delivery: `Menunggu` ➔ `Diproses` ➔ `Sedang Diantar` ➔ `Selesai`
     - Pickup: `Menunggu` ➔ `Diproses` ➔ `Siap Diambil` ➔ `Selesai`
   - Kontrol simulasi tahap demo untuk mempermudah pengujian.
   - Tombol *"Chat dengan Penjual"*.
10. **Chat Pesanan**:
    - Mock percakapan antara customer dan barista/dapur GKB 2 Basement (`"Halo kak, pesanan saya sedang diantar ke GKB 2 lantai 5"`).
    - Input chat dan tombol kirim pesan interaktif.
11. **Pesanan Selesai**:
    - Tampilan checkmark *"Pesanan Selesai!"*, nomor pesanan, dan tombol *"Kembali ke Beranda"* (tanpa rating atau review sesuai spesifikasi).

---

## 🔐 Keamanan & Autentikasi (Week 5: Secure API)

Aplikasi Kedai Tong Djajakarta telah mengimplementasikan arsitektur keamanan berbasis token (**Token-Based Authentication**):
1. **Password Hashing (Server-side)**: Password pengguna diamankan dengan salt rounds 10 menggunakan `bcryptjs`. Tidak ada password dalam bentuk plain text yang disimpan di database `db.json`.
2. **Perlindungan Data Kredensial**: Respons endpoint Register (`POST /register`), Login (`POST /login`), dan Profil (`GET /profile`) tidak pernah menyertakan password atau hash password. UI dan log aplikasi bersih dari ekspos kredensial rahasia.
3. **JWT Access Token**: Login berhasil menerbitkan JSON Web Token (JWT) yang ditandatangani menggunakan secret key di backend (`JWT_SECRET`).
4. **Penyimpanan Token Aman**: Access token disimpan di client menggunakan `expo-secure-store` (iOS Keychain / Android Keystore dengan fallback web aman).
5. **Attach Token to API Request**: Permintaan ke endpoint terlindungi (`GET /profile`, `POST /orders`, `GET /orders`) menyertakan header `Authorization: Bearer <access_token>`.
6. **Proteksi & Revokasi Sesi**: Logout mencabut token di server (`POST /logout`), menghapus token dari SecureStore, dan backend menolak penggunaan ulang token lama.
7. **REST API Menu**: Endpoint `GET /menus` dari Week 4 tetap publik dan menyajikan seluruh 32 menu otentik Kedai Tong Djajakarta.

---

## 🛠️ Cara Menjalankan Project

### 1. Menjalankan Backend Server (Port 4000)
Backend menyediakan REST API menu, registrasi, autentikasi JWT, verifikasi profil, dan pencabutan token.
```bash
npm run api
```
Server akan berjalan di `http://localhost:4000`.

### 2. Menjalankan Frontend Expo
- **Web Browser**:
  ```bash
  npm run web
  ```
- **Expo Go (Ponsel Fisik Android / iOS)**:
  ```bash
  npm run start
  ```
  Pindai kode QR yang muncul di terminal menggunakan aplikasi **Expo Go**.

### 3. Menjalankan Pengujian Otomatis (17 Kriteria Wajib)
Jalankan seluruh test suite keamanan dan alur aplikasi:
```bash
npm test
```
Atau secara spesifik:
```bash
npm run test:security   # Pengujian 17 kriteria keamanan Week 5
npm run test:flow       # Pengujian 14 skenario alur customer
```
