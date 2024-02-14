<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardStock extends Model
{
    use HasFactory;

    protected $table = 'card_stocks';

    protected $fillable = [
        'date_stock',
        'invoice_number',
        'type',
        'medicine_id',
        'buy',
        'sell',
        'return',
        'accumulated_stock',
        'notes'
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
