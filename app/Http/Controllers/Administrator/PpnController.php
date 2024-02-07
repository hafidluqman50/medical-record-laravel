<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Ppn;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PpnController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $ppn = Ppn::when($search != '', function(Builder $query)use($search) {
                $query->where('nilai_ppn', 'like', "%{$search}%");
            })->paginate(1)->withQueryString();

        $page_num = ($ppn->currentPage() - 1) * $ppn->perPage() + 1;

        return Inertia::render('Administrator/Ppn/Index', compact('ppn', 'page_num'));
    }

    public function create(): Response
    {
        return Inertia::render('Administrator/Ppn/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nilai_ppn' => 'required|integer'
        ]);

        DB::beginTransaction();

        try {
            
            if (Ppn::count() > 0) {
                return redirect()->intended('/administrator/ppn')->with('fail', 'Data Ppn Sudah Ada Dan Tidak Bisa Ditambah Lagi!');
            }

            Ppn::create($request->all());
            DB::commit();

            return redirect()->intended('/administrator/ppn')->with('success', 'Berhasil Input Ppn!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }

    public function edit(int $id): Response
    {
        $ppn = Ppn::where('id',$id)->firstOrFail();

        return Inertia::render('Administrator/Ppn/Edit', compact('ppn'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'nilai_ppn' => 'required|integer'
        ]);

        DB::beginTransaction();

        try {

            Ppn::where('id', $id)->update($request->all());
            DB::commit();

            return redirect()->intended('/administrator/ppn')->with('success', 'Berhasil Update Ppn!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {

            Ppn::where('id', $id)->delete();
            DB::commit();

            return redirect()->intended('/administrator/ppn')->with('success', 'Berhasil Hapus Ppn!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }
}
