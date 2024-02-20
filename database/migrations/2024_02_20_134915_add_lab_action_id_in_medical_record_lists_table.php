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
        Schema::table('medical_record_lists', function (Blueprint $table) {
            $table->foreignId('lab_action_id')->after('lab_action')->nullable()
                  ->constrained('lab_actions')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->dropColumn(['lab_action']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medical_record_lists', function (Blueprint $table) {
            $table->dropConstrainedForeignId('lab_action_id');
        });
    }
};
