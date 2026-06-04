<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Rumah extends Model
{
    protected $fillable = [
        'nomor_rumah',
        'status_rumah',
    ];

    public function historyPenghuni(): HasMany
    {
        return $this->hasMany(PenghuniRumah::class);
    }

    public function penghuniAktif(): HasOne
    {
        return $this->hasOne(PenghuniRumah::class)->whereNull('tanggal_keluar');
    }

    public function historyPembayaran(): HasMany
    {
        return $this->hasMany(Pembayaran::class);
    }
}
