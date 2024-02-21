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
        $page_num      = $request->page_num;
        $search        = $request->search;
        $filter        = $request->filter;

        $medicines = Medicine::with('medicineFactory')->when($medicine != '', function(Builder $query) use ($medicine, $data_location) {
            $query->where('name','like',"%{$medicine}%")
                  ->where('data_location', $data_location)
                  ->orWhere('code','like',"%{$medicine}%");
        })->when($page_num != '', function(Builder $query) use ($page_num) {
            $query->offset($page_num)->limit(5);
        })->when($filter != '', function(Builder $query) use ($search, $filter) {
            if($filter == 'generic') {
                $query->where('is_generic', 1);
            } else {
                $query->where($filter, 'like', "%{$search}%");
            }
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

        $count = Medicine::where('data_location', $data_location)->count();

        $max_page = ceil($count / 5);

        return response()->json(compact('medicines', 'max_page'));
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

    public function setStatus(int $id): JsonResponse 
    {
        $medicine = Medicine::where('id', $id)->firstOrFail();

        if ($medicine->is_active == 1) {
            Medicine::where('id', $id)->update(['is_active' => 0]);
        } else {
            Medicine::where('id', $id)->update(['is_active' => 1]);
        }

        return $this->responseResult()
                    ->message('Success Set Status Medicine ID '.$id)
                    ->ok();
    }
}
