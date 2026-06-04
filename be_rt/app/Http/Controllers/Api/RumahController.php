<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rumah;
use App\Models\PenghuniRumah;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RumahController extends Controller
{
    // Tampilkan 20 Rumah beserta status & penghuni aktifnya saat ini (Kriteria 2.a, 2.e, 2.f)
    public function index()
    {
        $rumah = Rumah::with(['penghuniAktif.warga'])->get();
        return response()->json(['status' => 'success', 'data' => $rumah]);
    }

    // Tambah Rumah baru jika ada penambahan unit (Kriteria 2.a)
    public function store(Request $request)
    {
        $request->validate(['nomor_rumah' => 'required|string|unique:rumahs,nomor_rumah|max:10']);
        $rumah = Rumah::create(['nomor_rumah' => $request->nomor_rumah, 'status_rumah' => 'tidak_dihuni']);
        return response()->json(['status' => 'success', 'data' => $rumah], 201);
    }

    // Menambah / Mengubah penghuni di suatu rumah (Kriteria 2.b)
    public function setPenghuni(Request $request, $id)
    {
        $rumah = Rumah::findOrFail($id);
        $request->validate([
            'warga_id' => 'required|exists:wargas,id',
            'tanggal_masuk' => 'required|date'
        ]);

        // 1. Jika rumah sedang dihuni orang lain, keluarkan penghuni lama dulu (isi tanggal_keluar)
        $penghuniSekarang = PenghuniRumah::where('rumah_id', $id)->whereNull('tanggal_keluar')->first();
        if ($penghuniSekarang) {
            $penghuniSekarang->update(['tanggal_keluar' => Carbon::parse($request->tanggal_masuk)->subDay()->format('Y-m-d')]);
        }

        // 2. Daftarkan penghuni baru ke tabel junction history
        PenghuniRumah::create([
            'rumah_id' => $id,
            'warga_id' => $request->warga_id,
            'tanggal_masuk' => $request->tanggal_masuk,
            'tanggal_keluar' => null
        ]);

        // 3. Set status rumah menjadi dihuni
        $rumah->update(['status_rumah' => 'dihuni']);

        return response()->json(['status' => 'success', 'message' => 'Penghuni rumah berhasil diperbarui']);
    }

    // Mengosongkan Rumah (Penghuni keluar/pindah)
    public function kosongkanRumah(Request $request, $id)
    {
        $rumah = Rumah::findOrFail($id);
        $request->validate(['tanggal_keluar' => 'required|date']);

        $penghuniSekarang = PenghuniRumah::where('rumah_id', $id)->whereNull('tanggal_keluar')->first();
        if ($penghuniSekarang) {
            $penghuniSekarang->update(['tanggal_keluar' => $request->tanggal_keluar]);
        }

        $rumah->update(['status_rumah' => 'tidak_dihuni']);
        return response()->json(['status' => 'success', 'message' => 'Rumah berhasil dikosongkan']);
    }

    // Mendapatkan Catatan Historical Penghuni Rumah (Kriteria 2.c)
    public function historiPenghuni($id)
    {
        $histori = PenghuniRumah::with('warga')
            ->where('rumah_id', $id)
            ->orderBy('tanggal_masuk', 'desc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $histori]);
    }
}