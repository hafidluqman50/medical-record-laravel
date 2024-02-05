<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MedicalSupplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'medical_suppliers';

    protected $fillable = [
        'name',
        'abbreviation_name',
        'phone_number',
        'address'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
