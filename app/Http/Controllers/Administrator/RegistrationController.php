<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Registration;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RegistrationController extends Controller
{
    public function index(Request $request): Response
    {
        $doctor_id = $request->doctor;
        $search    = $request->search;

        $registrations = Registration::with(['patient','doctor'])
                        ->when($doctor_id != NULL, function(Builder $query) use ($doctor_id) {
                            $query->where('doctor_id', $doctor_id);
                        })->when($search != NULL, function(Builder $query) use ($search) {
                            $query->whereHas('patient', function(Builder $queryEloquent) use ($search) {
                                $queryEloquent->where('name', 'like', "%{$search}%");
                            });
                        })->paginate(5)->withQueryString();

        return Inertia::render('Administrator/Registration/Index', compact('registrations'));
    }
}
