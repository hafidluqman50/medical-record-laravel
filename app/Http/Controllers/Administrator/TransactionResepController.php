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

        $patients = Patient::with(['patientCategory'])->get();

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

        $medicines = Medicine::with(['medicineFactory'])->get()->map(function(Medicine $medicine) {

            $capital_price     = $medicine->capital_price;
            $capital_price_vat = $medicine->capital_price_vat;
            $sell_price        = $medicine->sell_price;

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
                            'medicine_price_parameters',
                            'medicines',
                            'patients'
                        );

        return Inertia::render('Administrator/TransactionResep/Index', $compact);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'medicines'            => 'required|array',
            'patient_id'           => 'required|integer|exists:'.Patient::class.',id',
            'patient_name'         => 'sometimes|nullable|string',
            'patient_address'      => 'sometimes|nullable|string',
            'patient_phone_number' => 'sometimes|nullable|string',
            'patient_city_place'   => 'sometimes|nullable|string',
            'doctor_id'            => 'required|integer|exists:'.Doctor::class.',id',
            'doctor_code'          => 'sometimes|nullable|string',
            'doctor_name'          => 'sometimes|nullable|string',
            'sub_total_grand'      => 'required|integer',
            'diskon_grand'         => 'required|integer',
            'total_grand'          => 'required|integer',
            'bayar'                => 'required|integer',
            'kembalian'            => 'required|integer',
            'jenis_pembayaran'     => 'required|string:in:tunai,bank'
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

            if ($patient_id == '') {
                $patient_id = Patient::insertGetId([
                    'code'                => Patient::generateCode(),
                    'patient_category_id' => null,
                    'name'                => $request->patient_name,
                    'address'             => $request->patient_address,
                    'phone_number'        => $request->phone_number,
                    'city_place'          => $request->city_place
                ]);
            }

            if($doctor_id == '') {
                $doctor_id = Doctor::insertGetId([
                    'code' => $request->doctor,
                    'name' => $request->doctor_name
                ]);
            }

            $prescription_id = Prescription::insertGetId([
                'patient_id' => $patient_id,
                'doctor_id'  => $doctor_id,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);

            foreach ($prescription_name as $key => $value) {
                $prescription_list_id = PrescriptionList::insertGetId([
                    'prescription_id'          => $prescription_id,
                    'name'                     => $value['prefixNum'],
                    'service_fee'              => 0,
                    'total_costs'              => 0,
                    'total_prescription_packs' => 0
                ]);

                foreach ($medicines as $k => $v) {
                    if($value['prefixNum'] == $v['prefixNum']) {
                        PrescriptionDetail::create([
                            'prescription_list_id' => $prescription_list_id,
                            'medicine_id'          => $v['id'],
                            'sub_total'            => $v['sub_total'],
                            'qty'                  => $v['qty'],
                            'prescription_packs'   => $v['prescription_packs'] ?? 0,
                            'dose'                 => $v['dose'],
                            'service_fee'          => $v['jasa'],
                            'total'                => $v['total'],
                            'faktor'               => $v['faktor'],
                            'prescription_name'    => $v['prefixNum']
                        ]);

                        PrescriptionList::where('id', $prescription_list_id)->where('prescription_id',$prescription_id)->increment('service_fee', (int)$v['jasa']);
                        PrescriptionList::where('id', $prescription_list_id)->where('prescription_id',$prescription_id)->increment('total_costs', (int)$v['total']);
                        PrescriptionList::where('id', $prescription_list_id)->where('prescription_id',$prescription_id)->increment('total_prescription_packs', (int)$v['prescription_packs']);
                    }
                }
            }

            $check = TransactionPrescription::where('invoice_number', $kode_transaksi)->exists();
            if($check) {
                TransactionPrescription::where('invoice_number', $kode_transaksi)->delete();

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
                    'doctor_id'            => $doctor_id,
                    'user_id'              => $request->user()->id,
                    'created_at'           => date('Y-m-d H:i:s'),
                    'updated_at'           => date('Y-m-d H:i:s')
                ]);
            }
            else {
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
            }


            DB::commit();

            return redirect()->intended('/administrator/transaction-resep/print/'.$transaction_id);
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }

    public function printInvoice(int $id, ?string $url = null): Response
    {

        if($url == null) {
            $url = 'administrator.transaction-resep';
        }

        $transaction_prescription = TransactionPrescription::with(['user','prescription.patient','prescription.doctor','prescription.prescriptionLists.prescriptionDetails.medicine'])->firstOrFail();

        return Inertia::render('Administrator/TransactionResep/Print', compact('transaction_prescription', 'url'));
    }

    public function printReceipt(int $id): Response
    {
        if($url == null) {
            $url = 'administrator.transaction-resep';
        }

        $transaction_prescription = TransactionPrescription::with(['user','prescription.patient','prescription.prescriptionLists.prescriptionDetails.medicine'])->firstOrFail();

        return Inertia::render('Administrator/TransactionResep/Receipt', compact('transaction_prescription', 'url'));
    }
}
