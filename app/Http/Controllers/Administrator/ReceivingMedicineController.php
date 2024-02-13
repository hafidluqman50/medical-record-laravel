<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Medicine;
use App\Models\ReceivingMedicine;
use App\Models\ReceivingMedicineDetail;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReceivingMedicineController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $receiving_medicines = ReceivingMedicine::with(['user'])
                            ->when($search != '', function(Builder $query) use ($search) {
                                $query->where('invoice_number', 'like', "%{$search}%");
                            })->paginate(5)->withQueryString();

        $page_num = ($receiving_medicines->currentPage() - 1) * $receiving_medicines->perPage() + 1;

        return Inertia::render('Administrator/ReceivingMedicine/Index', compact('receiving_medicines', 'page_num'));
    }

    public function create(): Response
    {
        $invoice_number = ReceivingMedicine::generateCode();

        return Inertia::render('Administrator/ReceivingMedicine/Create', compact('invoice_number'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'order'               => 'required|array',
            'invoice_number'      => 'required|string',
            'date_receive'        => 'required|string|date_format:Y-m-d',
            'total_grand'         => 'required|integer'
        ]);

        DB::beginTransaction();

        try {
            $input_receiving_medicine               = $request->except('order');
            $input_receiving_medicine['user_id']    = $request->user()->id;
            $input_receiving_medicine['created_at'] = date('Y-m-d H:i:s');
            $input_receiving_medicine['updated_at'] = date('Y-m-d H:i:s');

            $receiving_medicine_id = ReceivingMedicine::insertGetId($input_receiving_medicine);

            foreach ($request->order as $key => $value) {
                ReceivingMedicineDetail::create([
                    'receiving_medicine_id' => $receiving_medicine_id,
                    'medicine_id'           => $value['medicine_id'],
                    'qty'                   => $value['qty'],
                    'price'                 => $value['price'],
                    'stock_per_unit'        => $value['stock_per_unit'],
                    'unit_order'            => $value['unit_medicine'],
                    'sub_total'             => $value['sub_total'],
                    'notes'                 => $value['notes']
                ]);

                Medicine::where('id', $value['medicine_id'])->increment('stock', $value['qty']);
            }

            DB::commit();

            return redirect()->intended('/administrator/receiving-medicines')->with('success', 'Berhasil Input Penerimaan Obat!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
        }
    }

    public function detail(Request $request, int $id): Response
    {
        $search = $request->search;

        $receiving_medicine_details = ReceivingMedicineDetail::with(['medicine.medicineFactory'])
                        ->where('receiving_medicine_id', $id)
                        ->when($search != '', function(Builder $query) use ($search) {
                            $query->whereHas('medicine', function(Builder $queryHas) use ($search) {
                                $queryHas->where('name', 'like', "%{$search}%");
                            });
                        })->paginate(5)->withQueryString();

        $page_num = ($receiving_medicine_details->currentPage() - 1) * $receiving_medicine_details->perPage() + 1;

        return Inertia::render('Administrator/ReceivingMedicine/Detail', compact('receiving_medicine_details', 'page_num', 'id'));
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            ReceivingMedicine::where('id',$id)->delete();

            DB::commit();

            return redirect()->intended('/administrator/receiving-medicines')->with('success', 'Berhasil Hapus Penerimaan Obat!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
        }
    }
}
