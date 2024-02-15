<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseReturn extends Model
{
    use HasFactory;

    protected $table = 'purchase_returns';

    protected $fillable = [
        'invoice_number',
        'invoice_number_purchase',
        'medical_supplier_id',
        'date_return',
        'date_return_purchase',
        'total_return'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function medicalSupplier(): BelongsTo
    {
        return $this->belongsTo(MedicalSupplier::class, 'medical_supplier_id', 'id');
    }

    public function purchaseReturnDetails(): HasMany
    {
        return $this->hasMany(PurchaseReturnDetail::class, 'purchase_return_id', 'id');
    }

    public static function generateCode(): string
    {
        $db = self::count();
        $base = 'RPB-'.date('dmy');
        if ($db == 0) {
            $db = 1;
            $result = $base.'000001';
        } else {
            $db+=1;
        }
        return $generate_code = $base.str_pad($db,6,'000000',STR_PAD_LEFT);
    }
}
