import React, { Fragment, useEffect } from 'react'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/Components/ui/table"

import { formatRupiah } from '@/lib/helper'

import { StockOpname, StockOpnameDetail } from './type'

type PrintPageProps = {
    stock_opname:StockOpname
}

export default function Print({stock_opname}: PrintPageProps) {

    useEffect(() => {
        window.addEventListener('load', () => {
            window.print();
        })

        return () => {
            window.removeEventListener('load', () => {
                window.print();
            })
        }
    })

    return(
        <>
            <Head title="Print Stock Opname" />
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-4 px-4">
                <Button className="btn-hide" asChild>
                    <Link href={route('administrator.stock-opnames')}>
                        Kembali
                    </Link>
                </Button>
                <Button variant="success" className="btn-hide ml-4" onClick={() => window.print()}>
                    Print
                </Button>
                <div className="m-4">
                    <h5>Keterangan : {stock_opname.notes}</h5>
                    <h5>Tanggal  : {stock_opname.date_stock_opname}</h5>
                    <h5>Input By : {stock_opname.user.name}</h5>
                </div>
                <Table className="border-collapse border border-slate-200">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border border-slate-200">No</TableHead>
                      <TableHead className="border border-slate-200">Nama Obat</TableHead>
                      <TableHead className="border border-slate-200">Satuan</TableHead>
                      <TableHead className="border border-slate-200">Harga HNA</TableHead>
                      <TableHead className="border border-slate-200">Stok Komputer</TableHead>
                      <TableHead className="border border-slate-200">Stok Fisik</TableHead>
                      <TableHead className="border border-slate-200">Stok Selisih</TableHead>
                      <TableHead className="border border-slate-200">Sub Nilai</TableHead>
                      <TableHead className="border border-slate-200">Tanggal Exp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                        stock_opname.stock_opname_details.map((row, key) => (
                            <TableRow key={row.id}>
                                <TableCell className="border border-slate-200">
                                    {key+1}
                                </TableCell>
                                <TableCell className="border border-slate-200">
                                    {row.medicine.name}
                                </TableCell>
                                <TableCell className="border border-slate-200">
                                    {row.unit_medicine}
                                </TableCell>
                                <TableCell className="border border-slate-200">
                                    {row.price}
                                </TableCell>
                                <TableCell className="border border-slate-200">
                                    {row.stock_computer}
                                </TableCell>
                                <TableCell className="border border-slate-200">
                                    {row.stock_display}
                                </TableCell>
                                <TableCell className="border border-slate-200">
                                    {row.stock_deviation}
                                </TableCell>
                                <TableCell className="border border-slate-200">
                                    {row.sub_value}
                                </TableCell>
                                <TableCell className="border border-slate-200">
                                    {row.date_expired}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                  </TableBody>
                </Table>
            </div>
        </>
    )
}