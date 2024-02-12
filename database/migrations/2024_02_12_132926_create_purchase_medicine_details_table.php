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
        Schema::create('purchase_medicine_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_medicine_id')
                  ->constrained('purchase_medicines')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->foreignId('medicine_id')
                  ->constrained('medicines')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->integer('qty');
            $table->integer('price');
            $table->integer('ppn');
            $table->double('disc_1');
            $table->double('disc_2');
            $table->double('disc_3');
            $table->string('ppn_type',15);
            $table->integer('sub_total');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_medicine_details');
    }
};
