<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Customer;
use App\Models\PriceParameter;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $customers = Customer::when($search != '', function(Builder $query)use($search){
                        $query->where('name', 'like', "%{$search}%")
                              ->orWhere('debitur_number', 'like', "%{$search}%");
                    })->paginate(5)->withQueryString();

        $page_num = ($customers->currentPage() - 1) * $customers->perPage() + 1;

        return Inertia::render('Administrator/Customer/Index', compact('customers', 'page_num'));
    }

    public function create(): Response
    {
        $debitur_number = Customer::generateCode();

        $price_parameters = PriceParameter::whereNotIn('label', ['tunai'])->get();

        return Inertia::render('Administrator/Customer/Create', compact('debitur_number', 'price_parameters'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'debitur_number'     => 'required|string|max:255',
            'name'               => 'required|string|max:255',
            'price_parameter_id' => 'required|integer|exists:'.PriceParameter::class.',id'
        ]);

        DB::beginTransaction();

        try {
            Customer::create($request->all());
            DB::commit();

            return redirect()->intended('/administrator/customers')->with('success', 'Berhasil Input Pelanggan!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' '.$e->getLine());
        }
    }

    public function edit(int $id): Response
    {
        $customer = Customer::where('id', $id)->firstOrFail();

        $price_parameters = PriceParameter::whereNotIn('label', ['tunai'])->get();

        return Inertia::render('Administrator/Customer/Edit', compact('customer', 'price_parameters'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'debitur_number'     => 'required|string|max:255',
            'name'               => 'required|string|max:255',
            'price_parameter_id' => 'required|integer|exists:'.PriceParameter::class.',id'
        ]);

        DB::beginTransaction();

        try {
            Customer::where('id', $id)->update($request->all());
            DB::commit();

            return redirect()->intended('/administrator/customers')->with('success', 'Berhasil Update Pelanggan!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' '.$e->getLine());
        }
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            Customer::where('id', $id)->delete();
            DB::commit();

            return redirect()->intended('/administrator/customers')->with('success', 'Berhasil Hapus Pelanggan!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' '.$e->getLine());
        }
    }
}
