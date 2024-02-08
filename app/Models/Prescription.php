<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Prescription extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'prescriptions';

    protected $fillable = [
        'patient_id',
        'doctor_id'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function prescriptionLists(): HasMany
    {
        return $this->hasMany(PrescriptionList::class, 'prescription_id', 'id');
    }

    public function prescriptionToMedicines(): HasManyThrough
    {
        return $this->hasManyThrough(
            PrescriptionDetail::class,
            PrescriptionList::class,
            'prescription_id',
            'prescription_list_id',
            'id',
            'id'
        );
    }
}
