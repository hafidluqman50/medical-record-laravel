import { useState, useEffect, FormEventHandler, useCallback } from 'react'
import axios from 'axios'
import { useQuery, QueryFunctionContext } from "@tanstack/react-query";
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { PurchaseHistory } from './type';
import { Medicine } from '@/Pages/Administrator/Medicine/type';
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from '@/Components/DataTable'
import { SkeletonTable } from "@/Components/SkeletonTable"
import { Button } from '@/Components/ui/button'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/Components/ui/select"
// 

import Select from 'react-select';

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

interface PurchaseHistories {
    data:Array<PurchaseHistory>;
    links:Array<{
        url?:string,
        label:string,
        active:boolean
    }>;
}

type PurchaseHistoryProps = {
    purchase_histories:PurchaseHistories
    medicines:Medicine[]
}

export default function Index({auth, app, purchase_histories, page_num, medicines}: PageProps & PurchaseHistoryProps) {

    const [medicineBatch, setMedicineBatch] = useState<number|null>(null)
    const [fromDate, setFromDate]           = useState<string>('')
    const [toDate, setToDate]               = useState<string>('')
    const [listObat, setListObat]           = useState<Array<{value:number,label:string}>>([])
    
    const [pageNum, setPageNum] = useState<number>(0)

    const { session } = usePage<PageProps>().props

    const submitDelete = (id: number): void => {
        router.delete(route('administrator.order-medicines.delete',id))
    }

    const dismissAlert = (): void => {
        // document.getElementById('alert-success').remove()
    }

    const search = (): void => {
        router.get(
            route('administrator.purchase-histories'),
            {
                medicine_batch_number:medicineBatch,
                from_date:fromDate,
                to_date:toDate
            },
            {
                preserveState: true,
                replace: true,
            }
        )
    }
    
    const fetchListObat = async ({
      queryKey,
    }: QueryFunctionContext<[string, number]>): Promise<Array<{
      value:number,
      label:string
    }>> => {
      const [_, pageNum] = queryKey;
      const response = await axios.get<{
          medicines: Medicine[];
          max_page: number;
        }>(route("api.medicines.get-all"), {
        params: {
          page_num: pageNum,
          data_location:'gudang',
          limit: 20
        },
      });
      
      const listObatMap = response.data.medicines.map((map) => {
        return {
          value:map.id,
          label:`${map.name} - ${map.batch_number}`
        }
      })
      
      setListObat([...listObat, ...listObatMap])
      
      return response.data.medicines.map((map) => {
        return {
          value:map.id,
          label:`${map.name} - ${map.batch_number}`
        }
      });
    };
  
    const { isLoading, isError, data, error, refetch } = useQuery({
      queryKey: ["listObat", pageNum],
      queryFn: fetchListObat,
    });
    
    const handleScrollBottom = useCallback(() => {
        // key.current += 1;
        //setKey(key + 1);
        setPageNum(pageNum => pageNum + 20)
    }, [pageNum]);

    return (
        <AdministratorLayout
            user={auth.user}
            routeParent="pembelian"
            routeChild="history-beli"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">History Beli</h2>}
        >
            <Head title="History Beli" />

            <div className="py-12">
                <div className="w-full mx-auto sm:px-6 lg:px-8">
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
                            <div className="w-full flex-none flex space-x-4">
                                
                            <div className="w-3/12">
                                <Input
                                    type="date"
                                    name="from_date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                              </div>
                              <div className="w-3/12">
                                <Input
                                    type="date"
                                    name="from_date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                              </div>
                                {/* <Select onValueChange={(value) => {
                                    const split = value.split('|')
                                    setMedicineBatch(split[0])
                                }}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="=== Pilih Obat ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  {
                                    medicines.map((row, key) => (
                                        <SelectItem value={`${row.batch_number}|${row.id.toString()}`} key={key}>{row.name}</SelectItem>
                                    ))
                                  }
                                  </SelectContent>
                                </Select> */}
                                <div className="w-5/12">
                                  <Select 
                                      className="basic-single text-sm" 
                                      classNamePrefix="select" 
                                      options={listObat}
                                      name="list-obat"
                                      onMenuScrollToBottom={handleScrollBottom}
                                      onChange={(event) => {
                                        if(event != null) {
                                          setMedicineBatch(event.value)
                                        }
                                      }}
                                  />
                                </div>

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
                              <TableHead className="border border-slate-200">Tanggal Pembelian</TableHead>
                              <TableHead className="border border-slate-200">Supplier</TableHead>
                              <TableHead className="border border-slate-200">Jumlah</TableHead>
                              <TableHead className="border border-slate-200">Satuan</TableHead>
                              <TableHead className="border border-slate-200">Sub Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {
                                purchase_histories.data.length == 0 ? 
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        Empty Data!
                                    </TableCell>
                                </TableRow>
                                : purchase_histories.data.map((row, key) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="border border-slate-200">
                                            {page_num+key}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.invoice_number}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.date_purchase}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.medical_supplier.name}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.qty}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.unit_medicine}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            Rp. {formatRupiah(row.sub_total)}                                        
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Pagination>
                                        <PaginationContent>    
                                    {
                                        purchase_histories.links.map((pagination, key) => (
                                            
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