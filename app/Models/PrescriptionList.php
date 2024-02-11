<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrescriptionList extends Model
{
    use HasFactory;

    protected $table = 'prescription_lists';

    protected $fillable = [
        'prescription_id',
        'name',
        'service_fee',
        'total_costs',
        'total_prescription_packs'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function prescriptionDetails(): HasMany
    {
        return $this->hasMany(PrescriptionDetail::class, 'prescription_list_id', 'id');
    }
}
