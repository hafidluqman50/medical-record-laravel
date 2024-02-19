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
        Schema::create('stock_opname_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_opname_id')
                  ->constrained('stock_opnames')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->foreignId('medicine_id')
                  ->constrained('medicines')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->string('unit_medicine',100);
            $table->integer('stock_computer')->comment('stok komputer');
            $table->integer('stock_display')->comment('stok fisik');
            $table->integer('stock_deviation')->comment('stok selisih');
            $table->integer('price')->comment('harga satuan');
            $table->integer('sub_value')->comment('sub nilai');
            $table->date('date_expired')->comment('tanggal kadaluarsa obat');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_opname_details');
    }
};
