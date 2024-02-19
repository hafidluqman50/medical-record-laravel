<?php

namespace App\Http\Controllers\Api;

use App\Models\Medicine;
use App\Http\Controllers\ApiBaseController;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MedicineController extends ApiBaseController
{
    public function getAll(Request $request): JsonResponse
    {
        $medicine      = $request->medicine;
        $data_location = $request->data_location ?? 'gudang';

        $medicines = Medicine::with('medicineFactory')->when($medicine != '', function(Builder $query) use ($medicine) {
            $query->where('name','like',"%{$medicine}%")
                  ->orWhere('code','like',"%{$medicine}%");
        })->where('data_location', $data_location)->get()->map(function(Medicine $query) {
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

    public function getByLocationRack(string $location_rack): JsonResponse
    {
        $count_obat = Medicine::where('location_rack', $location_rack)->where('data_location', 'kasir')->count();

        $results = [];

        $data  = 160;
        $hasil = ceil($count_obat / 160);
        $no    = 0;

        for ($i=1; $i <= $hasil ; $i++) {
            $hitung = ($i > 1) ? ($i * $data) - $data : 0;

            $medicines = Medicine::where('location_rack', $location_rack)->where('data_location', 'kasir')->limit($data)->offset(0)->get();

            foreach ($medicines as $key => $value) {
                $results[$no][] = [
                    'medicine_id'     => $value->id,
                    'unit_medicine'   => $value->unit_medicine,
                    'medicine_name'   => $value->name,
                    'stock_computer'  => $value->stock,
                    'stock_display'   => 0,
                    'stock_deviation' => 0,
                    'price'           => $value->capital_price,
                    'sub_value'       => 0,
                    'date_expired'    => $value->date_expired,
                ];
            }

            $no++;
        }

        return $this->responseResult(compact('results'))
                    ->message('Success Get Medicines By Location Rack!')
                    ->ok();
    }
}
