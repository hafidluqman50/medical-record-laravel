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
        Schema::create('transaction_credits', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->date('date_transaction');
            $table->date('date_prescription');
            $table->foreignId('customer_id')
                  ->constrained('customers')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->string('group_name');
            $table->foreignId('prescription_id')
                  ->constrained('prescriptions')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->integer('sub_total');
            $table->integer('total');
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->integer('status_transaction');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_credits');
    }
};
