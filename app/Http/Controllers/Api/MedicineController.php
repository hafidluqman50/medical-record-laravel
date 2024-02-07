<?php

namespace App\Http\Controllers\Api;

use App\Models\Medicine;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MedicineController extends Controller
{
    public function getAll(Request $request): JsonResponse
    {
        $medicine = $request->medicine;

        $medicines = Medicine::with('medicineFactory')->when($medicine != '', function(Builder $query) use ($medicine) {
            $query->where('name','like',"%{$medicine}%")
                  ->orWhere('code','like',"%{$medicine}%");
        })->get()->map(function(Medicine $query) {
            $harga_modal     = format_rupiah($query->capital_price);
            $harga_modal_ppn = format_rupiah($query->capital_price_vat);
            $hja_net         = format_rupiah($query->sell_price);

            unset(
                $query->capital_price,
                $query->capital_price_vat,
                $query->sell_price,
            );

             $query->capital_price = $harga_modal;
             $query->capital_price_vat = $harga_modal_ppn;
             $query->sell_price = $hja_net;

             return $query;
        });

        return response()->json(compact('medicines'));
    }

    public function getById(int $id): JsonResponse
    {

        $medicine = Medicine::with('medicineFactory')->where('id', $id)->first();

        if ($medicine->sell_price != 0) {
            $medicine->price      = $medicine->sell_price;
            $medicine->is_hja_net = true;
        }
        else {
            $medicine->price      = $medicine->capital_price_vat;
            $medicine->is_hja_net = false;
        }

        return response()->json(compact('medicine'));
    }
}
