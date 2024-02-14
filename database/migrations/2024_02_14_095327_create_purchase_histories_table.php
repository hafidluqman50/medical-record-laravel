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
        Schema::create('purchase_histories', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->date('date_purchase');
            $table->foreignId('medical_supplier_id')
                  ->constrained('medical_suppliers')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->foreignId('medicine_id')
                  ->constrained('medicines')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->integer('qty');
            $table->string('unit_medicine');
            $table->integer('sub_total');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_histories');
    }
};
