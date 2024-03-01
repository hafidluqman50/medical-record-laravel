<?php

namespace App\Http\Controllers\Administrator;

use App\Models\CardStock;
use App\Models\PurchaseHistory;
use App\Models\PurchaseMedicine;
use App\Models\PurchaseMedicineDetail;
use App\Models\Ppn;
use App\Models\Medicine;
use App\Models\MedicalSupplier;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseMedicineController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $purchase_medicines = PurchaseMedicine::with(['medicalSupplier','user'])->when($search != '', function(Builder $query)use($search) {
                                $query->where('invoice_number', 'like', "%{$search}%");
                            })->paginate(5)->onEachSide(3)->withQueryString()->through(function(PurchaseMedicine $purchase_medicine) {
                                $total_dpp   = format_rupiah($purchase_medicine->total_dpp);
                                $total_ppn   = format_rupiah($purchase_medicine->total_ppn);
                                $total_grand = format_rupiah($purchase_medicine->total_grand);

                                unset(
                                    $purchase_medicine->total_dpp,
                                    $purchase_medicine->total_ppn,
                                    $purchase_medicine->total_grand
                                );

                                $purchase_medicine->total_dpp   = $total_dpp;
                                $purchase_medicine->total_ppn   = $total_ppn;
                                $purchase_medicine->total_grand = $total_grand;

                                return $purchase_medicine;
                            });

        $page_num = ($purchase_medicines->currentPage() - 1) * $purchase_medicines->perPage() + 1;

        return Inertia::render('Administrator/PurchaseMedicine/Index', compact('purchase_medicines', 'page_num'));
    }

    public function create(): Response
    {
        $medical_suppliers = MedicalSupplier::all();
        $medicines         = Medicine::where('data_location', 'gudang')->get();
        $kode_pembelian    = PurchaseMedicine::generateCode();

        return Inertia::render('Administrator/PurchaseMedicine/Create', compact('medical_suppliers', 'medicines', 'kode_pembelian'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'order'               => 'required|array',
            'medical_supplier_id' => 'required|integer|exists:'.MedicalSupplier::class.',id',
            'code'                => 'required|string',
            'invoice_number'      => 'required|string',
            'date_receive'        => 'required|string|date_format:Y-m-d',
            'debt_time'           => 'required|integer',
            'due_date'            => 'required|string|date_format:Y-m-d',
            'type'                => 'required|string',
            'total_dpp'           => 'required|integer',
            'total_ppn'           => 'required|integer',
            'total_discount'      => 'required|integer',
            'total_grand'         => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            $purchase_medicine_id = PurchaseMedicine::insertGetId([
                'invoice_number'      => $request->invoice_number,
                'medical_supplier_id' => $request->medical_supplier_id,
                'code'                => $request->code,
                'date_receive'        => $request->date_receive,
                'debt_time'           => $request->debt_time,
                'due_date'            => $request->due_date,
                'type'                => $request->type,
                'total_dpp'           => $request->total_dpp,
                'total_ppn'           => $request->total_ppn,
                'total_discount'      => $request->total_discount,
                'total_grand'         => $request->total_grand,
                'user_id'             => $request->user()->id,
                'created_at'          => date('Y-m-d H:i:s'),
                'updated_at'          => date('Y-m-d H:i:s')
            ]);

            foreach ($request->order as $key => $value) {
                PurchaseMedicineDetail::create([
                    'purchase_medicine_id' => $purchase_medicine_id,
                    'medicine_id'          => $value['medicine_id'],
                    'qty'                  => $value['qty'],
                    'price'                => $value['price'],
                    'ppn'                  => $value['ppn'],
                    'disc_1'               => $value['disc_1'],
                    'disc_2'               => $value['disc_2'],
                    'disc_3'               => $value['disc_3'],
                    'ppn_type'             => $value['ppn_type'],
                    'sub_total'            => $value['sub_total']
                ]);

                PurchaseHistory::create([
                    'date_purchase'       => $request->date_receive,
                    'invoice_number'      => $request->invoice_number,
                    'medical_supplier_id' => $request->medical_supplier_id,
                    'qty'                 => $value['qty'],
                    'medicine_id'         => $value['medicine_id'],
                    'unit_medicine'       => $value['unit_medicine'],
                    'sub_total'           => $value['sub_total']
                ]);

                $medicine_first = Medicine::where('id', $value['medicine_id'])->firstOrFail();

                if($value['ppn_type'] == 'include-ppn') {
                    if($value['price'] > $medicine_first->capital_price_vat) {
                        Medicine::where('id', $value['medicine_id'])->update([
                            'capital_price'     => $value['price'],
                            'capital_price_vat' => $value['price']
                        ]);
                    }
                } else {
                    if($value['price'] > $medicine_first->capital_price) {
                        
                        $ppn = Ppn::firstOrFail()->nilai_ppn;

                        $capital_price_vat = $value['price'] + (($value['price'] * $ppn) / 100);
                        
                        Medicine::where('id', $value['medicine_id'])->update([
                            'capital_price'     => $value['price'],
                            'capital_price_vat' => $ppn
                        ]);
                    }
                }

                CardStock::create([
                    'invoice_number'    => $request->invoice_number,
                    'medicine_id'       => $value['medicine_id'],
                    'date_stock'        => date('Y-m-d'),
                    'type'              => 'beli',
                    'buy'               => $value['qty'],
                    'sell'              => 0,
                    'return'            => 0,
                    'accumulated_stock' => $medicine_first->stock+$value['qty'],
                    'notes'             => 'Pembelian'
                ]);
            }

            DB::commit();

            return redirect()->intended('/administrator/purchase-medicines/print/'.$purchase_medicine_id);
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - '.$e->getLine());
        }
    }

    public function printInvoice(int $id): Response
    {
        $purchase_medicine = PurchaseMedicine::with(['medicalSupplier', 'purchaseMedicineDetails.medicine'])
                             ->where('id', $id)->firstOrFail();

        return Inertia::render('Administrator/PurchaseMedicine/Print', compact('purchase_medicine'));
    }

    public function detail(Request $request, int $id): Response
    {
        $purchase_medicine_details = PurchaseMedicineDetail::with(['medicine'])->where('purchase_medicine_id',$id)->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($purchase_medicine_details->currentPage() - 1) * $purchase_medicine_details->perPage() + 1;

        return Inertia::render('Administrator/PurchaseMedicine/Detail', compact('purchase_medicine_details', 'page_num', 'id'));
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            PurchaseMedicine::where('id', $id)->delete();

            DB::commit();

            return redirect()->intended('/administrator/purchase-medicines')->with('success', 'Berhasil Hapus Pembelian Obat');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - '.$e->getLine());
        }
    }
}
