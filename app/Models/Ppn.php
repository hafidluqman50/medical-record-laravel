<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ppn extends Model
{
    use HasFactory;

    protected $table = 'ppn';

    protected $fillable = [
        'nilai_ppn'
    ];

    public $timestamps = false;
}
