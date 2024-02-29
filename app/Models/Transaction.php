<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

class Transaction extends Model
{
    use HasFactory;

    protected $table = 'transactions';

    protected $fillable = [
        'date_transaction',
        'invoice_number',
        'sub_total',
        'discount',
        'discount_pay',
        'transaction_pay_type',
        'total',
        'pay_total',
        'change_money',
        'type',
        'user_id'
    ];

    protected $hidden = [
        'updated_at'
    ];

    protected function createdAt(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => Carbon::create($value)->format("d, M Y H:i:s")
        );
    }

    protected function dateTransaction(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => human_date($value)
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function transactionDetails(): HasMany
    {
        return $this->hasMany(TransactionDetail::class, 'transaction_id', 'id');
    }

    public static function generateCode(string $prefix = 'UP'): string
    {
        $db = self::count();
        $base = 'TRX-'.$prefix.'-'.date('dmy');
        if ($db == 0) {
            $db = 1;
            $result = $base.'0001';
        } else {
            $db+=1;
        }
        return $generate_code = $base.str_pad($db,4,'0000',STR_PAD_LEFT);
    }
}
