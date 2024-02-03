<?php

namespace App\Http\Controllers\Administrator;

use App\Models\PatientCategory;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PatientCategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $patient_categories = PatientCategory::paginate(5);
        return Inertia::render('Administrator/PatientCategory/Index',[
            'patient_categories' => $patient_categories
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administrator/PatientCategory/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:100'
        ]);

        DB::beginTransaction();

        try {
            PatientCategory::create($request->all());
            DB::commit();

            return redirect()->intended('/administrator/patient-categories')->with('success', 'Berhasil Input Kategori Pasien');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }

    public function edit(int $id): Response
    {
        $patient_category = PatientCategory::where('id',$id)->firstOrFail();
        return Inertia::render('Administrator/PatientCategory/Edit', compact('patient_category'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:100'
        ]);

        DB::beginTransaction();

        try {
            PatientCategory::where('id',$id)->update($request->all());
            DB::commit();

            return redirect()->intended('/administrator/patient-categories')->with('success', 'Berhasil Update Kategori Pasien');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            PatientCategory::where('id',$id)->delete();
            DB::commit();

            return redirect()->intended('/administrator/patient-categories')->with('success', 'Berhasil Hapus Kategori Pasien!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' -  Line: '.$e->getLine());
        }
    }
}
