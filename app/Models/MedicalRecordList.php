<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicalRecordList extends Model
{
    use HasFactory;

    protected $table = 'medical_record_lists';

    protected $fillable = [
        'medical_record_id',
        'registration_id',
        'date_check_up',
        'body_height',
        'body_weight',
        'body_temp',
        'blood_pressure',
        'main_complaint',
        'diagnose',
        'anemnesis',
        'physical_examinations',
        'supporting_examinations',
        'therapy',
        'referral',
        'notes',
        'next_control_date',
        'lab_action'
    ];

    public function medicalRecord(): BelongsTo
    {
        return $this->belongsTo(MedicalRecord::class, 'medical_record_id', 'id');
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class, 'registration_id', 'id');
    }
}
