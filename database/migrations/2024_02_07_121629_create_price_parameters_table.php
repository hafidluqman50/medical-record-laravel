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
        Schema::create('price_parameters', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->double('resep_tunai');
            $table->double('upds');
            $table->double('hv_otc');
            $table->double('resep_kredit');
            $table->double('enggros_faktur');
            $table->integer('embalase');
            $table->integer('jasa_racik');
            $table->integer('pembulatan');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_parameters');
    }
};
