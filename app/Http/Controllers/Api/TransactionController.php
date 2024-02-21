<?php

namespace App\Http\Controllers\Api;

use App\Models\PriceParameter;
use App\Models\Transaction;
use App\Models\TransactionCredit;
use App\Models\TransactionPrescription;
use App\Models\PrescriptionList;
use App\Models\PrescriptionDetail;
use App\Http\Controllers\ApiBaseController;
use Illuminate\Database\Eloquent\Builder;
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

    public function getTransactionResep(Request $request): JsonResponse
    {
        $search   = $request->search;
        $page_num = $request->page_num;

        $transaction_resep = TransactionPrescription::with(['prescription.patient','prescription.doctor','user'])
                            ->when($page_num != '', function(Builder $query) use ($page_num) {
                                $query->offset($page_num)->limit(5);
                            })->when($search != '', function(Builder $query) use ($search) {
                                $query->where('invoice_number', 'like', "%{$search}%");
                            })->get();

        $count = TransactionPrescription::where('invoice_number', 'like', "%{$search}%")->count();

        $max_page = ceil($count / 5);

        return $this->responseResult(compact('transaction_resep', 'max_page'))
                    ->message('Success Get Transaction Resep!')
                    ->ok();
    }

    public function getTransactionCredit(Request $request): JsonResponse
    {
        $search   = $request->search;
        $page_num = $request->page_num;

        $transaction_credit = TransactionCredit::with(['customer', 'prescription.patient','prescription.doctor','user'])
                            ->when($page_num != '', function(Builder $query) use ($page_num) {
                                $query->offset($page_num)->limit(5);
                            })->when($search != '', function(Builder $query) use ($search) {
                                $query->where('invoice_number', 'like', "%{$search}%");
                            })->get();

        $count = TransactionCredit::where('invoice_number', 'like', "%{$search}%")->count();

        $max_page = ceil($count / 5);

        return $this->responseResult(compact('transaction_credit', 'max_page'))
                    ->message('Success Get Transaction Resep!')
                    ->ok();
    }

    public function getPrescriptionLists(Request $request, int $prescription_id): JsonResponse
    {
        $search   = $request->search;
        $page_num = $request->page_num;

        $racik = PrescriptionList::when($page_num != '', function(Builder $query) use ($page_num) {
                                $query->offset($page_num)->limit(5);
                            })->when($search != '', function(Builder $query) use ($search) {
                                $query->where('name', 'like', "%{$search}%");
                            })->whereHas('prescription', function(Builder $query)use($prescription_id){
                                $query->where('id', $prescription_id);
                            })->get();

        $count = PrescriptionList::where('name', 'like', "%{$search}%")
                            ->whereHas('prescription', function(Builder $query)use($prescription_id){
                                $query->where('id', $prescription_id);
                            })->count();

        $max_page = ceil($count / 5);

        return $this->responseResult(compact('racik', 'max_page'))
                    ->message('Success Get Prescription Lists !')
                    ->ok();
    }

    public function getPrescriptionDetails(Request $request, int $prescription_id, int $prescription_list_id): JsonResponse
    {
        $search   = $request->search;
        $page_num = $request->page_num;

        $racik_detail = PrescriptionDetail::with(['medicine'])->when($page_num != '', function(Builder $query) use ($page_num) {
                                $query->offset($page_num)->limit(5);
                            })->when($search != '', function(Builder $query) use ($search) {
                                $query->whereHas('medicine', function(Builder $queryHas)use($search) {
                                    $queryHas->where('name', 'like', "%{$search}%");
                                });
                            })->whereHas('prescriptionList', function(Builder $query)use($prescription_list_id){
                                $query->where('id', $prescription_list_id);
                            })->whereHas('prescriptionList.prescription', function(Builder $query)use($prescription_id){
                                $query->where('id', $prescription_id);
                            })->get();

        $count = PrescriptionDetail::whereHas('medicine', function(Builder $query)use($search) {
                                $query->where('name', 'like', "%{$search}%");
                            })
                            ->whereHas('prescriptionList', function(Builder $query)use($prescription_list_id){
                                $query->where('id', $prescription_list_id);
                            })
                            ->whereHas('prescriptionList.prescription', function(Builder $query)use($prescription_id){
                                $query->where('id', $prescription_id);
                            })->count();

        $max_page = ceil($count / 5);

        return $this->responseResult(compact('racik_detail', 'max_page'))
                    ->message('Success Get Prescription Lists !')
                    ->ok();
    }

    public function setStatusCredit(int $id): JsonResponse
    {
        TransactionCredit::where('id', $id)->update(['status_transaction' => 1]);

        return $this->responseResult()
                    ->message('Success Change Status Credit!')
                    ->ok();
    }
}
