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
        Schema::create('drug_classifications', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('is_prekursor');
            $table->integer('is_narcotic');
            $table->integer('is_psychotropic');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drug_classifications');
    }
};
