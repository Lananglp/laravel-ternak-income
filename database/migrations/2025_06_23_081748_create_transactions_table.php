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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('membership_id')->nullable()->constrained()->onDelete('set null');

            $table->string('order_id')->unique(); // dari Midtrans
            $table->string('payment_type')->nullable(); // contoh: bank_transfer, gopay
            $table->string('transaction_status')->nullable(); // pending, settlement, expire, dll
            $table->string('transaction_id')->nullable(); // dari Midtrans
            $table->string('fraud_status')->nullable(); // optional, bisa kosong
            $table->json('response')->nullable(); // simpan full response Midtrans

            $table->timestamp('paid_at')->nullable(); // diisi kalau transaksi berhasil

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
