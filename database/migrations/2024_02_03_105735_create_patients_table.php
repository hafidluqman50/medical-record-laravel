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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('code',100);
            $table->string('name', 100);
            $table->string('bpjs_number', 30)->nullable();
            $table->foreignId('patient_category_id')
                  ->constrained('patient_categories')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->string('phone_number', 20);
            $table->text('address');
            $table->string('city_place', 100);
            $table->date('birth_date');
            $table->enum('gender', ['laki-laki', 'perempuan']);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
