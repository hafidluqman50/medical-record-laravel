<?php

namespace App\Http\Controllers\Api;

use App\Models\PurchaseMedicine;
use App\Http\Controllers\ApiBaseController;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PurchaseMedicineController extends ApiBaseController
{
    public function getByDate(string $date): JsonResponse
    {
        $results = [];

        $purchases = PurchaseMedicine::where('date_receive', $date)->get();

        foreach ($purchases as $key => $value) {
            $results[] = [
                'invoice_transaction' => $value->invoice_number,
                'invoice_number'      => $value->invoice_number
            ];
        }

        return $this->responseResult(compact('results'))
                    ->message('Success Get Purchase Invoice Number By Date!')
                    ->ok();
    }

    public function getByInvoice(string $invoice): JsonResponse
    {
        $results         = [];

        $purchase_medicine = PurchaseMedicine::with(['medicalSupplier','purchaseMedicineDetails.medicine'])->where('invoice_number', $invoice)->firstOrFail();

        foreach ($purchase_medicine->purchaseMedicineDetails as $key => $value) {
            $results[] = [
                'medicine_id'      => $value->medicine->id,
                'medicine_name'    => $value->medicine->name,
                'price'            => $value->price,
                'qty_purchase'     => $value->qty,
                'qty_return'       => 0,
                'sub_total'        => 0,
                'sub_total_custom' => 0
            ];
        }

        $medical_supplier_id   = $purchase_medicine->medical_supplier_id;
        $medical_supplier_name = $purchase_medicine->medicalSupplier?->name;

        return $this->responseResult(compact('results','medical_supplier_id','medical_supplier_name'))
                    ->message('Success Get By Invoice')
                    ->ok();
    }
}
