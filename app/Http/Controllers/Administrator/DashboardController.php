<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Doctor;
use App\Models\Medicine;
use App\Models\Patient;
use App\Models\Transaction;
use App\Models\TransactionPrescription;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {

        $total_medicines = Medicine::count();
        $total_sales     = Transaction::sum('total') + TransactionPrescription::where('status_transaction',1)->sum('total');
        $total_patients  = Patient::count();
        $total_doctors   = Doctor::count();

        return Inertia::render('Administrator/Dashboard', compact('total_medicines', 'total_sales', 'total_patients', 'total_doctors'));
    }
}
