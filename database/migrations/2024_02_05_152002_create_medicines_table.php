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
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->date('date_expired');
            $table->string('batch_number');
            $table->string('barcode')->nullable();
            $table->string('name');
            $table->foreignId('drug_classification_id')
                  ->constrained('drug_classifications')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->foreignId('medical_supplier_id')
                  ->constrained('medical_suppliers')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->foreignId('medicine_factory_id')
                  ->constrained('medicine_factories')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->integer('min_stock_supplier')->comment('minimal stok harus supply');
            $table->integer('is_generic')->comment('generic; jika generic maka 1');
            $table->integer('is_active')->comment('active; jika aktif maka 1');
            $table->integer('is_prescription')->comment('resep; jika aktif maka 1');
            $table->integer('stock')->comment('stok obat');
            $table->integer('piece_weight')->comment('bobot satuan');
            $table->string('pack_medicine')->comment('kemasan obat');
            $table->string('unit_medicine')->comment('satuan obat');
            $table->string('medicinal_preparations')->comment('sediaan obat');
            $table->string('location_rack')->comment('lokasi rak');
            $table->integer('dose')->comment('dosis obat');
            $table->string('composition')->comment('komposisi');
            $table->integer('is_fullpack')->comment('utuh; jika utuh maka nilai nya 1, digunakan untuk mencatat harga utuh atau tidak');
            $table->integer('capital_price')->comment('harga modal');
            $table->integer('capital_price_vat')->comment('harga modal ppn');
            $table->integer('sell_price')->comment('hja/net');
            $table->string('data_location')->comment('lokasi data; Ex: gudang, kasir;');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
