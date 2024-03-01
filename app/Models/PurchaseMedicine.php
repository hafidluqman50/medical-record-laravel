<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseMedicine extends Model
{
    use HasFactory;

    protected $table = 'purchase_medicines';

    protected $fillable = [
        'invoice_number',
        'medical_supplier_id',
        'code',
        'date_receive',
        'debt_time',
        'due_date',
        'type',
        'total_dpp',
        'total_ppn',
        'total_discount',
        'total_grand',
        'user_id'
    ];

    protected $hidden = [
        'updated_at'
    ];

    protected function dateReceive(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => human_date($value)
        );
    }

    protected function dueDate(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => human_date($value)
        );
    }

    public function medicalSupplier(): BelongsTo
    {
        return $this->belongsTo(MedicalSupplier::class, 'medical_supplier_id', 'id');
    }

    public function purchaseMedicineDetails(): HasMany
    {
        return $this->hasMany(PurchaseMedicineDetail::class, 'purchase_medicine_id', 'id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public static function generateCode(): string
    {
        $db = self::count();
        $base = 'PMB-'.date('dmy');
        if ($db == 0) {
            $db = 1;
            $result = $base.'000001';
        } else {
            $db+=1;
        }
        return $generate_code = $base.str_pad($db,6,'0000',STR_PAD_LEFT);
    }
}
