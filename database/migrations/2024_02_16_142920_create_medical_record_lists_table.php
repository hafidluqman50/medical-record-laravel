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
        Schema::create('medical_record_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medical_record_id')
                  ->constrained('medical_records')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->foreignId('registration_id')
                  ->constrained('registrations')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->date('date_check_up');
            $table->double('body_height');
            $table->double('body_weight');
            $table->double('body_temp');
            $table->string('blood_pressure');
            $table->string('main_complaint');
            $table->string('diagnose');
            $table->string('anemnesis');
            $table->string('physical_examinations');
            $table->string('supporting_examinations');
            $table->string('therapy');
            $table->string('referral');
            $table->text('notes');
            $table->date('next_control_date')->comment('tanggal kontrol selanjutnya');
            $table->string('lab_action');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_record_lists');
    }
};
