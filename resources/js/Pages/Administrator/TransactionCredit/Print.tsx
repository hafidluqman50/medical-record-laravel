import '../../../../css/credit-print.css'

import React, { Fragment, useEffect } from 'react'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'

import { formatRupiah } from '@/lib/helper'

import { logoPng } from '@/lib/assets'

interface Transaction {
    id:number
    date_transaction:string
    date_prescription:string
    customer_id:string
    prescription_id:string
    group_name:string
    invoice_number:string
    sub_total:number
    total:number
    user:{
        id:number
        name:string
    }
    created_at:string
}

type PrintPageProps = {
    transaction_credit:any
}

export default function Print({transaction_credit}: PrintPageProps) {

    useEffect(() => {
        setTimeout(() => window.print(), 600)
    },[]) 

    return(
        <>
            <Head title="Resep Kredit Print" />
            <div className="mx-auto py-2 sm:px-2">
              <div className="flex flex-wrap flex-row">
              <Button 
                type="button" 
                id="btn-invoice" 
                className="py-2 px-4 inline-block text-center mb-3 rounded leading-5 text-gray-100 bg-indigo-500 
                border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 
                hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0" asChild>
                <a href={route('administrator.transaction-credit')}>
                    Kembali
                </a>
              </Button>
                <div id="title-invoice" className="flex justify-between max-w-full px-4 py-4 w-full">   
                  <p className="text-xl font-bold mt-3 mb-5">Kwitansi #{transaction_credit.invoice_number}</p>
                  <button type="button" id="btn-invoice" onClick={() => window.print()} className="py-2 px-4 inline-block text-center mb-3 rounded leading-5 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ltr:mr-2 rtl:ml-2 inline-block bi bi-printer" viewBox="0 0 16 16">
                    <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"></path>
                    <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"></path>
                  </svg>Print Kwitansi</button>
                </div>
                 <div className="flex-shrink max-w-full px-4 w-full mb-6">
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-3">
                      <div className="flex flex-col">
                        <div className="text-3xl font-bold mb-1">
                          <img className="inline-block w-12 h-auto ltr:mr-2 rtl:ml-2" src={logoPng} />APOTEK SAHABAT
                        </div>
                        <p className="text-sm">Jl. Palang Merah Indonesia No.16 - B Samarinda</p>
                      </div>
                      <div className="text-4xl uppercase font-bold">KWITANSI</div>
                    </div>
                    <div className="flex flex-row justify-between py-3">
                      <div className="flex-1">
                        <p>
                            <strong>Debitur : </strong><br />
                            {transaction_credit.customer.name}<br />
                        </p>
                        <p>
                            <strong>Pasien : </strong><br />
                            {transaction_credit.prescription.patient.name}<br />
                        </p>
                        <p>
                            <strong>Dokter : </strong><br />
                            {transaction_credit.prescription.doctor.name}<br />
                        </p>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div className="flex-1 font-semibold">Nomor Kwitansi#:</div><div className="flex-1 ltr:text-right rtl:text-left">{transaction_credit.invoice_number}</div>
                        </div>
                        <div className="flex justify-between mb-2">
                          <div className="flex-1 font-semibold">Tanggal Kwitansi:</div><div className="flex-1 ltr:text-right rtl:text-left">{transaction_credit.date_transaction}</div>
                        </div>
                        <div className="flex justify-between mb-2">
                          <div className="flex-1 font-semibold">Tanggal Resep:</div><div className="flex-1 ltr:text-right rtl:text-left">{transaction_credit.date_prescription}</div>
                        </div>
                      </div>
                    </div>
                    <div className="py-4">
                      <table className="table-bordered w-full ltr:text-left rtl:text-right text-gray-600">
                        <thead className="border-b dark:border-gray-700">
                          <tr className="bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20">
                            <th>Obat</th>
                            <th className="text-center">Qty</th>
                            <th className="text-center">Harga Obat</th>
                            <th className="text-center">Sub Total</th>
                          </tr>
                        </thead>
                        <tbody>
                        {
                            transaction_credit.prescription.prescription_lists.map((row: any, key: number) => (
                                row.prescription_details.map((r: any, i: number) => (
                                  <tr key={i}>
                                    <td>
                                      <div className="flex flex-wrap flex-row items-center">
                                        <div className="leading-5 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">  
                                          {r.medicine.name}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="text-center">{r.qty}</td>
                                    <td className="text-center">Rp. {formatRupiah(r.medicine.sell_price)}</td>
                                    <td className="text-center">Rp. {formatRupiah(r.total)}</td>
                                  </tr>
                                ))
                            ))
                        }
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={2}></td>
                            <td className="text-center"><b>Total</b></td>
                            <td className="text-center font-bold">Rp. {formatRupiah(transaction_credit.total)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </>
    )
}