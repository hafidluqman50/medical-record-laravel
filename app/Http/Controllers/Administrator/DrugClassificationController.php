<?php

namespace App\Http\Controllers\Administrator;

use App\Models\DrugClassification;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DrugClassificationController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $drug_classifications = DrugClassification::when($search != '', function(Builder $query)use($search) {
            $query->where('name','like',"%{$search}%");
        })->paginate(5)->withQueryString();

        $page_num = ($drug_classifications->currentPage() - 1) * $drug_classifications->perPage() + 1;

        return Inertia::render('Administrator/DrugClassification/Index', compact('drug_classifications', 'page_num'));
    }

    public function create(): Response
    {
        return Inertia::render('Administrator/DrugClassification/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_prekursor' => 'required|integer|in:0,1',
            'is_narcotic' => 'required|integer|in:0,1',
            'is_psychotropic' => 'required|integer|in:0,1'
        ]);

        DB::beginTransaction();

        try {
            DrugClassification::create($request->all());
            DB::commit();

            return redirect()->intended('/administrator/drug-classifications')->with('success', 'Berhasil Input Golongan Obat');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());   
        }
    }

    public function edit(int $id): Response
    {
        $drug_classification = DrugClassification::where('id',$id)->firstOrFail();

        return Inertia::render('Administrator/DrugClassification/Edit', compact('drug_classification'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_prekursor' => 'required|integer|in:0,1',
            'is_narcotic' => 'required|integer|in:0,1',
            'is_psychotropic' => 'required|integer|in:0,1'
        ]);

        DB::beginTransaction();

        try {
            DrugClassification::where('id', $id)->update($request->all());
            DB::commit();

            return redirect()->intended('/administrator/drug-classifications')->with('success', 'Berhasil Update Golongan Obat');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());   
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            DrugClassification::where('id',$id)->delete();

            DB::commit();

            return redirect()->intended('/administrator/drug-classifications')->with('success', 'Berhasil Hapus Golongan Obat');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
            
        }
    }
}
