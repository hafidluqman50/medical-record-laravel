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
        Schema::create('purchase_return_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_return_id')
                  ->constrained('purchase_returns')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->foreignId('medicine_id')
                   ->constrained('medicines')
                   ->onDelete('restrict')
                   ->onUpdate('cascade');
            $table->integer('qty_purchase')->comment('Stok dari pembelian');
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
        Schema::dropIfExists('purchase_return_details');
    }
};
