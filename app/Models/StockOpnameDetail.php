<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class StockOpnameDetail extends Model
{
    use HasFactory;

    protected $table = 'stock_opname_details';

    protected $fillable = [
        'stock_opname_id',
        'medicine_id',
        'unit_medicine',
        'stock_computer',
        'stock_display',
        'stock_deviation',
        'price',
        'sub_value',
        'date_expired'
    ];

    protected function dateExpired(): Attribute
    {
        return Attribute::make(
            get: fn($value, $attributes) => human_date($value)
        );
    }

    protected function price(): Attribute
    {
        return Attribute::make(
            get: fn($value, $attributes) => format_rupiah($value)
        );
    }

    protected function subValue(): Attribute
    {
        return Attribute::make(
            get: fn($value, $attributes) => format_rupiah($value)
        );
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id', 'id');
    }
}
