<?php

namespace App\Http\Controllers\Doctor;

use Auth;
use App\Http\Controllers\Controller;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $search    = $request->search;

        $registrations = Registration::with(['patient','doctor','medicalRecordList'])->when($search != NULL, function(Builder $query) use ($search) {
                            $query->whereHas('patient', function(Builder $queryEloquent) use ($search) {
                                $queryEloquent->where('name', 'like', "%{$search}%");
                            });
                        })->where('doctor_id', Auth::guard('doctor')->id())->paginate(5)->onEachSide(3)->withQueryString()->through(function(Registration $through) {
                            $human_date = human_date($through->date_register);

                            unset($through->date_register);

                            $through->date_register = $human_date;

                            return $through;
                        });

        $page_num = ($registrations->currentPage() - 1) * $registrations->perPage() + 1;
        
        return Inertia::render('Doctor/Dashboard', compact('registrations', 'page_num'));
    }
}
