<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Medicine extends Model
{
    use HasFactory, SoftDeletes;

    protected $tables = 'medicines';

    protected $fillable = [
        'code',
        'batch_number',
        'barcode',
        'date_expired',
        'name',
        'drug_classification_id',
        'medical_supplier_id',
        'medicine_factory_id',
        'min_stock_supplier',
        'is_generic',
        'is_active',
        'is_prescription',
        'stock',
        'piece_weight',
        'pack_medicine',
        'unit_medicine',
        'medicinal_preparations',
        'location_rack',
        'dose',
        'composition',
        'is_fullpack',
        'capital_price',
        'capital_price_vat',
        'sell_price',
        'data_location'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public static function generateCode(): string
    {
        $db = self::count();
        if ($db == 0) {
            $db = 1;
            $result = 'OBT-000001';
        }
        return $generate_code = 'OBT-'.str_pad($db,6,'000000',STR_PAD_LEFT);
    }

    public function drugClassification(): BelongsTo
    {
        return $this->belongsTo(DrugClassification::class, 'drug_classification_id', 'id');
    }

    public function medicalSupplier(): BelongsTo
    {
        return $this->belongsTo(MedicalSupplier::class, 'medical_supplier_id', 'id');
    }

    public function medicineFactory(): BelongsTo
    {
        return $this->belongsTo(MedicineFactory::class, 'medicine_factory_id', 'id');
    }
}
