import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/Components/ui/table";
import DoctorLayout from '@/Layouts/DoctorLayout';
import { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

import { Input } from '@/Components/ui/input';

import { MedicalRecordDetail, PaginationData } from './type';

interface MedicalRecordDetails {
    data:Array<MedicalRecordDetail>;
    links:Array<PaginationData>;
}

type MedicalRecordDetailProps = {
    medical_record_details:MedicalRecordDetails
    medical_record_id: number
}

export default function DetailRecord({auth, medical_record_id, medical_record_details, page_num}: PageProps<MedicalRecordDetailProps>) {

    const [searchData, setSearchData] = useState<string>('')

    const { session } = usePage<PageProps>().props

    const submitDelete = (id: number): void => {
        // router.delete(route('doctor.medical-records.delete',id))
    }

    const dismissAlert = (): void => {
        // document.getElementById('alert-success').remove()
    }

    const search = (): void => {
        router.get(
            route('doctor.medical-records.detail-records',{
                medical_record_id:medical_record_details.data[0].medical_record_list.medical_record_id,
                medical_record_list_id:medical_record_details.data[0].medical_record_list.id
            }),
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
        <DoctorLayout
            user={auth.doctor}
            routeParent="rekam-medis"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Data Detail Rekam Medis</h2>}
        >
            <Head title="Data Detail Rekam Medis" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-4 px-4">
                        <div className="flex">
                            <div className="grow">
                                <Button variant="secondary" className="mb-2" asChild>
                                    <Link href={route('doctor.medical-records.list-records', medical_record_id)}>Kembali</Link>
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
                              <TableHead className="border border-slate-200">Nama Obat</TableHead>
                              <TableHead className="border border-slate-200">Qty</TableHead>
                              <TableHead className="border border-slate-200">Dosis</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {
                                medical_record_details.data.length == 0 ? 
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Empty Data!
                                    </TableCell>
                                </TableRow>
                                : medical_record_details.data.map((row, key) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="border border-slate-200">
                                            {page_num+key}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.medicine.name}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.qty}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.dose}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Pagination>
                                        <PaginationContent>    
                                    {
                                        medical_record_details.links.map((pagination, key) => (
                                            
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
        </DoctorLayout>
    )
}