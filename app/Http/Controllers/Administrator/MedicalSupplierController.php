<?php

namespace App\Http\Controllers\Administrator;

use App\Models\MedicalSupplier;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MedicalSupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $medical_suppliers = MedicalSupplier::when($search != '', function(Builder $query)use($search) {
                                $query->where('name','like',"%{$search}%")
                                      ->orWhere('abbreviation_name', 'like', "%{$search}%")
                                      ->orWhere('address','like',"%{$search}%")
                                      ->orWhere('phone_number', 'like', "%{$search}%");
                             })->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($medical_suppliers->currentPage() - 1) * $medical_suppliers->perPage() + 1;

        return Inertia::render('Administrator/MedicalSupplier/Index', compact('medical_suppliers', 'page_num'));
    }

    public function create(): Response
    {
        return Inertia::render('Administrator/MedicalSupplier/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'              => 'required|string|max:255',
            'abbreviation_name' => 'required|string|max:255',
            'phone_number'      => 'required|string|max:20',
            'address'           => 'required|string'
        ]);

        DB::beginTransaction();

        try {
            MedicalSupplier::create($request->all());
            DB::commit();

            return redirect()->intended('/administrator/medical-suppliers')->with('success', 'Berhasil Input Supplier Obat');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }

    public function edit(int $id): Response
    {
        $medical_supplier = MedicalSupplier::where('id',$id)->firstOrFail();

        return Inertia::render('Administrator/MedicalSupplier/Edit', compact('medical_supplier'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'name'              => 'required|string|max:255',
            'abbreviation_name' => 'required|string|max:255',
            'phone_number'      => 'required|string|max:20',
            'address'           => 'required|string'
        ]);

        DB::beginTransaction();

        try {
            MedicalSupplier::where('id',$id)->update($request->all());
            DB::commit();

            return redirect()->intended('/administrator/medical-suppliers')->with('success', 'Berhasil Update Supplier Obat!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            MedicalSupplier::where('id',$id)->delete();
            DB::commit();

            return redirect()->intended('/administrator/medical-suppliers')->with('success', 'Berhasil Hapus Supplier Obat!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }
}
