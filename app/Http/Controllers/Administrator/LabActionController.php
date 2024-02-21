<?php

namespace App\Http\Controllers\Administrator;

use App\Models\LabAction;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LabActionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $lab_actions = LabAction::when($search != '', function(Builder $query)use($search){
            $query->where('name', 'like', "%{$search}%");
        })->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($lab_actions->currentPage() - 1) * $lab_actions->perPage() + 1;

        return Inertia::render('Administrator/LabAction/Index', compact('lab_actions', 'page_num'));
    }

    public function create(): Response
    {
        return Inertia::render('Administrator/LabAction/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        DB::beginTransaction();

        try {
            LabAction::create($request->all());

            DB::commit();

            return redirect()->intended('/administrator/lab-actions')->with('success', 'Berhasil Input Tindakan Lab!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line : '.$e->getLine());
        }
    }

    public function edit(int $id): Response
    {
        $lab_action = LabAction::where('id', $id)->firstOrFail();

        return Inertia::render('Administrator/LabAction/Edit', compact('lab_action'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        DB::beginTransaction();

        try {
            LabAction::where('id', $id)->update($request->all());

            DB::commit();

            return redirect()->intended('/administrator/lab-actions')->with('success', 'Berhasil Update Tindakan Lab!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line : '.$e->getLine());
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            LabAction::where('id', $id)->delete();

            DB::commit();

            return redirect()->intended('/administrator/lab-actions')->with('success', 'Berhasil Hapus Tindakan Lab!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line : '.$e->getLine());
        }
    }
}
