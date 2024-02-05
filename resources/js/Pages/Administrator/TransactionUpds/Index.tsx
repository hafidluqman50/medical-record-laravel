import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button'
import { Separator } from '@/Components/ui/separator'
import TransactionLayout from '@/Layouts/TransactionLayout'
import { Label } from '@/Components/ui/label'
import { useEffect, useState, KeyboardEvent, useRef } from 'react'
import { Input } from '@/Components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog"
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

import { DataTable } from "@/Components/DataTable"

import { ColumnDef } from "@tanstack/react-table"

interface RowObat {
    name:string
    piece:string
    price:number
    qty:number
    sub_total:number
    disc:number
    total:number
}

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

interface ColumnLists {
    columnFilter:string
    columnName:string
}
 
const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  }
]

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]

const columnLists: ColumnLists[] = [
  {
    columnFilter: "status",
    columnName: "Status",
  },
  {
    columnFilter: "email",
    columnName: "Email",
  },
  {
    columnFilter: "amount",
    columnName: "Amount",
  }
]

export default function TransactionUpds() {

    const [open, setOpen] = useState<boolean>(false)
    const [cekHargaObatDialog, setCekHargaObatDialog] = useState<boolean>(false)

    const [rowObat, setRowObat] = useState<RowObat[]>([])

    const openEnterDialog = (event: KeyboardEvent<HTMLInputElement>): void => {
        if(event.keyCode === 13) {
            setOpen(true)
        }
    }

    const onKeyDownAct = (event: any): void => {
        if(event.ctrlKey && event.altKey && event.keyCode == 80) {
            router.get(route('administrator.dashboard'))
        }
        else if(event.ctrlKey && event.altKey && event.keyCode == 79) {
            setCekHargaObatDialog(true)
        }
    }

    useEffect(() => {
        document.addEventListener('keydown',onKeyDownAct)
    },[])

    return(
        <TransactionLayout
            title="Penjualan UPDS"
            bgColor="bg-sky-500"
        >

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="max-w-5xl">
                <DialogHeader>
                  <DialogTitle>List Obat</DialogTitle>
                  <Table className="border-collapse border border-slate-100 mt-4">
                    <TableHeader>
                        <TableRow>
                          <TableHead className="border border-slate-100">#</TableHead>
                          <TableHead className="border border-slate-100">No</TableHead>
                          <TableHead className="border border-slate-100">Nama Obat</TableHead>
                          <TableHead className="border border-slate-100">Pabrik</TableHead>
                          <TableHead className="border border-slate-100">Kemasan</TableHead>
                          <TableHead className="border border-slate-100">Hrg PPn</TableHead>
                          <TableHead className="border border-slate-100">Hrg Hja</TableHead>
                          <TableHead className="border border-slate-100">Stok</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="border border-slate-100"><input type="radio" name="select_obat" /></TableCell>
                            <TableCell className="border border-slate-100">1</TableCell>
                            <TableCell className="border border-slate-100">Amoxilin</TableCell>
                            <TableCell className="border border-slate-100">SANBE</TableCell>
                            <TableCell className="border border-slate-100">PCS</TableCell>
                            <TableCell className="border border-slate-100">Rp. 1.000.000,00</TableCell>
                            <TableCell className="border border-slate-100">Rp. 2.000.000,00</TableCell>
                            <TableCell className="border border-slate-100">100</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-slate-100"><input type="radio" name="select_obat" /></TableCell>
                            <TableCell className="border border-slate-100">1</TableCell>
                            <TableCell className="border border-slate-100">Amoxilin</TableCell>
                            <TableCell className="border border-slate-100">SANBE</TableCell>
                            <TableCell className="border border-slate-100">PCS</TableCell>
                            <TableCell className="border border-slate-100">Rp. 1.000.000,00</TableCell>
                            <TableCell className="border border-slate-100">Rp. 2.000.000,00</TableCell>
                            <TableCell className="border border-slate-100">100</TableCell>
                        </TableRow>
                    </TableBody>
                  </Table>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Dialog open={cekHargaObatDialog} onOpenChange={setCekHargaObatDialog}>
              <DialogContent className="max-w-5xl">
                <DialogHeader>
                  <DialogTitle>Data Harga Obat</DialogTitle>
                  {/*<DataTable columns={columns} data={payments} columnLists={columnLists}/>*/}
                  <Table className="border-collapse border border-slate-100 mt-4">
                    <TableHeader>
                        <TableRow>
                          <TableHead className="border border-slate-100">No</TableHead>
                          <TableHead className="border border-slate-100">Nama Obat</TableHead>
                          <TableHead className="border border-slate-100">Pabrik</TableHead>
                          <TableHead className="border border-slate-100">Kemasan</TableHead>
                          <TableHead className="border border-slate-100">Hrg PPn</TableHead>
                          <TableHead className="border border-slate-100">Hrg Hja</TableHead>
                          <TableHead className="border border-slate-100">Stok</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="border border-slate-100">1</TableCell>
                            <TableCell className="border border-slate-100">Amoxilin</TableCell>
                            <TableCell className="border border-slate-100">SANBE</TableCell>
                            <TableCell className="border border-slate-100">PCS</TableCell>
                            <TableCell className="border border-slate-100">Rp. 1.000.000,00</TableCell>
                            <TableCell className="border border-slate-100">Rp. 2.000.000,00</TableCell>
                            <TableCell className="border border-slate-100">100</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-slate-100">1</TableCell>
                            <TableCell className="border border-slate-100">Amoxilin</TableCell>
                            <TableCell className="border border-slate-100">SANBE</TableCell>
                            <TableCell className="border border-slate-100">PCS</TableCell>
                            <TableCell className="border border-slate-100">Rp. 1.000.000,00</TableCell>
                            <TableCell className="border border-slate-100">Rp. 2.000.000,00</TableCell>
                            <TableCell className="border border-slate-100">100</TableCell>
                        </TableRow>
                    </TableBody>
                  </Table>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <div className="flex justify-center space-x-2 mb-3">
                <Link href={route('administrator.dashboard')}>
                    <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40">
                        DASHBOARD [CTRL+ALT+P]
                    </Button>
                </Link>
                <Button 
                    size="lg" 
                    variant="secondary" 
                    className="shadow-sm shadow-slate-500/40" 
                    onClick={() => setCekHargaObatDialog(!cekHargaObatDialog)}
                >
                    CEK HARGA OBAT [CTRL+ALT+O]
                </Button>
                <Link href='#'>
                    <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40">RESEP [F1]</Button>
                </Link>
                <Link href='#'>
                    <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40">HV/OTC [F3]</Button>
                </Link>
                <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40">BATAL [F7]</Button>
                <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40">HAPUS [F8]</Button>
                <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40">BAYAR [F12]</Button>
            </div>
            <Separator className="bg-slate-200" />
            <div className="grid grid-cols-4 gap-4 mt-4 mb-4">
                <div className="flex flex-col gap-2">
                    <div className="flex space-x-2">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi">Transaksi : </Label>
                        </div>
                        <div>
                            <Input className="bg-slate-200" type="text" readOnly/>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi">Kode Obat : </Label>
                        </div>
                        <div>
                            <Input className="border border-slate-100" type="text" name="kode_obat" onKeyUp={openEnterDialog} autoFocus />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi">Harga Obat : </Label>
                        </div>
                        <div>
                            <Input id="harga-obat" type="text" className="bg-slate-200" readOnly />
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="flex flex-col gap-2">
                        <div className="mt-11">
                            <Input type="text" className="bg-slate-200" readOnly />
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-1/6">
                                <Label htmlFor="kode-transaksi">Qty Jual : </Label>
                            </div>
                            <div>
                                <Input id="harga-obat" type="text"/>
                            </div>
                            <div className="w-1/6">
                                <Label htmlFor="kode-transaksi">Diskon : </Label>
                            </div>
                            <div>
                                <Input id="harga-obat" type="number"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex space-x-4">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi"><u>F</u>aktor : </Label>
                        </div>
                        <div>
                            <Input className="bg-slate-200" type="text" value="UPDS" readOnly/>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi">Satuan : </Label>
                        </div>
                        <div>
                            <Input className="bg-slate-200" type="text" readOnly />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi">Jumlah : </Label>
                        </div>
                        <div>
                            <Input className="bg-slate-200" type="text" readOnly />
                        </div>
                    </div>
                </div>
            </div>
            <Separator className="bg-slate-200" />
            <Table className="border-collapse border-slate-100 mt-4 mb-4">
                <TableHeader>
                    <TableRow>
                        <TableHead className="border border-slate-100">#</TableHead>
                        <TableHead className="border border-slate-100">No.</TableHead>
                        <TableHead className="border border-slate-100">Nama Obat</TableHead>
                        <TableHead className="border border-slate-100">Satuan</TableHead>
                        <TableHead className="border border-slate-100">Harga</TableHead>
                        <TableHead className="border border-slate-100">Qty</TableHead>
                        <TableHead className="border border-slate-100">Sub Total</TableHead>
                        <TableHead className="border border-slate-100">Disc</TableHead>
                        <TableHead className="border border-slate-100">Total</TableHead>
                        <TableHead className="border border-slate-100">#</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        rowObat.length == 0 ?
                        <TableRow>
                            <TableCell className="border border-slate-100" colSpan={10} align="center">Tidak Ada Transaksi Obat</TableCell>
                        </TableRow>
                        : ''
                    }
                </TableBody>
            </Table>
            <Separator className="bg-slate-200" />
            <div className="grid grid-cols-2 place-items-end gap-2 mt-4 w-full">
                <div className="col-start-2 flex space-x-4">
                    <div className="w-20">
                        <Label htmlFor="kode-transaksi">Sub Total : </Label>
                    </div>
                    <div>
                        <Input className="bg-slate-200" type="text" readOnly />
                    </div>
                </div>
                <div className="col-start-2 flex space-x-4">
                    <div className="w-20">
                        <Label htmlFor="kode-transaksi">Diskon : </Label>
                    </div>
                    <div>
                        <Input className="bg-slate-200" type="text" readOnly />
                    </div>
                </div>
                <div className="col-start-2 flex space-x-4">
                    <div className="w-20">
                        <Label htmlFor="kode-transaksi">Total : </Label>
                    </div>
                    <div>
                        <Input className="bg-slate-200" type="text" readOnly />
                    </div>
                </div>
            </div>
        </TransactionLayout>
    )
}