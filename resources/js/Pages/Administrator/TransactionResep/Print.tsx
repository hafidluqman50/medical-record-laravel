import '../../../../css/print.css'

import React, { Fragment, useEffect } from 'react'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'

import { formatRupiah } from '@/lib/helper'

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
}

type PrintPageProps = {
    transaction_prescription:any
}

export default function Print({transaction_prescription}: PrintPageProps) {
    
    useEffect(() => {
        setTimeout(() => window.print(), 600)
    },[]) 

    return(
        <>
            <Head title="Resep Print" />
            <section className="receipt">
                <p>
                    <a href={route('administrator.transaction-resep')} className="btn-hide">
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
                        <p>No Nota: {transaction_prescription.invoice_number}</p>
                        <p>KASIR : {transaction_prescription.user.name}</p>
                    </div>
                    <div>
                        <p className="right">{transaction_prescription.date_transaction}</p>
                        <br />
                        <p className="right">{transaction_prescription.created_at}</p>
                    </div>
                    <div style={{clear: 'both'}}></div>
                    <hr />
                    <table border={0} width="100%">
                        <tbody>
                        {
                            transaction_prescription.prescription.prescription_lists.map((row: any, key: number) => (
                                <Fragment key={key}>
                                    <tr>
                                    {
                                        row.name.includes('R') && row.name.length == 2 ?
                                        <Fragment key={key}>
                                            <td width="40%" className="item-name">{row.name.replace('R','Racik ')}</td>
                                            <td>{row.total_prescription_packs}</td>
                                            <td>{formatRupiah(row.service_fee + row.total_costs)}</td>
                                        </Fragment>
                                        : 
                                        row.prescription_details.map((r: any , k: number) => (
                                            <Fragment key={k}>
                                                <tr>
                                                    <td width="40%" className="item-name">{r.medicine.name}</td>
                                                    <td>{r.qty} {r.medicine.unit_medicine}</td>
                                                    <td>{formatRupiah(r.total)}</td>
                                                </tr>
                                            </Fragment>
                                        ))
                                    }
                                    </tr>
                                </Fragment>
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
                                <td>{formatRupiah(transaction_prescription.sub_total)}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}} width="85%">Total Diskon</td>
                                <td>{formatRupiah(transaction_prescription.discount)}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}} width="85%">Grand Total</td>
                                <td>{formatRupiah(transaction_prescription.total)}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}}>Bayar </td>
                                <td>{formatRupiah(transaction_prescription.pay_total)}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}}>Kembalian </td>
                                <td>{formatRupiah(transaction_prescription.change_money)}</td>
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
                <div style={{pageBreakAfter:'always'}}></div>
                <section className="sheet padding-5">
                    <h3 className="title">APOTEK SAHABAT</h3>
                    <h4 className="subtitle">Jl. Palang Merah Indonesia No.16 - B Samarinda</h4>
                    <h4 className="subtitle">Telp: 0541-7803959</h4>
                    <hr />
                    <h4 className="subtitle text-center">BUKTI TRANSAKSI</h4>
                    <hr />
                    <div>
                        <p>No Nota: {transaction_prescription.invoice_number}</p>
                        <p>KASIR : {transaction_prescription.user.name}</p>
                    </div>
                    <div>
                        <p className="right">{transaction_prescription.date_transaction}</p>
                        <br />
                        <p className="right">{transaction_prescription.created_at}</p>
                    </div>
                    <div style={{clear: 'both'}}></div>
                    <hr />
                    <table border={0} width="100%">
                        <tbody>
                        {
                            transaction_prescription.prescription.prescription_lists.map((row: any, key: number) => (
                                <Fragment key={key}>
                                    <tr>
                                        <td colSpan={3} align="center">
                                           {
                                                row.name.includes('R') && row.name.length == 2 ? 
                                                row.name.replace('R', 'Racik ') :
                                                row.name
                                            } 
                                        </td>
                                    </tr>
                                {
                                    row.prescription_details.map((r: any , k: number) => (
                                        <Fragment key={k}>
                                            <tr>
                                                <td width="40%" className="item-name">{r.medicine.name}</td>
                                                <td>{r.qty} {r.medicine.unit_medicine}</td>
                                                <td>{formatRupiah(r.total)}</td>
                                            </tr>
                                        </Fragment>
                                    ))
                                }
                                </Fragment>
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
                                <td>{formatRupiah(transaction_prescription.sub_total)}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}} width="85%">Total Diskon</td>
                                <td>{formatRupiah(transaction_prescription.discount)}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}} width="85%">Grand Total</td>
                                <td>{formatRupiah(transaction_prescription.total)}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}}>Bayar </td>
                                <td>{formatRupiah(transaction_prescription.pay_total)}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right', paddingRight: '10px'}}>Kembalian </td>
                                <td>{formatRupiah(transaction_prescription.change_money)}</td>
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