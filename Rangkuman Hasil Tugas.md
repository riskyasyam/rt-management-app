# 📝 Rangkuman Hasil Tugas — RT Management App

**Nama Aplikasi:** RT Management System  
**Stack Teknologi:** Laravel 12 (Backend API) + React 19 + Vite (Frontend)  
**Tanggal Pengerjaan:** Juni 2026

---

## 📌 Deskripsi Aplikasi

RT Management App adalah aplikasi berbasis web untuk membantu pengelolaan administrasi RT (Rukun Tetangga) secara digital. Aplikasi ini mencakup manajemen data warga, pengelolaan rumah dan penghuni, serta pencatatan dan pelaporan keuangan RT.

---

## 🧱 Arsitektur Sistem

```
┌─────────────────────┐         ┌──────────────────────┐
│   Frontend (React)   │  HTTP   │  Backend (Laravel)   │
│   localhost:5173     │◄───────►│  localhost:8000/api  │
└─────────────────────┘         └──────────┬───────────┘
                                           │
                                    ┌──────▼──────┐
                                    │   MySQL DB   │
                                    │   (be_rt)    │
                                    └─────────────┘
```

---

## 🖥️ Fitur-Fitur Aplikasi

---

### 1. 📊 Dashboard

**Deskripsi:**  
Halaman utama yang menampilkan ringkasan informasi keseluruhan RT secara real-time, meliputi total warga, total rumah, status hunian, dan rekap keuangan singkat.

**Fitur yang ditampilkan:**
- Total jumlah warga terdaftar
- Total unit rumah (dihuni / kosong)
- Saldo kas RT saat ini
- Grafik / statistik ringkas

📸 **Screenshot:**

> ![Dashboard](/screenshot/1.Dashboard.png)

---

### 2. 👥 Manajemen Warga

**Deskripsi:**  
Halaman untuk mengelola data seluruh warga yang terdaftar di RT. Admin dapat menambah, melihat detail, mengedit, serta menghapus data warga.

**Fitur yang ditampilkan:**
- Tabel daftar warga dengan informasi lengkap (nama, NIK, nomor telepon, status)
- Form tambah warga baru (termasuk upload foto KTP/profil)
- Detail data warga
- Edit dan hapus data warga

📸 **Screenshot:**

> ![Menu Warga](/screenshot/2.Menu_Warga.png)

> ![Create Warga](/screenshot/3.Create_Warga.png)

---

### 3. 🏠 Manajemen Rumah & Penghuni

**Deskripsi:**  
Halaman untuk mengelola data unit rumah di lingkungan RT, termasuk status hunian dan histori penghuni setiap unit.

**Sub-fitur:**

#### a. Daftar Rumah
- Tabel semua unit rumah dengan status (dihuni / kosong)
- Informasi penghuni aktif saat ini
- Filter berdasarkan status hunian

📸 **Screenshot:**

> ![Daftar Rumah](/screenshot/4.Menu_Rumah_dan_Penghuni.png)

#### b. Set Penghuni
- Form untuk menetapkan warga sebagai penghuni aktif suatu unit rumah
- Validasi: satu rumah hanya boleh memiliki satu penghuni aktif

📸 **Screenshot:**

> ![Set Penghuni](/screenshot/6.Set_Penghuni.png)

#### c. Kosongkan Rumah
- Form untuk mencatat tanggal keluar penghuni dan mengosongkan unit rumah

📸 **Screenshot:**

> ![Kosongkan Rumah](/screenshot/5.Kosongkan_Rumah.png)

#### d. Histori Penghuni
- Riwayat lengkap siapa saja yang pernah menghuni suatu unit rumah beserta tanggal masuk dan keluar

📸 **Screenshot:**

> ![Histori Penghuni](/screenshot/7.Histori_Penghuni.png)

#### e. Histori Pembayaran per Rumah
- Rekap semua pembayaran iuran yang pernah dilakukan oleh penghuni suatu unit rumah

📸 **Screenshot:**

> ![Histori Pembayaran per Rumah](/screenshot/History_Per_Rumah.png)

---

### 4. 💰 Keuangan RT

**Deskripsi:**  
Halaman pengelolaan keuangan RT yang mencakup pencatatan iuran masuk, pengeluaran, serta pelaporan keuangan baik tahunan maupun bulanan.

---

#### a. Bayar Iuran

**Deskripsi:**  
Form untuk mencatat pembayaran iuran warga (iuran Satpam dan Kebersihan). Mendukung pembayaran sekaligus untuk beberapa bulan.

