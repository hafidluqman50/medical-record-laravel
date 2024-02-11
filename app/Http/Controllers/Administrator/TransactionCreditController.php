<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Customer;
use App\Models\Doctor;
use App\Models\Medicine;
use App\Models\Patient;
use App\Models\PriceParameter;
use App\Models\Prescription;
use App\Models\PrescriptionDetail;
use App\Models\PrescriptionList;
use App\Models\TransactionCredit;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransactionCreditController extends Controller
{
    public function index(): Response
    {
        $kode_transaksi = TransactionCredit::generateCode();

        $price_parameter = PriceParameter::where('label', 'Tunai')->firstOrFail();

        $debitur   = Customer::orderByDesc('id')->firstOrFail();

        $customers = Customer::all();

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
                            'patients',
                            'debitur',
                            'customers'
                        );

        return Inertia::render('Administrator/TransactionCredit/Index', $compact);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'medicines'        => 'required|array',
            'customer_id'      => 'required|integer|exists:'.Customer::class.',id',
            'patient_id'       => 'required|integer|exists:'.Patient::class.',id',
            'doctor_id'        => 'required|integer|exists:'.Doctor::class.',id',
            'group_name'       => 'required|string|max:255',
            'sub_total_grand'  => 'required|integer',
            'total_grand'      => 'required|integer',
        ]);

        $medicines         = $request->medicines;
        $kode_transaksi    = $request->kode_transaksi;
        $date_prescription = $request->date_prescription;
        $customer_id       = $request->customer_id;
        $group_name        = $request->group_name;
        $patient_id        = $request->patient_id;
        $doctor_id         = $request->doctor_id;
        $sub_total_grand   = $request->sub_total_grand;
        $total_grand       = $request->total_grand;

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
                            'prescription_packs'   => $v['prescription_packs'],
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

            $transaction_id = TransactionCredit::insertGetId([
                'invoice_number'       => $kode_transaksi,
                'date_transaction'     => date('Y-m-d'),
                'date_prescription'    => $date_prescription,
                'prescription_id'      => $prescription_id,
                'customer_id'          => $customer_id,
                'group_name'           => $group_name,
                'sub_total'            => $sub_total_grand,
                'total'                => $total_grand,
                'status_transaction'   => 0,
                'user_id'              => $request->user()->id,
                'created_at'           => date('Y-m-d H:i:s'),
                'updated_at'           => date('Y-m-d H:i:s')
            ]);

            DB::commit();

            return redirect()->intended('/administrator/transaction-credit/'.$transaction_id.'/print');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }

    public function printInvoice(int $id): Response
    {
        $transaction_credit = TransactionCredit::with(['user','customer','prescription.patient','prescription.doctor','prescription.prescriptionLists.prescriptionDetails.medicine'])->where('id',$id)->firstOrFail();

        return Inertia::render('Administrator/TransactionCredit/Print', compact('transaction_credit'));
    }
}
