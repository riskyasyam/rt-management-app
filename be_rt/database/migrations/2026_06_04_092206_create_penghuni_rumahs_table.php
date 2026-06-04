<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penghuni_rumahs', function (Blueprint $table) {
            $table->id();
            //Foreign
            $table->foreignId('rumah_id')->constrained()->cascadeOnDelete();
            $table->foreignId('warga_id')->constrained()->cascadeOnDelete();
            
            $table->date('tanggal_masuk');
            $table->date('tanggal_keluar')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penghuni_rumahs');
    }
};
