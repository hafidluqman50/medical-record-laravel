<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReceivingMedicine extends Model
{
    use HasFactory;

    protected $table = 'receiving_medicines';

    protected $fillable = [
        'invoice_number',
        'date_receive',
        'total_grand',
        'user_id'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    protected function dateReceive(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => human_date($value)
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function receivingMedicineDetails(): HasMany
    {
        return $this->hasMany(OrderMedicineDetail::class, 'receiving_medicine_id', 'id');
    }

    public static function generateCode(): string
    {
        $db = self::count();
        $base = 'PNR-'.date('dmy');
        if ($db == 0) {
            $db = 1;
            $result = $base.'000001';
        } else {
            $db+=1;
        }
        return $generate_code = $base.str_pad($db,6,'000000',STR_PAD_LEFT);
    }
}
