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
        'dose',
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

    public function prescriptionList(): BelongsTo
    {
        return $this->belongsTo(PrescriptionList::class, 'prescription_list_id', 'id');
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id', 'id');
    }
}
