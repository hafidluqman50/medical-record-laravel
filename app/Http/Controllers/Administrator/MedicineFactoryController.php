<?php

namespace App\Http\Controllers\Administrator;

use App\Models\MedicineFactory;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MedicineFactoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $medicine_factories = MedicineFactory::when($search != '', function(Builder $query)use($search) {
                                $query->where('name','like',"%{$search}%")
                                      ->orWhere('address','like',"%{$search}%")
                                      ->orWhere('phone_number', 'like', "%{$search}%");
                             })->paginate(5)->withQueryString();

        $page_num = ($medicine_factories->currentPage() - 1) * $medicine_factories->perPage() + 1;

        return Inertia::render('Administrator/MedicineFactory/Index', compact('medicine_factories', 'page_num'));
    }

    public function create(): Response
    {
        return Inertia::render('Administrator/MedicineFactory/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'              => 'required|string|max:255',
            'phone_number'      => 'required|string|max:20',
            'address'           => 'required|string'
        ]);

        DB::beginTransaction();

        try {
            MedicineFactory::create($request->all());
            DB::commit();

            return redirect()->intended('/administrator/medicine-factories')->with('success', 'Berhasil Input Pabrik Obat!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }

    public function edit(int $id): Response
    {
        $medicine_factory = MedicineFactory::where('id',$id)->firstOrFail();

        return Inertia::render('Administrator/MedicineFactory/Edit', compact('medicine_factory'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'name'              => 'required|string|max:255',
            'phone_number'      => 'required|string|max:20',
            'address'           => 'required|string'
        ]);

        DB::beginTransaction();

        try {
            MedicineFactory::where('id',$id)->update($request->all());
            DB::commit();

            return redirect()->intended('/administrator/medicine-factories')->with('success', 'Berhasil Update Pabrik Obat!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            MedicineFactory::where('id',$id)->delete();
            DB::commit();

            return redirect()->intended('/administrator/medicine-factories')->with('success', 'Berhasil Hapus Pabrik Obat!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }
}
