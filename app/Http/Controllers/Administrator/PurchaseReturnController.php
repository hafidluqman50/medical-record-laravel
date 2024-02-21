<?php

namespace App\Http\Controllers\Administrator;

use App\Models\CardStock;
use App\Models\Medicine;
use App\Models\MedicalSupplier;
use App\Models\PurchaseReturn;
use App\Models\PurchaseReturnDetail;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseReturnController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $purchase_returns = PurchaseReturn::with(['medicalSupplier'])->when($search != '', function(Builder $query)use($search) {
                            $query->where('invoice_number','like',"%{$search}%")
                                  ->orWhere('invoice_number_purchase');
                        })->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($purchase_returns->currentPage() - 1) * $purchase_returns->perPage() + 1;

        return Inertia::render('Administrator/PurchaseReturn/Index', compact('purchase_returns', 'page_num'));
    }

    public function create(): Response
    {
        $invoice_number = PurchaseReturn::generateCode();

        return Inertia::render('Administrator/PurchaseReturn/Create', compact('invoice_number'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'invoice_number'          => 'required|string',
            'date_return'             => 'required|string|date_format:Y-m-d',
            'date_return_purchase'    => 'required|string|date_format:Y-m-d',
            'invoice_number_purchase' => 'required|string',
            'medical_supplier_id'     => 'required|integer|exists:'.MedicalSupplier::class.',id',
            'data_returns'            => 'required|array',
            'total_return'            => 'required|integer'
        ]);

        DB::beginTransaction();

        try {
            $purchase_return_id = PurchaseReturn::insertGetId($request->except('data_returns'));

            foreach ($request->data_returns as $key => $value) {
                
                unset($value['medicine_name'], $value['price']);

                $value['purchase_return_id'] = $purchase_return_id;

                PurchaseReturnDetail::create($value);

                $old_stock_medicine = Medicine::where('id', $value['medicine_id'])->firstOrFail()->stock;

                CardStock::create([
                    'date_stock'        => date('Y-m-d'),
                    'invoice_number'    => $request->invoice_number,
                    'type'              => 'retur pembelian',
                    'medicine_id'       => $value['medicine_id'],
                    'buy'               => 0,
                    'sell'              => 0,
                    'return'            => $value['qty_return'],
                    'accumulated_stock' => $value['qty_return'] + $old_stock_medicine,
                    'notes'             => 'Retur Pembelian'
                ]);
            }

            DB::commit();

            return redirect()->intended('administrator/purchase-returns')->with('success', 'Berhasil Input Retur Pembelian');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
            
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            PurchaseReturn::where('id', $id)->delete();

            DB::commit();

            return redirect()->intended('administrator/purchase-returns')->with('success', 'Berhasil Hapus Retur Pembelian');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }

    public function detail(Request $request, int $id): Response
    {
        $search = $request->search;

        $purchase_return_details = PurchaseReturnDetail::with(['medicine'])->where('purchase_return_id', $id)->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($purchase_return_details->currentPage() - 1) * $purchase_return_details->perPage() + 1;        

        return Inertia::render('Administrator/PurchaseReturn/Detail', compact('purchase_return_details', 'page_num'));
    }
}
