<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DrugClassification extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'drug_classifications';

    protected $fillable = [
        'name',
        'is_prekursor',
        'is_narcotic',
        'is_psychotropic'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
