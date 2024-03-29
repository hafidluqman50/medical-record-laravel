<?php

namespace App\Http\Controllers\Administrator;

use App\Models\DrugClassification;
use App\Models\Medicine;
use App\Models\MedicalSupplier;
use App\Models\MedicineFactory;
use App\Models\Ppn;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


class MedicineController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;
        $data_location = $request->data_location ?? "gudang";
        $data_locations = Medicine::groupBy("data_location")->get();

        $medicines = Medicine::with([
            "drugClassification",
            "medicalSupplier",
            "medicineFactory",
        ])
            ->when($search != "", function (Builder $query) use ($search) {
                $query->where("name", "like", "%{$search}%");
            })
            ->where("data_location", $data_location)
            ->orderBy("id", "DESC")
            ->paginate(5)
            ->onEachSide(3)
            ->withQueryString()
            ->through(function (Medicine $query) {
                $harga_modal = format_rupiah($query->capital_price);
                $harga_modal_ppn = format_rupiah($query->capital_price_vat);
                $hja_net = format_rupiah($query->sell_price);

                unset(
                    $query->capital_price,
                    $query->capital_price_vat,
                    $query->sell_price
                );

                $query->capital_price = $harga_modal;
                $query->capital_price_vat = $harga_modal_ppn;
                $query->sell_price = $hja_net;

                return $query;
            });

        $page_num = ($medicines->currentPage() - 1) * $medicines->perPage() + 1;

        return Inertia::render(
            "Administrator/Medicine/Index",
            compact("medicines", "page_num", "data_locations", "data_location")
        );
    }

    public function create(): Response
    {
        $drug_classifications = DrugClassification::all();
        $medical_suppliers = MedicalSupplier::all();
        $medicine_factories = MedicineFactory::all();
        $code = Medicine::generateCode();
        $ppn = Ppn::firstOrFail();

        return Inertia::render(
            "Administrator/Medicine/Create",
            compact(
                "code",
                "drug_classifications",
                "medical_suppliers",
                "medicine_factories",
                "ppn"
            )
        );
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            "code" => "required|string|max:255",
            "batch_number" => "required|string|max:255",
            "barcode" => "sometimes|nullable|string|max:255",
            "date_expired" => "required|date_format:Y-m-d",
            "name" => "required|string|max:255",
            "drug_classification_id" =>
                "required|integer|exists:" . DrugClassification::class . ",id",
            "medical_supplier_id" =>
                "required|integer|exists:" . MedicalSupplier::class . ",id",
            "medicine_factory_id" =>
                "required|integer|exists:" . MedicineFactory::class . ",id",
            "min_stock_supplier" => "required|integer",
            "is_generic" => "required|integer",
            "is_active" => "required|integer",
            "is_prescription" => "required|integer",
            "stock" => "required|integer",
            "piece_weight" => "required|integer",
            "pack_medicine" => "required|string|max:255",
            "unit_medicine" => "required|string",
            "medicinal_preparations" => "required|string",
            "location_rack" => "required|string",
            "dose" => "required|integer",
            "composition" => "required|string",
            "is_fullpack" => "required|integer",
            "capital_price" => "required|integer",
            "capital_price_vat" => "required|integer",
            "sell_price" => "required|integer",
        ]);

        DB::beginTransaction();

        try {
            $input = $request->all();
            $input["data_location"] = "gudang";

            Medicine::create($input);

            DB::commit();

            return redirect()
                ->intended("/administrator/medicines")
                ->with("success", "Berhasil Input Data Obat!");
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage() . " - Line:" . $e->getLine());
        }
    }

    public function edit(int $id): Response
    {
        $drug_classifications = DrugClassification::all();
        $medical_suppliers = MedicalSupplier::all();
        $medicine_factories = MedicineFactory::all();
        $medicine = Medicine::with("drugClassification")
            ->where("id", $id)
            ->where("data_location", "gudang")
            ->firstOrFail();
        $ppn = Ppn::firstOrFail();

        return Inertia::render(
            "Administrator/Medicine/Edit",
            compact(
                "medicine",
                "drug_classifications",
                "medical_suppliers",
                "medicine_factories",
                "ppn"
            )
        );
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            "code" => "required|string|max:255",
            "batch_number" => "required|string|max:255",
            "barcode" => "sometimes|nullable|string|max:255",
            "date_expired" => "required|date_format:Y-m-d",
            "drug_classification_id" =>
                "required|integer|exists:" . DrugClassification::class . ",id",
            "medical_supplier_id" =>
                "required|integer|exists:" . MedicalSupplier::class . ",id",
            "medicine_factory_id" =>
                "required|integer|exists:" . MedicineFactory::class . ",id",
            "min_stock_supplier" => "required|integer",
            "is_generic" => "required|integer",
            "is_active" => "required|integer",
            "is_prescription" => "required|integer",
            "stock" => "required|integer",
            "piece_weight" => "required|integer",
            "pack_medicine" => "required|string|max:255",
            "unit_medicine" => "required|string",
            "medicinal_preparations" => "required|string",
            "location_rack" => "required|string",
            "dose" => "required|integer",
            "composition" => "required|string",
            "is_fullpack" => "required|integer",
            "capital_price" => "required|integer",
            "capital_price_vat" => "required|integer",
            "sell_price" => "required|integer",
        ]);

        DB::beginTransaction();

        try {
            Medicine::where("id", $id)
                ->where("data_location", "gudang")
                ->update($request->all());

            DB::commit();

            return redirect()
                ->intended("/administrator/medicines")
                ->with("success", "Berhasil Update Data Obat!");
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage() . " - Line:" . $e->getLine());
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            Medicine::where("id", $id)
                ->where("data_location", "gudang")
                ->delete();
            DB::commit();

            return redirect()
                ->intended("/administrator/medicines")
                ->with("success", "Berhasil Hapus Data Obat!");
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage() . " - Line:" . $e->getLine());
        }
    }
    
    public function importMedicinesForm(): Response
    {
        return Inertia::render('Administrator/Medicine/ImportForm');
    }
    
    public function importMedicines(Request $request): RedirectResponse
    {
        $file_excel = $request->file_excel;
        
        $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
        $spreadsheet = $reader->load($file_excel[0]);
        $rows = $spreadsheet->getActiveSheet()->toArray();
        
        DB::beginTransaction();
        
        try {
            foreach($rows as $key => $row) {
                if($key >= 3 && $row[0] != null) {
                    $check_medicines_factory = MedicineFactory::where('name', $row[1])->exists();
                    if(!$check_medicines_factory) {
                        $medicine_factory_id = MedicineFactory::insertGetId([
                            'name' => $row[1],
                            'phone_number' => 0,
                            'address' => '-'
                        ]);
                    }
                    else {
                        $medicine_factory_id = MedicineFactory::where('name', $row[1])->firstOrFail()->id;
                    }
                    
                    Medicine::updateOrCreate(
                        ['code' => $row[7], 'name' => $row[0], 'data_location' => 'gudang'],
                        [
                            'code' => $row[7],
                            'batch_number' => $row[7],
                            'name' => $row[0],
                            'date_expired' => '0000-00-00',
                            'medicine_factory_id' => $medicine_factory_id,
                            'drug_classification_id' => 1,
                            'medical_supplier_id' => 1,
                            'min_stock_supplier' => 0,
                            'is_generic' => 0,
                            'is_active' => 1,
                            'is_prescription' => 1,
                            'stock' => $row[4],
                            'piece_weight' => 1,
                            'pack_medicine' => $row[2],
                            'unit_medicine' => $row[3],
                            'capital_price' => (int)$row[5],
                            'capital_price_vat' => (int)$row[6],
                            'sell_price' => 0,
                            'medicinal_preparations' => $row[2],
                            'location_rack' => '-',
                            'dose' => 0,
                            'composition' => '-',
                            'is_fullpack' => 0,
                            'data_location' => 'gudang'
                        ]
                    );
                    
                    Medicine::updateOrCreate(
                        ['code' => $row[7], 'name' => $row[0], 'data_location' => 'kasir'],
                        [
                            'code' => $row[7],
                            'batch_number' => $row[7],
                            'name' => $row[0],
                            'date_expired' => '0000-00-00',
                            'medicine_factory_id' => $medicine_factory_id,
                            'drug_classification_id' => 1,
                            'medical_supplier_id' => 1,
                            'min_stock_supplier' => 0,
                            'is_generic' => 0,
                            'is_active' => 1,
                            'is_prescription' => 1,
                            'stock' => $row[4],
                            'piece_weight' => 1,
                            'pack_medicine' => $row[2],
                            'unit_medicine' => $row[3],
                            'capital_price' => (int)$row[5],
                            'capital_price_vat' => (int)$row[6],
                            'sell_price' => 0,
                            'medicinal_preparations' => $row[2],
                            'location_rack' => '-',
                            'dose' => 0,
                            'composition' => '-',
                            'is_fullpack' => 0,
                            'data_location' => 'kasir'
                        ]
                    );
                }
            }
            
            DB::commit();
            
            return redirect()->intended('/administrator/medicines')->with('success', 'Berhasil Import Data Obat!');
        } catch(Exception $e) {
            DB::rollBack();
            
            return redirect()->intended('/administrator/medicines')->with('error', $e->getMessage().'-'.$e->getLine());
        }
    }
    
    public function testExcel(): void
    {
        $spreadsheet = new Spreadsheet();
        $activeWorksheet = $spreadsheet->getActiveSheet();
        $activeWorksheet->setCellValue('A1', 'Hello World !');
        
        $writer = new Xlsx($spreadsheet);
        header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        header("Content-Disposition: attachment;filename=\"hello world.xlsx\"");
        $writer->save('php://output');
    }
}
