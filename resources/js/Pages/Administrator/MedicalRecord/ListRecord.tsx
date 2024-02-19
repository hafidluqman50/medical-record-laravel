import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps, Doctor } from '@/types';
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

import { MedicalRecordList, PaginationData } from './type'

interface MedicalRecordLists {
    data:Array<MedicalRecordList>;
    links:Array<PaginationData>;
}

type MedicalRecordListProps = {
    medical_record_lists:MedicalRecordLists
}

export default function ListRecord({auth, app, medical_record_lists, page_num}: PageProps & MedicalRecordListProps) {

    const [searchData, setSearchData] = useState<string>('')

    const { session } = usePage<PageProps>().props

    const submitDelete = (id: number): void => {
        // router.delete(route('administrator.medical-records.delete',id))
    }

    const dismissAlert = (): void => {
        // document.getElementById('alert-success').remove()
    }

    const search = (): void => {
        router.get(
            route('administrator.medical-records.list-records', medical_record_lists.data[0].medical_record_id),
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
            routeParent="rekam-medis"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Data Riwayat Rekam Medis</h2>}
        >
            <Head title="Data Riwayat Rekam Medis" />

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
                            <div className="grow">
                                <Button variant="secondary" className="mb-2" asChild>
                                    <Link href={route('administrator.medical-records')}>Kembali</Link>
                                </Button>
                            </div>
                            <div className="w-1/3 flex-none flex space-x-4">
                                <Input
                                    type="search" 
                                    name="search_data"
                                    placeholder="Cari" 
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
                              <TableHead className="border border-slate-200">Nama Pasien</TableHead>
                              <TableHead className="border border-slate-200">Nama Dokter</TableHead>
                              <TableHead className="border border-slate-200">Tanggal Periksa</TableHead>
                              <TableHead className="border border-slate-200">Tinggi Badan</TableHead>
                              <TableHead className="border border-slate-200">Berat Badan</TableHead>
                              <TableHead className="border border-slate-200">Suhu Badan</TableHead>
                              <TableHead className="border border-slate-200">Tekanan Darah</TableHead>
                              <TableHead className="border border-slate-200">Keluhan</TableHead>
                              <TableHead className="border border-slate-200">Diagnosa</TableHead>
                              <TableHead className="border border-slate-200">Anemnesis</TableHead>
                              <TableHead className="border border-slate-200">Pemeriksaan Fisik</TableHead>
                              <TableHead className="border border-slate-200">Pemeriksaan Penunjang</TableHead>
                              <TableHead className="border border-slate-200">Terapi</TableHead>
                              <TableHead className="border border-slate-200">Rujukan</TableHead>
                              <TableHead className="border border-slate-200">Keterangan</TableHead>
                              <TableHead className="border border-slate-200">Tanggal Kontrol Selanjutnya</TableHead>
                              <TableHead className="border border-slate-200">#</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {
                                medical_record_lists.data.length == 0 ? 
                                <TableRow>
                                    <TableCell colSpan={18} align="center">
                                        Empty Data!
                                    </TableCell>
                                </TableRow>
                                : medical_record_lists.data.map((row, key) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="border border-slate-200">
                                            {page_num+key}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.registration.patient.name}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.registration.doctor.name}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.date_check_up}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.body_height} Cm
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.body_weight} Kg
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.body_temp} &deg;C
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.blood_pressure} mmHg
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.main_complaint}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.diagnose}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.anemnesis}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.physical_examinations}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.supporting_examinations}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.therapy}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.referral}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.notes}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.next_control_date}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            <div className="flex space-x-4">
                                                <Button className="bg-cyan-500 text-white hover:bg-cyan-500" asChild>
                                                    <Link href={route('administrator.medical-records.detail-records',{
                                                        medical_record_id:row.medical_record_id,
                                                        medical_record_list_id:row.id
                                                    })}>Detail</Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                                <TableCell colSpan={18}>
                                    <Pagination>
                                        <PaginationContent>    
                                    {
                                        medical_record_lists.links.map((pagination, key) => (
                                            
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