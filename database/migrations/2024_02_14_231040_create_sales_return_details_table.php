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
        Schema::create('sales_return_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_return_id')
                  ->constrained('sales_returns')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->foreignId('medicine_id')
                   ->constrained('medicines')
                   ->onDelete('restrict')
                   ->onUpdate('cascade');
            $table->integer('qty_transaction')->comment('Stok dari penjualan(resep, upds, HV)');
            $table->integer('qty_return')->comment('Stok yang diretur');
            $table->integer('sub_total');
            $table->integer('sub_total_custom');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_return_details');
    }
};
