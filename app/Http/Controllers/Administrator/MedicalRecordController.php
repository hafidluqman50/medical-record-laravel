<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Medicine;
use App\Models\MedicalRecord;
use App\Models\MedicalRecordDetail;
use App\Models\MedicalRecordList;
use App\Models\Prescription;
use App\Models\PrescriptionDetail;
use App\Models\PrescriptionList;
use App\Models\PriceParameter;
use App\Models\Registration;
use App\Models\TransactionPrescription;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MedicalRecordController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $medical_records = MedicalRecord::with(['patient'])->when($search != '', function(Builder $query) use ($search) {
                                $query->whereHas('patient', function(Builder $queryHas) use ($search) {
                                    $queryHas->where('name', 'like', "%{$search}%");
                                });
                            })->paginate(5)->withQueryString();

        $page_num = ($medical_records->currentPage() - 1) * $medical_records->perPage() + 1;

        return Inertia::render('Administrator/MedicalRecord/Index', compact('medical_records', 'page_num'));
    }

    public function create(): Response
    {
        $registrations = Registration::with(['patient','doctor'])->where('status_register',0)->get();

        $kode_transaksi = TransactionPrescription::generateCode();

        $price_parameter = PriceParameter::where('label', 'Tunai')->firstOrFail();

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
        
        return Inertia::render('Administrator/MedicalRecord/Create', compact('registrations', 'kode_transaksi', 'price_parameter', 'medicines'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'registration_id'         => 'required|integer',
            'body_height'             => 'required|numeric|between:0,9999.99',
            'body_weight'             => 'required|numeric|between:0,9999.99',
            'body_temp'               => 'required|numeric|between:0,9999.99',
            'blood_pressure'          => 'required|string|max:10',
            'complains_of_pain'       => 'required|string',
            'anemnesis'               => 'required|string',
            'physical_examinations'   => 'required|string',
            'supporting_examinations' => 'required|string',
            'diagnose'                => 'required|string',
            'lab_action'              => 'required|string',
            'therapy'                 => 'required|string',
            'referral'                => 'required|string',
            'next_control_date'       => 'required|string',
            'notes'                   => 'required|string',
            'medicines'               => 'required|array',
            'sub_total_grand'         => 'required|integer',
            'diskon_grand'            => 'required|integer',
            'total_grand'             => 'required|integer',
            'bayar'                   => 'required|integer',
            'kembalian'               => 'required|integer',
            'jenis_pembayaran'        => 'required|string:in:tunai,kartu-debit-kredit'
        ]);

        $medicines        = $request->medicines;
        $kode_transaksi   = $request->kode_transaksi;
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
            $get_registration_by_id = Registration::where('id', $request->registration_id)->firstOrFail();

            $check_medical_record = MedicalRecord::where('patient_id', $get_registration_by_id->patient_id)->exists();

            if($check_medical_record) {
                $medical_record_id = MedicalRecord::where('patient_id', $get_registration_by_id->patient_id)->firstOrFail()->id;
            } else {
                $medical_record_id = MedicalRecord::insertGetId([
                    'patient_id' => $get_registration_by_id->patient_id,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ]);
            }

            $input_medical_record_list = $request->except([
                'kode_transaksi',
                'medicines', 
                'sub_total_grand',
                'diskon_grand',
                'total_grand',
                'bayar',
                'kembalian',
                'jenis_pembayaran',
            ]);

            $input_medical_record_list['date_check_up']     = date('Y-m-d');
            $input_medical_record_list['medical_record_id'] = $medical_record_id;
            $input_medical_record_list['main_complaint']    = $input_medical_record_list['complains_of_pain'];
            $input_medical_record_list['created_at']        = date('Y-m-d H:i:s');
            $input_medical_record_list['updated_at']        = date('Y-m-d H:i:s');

            unset($input_medical_record_list['complains_of_pain']);

            $medical_record_list_id = MedicalRecordList::insertGetId($input_medical_record_list);

            foreach ($medicines as $key => $value) {
                MedicalRecordDetail::create([
                    'medical_record_list_id' => $medical_record_list_id,
                    'medicine_id'            => $value['id'],
                    'dose'                   => $value['dose'],
                    'qty'                    => $value['qty']
                ]);
            }

            $prescription_id = Prescription::insertGetId([
                'patient_id' => $get_registration_by_id->patient_id,
                'doctor_id'  => $get_registration_by_id->doctor_id,
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
                'status_transaction'   => 0,
                'user_id'              => $request->user()->id,
                'created_at'           => date('Y-m-d H:i:s'),
                'updated_at'           => date('Y-m-d H:i:s')
            ]);

            /* Update Status Register from 0 to 1 */
            Registration::where('id', $request->registration_id)->update(['status_register' => 1]);

            DB::commit();

            return redirect()->intended('/administrator/medical-records')->with('success', 'Berhasil Input Rekam Medis!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
        }
    }

    public function listRecords(Request $request, int $medical_record_id): Response
    {   
        $search = $request->search;

        $medical_record_lists = MedicalRecordList::with(['registration.patient','registration.doctor'])
                                ->when($search != '', function(Builder $query) use ($search) {
                                    $query->whereHas('registration.patient', function(Builder $queryHas) use ($search) {
                                        $queryHas->where('name', 'like', "%{$search}%");
                                    })->orWhereHas('registration.doctor', function(Builder $queryHas) use ($search) {
                                        $queryHas->where('name', 'like', "%{$search}%");
                                    });
                                })->where('medical_record_id', $medical_record_id)->paginate(5)->withQueryString();

        $page_num = ($medical_record_lists->currentPage() - 1) * $medical_record_lists->perPage() + 1;

        return Inertia::render('Administrator/MedicalRecord/ListRecord', compact('medical_record_lists', 'page_num'));
    }

    public function detailRecords(Request $request, int $medical_record_id, int $medical_record_list_id): Response
    {
        $search = $request->search;

        $medical_record_details = MedicalRecordDetail::with(['medicalRecordList', 'medicine'])
                                ->when($search != '', function(Builder $query) use ($search) {
                                    $query->whereHas('medicine', function(Builder $queryHas) use ($search) {
                                        $queryHas->where('name', 'like', "%{$search}%");
                                    });
                                })
                                ->whereHas('medicalRecordList', function(Builder $queryHas) use ($medical_record_id){
                                    $queryHas->where('medical_record_id', $medical_record_id);
                                })
                                ->where('medical_record_list_id', $medical_record_list_id)
                                ->paginate(5)->withQueryString();

        $page_num = ($medical_record_details->currentPage() - 1) * $medical_record_details->perPage() + 1;

        return Inertia::render('Administrator/MedicalRecord/DetailRecord', compact('medical_record_details', 'page_num'));
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            MedicalRecord::where('id', $id)->delete();

            DB::commit();

            return redirect()->intended('/administrator/medical-records')->with('success', 'Berhasil Hapus Rekam Medis!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
        }
    }
}
