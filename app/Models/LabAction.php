<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LabAction extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'lab_actions';

    protected $fillable = [
        'name'
    ];
}
