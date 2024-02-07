<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceParameter extends Model
{
    use HasFactory;

    protected $table = 'price_parameters';

    protected $fillable = [
        'label',
        'resep_tunai',
        'upds',
        'hv_otc',
        'resep_kredit',
        'enggros_faktur',
        'embalase',
        'jasa_racik',
        'pembulatan',
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];
}
