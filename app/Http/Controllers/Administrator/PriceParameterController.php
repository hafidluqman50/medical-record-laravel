<?php

namespace App\Http\Controllers\Administrator;

use App\Models\PriceParameter;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PriceParameterController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $price_parameters = PriceParameter::when($search != '', function(Builder $query)use($search) {
            $query->where('name','like',"%{$search}%");
        })->paginate(5)->withQueryString()->through(function(PriceParameter $price_parameter) {
            $embalase   = format_rupiah($price_parameter->embalase);
            $jasa_racik = format_rupiah($price_parameter->jasa_racik);
            $pembulatan = format_rupiah($price_parameter->pembulatan);

            unset(
                $price_parameter->embalase,
                $price_parameter->jasa_racik,
                $price_parameter->pembulatan
            );

            $price_parameter->embalase   = $embalase;
            $price_parameter->jasa_racik = $jasa_racik;
            $price_parameter->pembulatan = $pembulatan;

            return $price_parameter;
        });

        $page_num = ($price_parameters->currentPage() - 1) * $price_parameters->perPage() + 1;

        return Inertia::render('Administrator/PriceParameter/Index', compact('price_parameters', 'page_num'));
    }

    public function create(): Response
    {
        return Inertia::render('Administrator/PriceParameter/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'label'          => 'required|string|max:255',
            'resep_tunai'    => 'required|numeric|between:0,9999999.99',
            'upds'           => 'required|numeric|between:0,9999999.99',
            'hv_otc'         => 'required|numeric|between:0,9999999.99',
            'resep_kredit'   => 'required|numeric|between:0,9999999.99',
            'enggros_faktur' => 'required|numeric|between:0,9999999.99',
            'embalase'       => 'required|integer',
            'jasa_racik'     => 'required|integer',
            'pembulatan'     => 'required|integer'
        ]);

        DB::beginTransaction();

        try {
            PriceParameter::create($request->all());
            DB::commit();

            return redirect()->intended('/administrator/price-parameters')->with('success', 'Berhasil Input Parameter Harga!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' -  Line:'.$e->getLine());
        }
    }

    public function edit(int $id): Response
    {
        $price_parameter = PriceParameter::where('id', $id)->firstOrFail();

        return Inertia::render('Administrator/PriceParameter/Edit', compact('price_parameter'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {

        $request->validate([
            'label'          => 'required|string|max:255',
            'resep_tunai'    => 'required|numeric|between:0,9999999.99',
            'upds'           => 'required|numeric|between:0,9999999.99',
            'hv_otc'         => 'required|numeric|between:0,9999999.99',
            'resep_kredit'   => 'required|numeric|between:0,9999999.99',
            'enggros_faktur' => 'required|numeric|between:0,9999999.99',
            'embalase'       => 'required|integer',
            'jasa_racik'     => 'required|integer',
            'pembulatan'     => 'required|integer'
        ]);

        DB::beginTransaction();

        try {
            PriceParameter::where('id',$id)->update($request->all());
            DB::commit();

            return redirect()->intended('/administrator/price-parameters')->with('success', 'Berhasil Update Parameter Harga!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' -  Line:'.$e->getLine());
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            PriceParameter::where('id',$id)->delete();
            DB::commit();

            return redirect()->intended('/administrator/price-parameters')->with('success', 'Berhasil Hapus Parameter Harga!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' -  Line:'.$e->getLine());
        }
    }
}
