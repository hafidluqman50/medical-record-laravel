<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Medicine;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransactionHvController extends Controller
{
    public function index(): Response
    {
        $kode_transaksi = Transaction::generateCode('HV');

        return Inertia::render('Administrator/TransactionHv/Index', compact('kode_transaksi'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'medicine_id'      => 'required|array',
            'medicine_id.*'    => 'required|integer|exists:'.Medicine::class.',id',
            'price'            => 'required|array',
            'price.*'          => 'required|integer',
            'qty'              => 'required|array',
            'qty.*'            => 'required|integer',
            'sub_total'        => 'required|array',
            'sub_total.*'      => 'required|integer',
            'disc'             => 'required|array',
            'disc.*'           => 'required|integer',
            'total'            => 'required|array',
            'total.*'          => 'required|integer',
            'sub_total_grand'  => 'required|integer',
            'total_grand'      => 'required|integer',
            'diskon_grand'     => 'required|integer',
            'diskon_bayar'     => 'required|integer',
            'bayar'            => 'required|integer',
            'kembalian'        => 'required|integer',
            'kode_transaksi'   => 'required|string',
            'jenis_pembayaran' => 'required|string|in:tunai,kartu-debit-kredit',
        ]);

        DB::beginTransaction();

        try {
            $sub_total_grand      = $request->sub_total_grand;
            $total_grand          = $request->total_grand;
            $discount_grand       = $request->diskon_grand;
            $discount_pay         = $request->diskon_bayar;
            $transaction_pay_type = $request->jenis_pembayaran;
            $invoice_number       = $request->kode_transaksi;
            $pay_total            = $request->bayar;
            $change_money         = $request->kembalian;
            $user_id              = $request->user()->id;
            $date_transaction     = date('Y-m-d');

            $transaction_input = [
                'date_transaction'     => $date_transaction,
                'invoice_number'       => $invoice_number,
                'sub_total'            => $sub_total_grand,
                'discount'             => $discount_grand,
                'discount_pay'         => $discount_pay,
                'total'                => $total_grand,
                'pay_total'            => $pay_total,
                'change_money'         => $change_money,
                'transaction_pay_type' => $transaction_pay_type,
                'type'                 => 'HV',
                'user_id'              => $user_id,
                'created_at'           => date('Y-m-d H:i:s'),
                'updated_at'           => date('Y-m-d H:i:s'),
            ];

            $transaction_id = Transaction::insertGetId($transaction_input);

            $medicine_id = $request->medicine_id;
            $qty         = $request->qty;
            $sub_total   = $request->sub_total;
            $discount    = $request->disc;
            $total       = $request->total;

            foreach ($medicine_id as $key => $value) {
                $transaction_detail_input = [
                    'transaction_id' => $transaction_id,
                    'medicine_id'    => $value,
                    'qty'            => $qty[$key],
                    'sub_total'      => $sub_total[$key],
                    'discount'       => $discount[$key],
                    'total'          => $total[$key]
                ];

                TransactionDetail::create($transaction_detail_input);
            }

            DB::commit();

            return redirect()->intended('/administrator/transaction-hv/'.$transaction_id.'/print');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line :'.$e->getLine());
        }
    }

    public function printInvoice(int $id): Response
    {
        $transaction = Transaction::with(['user','transactionDetails.medicine'])->where('id',$id)->firstOrFail();

        return Inertia::render('Administrator/TransactionHv/Print', compact('transaction'));
    }
}
