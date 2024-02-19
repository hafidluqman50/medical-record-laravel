<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

class TransactionPrescription extends Model
{
    use HasFactory;

    protected $table = 'transaction_prescriptions';

    protected $fillable = [
        'invoice_number',
        'date_transaction',
        'prescription_id',
        'sub_total',
        'discount',
        'total',
        'pay_total',
        'change_money',
        'user_id',
        'doctor_id',
        'status_transaction'
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

    public function prescription(): BelongsTo
    {
        return $this->belongsTo(Prescription::class, 'prescription_id', 'id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public static function generateCode(): string
    {
        $db = self::count();
        $base = 'TRX-RSP-'.date('dmy');
        if ($db == 0) {
            $db = 1;
            $result = $base.'0001';
        } else {
            $db+=1;
        }
        return $generate_code = $base.str_pad($db,4,'0000',STR_PAD_LEFT);
    }
}
