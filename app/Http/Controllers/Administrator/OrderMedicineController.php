<?php

namespace App\Http\Controllers\Administrator;

use App\Models\MedicalSupplier;
use App\Models\OrderMedicine;
use App\Models\OrderMedicineDetail;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderMedicineController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $order_medicines = OrderMedicine::with(['user','medicalSupplier'])
                        ->when($search != '', function(Builder $query) use ($search) {
                            $query->where('invoice_number', 'like', "%{$search}%");
                        })->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($order_medicines->currentPage() - 1) * $order_medicines->perPage() + 1;

        return Inertia::render('Administrator/OrderMedicine/Index', compact('order_medicines', 'page_num'));
    }

    public function create(): Response
    {
        $invoice_number    = OrderMedicine::generateCode();
        $medical_suppliers = MedicalSupplier::all();

        return Inertia::render('Administrator/OrderMedicine/Create', compact('invoice_number', 'medical_suppliers'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'order'               => 'required|array',
            'medical_supplier_id' => 'required|integer|exists:'.MedicalSupplier::class.',id',
            'invoice_number'      => 'required|string',
            'date_order'          => 'required|string|date_format:Y-m-d',
            'total_grand'         => 'required|integer'
        ]);

        DB::beginTransaction();

        try {
            $input_order_medicine               = $request->except('order');
            $input_order_medicine['user_id']    = $request->user()->id;
            $input_order_medicine['created_at'] = date('Y-m-d H:i:s');
            $input_order_medicine['updated_at'] = date('Y-m-d H:i:s');

            $order_medicine_id = OrderMedicine::insertGetId($input_order_medicine);

            foreach ($request->order as $key => $value) {
                OrderMedicineDetail::create([
                    'order_medicine_id' => $order_medicine_id,
                    'medicine_id'       => $value['medicine_id'],
                    'qty'               => $value['qty'],
                    'price'             => $value['price'],
                    'stock_per_unit'    => $value['stock_per_unit'],
                    'unit_order'        => $value['unit_medicine'],
                    'sub_total'         => $value['sub_total']
                ]);
            }

            DB::commit();

            return redirect()->intended('/administrator/order-medicines')->with('success', 'Berhasil Input Pemesanan Obat!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
        }
    }

    public function detail(Request $request, int $id): Response
    {
        $search = $request->search;

        $order_medicine_details = OrderMedicineDetail::with(['medicine.medicineFactory'])
                        ->where('order_medicine_id', $id)
                        ->when($search != '', function(Builder $query) use ($search) {
                            $query->whereHas('medicine', function(Builder $queryHas) use ($search) {
                                $queryHas->where('name', 'like', "%{$search}%");
                            });
                        })->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($order_medicine_details->currentPage() - 1) * $order_medicine_details->perPage() + 1;

        return Inertia::render('Administrator/OrderMedicine/Detail', compact('order_medicine_details', 'page_num', 'id'));
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            OrderMedicine::where('id',$id)->delete();

            DB::commit();

            return redirect()->intended('/administrator/order-medicines')->with('success', 'Berhasil Hapus Pemesanan Obat!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
        }
    }
}
