<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicalRecordDetail extends Model
{
    use HasFactory;

    protected $table = 'medical_record_details';

    protected $fillable = [
        'medical_record_list_id',
        'medicine_id',
        'qty',
        'dose'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function medicalRecordList(): BelongsTo
    {
        return $this->belongsTo(MedicalRecordList::class, 'medical_record_list_id', 'id');
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id', 'id');
    }
}
