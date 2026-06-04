# 📋 Panduan Instalasi — RT Management App

Panduan ini menjelaskan langkah-langkah instalasi **Backend (Laravel)** dan **Frontend (React + Vite)** untuk aplikasi RT Management System.

---

## ⚙️ Persyaratan Sistem

Pastikan perangkat kamu telah terinstal:

| Kebutuhan | Versi Minimum |
|-----------|--------------|
| PHP | ≥ 8.2 |
| Composer | ≥ 2.x |
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| MySQL | ≥ 8.0 |
| Git | ≥ 2.x |

---

## 📁 Struktur Direktori

```
rt-management-app/
├── be_rt/          ← Backend (Laravel 12)
└── fe_rt/          ← Frontend (React 19 + Vite)
```

---

## 🔧 BAGIAN 1 — Instalasi Backend (`be_rt`)

### 1. Clone Repository

```bash
git clone https://github.com/riskyasyam/rt-management-app.git
cd rt-management-app
```

### 2. Masuk ke Direktori Backend

```bash
cd be_rt
```

### 3. Install Dependensi PHP

```bash
composer install
```

### 4. Salin File Konfigurasi Environment

```bash
cp .env.example .env
```

> **Windows (PowerShell):**
> ```powershell
> Copy-Item .env.example .env
> ```

### 5. Konfigurasi File `.env`

Buka file `.env` dan sesuaikan pengaturan database:

```env
APP_NAME=RT-Management
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=be_rt
DB_USERNAME=root
DB_PASSWORD=
```

> ⚠️ Pastikan database dengan nama `be_rt` sudah dibuat di MySQL sebelum melanjutkan.
>
> ```sql
> CREATE DATABASE be_rt;
> ```

### 6. Generate Application Key

```bash
php artisan key:generate
```

### 7. Jalankan Migrasi Database

Perintah ini akan membuat semua tabel yang dibutuhkan secara otomatis:

```bash
php artisan migrate
```

Tabel yang akan dibuat:
- `rumahs` — data unit rumah RT
- `wargas` — data warga / penghuni
- `penghuni_rumahs` — histori penghuni per rumah
- `pembayarans` — catatan pembayaran iuran
- `pengeluarans` — catatan pengeluaran RT
- `cache`, `jobs`, `sessions` — tabel sistem Laravel

### 8. (Opsional) Jalankan Seeder

Jika tersedia data contoh:

```bash
php artisan db:seed
```

### 9. Konfigurasi CORS

Pastikan CORS sudah dikonfigurasi agar frontend dapat berkomunikasi dengan backend. Cek file `config/cors.php` dan pastikan `allowed_origins` sudah menyertakan URL frontend:

```php
'allowed_origins' => ['http://localhost:5173'],
```

### 10. Jalankan Server Backend

```bash
php artisan serve
```

Server backend akan berjalan di: **http://localhost:8000**

> Untuk menghentikan server, tekan `Ctrl + C`.

---

## 🎨 BAGIAN 2 — Instalasi Frontend (`fe_rt`)

### 1. Masuk ke Direktori Frontend

Buka terminal baru (jangan tutup terminal backend), lalu:

```bash
cd rt-management-app/fe_rt
```

### 2. Install Dependensi Node.js

```bash
npm install
```

Dependensi utama yang akan terinstal:
- `react` & `react-dom` — library UI utama
- `react-router-dom` — routing halaman
- `axios` — HTTP client untuk komunikasi API
- `recharts` — library grafik/chart
- `@radix-ui/*` — komponen UI primitif (dialog, select, tabs, toast, dll.)
- `lucide-react` — ikon SVG
- `tailwindcss` & `vite` — build tool & styling

### 3. Konfigurasi Environment Frontend (Opsional)

Jika backend berjalan di URL selain `http://localhost:8000`, buat file `.env` di dalam folder `fe_rt/`:

```bash
# fe_rt/.env
VITE_API_BASE_URL=http://localhost:8000/api
```

Lalu sesuaikan `fe_rt/src/lib/api.js`:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});
```

### 4. Jalankan Server Development Frontend

```bash
npm run dev
```

Server frontend akan berjalan di: **http://localhost:5173**

> Untuk menghentikan server, tekan `Ctrl + C`.

---

## 🚀 Menjalankan Aplikasi Lengkap

Pastikan **kedua server** berjalan secara bersamaan di terminal yang berbeda:

| Terminal | Direktori | Perintah |
|----------|-----------|----------|
| Terminal 1 | `be_rt/` | `php artisan serve` |
| Terminal 2 | `fe_rt/` | `npm run dev` |

Kemudian buka browser dan akses: **http://localhost:5173**

---

## 🛑 Troubleshooting

### ❌ Error: `php artisan migrate` gagal
- Pastikan MySQL sudah berjalan
- Pastikan database `be_rt` sudah dibuat
- Cek konfigurasi `DB_USERNAME` dan `DB_PASSWORD` di `.env`

### ❌ Error: `composer install` gagal
- Pastikan PHP ≥ 8.2 terinstal: `php -v`
- Pastikan Composer terinstal: `composer -V`

### ❌ Frontend tidak bisa terhubung ke backend
- Pastikan backend sudah berjalan di port 8000
- Cek konfigurasi CORS di `be_rt/config/cors.php`
- Cek `baseURL` di `fe_rt/src/lib/api.js`

### ❌ Error: `npm install` gagal
- Pastikan Node.js ≥ 18 terinstal: `node -v`
- Coba hapus `node_modules` dan install ulang:
  ```bash
  rm -rf node_modules
  npm install
  ```

---

## 📬 Pengujian API (Opsional)

File Postman Collection tersedia di:
```
be_rt/RT_Management_API.postman_collection.json
```

Import file tersebut ke Postman untuk langsung menguji semua endpoint API yang tersedia.

---

*Dibuat untuk RT Management App — Laravel 12 + React 19*
