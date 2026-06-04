<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WargaController extends Controller
{
    public function index()
    {
        $warga = Warga::all();
        return response()->json(['status' => 'success', 'data' => $warga]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap'     => 'required|string|max:255',
            'foto_ktp'         => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'status_warga'     => 'required|in:tetap,kontrak',
            'nomor_telepon'    => 'nullable|string|max:15',
            'status_pernikahan'=> 'required|in:menikah,belum_menikah',
        ]);

        $path = $request->file('foto_ktp')->store('uploads/ktp', 'public');

        $warga = Warga::create([
            'nama_lengkap'      => $request->nama_lengkap,
            'foto_ktp'          => $path,
            'status_warga'      => $request->status_warga,
            'nomor_telepon'     => $request->nomor_telepon,
            'status_pernikahan' => $request->status_pernikahan,
        ]);

        return response()->json(['status' => 'success', 'message' => 'Warga berhasil ditambahkan', 'data' => $warga], 201);
    }

    public function show($id)
    {
        $warga = Warga::findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $warga]);
    }

    public function update(Request $request, $id)
    {
        $warga = Warga::findOrFail($id);

        $request->validate([
            'nama_lengkap'     => 'required|string|max:255',
            'foto_ktp'         => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status_warga'     => 'required|in:tetap,kontrak',
            'nomor_telepon'    => 'nullable|string|max:15',
            'status_pernikahan'=> 'required|in:menikah,belum_menikah',
        ]);

        $data = $request->only(['nama_lengkap', 'status_warga', 'nomor_telepon', 'status_pernikahan']);

        if ($request->hasFile('foto_ktp')) {
            // Hapus foto KTP lama jika ada
            if ($warga->foto_ktp && Storage::disk('public')->exists($warga->foto_ktp)) {
                Storage::disk('public')->delete($warga->foto_ktp);
            }
            $data['foto_ktp'] = $request->file('foto_ktp')->store('uploads/ktp', 'public');
        }

        $warga->update($data);

        return response()->json(['status' => 'success', 'message' => 'Data warga berhasil diubah', 'data' => $warga->fresh()]);
    }

    public function destroy($id)
    {
        $warga = Warga::findOrFail($id);
        if ($warga->foto_ktp && Storage::disk('public')->exists($warga->foto_ktp)) {
            Storage::disk('public')->delete($warga->foto_ktp);
        }
        $warga->delete();
        return response()->json(['status' => 'success', 'message' => 'Warga berhasil dihapus']);
    }
}
