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

import { Input } from "@/Components/ui/input"

interface Doctors {
    data:Array<{
        id: number,
        name:string,
        username:string,
        fee:number,
        address:string,
        phone_number:number,
        status_doctor_text:string
    }>;
    links:Array<{
        url?:string,
        label:string,
        active:boolean
    }>;
}

type DoctorProps = {
    doctors:Doctors
}

export default function Index({auth, app, doctors, page_num}: PageProps & DoctorProps) {

    const [searchData, setSearchData] = useState<string>('');

    const { session } = usePage<PageProps>().props

    const submitDelete = (id: number): void => {
        router.delete(route('administrator.doctors.delete',id))
    }

    const dismissAlert = (): void => {
        // document.getElementById('alert-success').remove()
    }

    const search = (): void => {
        router.get(
            route('administrator.doctors'),
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
            routeParent="data-master"
            routeChild="data-dokter"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Data Dokter</h2>}
        >
            <Head title="Data Dokter" />

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
                                        <Link href={route('administrator.doctors.create')}>Tambah Dokter</Link>
                                    </Button>
                                </div>
                                <div className="w-1/3 flex-none flex space-x-4">
                                    <Input
                                        type="search" 
                                        name="search_data"
                                        placeholder="Cari Dokter" 
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
                                  <TableHead>Nama Dokter</TableHead>
                                  <TableHead>Username</TableHead>
                                  <TableHead>Alamat</TableHead>
                                  <TableHead>Nomor HP</TableHead>
                                  <TableHead>Biaya Dokter</TableHead>
                                  <TableHead>Status Dokter</TableHead>
                                  <TableHead>#</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {
                                    doctors.data.length == 0 ? 
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            Empty Data!
                                        </TableCell>
                                    </TableRow>
                                    : doctors.data.map((row, key) => (
                                        <TableRow key={row.id}>
                                            <TableCell>
                                                {page_num+key}
                                            </TableCell>
                                            <TableCell>
                                                {row.name}
                                            </TableCell>
                                            <TableCell>
                                                {row.username}
                                            </TableCell>
                                            <TableCell>
                                                {row.address}
                                            </TableCell>
                                            <TableCell>
                                                {row.phone_number}
                                            </TableCell>
                                            <TableCell>
                                                {row.fee}
                                            </TableCell>
                                            <TableCell>
                                                {row.status_doctor_text}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-4">
                                                    <Button className="bg-amber-500 text-white hover:bg-amber-500" asChild>
                                                        <Link href={route('administrator.doctors.edit', row.id)}>Edit</Link>
                                                    </Button>
                                                    <AlertDialog>
                                                      <AlertDialogTrigger asChild>
                                                        <Button variant="destructive">Delete</Button>
                                                      </AlertDialogTrigger>
                                                      <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            This action cannot be undone. This will delete your doctors data from our servers.
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
                                    <TableCell colSpan={8}>
                                        <Pagination>
                                            <PaginationContent>    
                                        {
                                            doctors.links.map((pagination, key) => (
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
                                                    :''

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