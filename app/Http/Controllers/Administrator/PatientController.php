<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Patient;
use App\Models\PatientCategory;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;
        
        $patients = Patient::with('patientCategory')
        ->when($request->filled('search'), function(Builder $query) use ($search){
            $query->where('name','like',"%{$search}%");
        })->paginate(5)->onEachSide(3)->withQueryString()->through(function(Patient $through) {
            $convert_date = human_date($through->birth_date);
            unset($through->birth_date);

            $through->birth_date = $convert_date;

            return $through;
        });

        $page_num = ($patients->currentPage() - 1) * $patients->perPage() + 1;

        return Inertia::render('Administrator/Patient/Index', compact('patients','page_num'));
    }

    public function create(): Response
    {
        $code = Patient::generateCode();
        $patient_categories = PatientCategory::all();

        return Inertia::render('Administrator/Patient/Create', compact('code','patient_categories'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'code'                => 'required|string|max:100',
            'bpjs_number'         => 'sometimes|nullable|string',
            'name'                => 'required|string|max:100',
            'patient_category_id' => 'required|integer|not_in:0|exists:'.PatientCategory::class.',id',
            'birth_date'          => 'required|string|date_format:Y-m-d',
            'phone_number'        => 'required|string|max:20',
            'city_place'          => 'required|string',
            'address'             => 'required|string'
        ]);

        DB::beginTransaction();

        try {
            Patient::create($request->all());
            DB::commit();

            return redirect()->intended('/administrator/patients')->with('success', 'Berhasil Input Pasien!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }

    public function edit(int $id): Response
    {
        $patient = Patient::where('id',$id)->firstOrFail();
        $patient_categories = PatientCategory::all();

        return Inertia::render('Administrator/Patient/Edit', compact('patient', 'patient_categories'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'code'                => 'required|string|max:100',
            'bpjs_number'         => 'sometimes|nullable|string',
            'name'                => 'required|string|max:100',
            'patient_category_id' => 'required|integer|not_in:0|exists:'.PatientCategory::class.',id',
            'birth_date'          => 'required|string|date_format:Y-m-d',
            'phone_number'        => 'required|string|max:20',
            'city_place'          => 'required|string',
            'address'             => 'required|string'
        ]);

        DB::beginTransaction();

        try {
            Patient::where('id', $id)->update($request->all());
            DB::commit();

            return redirect()->intended('/administrator/patients')->with('success', 'Berhasil Update Pasien!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();
        try {
            Patient::where('id', $id)->delete();
            DB::commit();

            return redirect()->intended('/administrator/patients')->with('success', 'Berhasil Hapus Pasien!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }
}
