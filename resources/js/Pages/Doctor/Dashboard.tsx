import { useState } from 'react'
import DoctorLayout from '@/Layouts/DoctorLayout';
import { Head, Link, router} from '@inertiajs/react';
import { PageProps, PaginationData } from '@/types';
import { Calendar } from "@/Components/ui/calendar"
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

import { Input } from '@/Components/ui/input'

import { Button } from '@/Components/ui/button'

import { Badge } from '@/Components/ui/badge'

interface Registration {
    id: number;
    number_register:string;
    patient:{
        name:string
    };
    doctor:{
        name:string
    };
    date_register:string;
    body_height:number;
    body_weight:number;
    body_temp:number;
    blood_pressure:string;
    complains_of_pain:string;
    supporting_examinations:string;
    status_register:number;
    medical_record_list?:{
        id:number;
        medical_record_id:number
    }
}

interface Registrations {
    data:Array<Registration>;
    links:Array<PaginationData>;
}

export default function Dashboard({ auth, registrations, page_num}: PageProps<{registrations:Registrations}>) {
    const [date, setDate] = useState<Date | undefined>(new Date())

    const [search, setSearch] = useState<string>('')

    const searchAct = (): void => {
        router.get(
            route('doctor.dashboard'),
            {
                search
            },
            {
                preserveState: true,
                replace: true,
            }
        )
    }

    return (
        <DoctorLayout
            user={auth.doctor}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">Welcome {auth.doctor.name}! You're logged in as DOCTOR!</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-auto shadow-sm sm:rounded-lg py-4 px-4 mt-4">
                        <div className="w-1/3 mx-auto flex-none flex space-x-4 mb-4">
                            <Input
                                type="search" 
                                name="search_data"
                                placeholder="Cari Nama Pasien" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button className="mb-2" variant="secondary" onClick={() => searchAct()}>
                                Cari
                            </Button>
                        </div>
                        <Table className="w-screen border-collapse border border-slate-200">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="border border-slate-200">No</TableHead>
                              <TableHead className="border border-slate-200">Nomor Daftar</TableHead>
                              <TableHead className="border border-slate-200">Tanggal Daftar</TableHead>
                              <TableHead className="border border-slate-200">Nama Pasien</TableHead>
                              <TableHead className="border border-slate-200">Nama Dokter</TableHead>
                              <TableHead className="border border-slate-200">Tinggi Badan</TableHead>
                              <TableHead className="border border-slate-200">Berat Badan</TableHead>
                              <TableHead className="border border-slate-200">Suhu Badan</TableHead>
                              <TableHead className="border border-slate-200">Tekanan Darah</TableHead>
                              <TableHead className="border border-slate-200">Keluhan</TableHead>
                              <TableHead className="border border-slate-200">Pemeriksaan Penunjang</TableHead>
                              <TableHead className="border border-slate-200">Status</TableHead>
                              <TableHead className="border border-slate-200">#</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {
                                registrations.data.length == 0 ? 
                                <TableRow>
                                    <TableCell colSpan={13} align="center">
                                        Empty Data!
                                    </TableCell>
                                </TableRow>
                                : registrations.data.map((data, key) => (
                                    <TableRow key={data.id}>
                                        <TableCell className="border border-slate-200">
                                            {page_num+key}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {data.number_register}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {data.date_register}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {data.patient.name}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {data.doctor.name}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {data.body_height} Cm
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {data.body_weight} Kg
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {data.body_temp} &deg;C
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {data.blood_pressure} mmHg
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {data.complains_of_pain}
                                        </TableCell>
                                        <TableCell>
                                            {data.supporting_examinations}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {
                                                data.status_register == 0 ? 
                                                <Badge variant="destructive">Belum Diperiksa</Badge> : 
                                                <Badge variant="success">Sudah Diperiksa</Badge>
                                            }
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            <div className="flex space-x-4">
                                                <Button className="bg-cyan-500 text-white hover:bg-cyan-500" disabled={data.status_register == 1}>
                                                    <Link href={route('doctor.medical-records.create',data.id)}>Proses Rekam Medis</Link>
                                                </Button>
                                                <Button className="bg-orange-500 text-white hover:bg-orange-500" disabled={data.medical_record_list == null}>
                                                    {data.medical_record_list != null ? <Link href={route('doctor.medical-records.list-records', data.medical_record_list.medical_record_id)}>Riwayat Rekam Medis</Link> : 'Riwayat Rekam Medis'}
                                                </Button>
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
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="max-w-fit mt-4 bg-white rounded-md border shadow"
                    />
                </div>
            </div>
        </DoctorLayout>
    );
}
