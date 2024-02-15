<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Medicine;
use App\Models\CardStock;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CardStockController extends Controller
{
    public function index(Request $request): Response
    {
        $medicine_batch_number = $request->medicine_batch_number;
        $from_date             = $request->from_date;
        $to_date               = $request->to_date;

        $medicines = Medicine::where('data_location', 'gudang')->get();

        $card_stocks = CardStock::whereBetween('date_stock',[$from_date,$to_date])
                      ->whereHas('medicine', function(Builder $queryHas) use ($medicine_batch_number) {
                        $queryHas->where('batch_number', $medicine_batch_number);
                      })->orderBy('accumulated_stock','DESC')->paginate(10)->withQueryString();

        $page_num = ($card_stocks->currentPage() - 1) * $card_stocks->perPage() + 1;

        return Inertia::render('Administrator/CardStock/Index', compact('card_stocks', 'page_num', 'medicines'));
    }
}
