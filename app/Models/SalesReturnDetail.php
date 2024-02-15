<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalesReturnDetail extends Model
{
    use HasFactory;

    protected $table = 'sales_return_details';

    protected $fillable = [
        'sales_return_id',
        'medicine_id',
        'qty_transaction',
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
