<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseReturnDetail extends Model
{
    use HasFactory;

    protected $table = 'purchase_return_details';

    protected $fillable = [
        'purchase_return_id',
        'medicine_id',
        'qty_purchase',
        'qty_return',
        'sub_total',
        'sub_total_custom'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id', 'id');
    }
}
