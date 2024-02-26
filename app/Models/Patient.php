<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'patients';

    protected $fillable = [
        'code',
        'name',
        'bpjs_number',
        'patient_category_id',
        'phone_number',
        'birth_date',
        'address',
        'city_place',
        'gender'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function patientCategory(): BelongsTo
    {
        return $this->belongsTo(PatientCategory::class, 'patient_category_id', 'id');
    }

    public static function generateCode(): string
    {
        $db = self::count();
        if ($db == 0) {
            $db = 1;
            $result = 'PSN-000001';
        }
        else {
            $db += 1;
        }
        return $generate_code = 'PSN-'.str_pad($db,6,'000000',STR_PAD_LEFT);
    }
}
