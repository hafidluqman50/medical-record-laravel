import '../../../../css/print.css'

import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import { 
    pembilang,
    formatRupiah,
    dateWithSlash
} from '@/lib/helper'
import {
    logoPng
} from '@/lib/assets'

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

export default function Invoice({transaction_prescription, url}: PrintPageProps & {url: string}) {

    const [row, setRow] = useState<any>([])

    useEffect(() => {
        transaction_prescription.prescription.prescription_lists.map((data:any, key:number) => (
            setRow((row:any) => ([
                ...row,
                ...data.prescription_details
            ]))
        ))

        setTimeout(() => window.print(), 600)

        return () => {
            setRow([])
        }
    },[])

    const deleteVar = (i: number): void => {
        const data = row.filter((data:any, num:number) => (num != i))
        setRow(data)
    }

    const inputFirstRef = useRef<any>()
    const inputSecondRef = useRef<any>()
    const inputThirdRef = useRef<any>()
    const inputFourthRef = useRef<any>()

    return(
        <>
            <Head title="Kwitansi Resep" />
            <a className="btn-hide" href={route(url)}>Kembali</a>
            <div className="flex max-w-7xl mt-4 space-x-2 ml-4 border-black border-2 p-1 max-h-[500px]">
                <div className="border-black border-r-8 border-double">
                    <div className="[writing-mode:vertical-rl] [transform:rotate(-180deg)] text-center flex">
                        <div className="[transform:rotate(90deg)] text-center">
                            <img className="[filter:brightness(0%)]" src={logoPng} width={145} height={145} />
                        </div>
                        <div className="flex-row mr-2">
                            <h4 className="font-serif font-extrabold text-3xl">APOTEK SAHABAT</h4>
                            <h4 className="text-xs">Jl. Palang Merah Indonesia No.16 - B Samarinda</h4>
                            <h4 className="text-xs">Telp: 0541-7803959</h4>
                            <h4 className="text-xs">Apoteker: apt. Nurlina Muliani, S.Farm</h4>
                            <h4 className="text-xs">No. SIPA: 503/019/SIPA/100.20</h4>
                            <h4 className="text-xs">No. SIA: 503/SIA/17/100.26</h4>
                        </div>
                    </div>
                </div>
                <div className="w-8/12 text-xs">
                    <div className="flex space-x-2">
                         <div className="mt-1">
                            KWITANSI NO : 
                         </div>
                        <div className="max-w-md h-7 border-black border-2">{transaction_prescription.invoice_number}</div>
                    </div>
                    <div className="flex space-x-1 mt-4">
                         <div className="w-22 mt-1">
                            SUDAH DITERIMA : 
                         </div>
                        <div className="w-10/12 h-7">
                            <input className="bg-transparent border-0 h-7 w-full text-xs p-0 border-b-2 border-black border-dotted" defaultValue={transaction_prescription.prescription.patient.name} />
                        </div>
                    </div>
                    <div className="flex space-x-1 mt-4">
                         <div className="w-[20%] mt-1">
                            BANYAKNYA UANG : 
                         </div>
                        <div className="w-10/12 h-7">
                            <div className="w-full h-8 border-black border-2 [transform:skew(-20deg)] mb-2 p-1">
                                <p className="[transform:skew(20deg)]">{pembilang(transaction_prescription.total)}</p>
                            </div>
                            <div className="w-full h-8 border-black border-2 [transform:skew(-20deg)] p-1">
                                <p className="[transform:skew(20deg)]">Rupiah</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-14">
                        <div className="flex space-x-1">
                             <div className="w-[20%] mt-3">
                                UNTUK PEMBAYARAN : 
                             </div>
                            <div className="w-[86%] h-7">
                                <input 
                                    ref={inputFirstRef}
                                    className="bg-transparent border-0 h-7 w-full text-xs p-0 border-b-2 border-black border-dotted" 
                                    onKeyUp={(event) => {
                                        if(event.keyCode == 13) {
                                            inputSecondRef.current.focus()
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="w-12/12">
                            <input 
                                ref={inputSecondRef} 
                                className="bg-transparent border-0 h-7 w-full text-xs p-0 border-b-2 border-black border-dotted" 
                                onKeyUp={(event) => {
                                    if(event.keyCode == 13) {
                                        inputThirdRef.current.focus()
                                    }
                                }}
                            />
                        </div>
                        <div className="w-12/12">
                            <input 
                                ref={inputThirdRef} 
                                className="bg-transparent border-0 h-7 w-full text-xs p-0 border-b-2 border-black border-dotted" 
                                onKeyUp={(event) => {
                                    if(event.keyCode == 13) {
                                        inputFourthRef.current.focus()
                                    }
                                }}
                            />
                        </div>
                        <div className="w-12/12">
                            <input ref={inputFourthRef} className="bg-transparent border-0 h-7 w-full text-xs p-0 border-b-2 border-black border-dotted" />
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex">
                            <div className="w-10/12"></div>
                            <div className="mt-4 mr-2">Samarinda,</div>
                            <div className="w-4/12">
                                <input 
                                    className="bg-transparent border-0 h-7 w-full text-xs p-0 border-b-2 border-black border-dotted" 
                                    defaultValue={dateWithSlash(transaction_prescription.date_transaction)} 
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-4/12 mt-8 border-t-8 border-b-8 border-black border-double flex">
                        <div className="font-extrabold text-lg mt-4 mr-4">Rp.</div>
                        <div className="w-full h-8 border-black border-2 [transform:skew(-20deg)] mt-4 mb-4 p-1">
                            <p className="[transform:skew(20deg)]">{formatRupiah(transaction_prescription.total)},00</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="[page-break-after:always]" />
            <div className="max-w-[500px] h-[43rem] max-h-[43rem] ml-4 mt-4 p-2 print-min-90deg">
                <table width="100%">
                    <tbody>
                    {
                        row.map((r:any, i:number) => (
                            <tr key={i}>
                                <td width="20%" align="center">{r.medicine.name}</td>
                                <td>{r.qty}</td>
                                <td>
                                    <Button 
                                        className="btn-hide" 
                                        variant="destructive" 
                                        onClick={() => deleteVar(i)}
                                    >X</Button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </>
    )
}