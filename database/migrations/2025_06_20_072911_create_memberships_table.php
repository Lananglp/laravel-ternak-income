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
        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama plan: Pro Plan, Premium, dsb
            $table->integer('price'); // Harga dalam rupiah
            $table->integer('duration_days')->nullable(); // Jumlah hari (null kalau lifetime)
            $table->string('tagline')->nullable(); // Tagline pendek
            $table->unsignedInteger('position')->default(0);
            // $table->text('description')->nullable(); // Deskripsi utama
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};
