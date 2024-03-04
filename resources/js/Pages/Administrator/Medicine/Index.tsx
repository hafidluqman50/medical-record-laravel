import { Button } from "@/Components/ui/button";
import AdministratorLayout from "@/Layouts/AdministratorLayout";
import { PageProps } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { type MedicineIndexProps } from "./type";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
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

import { Input } from "@/Components/ui/input";

export default function Index({
  auth,
  medicines,
  page_num,
  data_locations,
  data_location,
}: PageProps<MedicineIndexProps> & {
  data_locations: Array<{ data_location: string }>;
  data_location: string;
}) {
  const [search, setSearch] = useState<string>("");
  const [dataLocation, setDataLocation] = useState<string>(data_location ?? "");

  const { session } = usePage<PageProps>().props;

  const submitDelete = (id: number): void => {
    router.delete(route("administrator.medicines.delete", id));
  };

  const dismissAlert = (): void => {
    // document.getElementById('alert-success').remove()
  };

  const searchAct = (): void => {
    const location = dataLocation == "" ? data_location : dataLocation;

    router.get(
      route("administrator.medicines"),
      {
        search,
        data_location: location,
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
      routeParent="data-obat"
      routeChild="data-obat"
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Data Obat
        </h2>
      }
    >
      <Head title="Data Obat" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white px-4 py-4 shadow-sm sm:rounded-lg dark:bg-gray-800">
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
            <div className="flex">
              <div className="grow">
                <Button className="mb-2" asChild>
                  <Link href={route("administrator.medicines.create")}>
                    Tambah Obat
                  </Link>
                </Button>
              </div>
              <div className="flex w-1/3 flex-none space-x-4">
                <Select
                  defaultValue={dataLocation}
                  value={dataLocation}
                  onValueChange={(value) => setDataLocation(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="=== Filter Data ===" />
                  </SelectTrigger>
                  <SelectContent>
                    {data_locations.map((row, key) => (
                      <SelectItem value={row.data_location} key={key}>
                        {row.data_location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="search"
                  name="search_data"
                  placeholder="Cari Obat"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  className="mb-2"
                  variant="secondary"
                  onClick={searchAct}
                >
                  Cari
                </Button>
              </div>
            </div>
            <Table className="border-collapse border border-slate-200">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-slate-200">No</TableHead>
                  <TableHead className="border border-slate-200">
                    Kode Obat
                  </TableHead>
                  <TableHead className="border border-slate-200">
                    Nomor Batch
                  </TableHead>
                  <TableHead className="border border-slate-200">
                    Nama Obat
                  </TableHead>
                  <TableHead className="border border-slate-200">
                    Stok Obat
                  </TableHead>
                  <TableHead className="border border-slate-200">
                    Satuan Obat
                  </TableHead>
                  <TableHead className="border border-slate-200">
                    Harga Modal
                  </TableHead>
                  <TableHead className="border border-slate-200">
                    Harga Modal PPn
                  </TableHead>
                  <TableHead className="border border-slate-200">
                    Hja/Net
                  </TableHead>
                  <TableHead className="border border-slate-200">#</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.data.length == 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      Empty Data!
                    </TableCell>
                  </TableRow>
                ) : (
                  medicines.data.map((row, key) => (
                    <TableRow key={row.id}>
                      <TableCell className="border border-slate-200">
                        {page_num + key}
                      </TableCell>
                      <TableCell className="border border-slate-200">
                        {row.code}
                      </TableCell>
                      <TableCell className="border border-slate-200">
                        {row.batch_number}
                      </TableCell>
                      <TableCell className="border border-slate-200">
                        {row.name}
                      </TableCell>
                      <TableCell className="border border-slate-200">
                        {row.stock}
                      </TableCell>
                      <TableCell className="border border-slate-200">
                        {row.unit_medicine}
                      </TableCell>
                      <TableCell className="border border-slate-200">
                        {row.capital_price}
                      </TableCell>
                      <TableCell className="border border-slate-200">
                        {row.capital_price_vat}
                      </TableCell>
                      <TableCell className="border border-slate-200">
                        {row.sell_price}
                      </TableCell>
                      <TableCell className="border border-slate-200">
                        <div className="flex space-x-4">
                          <Button
                            className="bg-amber-500 text-white hover:bg-amber-500"
                            asChild
                          >
                            <Link
                              href={route(
                                "administrator.medicines.edit",
                                row.id,
                              )}
                            >
                              Edit
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will delete
                                  your medicines data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => submitDelete(row.id)}
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
                  <TableCell colSpan={10}>
                    <Pagination>
                      <PaginationContent>
                        {medicines.links.map((pagination, key) => (
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
                                  <PaginationLink isActive={pagination.active}>
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
          </div>
        </div>
      </div>
    </AdministratorLayout>
  );
}
