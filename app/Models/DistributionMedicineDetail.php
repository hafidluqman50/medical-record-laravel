<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DistributionMedicineDetail extends Model
{
    use HasFactory;

    protected $table = 'distribution_medicine_details';

    protected $fillable = [
        'distribution_medicine_id',
        'medicine_id',
        'qty',
        'stock_per_unit',
        'unit_order',
        'data_location'
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
