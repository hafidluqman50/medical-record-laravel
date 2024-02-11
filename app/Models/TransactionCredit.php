<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

class TransactionCredit extends Model
{
    use HasFactory;

    protected $table = 'transaction_credits';

    protected $fillable = [
        'invoice_number',
        'date_transaction',
        'date_prescription',
        'prescription_id',
        'customer_id',
        'group_name',
        'sub_total',
        'total',
        'user_id',
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
            get: fn ($value, $attributes) => Carbon::create($value)->format("d, M Y")
        );
    }

    protected function datePrescription(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => Carbon::create($value)->format("d, M Y")
        );
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
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
