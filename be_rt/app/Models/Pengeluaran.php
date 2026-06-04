<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengeluaran extends Model
{
    protected $fillable = [
        'deskripsi',
        'nominal',
        'tanggal_pengeluaran',
    ];
}