**Detail fitur:**
- Pilih rumah yang akan membayar (hanya rumah yang sedang dihuni)
- Pilih jenis iuran: **Satpam (Rp 100.000/bulan)** atau **Kebersihan (Rp 15.000/bulan)**
- Tentukan bulan mulai, tahun, dan durasi pembayaran (bisa bayar sekaligus hingga 12 bulan)
- Sistem otomatis mencegah duplikasi pembayaran bulan yang sama

📸 **Screenshot:**

> ![Bayar Iuran](/screenshot/8.Bayar_Iuran.png)

---

#### b. Tambah Pengeluaran

**Deskripsi:**  
Form untuk mencatat pengeluaran kas RT secara manual.

**Detail fitur:**
- Input deskripsi pengeluaran
- Input nominal (dalam Rupiah)
- Pilih tanggal pengeluaran

📸 **Screenshot:**

> ![Tambah Pengeluaran](/screenshot/9.Tambah_Pengeluaran.png)

---

#### c. Laporan Tahunan

**Deskripsi:**  
Halaman rekapitulasi keuangan dalam satu tahun, menampilkan total pemasukan, total pengeluaran, saldo kas, dan grafik batang per bulan.

**Detail fitur:**
- Filter laporan berdasarkan tahun
- Kartu ringkasan: Total Pemasukan, Total Pengeluaran, Saldo Kas
- Grafik batang: Pemasukan vs Pengeluaran per bulan (Januari–Desember)

📸 **Screenshot:**

> ![Laporan Tahunan](/screenshot/10.Laporan_Tahunan.png)

---

#### d. Detail Bulanan

**Deskripsi:**  
Laporan rinci transaksi keuangan untuk satu bulan tertentu, menampilkan daftar pemasukan dari iuran dan daftar pengeluaran RT.

**Detail fitur:**
- Filter berdasarkan bulan dan tahun
- Ringkasan total pemasukan dan pengeluaran bulan tersebut
- Tabel detail pemasukan: nomor rumah, nama warga, jenis iuran, periode, jumlah
- Tabel detail pengeluaran: deskripsi, tanggal, nominal

📸 **Screenshot:**

> ![Detail Bulanan](/screenshot/11.Detail_Bulanan.png)

---

## 🗄️ Struktur Database

Berikut tabel-tabel yang digunakan dalam sistem:

| Tabel | Fungsi |
|-------|--------|
| `wargas` | Menyimpan data warga RT |
| `rumahs` | Menyimpan data unit rumah |
| `penghuni_rumahs` | Histori penghuni setiap unit rumah |
| `pembayarans` | Catatan pembayaran iuran warga |
| `pengeluarans` | Catatan pengeluaran kas RT |

📸 **ERD (Entity Relationship Diagram):**

> *[Tambahkan foto/screenshot ERD di sini — file ERD.png sudah tersedia di root repository]*

---

## 🔌 Daftar Endpoint API

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| `GET` | `/api/warga` | Ambil semua data warga |
| `POST` | `/api/warga` | Tambah warga baru |
| `PUT` | `/api/warga/{id}` | Edit data warga |
| `DELETE` | `/api/warga/{id}` | Hapus warga |
| `GET` | `/api/rumah` | Ambil semua data rumah |
| `POST` | `/api/rumah` | Tambah unit rumah |
| `POST` | `/api/rumah/{id}/set-penghuni` | Tetapkan penghuni aktif |
| `POST` | `/api/rumah/{id}/kosongkan` | Kosongkan rumah |
| `GET` | `/api/rumah/{id}/histori-penghuni` | Histori penghuni rumah |
| `GET` | `/api/rumah/{id}/histori-pembayaran` | Histori bayar per rumah |
| `POST` | `/api/keuangan/bayar-iuran` | Catat pembayaran iuran |
| `POST` | `/api/keuangan/pengeluaran` | Catat pengeluaran RT |
| `GET` | `/api/keuangan/report-summary` | Laporan keuangan tahunan |
| `GET` | `/api/keuangan/report-detail` | Detail keuangan bulanan |

---

## ✅ Checklist Kriteria yang Terpenuhi

- [x] Manajemen data warga (tambah, lihat, edit, hapus)
- [x] Manajemen unit rumah RT
- [x] Penetapan penghuni aktif per unit rumah
- [x] Histori penghuni per unit rumah
- [x] Pencatatan pembayaran iuran (Satpam & Kebersihan)
- [x] Pembayaran iuran bisa sekaligus beberapa bulan
- [x] Pencatatan pengeluaran kas RT
- [x] Laporan keuangan tahunan dengan grafik
- [x] Laporan keuangan detail per bulan
- [x] Histori pembayaran per unit rumah
- [x] Validasi duplikasi pembayaran bulan yang sama
- [x] Desain UI responsif dan modern

---

*RT Management App — Tugas Sistem Informasi*
