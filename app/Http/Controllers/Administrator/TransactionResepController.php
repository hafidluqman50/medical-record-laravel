<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Doctor;
use App\Models\Medicine;
use App\Models\Patient;
use App\Models\PriceParameter;
use App\Models\Prescription;
use App\Models\PrescriptionDetail;
use App\Models\PrescriptionList;
use App\Models\TransactionPrescription;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransactionResepController extends Controller
{
    public function index(): Response
    {
        $kode_transaksi = TransactionPrescription::generateCode();

        $price_parameter = PriceParameter::where('label', 'Tunai')->firstOrFail();

        $medicine_price_parameters = Medicine::with(['medicineFactory'])->get()->map(function(Medicine $medicine) use ($price_parameter) {

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

        $compact = compact(
                            'kode_transaksi', 
                            'price_parameter', 
                            'medicine_price_parameters'
                        );

        return Inertia::render('Administrator/TransactionResep/Index', $compact);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'medicines'        => 'required|array',
            'patient_id'       => 'required|integer|exists:'.Patient::class.',id',
            'doctor_id'        => 'required|integer|exists:'.Doctor::class.',id',
            'sub_total_grand'  => 'required|integer',
            'diskon_grand'     => 'required|integer',
            'total_grand'      => 'required|integer',
            'bayar'            => 'required|integer',
            'kembalian'        => 'required|integer',
            'jenis_pembayaran' => 'required|string:in:tunai,kartu-debit-kredit'
        ]);

        $medicines        = $request->medicines;
        $kode_transaksi   = $request->kode_transaksi;
        $patient_id       = $request->patient_id;
        $doctor_id        = $request->doctor_id;
        $sub_total_grand  = $request->sub_total_grand;
        $total_grand      = $request->total_grand;
        $discount_grand   = $request->diskon_grand;
        $bayar            = $request->bayar;
        $kembalian        = $request->kembalian;
        $jenis_pembayaran = $request->jenis_pembayaran;

        $temp = array_unique(array_column($medicines, 'prefixNum'));
        $prescription_name = array_intersect_key($medicines, $temp);

        DB::beginTransaction();

        try {

            $prescription_id = Prescription::insertGetId([
                'patient_id' => $patient_id,
                'doctor_id'  => $doctor_id,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);

            foreach ($prescription_name as $key => $value) {
                $prescription_list_id = PrescriptionList::insertGetId([
                    'prescription_id' => $prescription_id,
                    'name'            => $value['prefixNum'],
                    'service_fee'     => 0
                ]);

                foreach ($medicines as $k => $v) {
                    if($value['prefixNum'] == $v['prefixNum']) {
                        PrescriptionDetail::create([
                            'prescription_list_id' => $prescription_list_id,
                            'medicine_id'          => $v['id'],
                            'sub_total'            => $v['sub_total'],
                            'qty'                  => $v['qty'],
                            'service_fee'          => $v['jasa'],
                            'total'                => $v['total'],
                            'faktor'               => $v['faktor'],
                            'prescription_name'    => $v['prefixNum']
                        ]);

                        PrescriptionList::where('id', $prescription_list_id)->where('prescription_id',$prescription_id)->increment('service_fee', (int)$v['jasa']);
                    }
                }
            }

            $transaction_id = TransactionPrescription::insertGetId([
                'invoice_number'       => $kode_transaksi,
                'date_transaction'     => date('Y-m-d'),
                'prescription_id'      => $prescription_id,
                'sub_total'            => $sub_total_grand,
                'discount'             => $discount_grand,
                'total'                => $total_grand,
                'pay_total'            => $bayar,
                'change_money'         => $kembalian,
                'transaction_pay_type' => $jenis_pembayaran,
                'status_transaction'   => 1,
                'user_id'              => $request->user()->id,
                'created_at'           => date('Y-m-d H:i:s'),
                'updated_at'           => date('Y-m-d H:i:s')
            ]);

            DB::commit();

            return redirect()->intended('/administrator/transaction-resep/'.$transaction_id.'/print');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }

    public function printInvoice(int $id): Response
    {
        $transaction_prescription = TransactionPrescription::with(['user','prescription.prescriptionLists.prescriptionDetails.medicine'])->firstOrFail();

        return Inertia::render('Administrator/TransactionResep/Print', compact('transaction_prescription'));
    }
}
