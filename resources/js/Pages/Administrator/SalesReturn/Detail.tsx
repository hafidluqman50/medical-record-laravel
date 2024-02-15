import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { SalesReturnDetail } from './type';
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

import { Badge } from '@/Components/ui/badge'

import { formatRupiah } from '@/lib/helper'

interface SalesReturnDetails {
    data:Array<SalesReturnDetail>;
    links:Array<{
        url?:string,
        label:string,
        active:boolean
    }>;
}

type SalesReturnDetailProps = {
    sales_return_details:SalesReturnDetails
}

export default function Detail({auth, app, sales_return_details, page_num}: PageProps & SalesReturnDetailProps) {

    const [searchData, setSearchData] = useState<string>('')

    const { session } = usePage<PageProps>().props

    const submitDelete = (id: number): void => {
        router.delete(route('administrator.sales-returns.delete', id))
    }

    const dismissAlert = (): void => {
        // document.getElementById('alert-success').remove()
    }

    const search = (): void => {
        router.get(
            route('administrator.sales-returns'),
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
            routeParent="penjualan"
            routeChild="retur-penjualan"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Data Retur Penjualan Detail</h2>}
        >
            <Head title="Data Retur Penjualan Detail" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-4 px-4">
                        <div className="flex">
                            <div className="grow">
                                <Button variant="secondary" className="mb-2" asChild>
                                    <Link href={route('administrator.sales-returns')}>Kembali</Link>
                                </Button>
                            </div>
                            <div className="w-1/3 flex-none flex space-x-4">
                                <Input
                                    type="search" 
                                    name="search_data"
                                    placeholder="Cari Retur Penjualan" 
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
                              <TableHead className="border border-slate-200">Stok Transaksi</TableHead>
                              <TableHead className="border border-slate-200">Stok Retur</TableHead>
                              <TableHead className="border border-slate-200">Harga Retur</TableHead>
                              <TableHead className="border border-slate-200">Harga Retur Flexibel</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {
                                sales_return_details.data.length == 0 ? 
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Empty Data!
                                    </TableCell>
                                </TableRow>
                                : sales_return_details.data.map((row, key) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="border border-slate-200">
                                            {page_num+key}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.medicine.name}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.qty_transaction}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.qty_return}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            Rp. {formatRupiah(row.sub_total)}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            Rp. {formatRupiah(row.sub_total_custom)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Pagination>
                                        <PaginationContent>    
                                    {
                                        sales_return_details.links.map((pagination, key) => (
                                            
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