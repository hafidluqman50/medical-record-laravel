<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderMedicine extends Model
{
    use HasFactory;

    protected $table = 'order_medicines';

    protected $fillable = [
        'invoice_number',
        'date_order',
        'medical_supplier_id',
        'total_grand',
        'user_id'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    protected function dateOrder(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => human_date($value)
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function medicalSupplier(): BelongsTo
    {
        return $this->belongsTo(MedicalSupplier::class, 'medical_supplier_id', 'id');
    }

    public function orderMedicineDetails(): HasMany
    {
        return $this->hasMany(OrderMedicineDetail::class, 'order_medicine_id', 'id');
    }

    public static function generateCode(): string
    {
        $db = self::count();
        $base = 'PMS-'.date('dmy');
        if ($db == 0) {
            $db = 1;
            $result = $base.'000001';
        } else {
            $db+=1;
        }
        return $generate_code = $base.str_pad($db,6,'000000',STR_PAD_LEFT);
    }
}
