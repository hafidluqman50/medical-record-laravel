<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SalesReturn extends Model
{
    use HasFactory;

    protected $table = 'sales_returns';

    protected $fillable = [
        'invoice_number',
        'invoice_number_transaction',
        'date_return',
        'date_return_transaction',
        'total_return'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function salesReturnDetails(): HasMany
    {
        return $this->hasMany(SalesReturnDetail::class, 'sales_return_id', 'id');
    }

    public static function generateCode(): string
    {
        $db = self::count();
        $base = 'RTB-'.date('dmy');
        if ($db == 0) {
            $db = 1;
            $result = $base.'000001';
        } else {
            $db+=1;
        }
        return $generate_code = $base.str_pad($db,6,'000000',STR_PAD_LEFT);
    }
}
