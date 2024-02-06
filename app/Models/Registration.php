<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Registration extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'registrations';

    protected $fillable = [
        'date_register',
        'number_register',
        'patient_id',
        'doctor_id',
        'body_height',
        'body_weight',
        'body_temp',
        'blood_pressure',
        'complains_of_pain',
        'supporting_examinations',
        'status_register'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'doctor_id', 'id');
    }

    public static function generateCode(): string
    {
        $db = self::count();
        $base = 'RGS'.date('dmy');
        if ($db == 0) {
            $db = 1;
            $result = $base.'0001';
        } else {
            $db+=1;
        }
        return $generate_code = $base.str_pad($db,4,'0000',STR_PAD_LEFT);
    }
}
