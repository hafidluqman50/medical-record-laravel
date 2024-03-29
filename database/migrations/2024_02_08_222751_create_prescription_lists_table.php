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
        Schema::create('prescription_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prescription_id')
                  ->constrained('prescriptions')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->string('name');
            $table->integer('service_fee');
            $table->integer('total_costs');
            $table->integer('total_prescription_packs');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescription_lists');
    }
};
