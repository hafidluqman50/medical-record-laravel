import { useState, useEffect, FormEventHandler, useRef } from "react";
import axios from "axios";
import AdministratorLayout from "@/Layouts/AdministratorLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { PageProps, PaginationData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/Components/DataTable";
import { SkeletonTable } from "@/Components/SkeletonTable";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/Components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination";

import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";

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
} from "@/Components/ui/alert-dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

import { Input } from "@/Components/ui/input";

import { Badge } from "@/Components/ui/badge";

import { Registration } from "./type";

import { Doctor } from "@/Pages/Administrator/Doctor/type";

interface Registrations {
  data: Array<Registration>;
  links: Array<PaginationData>;
}

type RegistrationProps = {
  registrations: Registrations;
  doctors: Doctor[];
  doctor_id?: string;
};

type Searching = {
  search?: string;
  doctor_id?: string;
};

export default function Index({
  auth,
  doctors,
  doctor_id,
  page_num,
  registrations,
}: PageProps<RegistrationProps>) {
  const [search, setSearch] = useState<string>("");
  const doctorIdRef = useRef<any>(doctor_id);

  const { session } = usePage<PageProps>().props;

  const submitDelete = (id: number): void => {
    router.delete(route("administrator.registrations.delete", id));
  };

  const dismissAlert = (): void => {
    // document.getElementById('alert-success').remove()
  };

  const searchAct = (doctor: string | null): void => {
    doctorIdRef.current = doctor ?? doctor_id;
    router.get(
      route("administrator.registrations"),
      {
        search,
        doctor_id: doctorIdRef.current,
      },
      {
        preserveState: true,
        replace: true,
      },
    );
  };

  return (
    <AdministratorLayout
      user={auth.user}
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Data Pendaftaran
        </h2>
      }
    >
      <Head title="Data Pendaftaran" />

      <div className="py-12">
        <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
          <div className="overflow-auto bg-white px-4 py-4 shadow-sm sm:rounded-lg dark:bg-gray-800">
            {session.success && (
              <Alert id="alert-success" className="mb-5 flex" variant="success">
                <div className="w-full grow">
                  <AlertTitle>Berhasil !</AlertTitle>
                  <AlertDescription>{session.success}</AlertDescription>
                </div>
                <div className="flex-none">
                  <Button
                    className="justify-content-end"
                    variant="ghost"
                    onClick={dismissAlert}
                  >
                    X
                  </Button>
                </div>
              </Alert>
            )}
            {session.error && (
              <Alert
                id="alert-error"
                className="mb-5 flex"
                variant="destructive"
              >
                <div className="w-full grow">
                  <AlertTitle>Gagal !</AlertTitle>
                  <AlertDescription>{session.error}</AlertDescription>
                </div>
                <div className="flex-none">
                  <Button
                    className="justify-content-end"
                    variant="ghost"
                    onClick={dismissAlert}
                  >
                    X
                  </Button>
                </div>
              </Alert>
            )}
            <div className="flex">
              <div className="grow">
                <Button className="mb-4" asChild>
                  <Link href={route("administrator.registrations.create")}>
                    Tambah Pendaftaran
                  </Link>
                </Button>
              </div>
            </div>
            {doctors.length == 0 ? (
              <h5 className="text-center">
                <b>Input Dokter Terlebih Dahulu!</b>
              </h5>
            ) : (
              <Tabs
                defaultValue={doctorIdRef.current.toString()}
                className="w-full"
              >
                <TabsList>
                  {doctors.map((row, key) => (
                    <TabsTrigger
                      value={row.id.toString()}
                      key={key}
                      onClick={() => searchAct(row.id.toString())}
                    >
                      {row.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {doctors.map((row, key) => (
                  <TabsContent value={row.id.toString()} key={key}>
                    <div className="mx-auto mb-4 flex w-1/3 flex-none space-x-4">
                      <Input
                        type="search"
                        name="search_data"
                        placeholder="Cari Nama Pasien"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <Button
                        className="mb-2"
                        variant="secondary"
                        onClick={() => searchAct(null)}
                      >
                        Cari
                      </Button>
                    </div>
                    <Table className="w-screen border-collapse border border-slate-200">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border border-slate-200">
                            No
                          </TableHead>
                          <TableHead className="border border-slate-200">
                            Nomor Daftar
                          </TableHead>
                          <TableHead className="border border-slate-200">
                            Tanggal Daftar
                          </TableHead>
                          <TableHead className="border border-slate-200">
                            Nama Pasien
                          </TableHead>
                          <TableHead className="border border-slate-200">
                            Nama Dokter
                          </TableHead>
                          <TableHead className="border border-slate-200">
                            Tinggi Badan
                          </TableHead>
                          <TableHead className="border border-slate-200">
                            Berat Badan
                          </TableHead>
                          <TableHead className="border border-slate-200">
                            Suhu Badan
                          </TableHead>
                          <TableHead className="border border-slate-200">
                            Tekanan Darah
                          </TableHead>
                          <TableHead className="border border-slate-200">
                            Keluhan
                          </TableHead>
                          <TableHead className="border border-slate-200">
                            Pemeriksaan Penunjang
                          </TableHead>
                          <TableHead className="border border-slate-200">
                            Status
                          </TableHead>
                          <TableHead className="border border-slate-200">
                            #
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registrations.data.length == 0 ? (
                          <TableRow>
                            <TableCell colSpan={13} align="center">
                              Empty Data!
                            </TableCell>
                          </TableRow>
                        ) : (
                          registrations.data.map((data, key) => (
                            <TableRow key={data.id}>
                              <TableCell className="border border-slate-200">
                                {page_num + key}
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
                                {data.status_register == 0 ? (
                                  <Badge variant="destructive">
                                    Belum Diperiksa
                                  </Badge>
                                ) : (
                                  <Badge variant="success">
                                    Sudah Diperiksa
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="border border-slate-200">
                                <div className="flex space-x-4">
                                  <Button
                                    className="bg-amber-500 text-white hover:bg-amber-500"
                                    disabled={data.status_register == 1}
                                  >
                                    <Link
                                      href={route(
                                        "administrator.registrations.edit",
                                        data.id,
                                      )}
                                    >
                                      Edit
                                    </Link>
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive">
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This
                                          will delete your registration data
                                          from our servers.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => submitDelete(data.id)}
                                        >
                                          Continue
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={13}>
                            <Pagination>
                              <PaginationContent>
                                {registrations.links.map((pagination, key) => (
                                  <div key={key}>
                                    {pagination.label.includes("Previous") ? (
                                      <Link
                                        href={
                                          pagination.url === undefined
                                            ? "#"
                                            : pagination.url
                                        }
                                      >
                                        <PaginationPrevious />
                                      </Link>
                                    ) : (
                                      ""
                                    )}
                                    {!pagination.label.includes("Previous") &&
                                    !pagination.label.includes("Next") ? (
                                      <Link
                                        href={
                                          pagination.url === undefined
                                            ? "#"
                                            : pagination.url
                                        }
                                      >
                                        <PaginationItem key={key}>
                                          <PaginationLink
                                            isActive={pagination.active}
                                          >
                                            {pagination.label}
                                          </PaginationLink>
                                        </PaginationItem>
                                      </Link>
                                    ) : (
                                      ""
                                    )}
                                    {pagination.label.includes("Next") ? (
                                      <Link
                                        href={
                                          pagination.url === undefined
                                            ? "#"
                                            : pagination.url
                                        }
                                      >
                                        <PaginationNext />
                                      </Link>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                ))}
                              </PaginationContent>
                            </Pagination>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </AdministratorLayout>
  );
}
