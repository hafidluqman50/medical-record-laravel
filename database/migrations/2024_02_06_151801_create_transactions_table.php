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
            $table->date('date_transaction');
            $table->string('invoice_number');
            $table->integer('sub_total');
            $table->integer('discount')->comment('total diskon untuk diskon dari sub total dan total sebelum bayar');
            $table->integer('discount_pay')->comment('total diskon untuk pembayaran');
            $table->integer('total');
            $table->integer('pay_total')->comment('uang bayar');
            $table->integer('change_money')->comment('uang kembalian');
            $table->enum('transaction_pay_type', ['tunai', 'kartu-debit-kredit']);
            $table->enum('type', ['UP', 'HV']);
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
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
