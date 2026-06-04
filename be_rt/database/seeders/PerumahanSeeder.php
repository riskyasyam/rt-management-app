<?php

namespace Database\Seeders;

use App\Models\Rumah;
use App\Models\Warga;
use App\Models\PenghuniRumah;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PerumahanSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Generate 20 Rumah Otomatis (Misal: Blok A-01 sampai A-20)
        for ($i = 1; $i <= 20; $i++) {
            $nomorRumah = 'A-' . str_pad($i, 2, '0', STR_PAD_LEFT);
            Rumah::create([
                'nomor_rumah' => $nomorRumah,
                'status_rumah' => 'tidak_dihuni', // Default awal, nanti di-update pas ada penghuninya
            ]);
        }

        // 2. Buat 15 Warga Tetap untuk Menempati Rumah A-01 sampai A-15
        $namaWargaTetap = [
            'Rizky Asyam', 'Budi Santoso', 'Siti Aminah', 'Andi Wijaya', 'Eko Prasetyo',
            'Dewi Lestari', 'Ahmad Fauzi', 'Rinaawati', 'Hendra Wijaya', 'Mega Utami',
            'Slamet Riyadi', 'Diana Putri', 'Aris Munandar', 'Fitriani', 'Taufik Hidayat'
        ];

        foreach ($namaWargaTetap as $index => $nama) {
            $warga = Warga::create([
                'nama_lengkap' => $nama,
                'foto_ktp' => 'uploads/ktp/dummy_tetap_' . ($index + 1) . '.jpg',
                'status_warga' => 'tetap',
                'nomor_telepon' => '0812345678' . str_pad($index, 2, '0', STR_PAD_LEFT),
                'status_pernikahan' => $index % 2 === 0 ? 'menikah' : 'belum_menikah',
            ]);

            // Hubungkan ke Rumah (Rumah ID 1 sampai 15)
            $rumahId = $index + 1;
            PenghuniRumah::create([
                'rumah_id' => $rumahId,
                'warga_id' => $warga->id,
                'tanggal_masuk' => Carbon::now()->subYears(1)->format('Y-m-d'), // Sudah tinggal sejak 1 tahun lalu
                'tanggal_keluar' => null, // Penghuni tetap aktif
            ]);

            // Update status rumah menjadi dihuni
            Rumah::where('id', $rumahId)->update(['status_rumah' => 'dihuni']);
        }

        // 3. Buat 2 Warga Kontrak untuk Menempati Rumah A-16 dan A-17 (Sisa 3 rumah kosong biar pas total 20 rumah)
        $namaWargaKontrak = ['Roni Setiawan', 'Siska Amelia'];

        foreach ($namaWargaKontrak as $index => $nama) {
            $warga = Warga::create([
                'nama_lengkap' => $nama,
                'foto_ktp' => 'uploads/ktp/dummy_kontrak_' . ($index + 1) . '.jpg',
                'status_warga' => 'kontrak',
                'nomor_telepon' => '0898765432' . str_pad($index, 2, '0', STR_PAD_LEFT),
                'status_pernikahan' => 'belum_menikah',
            ]);

            // Hubungkan ke Rumah (Rumah ID 16 dan 17)
            $rumahId = 15 + ($index + 1);
            PenghuniRumah::create([
                'rumah_id' => $rumahId,
                'warga_id' => $warga->id,
                'tanggal_masuk' => Carbon::now()->subMonths(3)->format('Y-m-d'), // Kontrak sejak 3 bulan lalu
                'tanggal_keluar' => null, // Status kontraknya masih aktif berjalan saat ini
            ]);

            // Update status rumah menjadi dihuni
            Rumah::where('id', $rumahId)->update(['status_rumah' => 'dihuni']);
        }
    }
}