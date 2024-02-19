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
        Schema::table('transaction_prescriptions', function (Blueprint $table) {
            $table->foreignId('doctor_id')->nullable()->after('user_id')
                  ->constrained('doctors')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->unsignedBigInteger('user_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaction_prescriptions', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->change();
            $table->dropConstrainedForeignId('doctor_id');
        });
    }
};
