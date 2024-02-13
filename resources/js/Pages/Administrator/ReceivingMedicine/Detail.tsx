import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ReceivingMedicineDetail } from './type';
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from '@/Components/DataTable'
import { SkeletonTable } from "@/Components/SkeletonTable"
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

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/Components/ui/alert"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"

import { Input } from '@/Components/ui/input'

import { formatRupiah } from '@/lib/helper'

interface ReceivingMedicineDetails {
    data:Array<ReceivingMedicineDetail>;
    links:Array<{
        url?:string,
        label:string,
        active:boolean
    }>;
}

type ReceivingMedicineDetailProps = {
    receiving_medicine_details:ReceivingMedicineDetails
    id:number
}

export default function Detail({auth, receiving_medicine_details, page_num, id}: PageProps & ReceivingMedicineDetailProps) {

    const [searchData, setSearchData] = useState<string>('')

    const { session } = usePage<PageProps>().props

    const dismissAlert = (): void => {
        // document.getElementById('alert-success').remove()
    }

    const search = (): void => {
        router.get(
            route('administrator.purchase-medicines.detail', id),
            {
                search:searchData
            },
            {
                preserveState: true,
                replace: true,
            }
        )
    }

    return (
        <AdministratorLayout
            user={auth.user}
            routeParent="pembelian"
            routeChild="data-penerimaan-obat"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Data Penerimaan Obat Detail</h2>}
        >
            <Head title="Data Penerimaan Obat Detail" />

            <div className="py-12">
                <div className="w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-4 px-4">
                        {/*<DataTable columns={columns} data={doctor}/>*/}
                        <div className="flex">
                            <div className="grow">
                                <Button variant="secondary" className="mb-2" asChild>
                                    <Link href={route('administrator.receiving-medicines')}>Kembali</Link>
                                </Button>
                            </div>
                            <div className="w-1/3 flex-none flex space-x-4">
                                <Input
                                    type="search" 
                                    name="search_data"
                                    placeholder="Cari Obat" 
                                    value={searchData}
                                    onChange={(e) => setSearchData(e.target.value)}
                                />
                                <Button className="mb-2" variant="secondary" onClick={search}>
                                    Cari
                                </Button>
                            </div>
                        </div>
                        <Table className="border-collapse border border-slate-200">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="border border-slate-200">No</TableHead>
                              <TableHead className="border border-slate-200">Nama Obat</TableHead>
                              <TableHead className="border border-slate-200">Pabrik</TableHead>
                              <TableHead className="border border-slate-200">Satuan</TableHead>
                              <TableHead className="border border-slate-200">Qty</TableHead>
                              <TableHead className="border border-slate-200">Hna</TableHead>
                              <TableHead className="border border-slate-200">Sub Total</TableHead>
                              <TableHead className="border border-slate-200">Keterangan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {
                                receiving_medicine_details.data.length == 0 ? 
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        Empty Data!
                                    </TableCell>
                                </TableRow>
                                : receiving_medicine_details.data.map((row, key) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="border border-slate-200">
                                            {page_num+key}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.medicine.name}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.medicine.medicine_factory.name}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.medicine.unit_medicine}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.qty}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            Rp. {formatRupiah(row.price)}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            Rp. {formatRupiah(row.sub_total)}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.notes}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                                <TableCell colSpan={8}>
                                    <Pagination>
                                        <PaginationContent>    
                                    {
                                        receiving_medicine_details.links.map((pagination: any, key: number) => (
                                            
                                            <div key={key}>
                                            {   
                                                pagination.label.includes('Previous') ? 
                                                <Link href={pagination.url === undefined ? '#' : pagination.url}>
                                                    <PaginationPrevious/>
                                                </Link> : ''
                                            }
                                            {
                                                !pagination.label.includes('Previous') && !pagination.label.includes('Next') ? 

                                                <Link href={pagination.url === undefined ? '#' : pagination.url}>
                                                    <PaginationItem key={key}>
                                                      <PaginationLink isActive={pagination.active}>
                                                        {pagination.label}
                                                      </PaginationLink>
                                                    </PaginationItem>
                                                </Link>
                                                : ''
                                            }
                                            {
                                                pagination.label.includes('Next') ?
                                                <Link href={pagination.url === undefined ? '#' : pagination.url}>
                                                    <PaginationNext/>
                                                </Link> : ''
                                            }
                                            </div>
                                        ))
                                    }
                                        </PaginationContent>
                                    </Pagination>
                                </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                    </div>
                </div>
            </div>
        </AdministratorLayout>
    )
}