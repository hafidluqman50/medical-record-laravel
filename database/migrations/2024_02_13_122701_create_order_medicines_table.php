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
        Schema::create('order_medicines', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->date('date_order');
            $table->foreignId('medical_supplier_id')
                  ->constrained('medical_suppliers')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
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
        Schema::dropIfExists('order_medicines');
    }
};
