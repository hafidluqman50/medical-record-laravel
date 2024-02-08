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
        Schema::create('transaction_prescriptions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->date('date_transaction');
            $table->foreignId('prescription_id')
                  ->constrained('prescriptions')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->integer('sub_total');
            $table->integer('discount');
            $table->integer('total');
            $table->integer('pay_total');
            $table->integer('change_money');
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->enum('transaction_pay_type', ['tunai', 'kartu-debit-kredit']);
            $table->integer('status_transaction');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_prescriptions');
    }
};
