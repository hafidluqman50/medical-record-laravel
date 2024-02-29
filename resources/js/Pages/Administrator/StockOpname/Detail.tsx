import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps, PaginationData } from '@/types';
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

import { StockOpnameDetail } from './type'

interface StockOpnameDetails {
    data:Array<StockOpnameDetail>;
    links:Array<PaginationData>;
}

type StockOpnameDetailProps = {
    stock_opname_details:StockOpnameDetails
}

export default function Index({auth, app, stock_opname_details, page_num}: PageProps<StockOpnameDetailProps>) {

    const [searchData, setSearchData] = useState<string>('')

    const { session } = usePage<PageProps>().props

    const dismissAlert = (): void => {
        // document.getElementById('alert-success').remove()
    }

    const search = (): void => {
        router.get(
            route('administrator.stock-opnames.detail', stock_opname_details.data[0].stock_opname_id),
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
            routeParent="stok-opname"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Data Stok Opname</h2>}
        >
            <Head title="Data Stok Opname" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-4 px-4">
                        {/*<DataTable columns={columns} data={doctor}/>*/}
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
                        <div className="flex">
                            <div className="grow">
                                <Button variant="secondary" className="mb-2" asChild>
                                    <Link href={route('administrator.stock-opnames')}>Kembali</Link>
                                </Button>
                            </div>
                            <div className="w-1/3 flex-none flex space-x-4">
                                <Input
                                    type="search" 
                                    name="search_data"
                                    placeholder="Cari Stok Opname" 
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
                                stock_opname_details.data.length == 0 ? 
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
                                        Empty Data!
                                    </TableCell>
                                </TableRow>
                                : stock_opname_details.data.map((row, key) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="border border-slate-200">
                                            {page_num+key}
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
                                            {row.stock_computer - row.stock_display}
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
                          <TableFooter>
                            <TableRow>
                                <TableCell colSpan={10}>
                                    <Pagination>
                                        <PaginationContent>    
                                    {
                                        stock_opname_details.links.map((pagination, key) => (
                                            
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