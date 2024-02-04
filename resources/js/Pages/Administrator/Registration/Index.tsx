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

interface RegistrationCategories {
    data:Array<{
        id: number,
        number_register:string,
        patient:{
            name:string
        },
        doctor:{
            name:string
        },
        date_register:string,
        body_height:number,
        body_weight:number,
        body_temp:number,
        blood_pressure:string,
        complains_of_pain:string,
        supporting_examinations:string
    }>;
    links:Array<{
        url?:string,
        label:string,
        active:boolean
    }>;
}

type RegistrationCategoryProps = {
    registrations:RegistrationCategories
}

export default function Index({auth, app, registrations, page_num}: PageProps & RegistrationCategoryProps) {

    const [searchData, setSearchData] = useState<string>('')

    const { session } = usePage<PageProps>().props

    const submitDelete = (id: number): void => {
        router.delete(route('administrator.registrations.delete',id))
    }

    const dismissAlert = (): void => {
        // document.getElementById('alert-success').remove()
    }

    const search = (): void => {
        router.get(
            route('administrator.registrations'),
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
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Data Pendaftaran</h2>}
        >
            <Head title="Data Pendaftaran" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
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
                                    <Button size="sm" className="mb-2" asChild>
                                        <Link href={route('administrator.registrations.create')}>Tambah Pendaftaran</Link>
                                    </Button>
                                </div>
                                <div className="w-1/3 flex-none flex space-x-4">
                                    <Input
                                        type="search" 
                                        name="search_data"
                                        placeholder="Cari Nama Pasien" 
                                        value={searchData}
                                        onChange={(e) => setSearchData(e.target.value)}
                                    />
                                    <Button className="mb-2" variant="secondary" onClick={search}>
                                        Cari
                                    </Button>
                                </div>
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>No</TableHead>
                                  <TableHead>Nomor Daftar</TableHead>
                                  <TableHead>Tanggal Daftar</TableHead>
                                  <TableHead>Nama Pasien</TableHead>
                                  <TableHead>Nama Dokter</TableHead>
                                  <TableHead>Tinggi Badan</TableHead>
                                  <TableHead>Berat Badan</TableHead>
                                  <TableHead>Tekanan Darah</TableHead>
                                  <TableHead>Keluhan</TableHead>
                                  <TableHead>Pemeriksaan Penunjang</TableHead>
                                  <TableHead>#</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {
                                    registrations.data.length == 0 ? 
                                    <TableRow>
                                        <TableCell colSpan={11} align="center">
                                            Empty Data!
                                        </TableCell>
                                    </TableRow>
                                    : registrations.data.map((row, key) => (
                                        <TableRow key={row.id}>
                                            <TableCell>
                                                {page_num+key}
                                            </TableCell>
                                            <TableCell>
                                                {row.number_register}
                                            </TableCell>
                                            <TableCell>
                                                {row.patient.name}
                                            </TableCell>
                                            <TableCell>
                                                {row.doctor.name}
                                            </TableCell>
                                            <TableCell>
                                                {row.body_height}
                                            </TableCell>
                                            <TableCell>
                                                {row.body_weight}
                                            </TableCell>
                                            <TableCell>
                                                {row.body_temp}
                                            </TableCell>
                                            <TableCell>
                                                {row.blood_pressure}
                                            </TableCell>
                                            <TableCell>
                                                {row.complains_of_pain}
                                            </TableCell>
                                            <TableCell>
                                                {row.supporting_examinations}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-4">
                                                    <Button className="bg-amber-500 text-white hover:bg-amber-500" asChild>
                                                        <Link href={route('administrator.registrations.edit', row.id)}>Edit</Link>
                                                    </Button>
                                                    <AlertDialog>
                                                      <AlertDialogTrigger asChild>
                                                        <Button variant="destructive">Delete</Button>
                                                      </AlertDialogTrigger>
                                                      <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            This action cannot be undone. This will delete your patient category data from our servers.
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
                                    <TableCell colSpan={11}>
                                        <Pagination>
                                            <PaginationContent>    
                                        {
                                            registrations.links.map((pagination, key) => (
                                                
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