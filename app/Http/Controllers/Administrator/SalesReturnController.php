<?php

namespace App\Http\Controllers\Administrator;

use App\Models\CardStock;
use App\Models\Medicine;
use App\Models\SalesReturn;
use App\Models\SalesReturnDetail;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SalesReturnController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $sales_returns = SalesReturn::when($search != '', function(Builder $query)use($search) {
                            $query->where('invoice_number','like',"%{$search}%")
                                  ->orWhere('invoice_number_transaction');
                        })->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($sales_returns->currentPage() - 1) * $sales_returns->perPage() + 1;

        return Inertia::render('Administrator/SalesReturn/Index', compact('sales_returns', 'page_num'));
    }

    public function create(): Response
    {
        $invoice_number = SalesReturn::generateCode();

        return Inertia::render('Administrator/SalesReturn/Create', compact('invoice_number'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'invoice_number'             => 'required|string',
            'date_return'                => 'required|string|date_format:Y-m-d',
            'date_return_transaction'    => 'required|string|date_format:Y-m-d',
            'invoice_number_transaction' => 'required|string',
            'data_returns'               => 'required|array',
            'total_return'               => 'required|integer'
        ]);

        DB::beginTransaction();

        try {
            $sales_return_id = SalesReturn::insertGetId($request->except('data_returns'));

            foreach ($request->data_returns as $key => $value) {
                
                unset($value['medicine_name'], $value['price']);

                $value['sales_return_id'] = $sales_return_id;

                $value['invoice_number_transaction'] = substr($value['invoice_number_transaction'], 0, -3);

                SalesReturnDetail::create($value);

                $old_stock_medicine = Medicine::where('id', $value['medicine_id'])->firstOrFail()->stock;

                CardStock::create([
                    'date_stock'        => date('Y-m-d'),
                    'invoice_number'    => $request->invoice_number,
                    'type'              => 'retur penjualan',
                    'medicine_id'       => $value['medicine_id'],
                    'buy'               => 0,
                    'sell'              => 0,
                    'return'            => $value['qty_return'],
                    'accumulated_stock' => $value['qty_return'] + $old_stock_medicine,
                    'notes'             => 'Retur Penjualan'
                ]);
            }

            DB::commit();

            return redirect()->intended('administrator/sales-returns')->with('success', 'Berhasil Input Retur Penjualan');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
            
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            SalesReturn::where('id', $id)->delete();

            DB::commit();

            return redirect()->intended('administrator/sales-returns')->with('success', 'Berhasil Hapus Retur Penjualan');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }

    public function detail(Request $request, int $id): Response
    {
        $search = $request->search;

        $sales_return_details = SalesReturnDetail::with(['medicine'])->where('sales_return_id', $id)->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($sales_return_details->currentPage() - 1) * $sales_return_details->perPage() + 1;        

        return Inertia::render('Administrator/SalesReturn/Detail', compact('sales_return_details', 'page_num'));
    }
}
