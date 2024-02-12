<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseMedicine extends Model
{
    use HasFactory;

    protected $table = 'purchase_medicines';

    protected $fillable = [
        'invoice_number',
        'medical_supplier_id',
        'code',
        'date_receive',
        'debt_time',
        'due_date',
        'type',
        'total_dpp',
        'total_ppn',
        'total_grand',
        'user_id'
    ];

    protected $hidden = [
        'updated_at'
    ];

    public function purchaseMedicineDetails(): HasMany
    {
        return $this->hasMany(PurchaseMedicineDetail::class, 'id', 'purchase_medicine_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
