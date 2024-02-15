<?php

namespace App\Http\Controllers\Api;

use App\Models\PriceParameter;
use App\Models\Transaction;
use App\Models\TransactionPrescription;
use App\Http\Controllers\ApiBaseController;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TransactionController extends ApiBaseController
{
    public function getByDate(string $date): JsonResponse
    {
        $results = [];

        $transactions = Transaction::where('date_transaction', $date)->get();

        $transaction_prescriptions = TransactionPrescription::where('date_transaction', $date)->get();

        foreach ($transactions as $key => $value) {
            $results[] = [
                'invoice_transaction' => $value->invoice_number.'|'.$value->type,
                'invoice_number'      => $value->invoice_number
            ];
        }

        foreach($transaction_prescriptions as $key => $value) {
            $results[] = [
                'invoice_transaction' => $value->invoice_number.'|UM',
                'invoice_number'      => $value->invoice_number
            ];
        }

        return $this->responseResult(compact('results'))
                    ->message('Success Get Transaction Invoice Number By Date!')
                    ->ok();
    }

    public function getByInvoice(string $invoice): JsonResponse
    {
        $results         = [];
        $invoice_number  = substr($invoice,0,-3);
        $price_parameter = PriceParameter::where('label', 'Tunai')->firstOrFail();
        $price           = 0;

        if(str_contains($invoice,'UM')) {
            $transaction_prescriptions = TransactionPrescription::with(['prescription.prescriptionToMedicines.medicine'])->where('invoice_number', $invoice_number)->firstOrFail();

            foreach ($transaction_prescriptions->prescription->prescriptionToMedicines as $key => $value) {
                $price = $value->sell_price == 0 ? $value->capital_price_vat * $price_parameter->resep_tunai : $value->sell_price;

                $results[] = [
                    'medicine_id'      => $value->medicine->id,
                    'medicine_name'    => $value->medicine->name,
                    'price'            => $price,
                    'qty_transaction'  => $value->qty,
                    'qty_return'       => 0,
                    'sub_total'        => 0,
                    'sub_total_custom' => 0
                ];
            }
        } else {
            $transaction = Transaction::with(['transactionDetails.medicine'])->where('invoice_number', $invoice_number)->firstOrFail();

            foreach ($transaction->transactionDetails as $key => $value) {
                if($transaction->type == 'UP') {
                    $price = $value->medicine->sell_price == 0 ? $value->medicine->capital_price_vat * $price_parameter->upds : $value->medicine->sell_price;
                } else {
                    $price = $value->medicine->sell_price == 0 ? $value->medicine->capital_price_vat * $price_parameter->hv_otc : $value->medicine->sell_price;
                }


                $results[] = [
                    'medicine_id'      => $value->medicine->id,
                    'medicine_name'    => $value->medicine->name,
                    'price'            => $price,
                    'qty_transaction'  => $value->qty,
                    'qty_return'       => 0,
                    'sub_total'        => 0,
                    'sub_total_custom' => 0
                ];
            }
        }

        return $this->responseResult(compact('results'))
                    ->message('Success Get By Invoice')
                    ->ok();
    }
}
