<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseHistory extends Model
{
    use HasFactory;

    protected $table = 'purchase_histories';

    protected $fillable = [
        'invoice_number',
        'date_purchase',
        'medical_supplier_id',
        'medicine_id',
        'qty',
        'unit_medicine',
        'sub_total'
    ];

    protected $hidden = [
        'updated_at'
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id', 'id');
    }

    public function medicalSupplier(): BelongsTo
    {
        return $this->belongsTo(MedicalSupplier::class, 'medical_supplier_id', 'id');
    }
}
