<?php

namespace App\Http\Controllers\Administrator;

use App\Models\DrugClassification;
use App\Models\Medicine;
use App\Models\MedicalSupplier;
use App\Models\MedicineFactory;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MedicineController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $medicines = Medicine::with(['drugClassification', 'medicalSupplier', 'medicineFactory'])
                            ->when($search != '', function(Builder $query) use ($search) {
                                $query->where('name','like',"%{$search}%");
                            })->paginate(5)->withQueryString()->through(function(Medicine $query) {

                                $harga_modal     = format_rupiah($query->capital_price);
                                $harga_modal_ppn = format_rupiah($query->capital_price_vat);
                                $hja_net         = format_rupiah($query->sell_price);

                                unset(
                                    $query->capital_price,
                                    $query->capital_price_vat,
                                    $query->sell_price,
                                );

                                 $query->capital_price = $harga_modal;
                                 $query->capital_price_vat = $harga_modal_ppn;
                                 $query->sell_price = $hja_net;

                                 return $query;

                            });

        $page_num = ($medicines->currentPage() - 1) * $medicines->perPage() + 1;

        return Inertia::render('Administrator/Medicine/Index', compact('medicines', 'page_num'));
    }

    public function create(): Response
    {
        $drug_classifications = DrugClassification::all();
        $medical_suppliers    = MedicalSupplier::all();
        $medicine_factories   = MedicineFactory::all();
        $code                 = Medicine::generateCode();

        return Inertia::render('Administrator/Medicine/Create', compact('code', 'drug_classifications', 'medical_suppliers', 'medicine_factories'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'code'                   => 'required|string|max:255',
            'batch_number'           => 'required|string|max:255',
            'barcode'                => 'sometimes|nullable|strimg|max:255',
            'date_expired'           => 'required|date_format:Y-m-d',
            'name'                   => 'required|string|max:255',
            'drug_classification_id' => 'required|integer|exists:'.DrugClassification::class.',id',
            'medical_supplier_id'    => 'required|integer|exists:'.MedicalSupplier::class.',id',
            'medicine_factory_id'    => 'required|integer|exists:'.MedicineFactory::class.',id',
            'min_stock_supplier'     => 'required|integer',
            'is_generic'             => 'required|integer',
            'is_active'              => 'required|integer',
            'is_prescription'        => 'required|integer',
            'stock'                  => 'required|integer',
            'piece_weight'           => 'required|integer',
            'pack_medicine'          => 'required|string|max:255',
            'unit_medicine'          => 'required|string',
            'medicinal_preparations' => 'required|string',
            'location_rack'          => 'required|string',
            'dose'                   => 'required|integer',
            'composition'            => 'required|string',
            'is_fullpack'            => 'required|integer',
            'capital_price'          => 'required|integer',
            'capital_price_vat'      => 'required|integer',
            'sell_price'             => 'required|integer'
        ]);

        DB::beginTransaction();

        try {
            $input = $request->all();
            $input['data_location'] = 'gudang';
            
            Medicine::create($input);

            DB::commit();

            return redirect()->intended('/administrator/medicines')->with('success', 'Berhasil Input Data Obat!');
        } catch (Exception $e) {
            DB::rollBack();
            
            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }

    public function edit(int $id): Response
    {
        $drug_classifications = DrugClassification::all();
        $medical_suppliers    = MedicalSupplier::all();
        $medicine_factories   = MedicineFactory::all();
        $medicine             = Medicine::with('drugClassification')
                                ->where('id',$id)->where('data_location','gudang')->firstOrFail();

        return Inertia::render('Administrator/Medicine/Edit', compact('medicine', 'drug_classifications', 'medical_suppliers', 'medicine_factories'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {

        $request->validate([
            'code'                   => 'required|string|max:255',
            'batch_number'           => 'required|string|max:255',
            'barcode'                => 'sometimes|nullable|strimg|max:255',
            'date_expired'           => 'required|date_format:Y-m-d',
            'drug_classification_id' => 'required|integer|exists:'.DrugClassification::class.',id',
            'medical_supplier_id'    => 'required|integer|exists:'.MedicalSupplier::class.',id',
            'medicine_factory_id'    => 'required|integer|exists:'.MedicineFactory::class.',id',
            'min_stock_supplier'     => 'required|integer',
            'is_generic'             => 'required|integer',
            'is_active'              => 'required|integer',
            'is_prescription'        => 'required|integer',
            'stock'                  => 'required|integer',
            'piece_weight'           => 'required|integer',
            'pack_medicine'          => 'required|string|max:255',
            'unit_medicine'          => 'required|string',
            'medicinal_preparations' => 'required|string',
            'location_rack'          => 'required|string',
            'dose'                   => 'required|integer',
            'composition'            => 'required|string',
            'is_fullpack'            => 'required|integer',
            'capital_price'          => 'required|integer',
            'capital_price_vat'      => 'required|integer',
            'sell_price'             => 'required|integer'
        ]);

        DB::beginTransaction();

        try {

            Medicine::where('id',$id)->where('data_location','gudang')->update($request->all());

            DB::commit();

            return redirect()->intended('/administrator/medicines')->with('success', 'Berhasil Update Data Obat!');
        } catch (Exception $e) {
            DB::rollBack();
            
            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            Medicine::where('id',$id)->where('data_location','gudang')->delete();
            DB::commit();

            return redirect()->intended('/administrator/medicines')->with('success', 'Berhasil Hapus Data Obat!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }
}
