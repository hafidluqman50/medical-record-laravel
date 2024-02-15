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
        Schema::create('purchase_returns', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->string('invoice_number_purchase');
            $table->foreignId('medical_supplier_id')
                  ->constrained('medical_suppliers')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->date('date_return');
            $table->date('date_return_purchase');
            $table->integer('total_return');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_returns');
    }
};
