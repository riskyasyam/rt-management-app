<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\Pengeluaran;
use App\Models\Rumah;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class KeuanganController extends Controller
{
    // 1. Mencatat Pembayaran Iuran Warga (Kriteria 3.a, 3.b, 3.c)
    public function bayarIuran(Request $request)
    {
        $request->validate([
            'rumah_id' => 'required|exists:rumahs,id',
            'jenis_iuran' => 'required|in:satpam,kebersihan',
            'bulan_mulai' => 'required|integer|between:1,12',
            'tahun' => 'required|integer|digits:4',
            'durasi_bulan' => 'required|integer|min:1',
        ]);

        $rumah = Rumah::with('penghuniAktif')->findOrFail($request->rumah_id);
        
        // Validasi: Pastikan rumah ada penghuninya saat ini
        if (!$rumah->penghuniAktif) {
            return response()->json([
                'status' => 'error',
                'message' => 'Rumah ini sedang kosong, tidak bisa menerima pembayaran iuran.'
            ], 420);
        }

        $wargaId = $rumah->penghuniAktif->warga_id;
        $tarif = $request->jenis_iuran === 'satpam' ? 100000 : 15000; // Satpam: 100k, Kebersihan: 15k
        
        $currentBulan = $request->bulan_mulai;
        $currentTahun = $request->tahun;
        $recordsCreated = [];

        // Loop berdasarkan durasi bulan yang dibayarkan (Kriteria 3.c: bisa bayar 1 tahun sekaligus)
        for ($i = 0; $i < $request->durasi_bulan; $i++) {
            // Jika bulan melebihi Desember, reset ke Januari dan tambah tahun
            if ($currentBulan > 12) {
                $currentBulan = 1;
                $currentTahun++;
            }

            // Cek apakah bulan & tahun ini sudah pernah dibayar/lunas sebelumnya
            $sudahBayar = Pembayaran::where('rumah_id', $request->rumah_id)
                ->where('jenis_iuran', $request->jenis_iuran)
                ->where('bulan', $currentBulan)
                ->where('tahun', $currentTahun)
                ->where('status_pembayaran', 'lunas')
                ->exists();

            if (!$sudahBayar) {
                $pembayaran = Pembayaran::create([
                    'rumah_id' => $request->rumah_id,
                    'warga_id' => $wargaId,
                    'jenis_iuran' => $request->jenis_iuran,
                    'bulan' => $currentBulan,
                    'tahun' => $currentTahun,
                    'jumlah_bayar' => $tarif,
                    'status_pembayaran' => 'lunas',
                    'tanggal_bayar' => Carbon::now()
                ]);
                $recordsCreated[] = $pembayaran;
            }

            $currentBulan++;
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Pembayaran iuran berhasil dicatat',
            'total_bulan_dibayar' => count($recordsCreated)
        ]);
    }

    // 2. Mencatat Pengeluaran RT (Kriteria 16 & 17)
    public function tambahPengeluaran(Request $request)
    {
        $request->validate([
            'deskripsi' => 'required|string|max:255',
            'nominal' => 'required|numeric|min:0',
            'tanggal_pengeluaran' => 'required|date',
        ]);

        $pengeluaran = Pengeluaran::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Pengeluaran RT berhasil dicatat',
            'data' => $pengeluaran
        ], 201);
    }

    // 3. Histori Pembayaran Per Rumah (Kriteria 2.d)
    public function historiPembayaranRumah($rumah_id)
    {
        $histori = Pembayaran::with('warga')
            ->where('rumah_id', $rumah_id)
            ->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $histori]);
    }

    // 4. Report Summary & Saldo Sisa + Grafik 1 Tahun (Kriteria 3.d)
    public function reportSummary(Request $request)
    {
        $tahun = $request->query('tahun', Carbon::now()->year);

        // Ambil rekap pemasukan bulanan dari iuran yang LUNAS
        $pemasukanBulanan = Pembayaran::select(
                'bulan',
                DB::raw('SUM(jumlah_bayar) as total_pemasukan')
            )
            ->where('tahun', $tahun)
            ->where('status_pembayaran', 'lunas')
            ->groupBy('bulan')
            ->get()
            ->pluck('total_pemasukan', 'bulan')
            ->toArray();

        // Ambil rekap pengeluaran bulanan RT
        $pengeluaranBulanan = Pengeluaran::select(
                DB::raw('MONTH(tanggal_pengeluaran) as bulan'),
                DB::raw('SUM(nominal) as total_pengeluaran')
            )
            ->whereYear('tanggal_pengeluaran', $tahun)
            ->groupBy('bulan')
            ->get()
            ->pluck('total_pengeluaran', 'bulan')
            ->toArray();

        // Gabungkan data untuk struktur grafik 12 bulan (Januari - Desember)
        $chartData = [];
        $totalPemasukanSetahun = 0;
        $totalPengeluaranSetahun = 0;

        for ($m = 1; $m <= 12; $m++) {
            $masuk = $pemasukanBulanan[$m] ?? 0;
            $keluar = $pengeluaranBulanan[$m] ?? 0;

            $totalPemasukanSetahun += $masuk;
            $totalPengeluaranSetahun += $keluar;

            $chartData[] = [
                'bulan' => $m,
                'nama_bulan' => Carbon::create()->month($m)->translatedFormat('F'),
                'pemasukan' => (float)$masuk,
                'pengeluaran' => (float)$keluar,
                'saldo_bulan_ini' => (float)($masuk - $keluar)
            ];
        }

        return response()->json([
            'status' => 'success',
            'summary' => [
                'tahun' => (int)$tahun,
                'total_pemasukan' => $totalPemasukanSetahun,
                'total_pengeluaran' => $totalPengeluaranSetahun,
                'sisa_saldo_kas' => $totalPemasukanSetahun - $totalPengeluaranSetahun
            ],
            'chart_data' => $chartData
        ]);
    }

    // 5. Report Detail Transaksi Pemasukan & Pengeluaran Bulan Tertentu (Kriteria 3.e)
    public function reportDetailBulanan(Request $request)
    {
        $request->validate([
            'bulan' => 'required|integer|between:1,12',
            'tahun' => 'required|integer|digits:4'
        ]);

        $bulan = (int) $request->bulan;
        $tahun = (int) $request->tahun;

        // Ambil daftar pemasukan di bulan tersebut
        $pemasukan = Pembayaran::with(['rumah', 'warga'])
            ->where('bulan', $bulan)
            ->where('tahun', $tahun)
            ->where('status_pembayaran', 'lunas')
            ->get();

        // Ambil daftar pengeluaran di bulan tersebut
        $pengeluaran = Pengeluaran::whereMonth('tanggal_pengeluaran', $bulan)
            ->whereYear('tanggal_pengeluaran', $tahun)
            ->get();

        return response()->json([
            'status' => 'success',
            'periode' => Carbon::create()->month($bulan)->year($tahun)->translatedFormat('F Y'),
            'data' => [
                'pemasukan_detail' => $pemasukan,
                'pengeluaran_detail' => $pengeluaran,
                'total_pemasukan' => $pemasukan->sum('jumlah_bayar'),
                'total_pengeluaran' => $pengeluaran->sum('nominal'),
            ]
        ]);
    }
}