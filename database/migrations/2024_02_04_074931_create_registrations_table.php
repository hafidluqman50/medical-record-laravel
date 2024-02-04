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
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->date('date_register');
            $table->foreignId('patient_id')
                  ->constrained('patients')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->foreignId('doctor_id')
                  ->constrained('doctors')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->double('body_height')->nullable();
            $table->double('body_weight')->nullable();
            $table->double('body_temp')->nullable();
            $table->string('blood_pressure',10)->nullable();
            $table->text('complains_of_pain')->nullable();
            $table->string('supporting_examinations')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
