<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderMedicineDetail extends Model
{
    use HasFactory;

    protected $table = 'order_medicine_details';

    protected $fillable = [
        'order_medicine_id',
        'medicine_id',
        'qty',
        'price',
        'stock_per_unit',
        'unit_order',
        'sub_total'
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
