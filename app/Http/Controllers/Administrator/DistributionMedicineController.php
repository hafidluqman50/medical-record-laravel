<?php

namespace App\Http\Controllers\Administrator;

use App\Models\DistributionMedicine;
use App\Models\DistributionMedicineDetail;
use App\Models\Medicine;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DistributionMedicineController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $distribution_medicines = DistributionMedicine::with(['user'])
                            ->when($search != '', function(Builder $query) use ($search) {
                                $query->where('invoice_number', 'like', "%{$search}%");
                            })->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($distribution_medicines->currentPage() - 1) * $distribution_medicines->perPage() + 1;

        return Inertia::render('Administrator/DistributionMedicine/Index', compact('distribution_medicines', 'page_num'));
    }

    public function create(): Response
    {
        $invoice_number = DistributionMedicine::generateCode();

        return Inertia::render('Administrator/DistributionMedicine/Create', compact('invoice_number'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'order'             => 'required|array',
            'invoice_number'    => 'required|string',
            'date_distribution' => 'required|string|date_format:Y-m-d',
        ]);

        DB::beginTransaction();

        try {
            $input_distribution_medicine               = $request->except('order');
            $input_distribution_medicine['user_id']    = $request->user()->id;
            $input_distribution_medicine['created_at'] = date('Y-m-d H:i:s');
            $input_distribution_medicine['updated_at'] = date('Y-m-d H:i:s');

            $distribution_medicine_id = DistributionMedicine::insertGetId($input_distribution_medicine);

            foreach ($request->order as $key => $value) {
                DistributionMedicineDetail::create([
                    'distribution_medicine_id' => $distribution_medicine_id,
                    'medicine_id'              => $value['medicine_id'],
                    'qty'                      => $value['qty'],
                    'stock_per_unit'           => $value['stock_per_unit'],
                    'unit_order'               => $value['unit_medicine'],
                    'data_location'            => $value['data_location']
                ]);

                $check_medicine = Medicine::where('name', $value['medicine_name'])
                                    ->where('batch_number', $value['medicine_batch_number'])
                                    ->where('data_location', $value['data_location'])
                                    ->exists();

                if ($check_medicine) {
                    Medicine::where('name', $value['medicine_name'])
                            ->where('batch_number', $value['medicine_batch_number'])
                            ->where('data_location', $value['data_location'])
                            ->increment('stock', $value['qty']);
                } else {
                    $get_medicine = Medicine::where('id', $value['medicine_id'])->firstOrFail();
                    $replicate = $get_medicine->replicate();
                    $replicate->batch_number = $value['medicine_batch_number'];
                    $replicate->data_location = $value['data_location'];
                    $replicate->stock = $value['qty'];
                    $replicate->save();
                }
            }

            DB::commit();

            return redirect()->intended('/administrator/distribution-medicines')->with('success', 'Berhasil Input Distribusi Obat!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }

    public function detail(Request $request, int $id): Response
    {
        $search = $request->search;

        $distribution_medicine_details = DistributionMedicineDetail::with(['medicine.medicineFactory'])
                        ->where('distribution_medicine_id', $id)
                        ->when($search != '', function(Builder $query) use ($search) {
                            $query->whereHas('medicine', function(Builder $queryHas) use ($search) {
                                $queryHas->where('name', 'like', "%{$search}%");
                            });
                        })->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($distribution_medicine_details->currentPage() - 1) * $distribution_medicine_details->perPage() + 1;

        return Inertia::render('Administrator/DistributionMedicine/Detail', compact('distribution_medicine_details', 'page_num', 'id'));
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            DistributionMedicine::where('id', $id)->delete();

            DB::commit();

            return redirect()->intended('/administrator/distribution-medicines')->with('success', 'Berhasil Hapus Distribusi Obat');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }
}
