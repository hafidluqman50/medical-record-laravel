<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrescriptionDetail extends Model
{
    use HasFactory;

    protected $table = 'prescription_details';

    protected $fillable = [
        'prescription_list_id',
        'medicine_id',
        'qty',
        'prescription_packs',
        'sub_total',
        'total',
        'service_fee',
        'prescription_name',
        'faktor'
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
