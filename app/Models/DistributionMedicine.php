<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DistributionMedicine extends Model
{
    use HasFactory;

    protected $table = 'distribution_medicines';

    protected $fillable = [
        'invoice_number',
        'date_distribution',
        'user_id'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    protected function dateDistribution(): Attribute
    {
        return Attribute::make(
            get: fn ($value, $attributes) => human_date($value)
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function distributionMedicineDetails(): HasMany
    {
        return $this->hasMany(DistributionMedicineDetail::class, 'distribution_medicine_id', 'id');
    }

    public static function generateCode(): string
    {
        $db = self::count();
        $base = 'DST-'.date('dmy');
        if ($db == 0) {
            $db = 1;
            $result = $base.'000001';
        } else {
            $db+=1;
        }
        return $generate_code = $base.str_pad($db,6,'000000',STR_PAD_LEFT);
    }
}
