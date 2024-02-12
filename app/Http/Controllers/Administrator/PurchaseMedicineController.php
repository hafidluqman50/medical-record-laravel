<?php

namespace App\Http\Controllers\Administrator;

use App\Models\PurchaseMedicine;
use App\Models\PurchaseMedicineDetail;
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

        $purchase_medicines = PurchaseMedicine::with(['user'])->when($search != '', function(Builder $query)use($search) {
                                $query->where('invoice_number', 'like', "%{$search}%");
                            })->paginate(5)->withQueryString()->through(function(PurchaseMedicine $purchase_medicine) {
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
                            });

        $page_num = ($purchase_medicines->currentPage() - 1) * $purchase_medicines->perPage() + 1;

        return Inertia::render('Administrator/PurchaseMedicine/Index', compact('purchase_medicines', 'page_num'));
    }

    public function create(): Response
    {
        $medical_suppliers = MedicalSupplier::all();
        $medicines         = Medicine::all();

        return Inertia::render('Administrator/PurchaseMedicine/Create', compact('medical_suppliers', 'medicines'));
    }
}
