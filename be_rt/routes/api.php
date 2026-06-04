<?php

use App\Http\Controllers\Api\WargaController;
use App\Http\Controllers\Api\RumahController;
use App\Http\Controllers\Api\KeuanganController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes for RT Management System
|--------------------------------------------------------------------------
*/

// Endpoint Pengelolaan Penghuni/Warga (Kriteria 1)
Route::apiResource('warga', WargaController::class);

// Endpoint Pengelolaan Rumah & Histori Penghuni (Kriteria 2)
Route::get('rumah', [RumahController::class, 'index']);
Route::post('rumah', [RumahController::class, 'store']);
Route::post('rumah/{id}/set-penghuni', [RumahController::class, 'setPenghuni']);
Route::post('rumah/{id}/kosongkan', [RumahController::class, 'kosongkanRumah']);
Route::get('rumah/{id}/histori-penghuni', [RumahController::class, 'historiPenghuni']);

// Endpoint Keuangan, Iuran, & Report Keuangan (Kriteria 3)
Route::post('keuangan/bayar-iuran', [KeuanganController::class, 'bayarIuran']);
Route::post('keuangan/pengeluaran', [KeuanganController::class, 'tambahPengeluaran']);
Route::get('rumah/{id}/histori-pembayaran', [KeuanganController::class, 'historiPembayaranRumah']);
Route::get('keuangan/report-summary', [KeuanganController::class, 'reportSummary']);
Route::get('keuangan/report-detail', [KeuanganController::class, 'reportDetailBulanan']);