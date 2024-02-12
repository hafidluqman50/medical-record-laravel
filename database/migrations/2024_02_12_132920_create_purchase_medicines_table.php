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
        Schema::create('purchase_medicines', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->foreignId('medical_supplier_id')
                  ->constrained('medical_suppliers')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->string('code');
            $table->date('date_receive')->comment('tanggal penerimaan');
            $table->integer('debt_time')->comment('waktu hutang; ex: 1 hari, 2 hari');
            $table->date('due_date')->comment('tanggal jatuh tempo');
            $table->enum('type', ['cash', 'kredit', 'konsinyasi']);
            $table->integer('total_dpp');
            $table->integer('total_ppn');
            $table->integer('total_discount');
            $table->integer('total_grand');
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
        Schema::dropIfExists('purchase_medicines');
    }
};
