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
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->id();
            #Foreign
            $table->foreignId('rumah_id')->constrained()->cascadeOnDelete();
            $table->foreignId('warga_id')->constrained()->cascadeOnDelete();
            
            $table->enum('jenis_iuran', ['satpam', 'kebersihan']);
            $table->unsignedTinyInteger('bulan');
            $table->year('tahun');
            $table->decimal('jumlah_bayar', 10, 2);
            $table->enum('status_pembayaran', ['lunas', 'belum_lunas'])->default('belum_lunas');
            $table->timestamp('tanggal_bayar')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};
