<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Medicine;
use App\Models\PurchaseHistory;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseHistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $medicine_batch_number = $request->medicine_batch_number;
        $from_date             = $request->from_date;
        $to_date               = $request->to_date;

        $medicines = Medicine::where('data_location', 'gudang')->get();

        $purchase_histories = PurchaseHistory::with(['medicalSupplier'])->whereBetween('date_purchase',[$from_date,$to_date])
                      ->whereHas('medicine', function(Builder $queryHas) use ($medicine_batch_number) {
                        $queryHas->where('batch_number', $medicine_batch_number);
                      })->paginate(10)->onEachSide(3)->withQueryString();

        $page_num = ($purchase_histories->currentPage() - 1) * $purchase_histories->perPage() + 1;

        return Inertia::render('Administrator/PurchaseHistory/Index', compact('purchase_histories', 'page_num', 'medicines'));
    }
}
