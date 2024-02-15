import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Transaction } from './type';
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

interface Transactions {
    data:Array<Transaction>;
    links:Array<{
        url?:string,
        label:string,
        active:boolean
    }>;
}

type TransactionProps = {
    transactions:Transactions
}

export default function Index({auth, app, transactions, page_num}: PageProps & TransactionProps) {

    const [searchData, setSearchData] = useState<string>('')

    const { session } = usePage<PageProps>().props

    const submitDelete = (id: number): void => {
        router.delete(route('administrator.transactions.delete', id))
    }

    const dismissAlert = (): void => {
        // document.getElementById('alert-success').remove()
    }

    const search = (): void => {
        router.get(
            route('administrator.transactions'),
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
            routeChild="data-penjualan"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Data Penjualan</h2>}
        >
            <Head title="Data Penjualan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-4 px-4">
                    {
                        session.success && (
                        <Alert id="alert-success" className="mb-5 flex" variant="success">
                          <div className="w-full grow">
                              <AlertTitle>Berhasil !</AlertTitle>
                              <AlertDescription>
                                {session.success}
                              </AlertDescription>
                          </div>
                          <div className="flex-none">
                            <Button className="justify-content-end" variant="ghost" onClick={dismissAlert}>X</Button>
                          </div>
                        </Alert>
                    )}
                        <div className="flex justify-end">
                            <div className="w-1/3 flex space-x-4">
                                <Input
                                    type="search" 
                                    name="search_data"
                                    placeholder="Cari Penjualan" 
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
                              <TableHead className="border border-slate-200">Nomor Invoice</TableHead>
                              <TableHead className="border border-slate-200">Tanggal Transaksi</TableHead>
                              <TableHead className="border border-slate-200">Sub Total</TableHead>
                              <TableHead className="border border-slate-200">Diskon</TableHead>
                              <TableHead className="border border-slate-200">Total</TableHead>
                              <TableHead className="border border-slate-200">Bayar</TableHead>
                              <TableHead className="border border-slate-200">Kembalian</TableHead>
                              <TableHead className="border border-slate-200">Jenis Pembayaran</TableHead>
                              <TableHead className="border border-slate-200">Jenis Transaksi</TableHead>
                              <TableHead className="border border-slate-200">Input By</TableHead>
                              <TableHead className="border border-slate-200">#</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {
                                transactions.data.length == 0 ? 
                                <TableRow>
                                    <TableCell colSpan={13} align="center">
                                        Empty Data!
                                    </TableCell>
                                </TableRow>
                                : transactions.data.map((row, key) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="border border-slate-200">
                                            {page_num+key}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.invoice_number}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.date_transaction}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            Rp. {formatRupiah(row.sub_total)}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            Rp. {formatRupiah(row.discount_pay)}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            Rp. {formatRupiah(row.total)}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            Rp. {formatRupiah(row.pay_total)}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            Rp. {formatRupiah(row.change_money)}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.transaction_pay_type}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.type}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.user.name}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            <div className="flex space-x-4">
                                                <Button className="bg-amber-500 text-white hover:bg-amber-500" asChild>
                                                    <Link href={route('administrator.transactions.detail', row.id)}>Detail</Link>
                                                </Button>
                                                <AlertDialog>
                                                  <AlertDialogTrigger asChild>
                                                    <Button variant="destructive">Delete</Button>
                                                  </AlertDialogTrigger>
                                                  <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                      <AlertDialogDescription>
                                                        This action cannot be undone. This will delete your transactions data from our servers.
                                                      </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                      <AlertDialogAction onClick={() => submitDelete(row.id)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                  </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                                <TableCell colSpan={13}>
                                    <Pagination>
                                        <PaginationContent>    
                                    {
                                        transactions.links.map((pagination, key) => (
                                            
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