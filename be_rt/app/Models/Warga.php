<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warga extends Model
{
    protected $fillable = [
        'nama_lengkap',
        'foto_ktp',
        'status_warga',
        'nomor_telepon',
        'status_pernikahan'
    ];

    public function sejarahRumah(): HasMany
    {
        return $this->hasMany(PenghuniRumah::class);
    }

    public function pembayaran(): HasMany
    {
        return $this->hasMany(Pembayaran::class);
    
    }
}
