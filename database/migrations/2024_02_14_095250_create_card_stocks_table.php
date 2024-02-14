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
        Schema::create('card_stocks', function (Blueprint $table) {
            $table->id();
            $table->date('date_stock');
            $table->string('invoice_number');
            $table->string('type')->comment('layanan; Ex: Beli, Jual, Retur');
            $table->foreignId('medicine_id')
                  ->constrained('medicines')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->integer('buy');
            $table->integer('sell');
            $table->integer('return');
            $table->integer('accumulated_stock');
            $table->text('notes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('card_stocks');
    }
};
