<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Registration;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RegistrationController extends Controller
{
    public function index(Request $request): Response
    {
        $doctor_id = $request->doctor_id;
        $search    = $request->search;

        $registrations = Registration::with(['patient','doctor'])
                        ->when($doctor_id != NULL, function(Builder $query) use ($doctor_id) {
                            $query->where('doctor_id', $doctor_id);
                        })->when($search != NULL, function(Builder $query) use ($search) {
                            $query->whereHas('patient', function(Builder $queryEloquent) use ($search) {
                                $queryEloquent->where('name', 'like', "%{$search}%");
                            });
                        })->paginate(5)->onEachSide(3)->withQueryString()->through(function(Registration $through) {
                            $human_date = human_date($through->date_register);

                            unset($through->date_register);

                            $through->date_register = $human_date;

                            return $through;
                        });

        $doctors = Doctor::all();

        $page_num = ($registrations->currentPage() - 1) * $registrations->perPage() + 1;

        return Inertia::render('Administrator/Registration/Index', compact('registrations', 'doctors', 'doctor_id', 'page_num'));
    }

    public function create(): Response
    {
        $doctors         = Doctor::all();
        $patients        = Patient::all();
        $number_register = Registration::generateCode();

        return Inertia::render('Administrator/Registration/Create', compact('doctors', 'patients', 'number_register'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'patient_id'             => 'required|integer|exists:'.Patient::class.',id',
            'doctor_id'              => 'required|integer|exists:'.Doctor::class.',id',
            'body_height'            => 'required|numeric|between:0,9999.99',
            'body_weight'            => 'required|numeric|between:0,9999.99',
            'body_temp'              => 'required|numeric|between:0,9999.99',
            'blood_pressure'         => 'required|string|max:10',
            'complains_of_pain'      => 'required|string',
            'supporting_examinations' => 'required|string'
        ]);

        $input                    = $request->all();
        $input['date_register']   = date('Y-m-d');
        $input['status_register'] = 0;

        DB::beginTransaction();

        try {
            Registration::create($input);
            DB::commit();

            return redirect()->intended('/administrator/registrations')->with('success', 'Berhasil Input Pendaftaran!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
        }
    }

    public function edit(int $id): Response|RedirectResponse
    {

        $registration = Registration::where('id',$id)->firstOrFail();
        
        if ($registration->status_register == 1) {
            return redirect()->intended('/administrator/registrations')->with('error', 'Tidak bisa diedit! Data Registrasi sudah dilakukan pemeriksaan dokter!');
        }

        $doctors      = Doctor::all();
        $patients     = Patient::all();

        return Inertia::render('Administrator/Registration/Edit', compact('doctors', 'patients', 'registration'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'patient_id'              => 'required|integer|exists:'.Patient::class.',id',
            'doctor_id'               => 'required|integer|exists:'.Doctor::class.',id',
            'body_height'             => 'required|numeric|between:0,9999.99',
            'body_weight'             => 'required|numeric|between:0,9999.99',
            'body_temp'               => 'required|numeric|between:0,9999.99',
            'blood_pressure'          => 'required|string|max:10',
            'complains_of_pain'       => 'required|string',
            'supporting_examinations' => 'required|string'
        ]);

        $input = $request->all();

        DB::beginTransaction();

        try {
            Registration::where('id',$id)->update($input);

            DB::commit();

            return redirect()->intended('/administrator/registrations')->with('success', 'Berhasil Update Pendaftaran!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            Registration::where('id',$id)->delete();

            DB::commit();

            return redirect()->intended('/administrator/registrations')->with('success', 'Berhasil Hapus Pendaftaran!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
        }
    }
}
