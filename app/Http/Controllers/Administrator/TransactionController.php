<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\TransactionPrescription;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $search    = $request->search;
        $tab_value = $request->tab_value ?? 'upds';

        if($tab_value == 'upds') {
            $transactions = Transaction::with(['user'])->when($search != '', function(Builder $query)use($search) {
                                $query->where('invoice_number','like',"%{$search}%");
                            })->where('type','UP')->paginate(5)->onEachSide(3)->withQueryString();
        } else if($tab_value == 'hv-otc') {
            $transactions = Transaction::with(['user'])->when($search != '', function(Builder $query)use($search) {
                                $query->where('invoice_number','like',"%{$search}%");
                            })->where('type','HV')->paginate(5)->onEachSide(3)->withQueryString();
        } else if($tab_value == 'resep-tunai') {
            $transactions = TransactionPrescription::with(['user'])->when($search != '', function(Builder $query)use($search) {
                                $query->where('invoice_number','like',"%{$search}%");
                            })->paginate(5)->onEachSide(3)->withQueryString();
        }


        $page_num = ($transactions->currentPage() - 1) * $transactions->perPage() + 1;

        return Inertia::render('Administrator/Transaction/Index', compact('transactions', 'page_num', 'tab_value'));
    }

    public function detail(Request $request, int $id): Response
    {
        $search = $request->search;

        $transaction_details = TransactionDetail::with(['medicine'])->when($search != '', function(Builder $query)use($search) {
                                    $query->where('invoice_number','like',"%{$search}%");
                                })->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($transaction_details->currentPage() - 1) * $transaction_details->perPage() + 1;

        return Inertia::render('Administrator/Transaction/Detail', compact('transaction_details', 'page_num'));
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {
            Transaction::where('id', $id)->delete();

            DB::commit();

            return redirect()->intended('administrator/transactions')->with('success', 'Berhasil Hapus Transaksi!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line:'.$e->getLine());
        }
    }
}
