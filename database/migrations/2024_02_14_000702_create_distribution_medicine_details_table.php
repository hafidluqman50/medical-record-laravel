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
        Schema::create('distribution_medicine_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('distribution_medicine_id')
                  ->constrained('distribution_medicines')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->foreignId('medicine_id')
                  ->constrained('medicines')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->integer('qty');
            $table->integer('stock_per_unit')->comment('Isi Obat Per Satuan');
            $table->string('unit_order');
            $table->string('data_location');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distribution_medicine_details');
    }
};
