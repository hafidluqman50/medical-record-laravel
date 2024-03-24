<?php

namespace App\Http\Controllers\Api;

use App\Models\Medicine;
use App\Models\PriceParameter;
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
        $limit         = $request->limit;
        $search        = $request->search;
        $filter        = $request->filter;

        $medicines = Medicine::with('medicineFactory')->when($medicine != '', function(Builder $query) use ($medicine, $data_location) {
            if($medicine != 'all') {
                $query->where('name','like',"%{$medicine}%")
                    ->where('data_location', $data_location)
                    ->orWhere('code','like',"%{$medicine}%");
            }
        })->when($page_num != '', function(Builder $query) use ($page_num, $limit) {
            $query->offset($page_num)->limit($limit != null ? $limit : 5);
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

        $count = Medicine::where('data_location', $data_location)->when($filter != '', function(Builder $query) use ($search, $filter) {
            if($filter == 'generic') {
                $query->where('is_generic', 1);
            } else {
                $query->where($filter, 'like', "%{$search}%");
            }
        })->count();

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
    
    public function getAllWithPriceParameters(Request $request): JsonResponse
    {
        $page_num = $request->page_num;
        $search = $request->search;
        
        $price_parameter = PriceParameter::where('label', 'Tunai')->firstOrFail();
        
        $medicine_price_parameters = Medicine::with(['medicineFactory'])->when($search != '', function(Builder $query) use ($search) {
            $query->where('name', 'like', "%{$search}%");
        })->when($page_num != '', function(Builder $query) use ($page_num) {
            $query->offset($page_num)->limit(5);
        })->get()->map(function(Medicine $medicine) use ($price_parameter) {

            $capital_price     = $medicine->capital_price;
            $capital_price_vat = $medicine->capital_price_vat;
            $sell_price        = $medicine->sell_price;

            $medicine->resep_tunai_price     = format_rupiah($capital_price_vat * $price_parameter->resep_tunai);
            $medicine->upds_price            = format_rupiah($capital_price_vat * $price_parameter->upds);
            $medicine->hv_otc_price          = format_rupiah($capital_price_vat * $price_parameter->hv_otc);
            $medicine->resep_kredit_price    = format_rupiah($capital_price_vat * $price_parameter->resep_kredit);
            $medicine->enggros_faktur_price  = format_rupiah($capital_price_vat * $price_parameter->enggros_faktur);
            $medicine->medicine_factory_name = $medicine->medicineFactory->name;

            unset(
                $medicine->capital_price,
                $medicine->capital_price_vat,
                $medicine->sell_price
            );

            $medicine->capital_price     = format_rupiah($capital_price);
            $medicine->capital_price_vat = format_rupiah($capital_price_vat);
            $medicine->sell_price        = format_rupiah($sell_price);

            return $medicine;
        });
        
        $count = Medicine::where('data_location', 'kasir')->when($search != '', function(Builder $query) use ($search) {
            $query->where('name', 'like', "%{$search}%");
        })->count();

        $max_page = ceil($count / 5);
        
        return $this->responseResult(compact('medicine_price_parameters', 'max_page'))
                    ->message('Success Get Medicine Price Parameter!')
                    ->ok();
    }
}
