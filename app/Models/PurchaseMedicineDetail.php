<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseMedicineDetail extends Model
{
    use HasFactory;

    protected $table = 'purchase_medicine_details';

    protected $fillable = [
        'purchase_medicine_id',
        'medicine_id',
        'qty',
        'price',
        'disc_1',
        'disc_2',
        'disc_3',
        'sub_total'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id', 'id');
    }

    public function purchaseMedicine(): BelongsTo
    {
        return $this->belongsTo(PurchaseMedicine::class, 'purchase_medicine_id', 'id');
    }
}
