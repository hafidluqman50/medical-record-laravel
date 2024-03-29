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
        Schema::create('prescription_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prescription_list_id')
                  ->constrained('prescription_lists')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->foreignId('medicine_id')
                  ->constrained('medicines')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->integer('qty');
            $table->integer('prescription_packs');
            $table->integer('sub_total');
            $table->integer('service_fee');
            $table->integer('total');
            $table->string('prescription_name');
            $table->string('faktor');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescription_details');
    }
};
