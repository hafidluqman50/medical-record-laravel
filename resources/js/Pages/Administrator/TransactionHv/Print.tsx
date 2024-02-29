import '../../../../css/print.css'

import React, {useEffect} from 'react'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'

import { formatRupiah } from '@/lib/helper'

interface TransactionDetail {
    id:number
    transaction_id:number
    medicine_id:number
    medicine:{
        id:number
        name:string
        unit_medicine:string
    }
    qty:number
    sub_total:number
    discount:number
    total:number
}

interface Transaction {
    id:number
    date_transaction:string
    invoice_number:string
    sub_total:number
    discount:number
    discount_pay:number
    total:number
    pay_total:number
    change_money:number
    transaction_pay_type:string
    type:string
    user:{
        id:number
        name:string
    }
    created_at:string
    transaction_details:TransactionDetail[]
}

type PrintPageProps = {
    transaction:Transaction
}

export default function Print({transaction, url}: PrintPageProps & {url: string}) {

    useEffect(() => {
        setTimeout(() => window.print(), 600)
    },[]) 

    return(
        <>
            <Head title="UPDS Print" />
            <section className="receipt">
                <p>
                    <a href={route(url)} className="btn-hide">
                        <Button variant="secondary">
                            Kembali
                        </Button>
                    </a>
                </p>
                <section className="sheet padding-5">
                    <h3 className="title">APOTEK SAHABAT</h3>
                    <h4 className="subtitle">Jl. Palang Merah Indonesia No.16 - B Samarinda</h4>
                    <h4 className="subtitle">Telp: 0541-7803959</h4>
                    <hr />
                    <h4 className="subtitle text-center">BUKTI TRANSAKSI</h4>
                    <hr />
                    <div>
                        <p>No Nota: {transaction.invoice_number}</p>
                        <p>KASIR : {transaction.user.name}</p>
                    </div>
                    <div>
                        <p className="right">{transaction.date_transaction}</p>
                        <br />
                        <p className="right">{transaction.created_at}</p>
                    </div>
                    <div style={{clear: 'both'}}></div>
                    <hr />
                    <table border={0} width="100%">
                        <tbody>
                        {
                            transaction.transaction_details.map((row, key) => (
                                <>
                                    <tr>
                                        <td width="40%" className="item-name">{row.medicine.name}</td>
                                        <td>{row.qty} {row.medicine.unit_medicine}</td>
                                        <td>{formatRupiah(row.total)}</td>
                                    </tr>
                                </>
                            ))
                        }
                        <tr>
                            <td colSpan={3}><hr /></td>
                        </tr>
                        </tbody>
                    </table>
                    <table width="100%">
                        <tfoot className="tfoot">
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}} width="85%">Total</td>
                                <td>{formatRupiah(transaction.sub_total)}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}} width="85%">Total Diskon</td>
                                <td>{formatRupiah(transaction.discount_pay)}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}} width="85%">Grand Total</td>
                                <td>{formatRupiah(transaction.total)}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}}>Bayar </td>
                                <td>{formatRupiah(transaction.pay_total)}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}}>Kembalian </td>
                                <td>{formatRupiah(transaction.change_money)}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <hr />
                    <table width="100%">
                        <tfoot className="tfoot">
                            <tr>
                                <td style={{textAlign:'center', paddingRight: '10px'}}>Terima Kasih</td>
                            </tr>
                            <tr>
                                <td style={{textAlign:'center', paddingRight: '10px'}}>Semoga Lekas Sembuh</td>
                            </tr>
                            <tr>
                                <td style={{textAlign:'center', paddingRight: '10px'}}>Harga Sudah Termasuk PPn</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p>
                        <Button variant="secondary" type="button" className="btn-hide" onClick={() => window.print()}>Cetak</Button>
                    </p>
                </section>
            </section>
        </>
    )
}