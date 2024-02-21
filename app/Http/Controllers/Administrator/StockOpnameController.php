<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Medicine;
use App\Models\StockOpname;
use App\Models\StockOpnameDetail;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StockOpnameController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $stock_opnames = StockOpname::with(['user'])->when($search != '', function(Builder $query)use($search){
            $query->where('notes', 'like', "%{$search}%");
        })->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($stock_opnames->currentPage() - 1) * $stock_opnames->perPage() + 1;

        return Inertia::render('Administrator/StockOpname/Index', compact('stock_opnames', 'page_num'));
    }

    public function create(): Response
    {
        $location_racks = Medicine::groupBy('location_rack')->get();

        return Inertia::render('Administrator/StockOpname/Create', compact('location_racks'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'medicine_stock_opnames' => 'required|array',
            'date_stock_opname'      => 'required|string|date_format:Y-m-d',
            'notes'                  => 'required|string',
            'location_rack'          => 'required|string'
        ]);

        DB::beginTransaction();

        try {
            $stock_opname_id = StockOpname::insertGetId([
                'date_stock_opname' => $request->date_stock_opname,
                'location_rack'     => $request->location_rack,
                'notes'             => $request->notes,
                'user_id'           => $request->user()->id
            ]);

            $collect = collect($request->medicine_stock_opnames)->chunk(50);
            foreach($collect as $value) 
            {
                foreach ($value as $key => $val) {
                    foreach ($val as $k => $v) {
                        StockOpnameDetail::create([
                            'stock_opname_id' => $stock_opname_id,
                            'medicine_id'     => $v['medicine_id'],
                            'unit_medicine'   => $v['unit_medicine'],
                            'stock_computer'  => $v['stock_computer'],
                            'stock_display'   => $v['stock_display'],
                            'stock_deviation' => $v['stock_deviation'],
                            'price'           => $v['price'],
                            'sub_value'       => $v['sub_value'],
                            'date_expired'    => $v['date_expired']
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->intended('/administrator/stock-opnames/print/'.$stock_opname_id)->with('success', 'Berhasil Input Stok Opname');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line : '.$e->getLine());
        }
    }

    public function detail(Request $request, int $id): Response
    {
        $search = $request->search;

        $stock_opname_details = StockOpnameDetail::when($search != '', function(Builder $query) use ($search) {
            $query->whereHas('medicine', function(Builder $queryHas) use ($search) {
                        $queryHas->where('name', 'like', "%{$search}%");
                    });
        })->with(['medicine'])->where('stock_opname_id', $id)->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($stock_opname_details->currentPage() - 1) * $stock_opname_details->perPage() + 1;

        return Inertia::render('Administrator/StockOpname/Detail', compact('stock_opname_details', 'page_num'));   
    }

    public function printStockOpname(int $id): Response
    {
        $stock_opname = StockOpname::with(['user','stockOpnameDetails.medicine'])->where('id', $id)->firstOrFail();

        return Inertia::render('Administrator/StockOpname/Print', compact('stock_opname'));
    }
}
