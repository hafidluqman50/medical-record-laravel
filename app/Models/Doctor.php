<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Doctor extends Authenticatable
{
    use HasFactory, SoftDeletes;

    protected $table = 'doctors';

    protected $fillable = [
        'code',
        'name',
        'username',
        'password',
        'address',
        'phone_number',
        'fee',
        'status_doctor'
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected $casts = [
        'password' => 'hashed'
    ];

    public static function generateCode(): string
    {
        $db = self::count();
        if ($db == 0) {
            $db = 1;
            $result = 'DTR-000001';
        }
        else {
            $db += 1;
        }
        return $generate_code = 'DTR-'.str_pad($db,6,'000000',STR_PAD_LEFT);
    }
}
