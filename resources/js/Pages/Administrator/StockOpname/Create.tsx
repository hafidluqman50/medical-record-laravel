import { 
    useState, 
    useEffect, 
    useRef, 
    FormEventHandler,
    KeyboardEvent,
    ChangeEvent
} from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types'
import { PriceParameter } from '@/Pages/Administrator/PriceParameter/type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { formatRupiah } from '@/lib/helper'
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

import { Textarea } from "@/Components/ui/textarea"
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'

import { useToast } from '@/Components/ui/use-toast'

interface SalesReturnForm {
    medicine_stock_opnames:Array<
        Array<{
            medicine_id:number,
            unit_medicine:string,
            medicine_name:string,
            stock_computer:number,
            stock_display:number,
            stock_deviation:number,
            price:number,
            sub_value:number,
            date_expired:string
        }>
    >,
    date_stock_opname:string;
    notes:string;
    location_rack:string;
}

type CreatePageProps = {
    invoice_number:string
    location_racks:Array<{
        location_rack:string
    }>
}

export default function Create({auth, location_racks}: PageProps<CreatePageProps>) {

    const { toast } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm<SalesReturnForm>({
        medicine_stock_opnames:[],
        date_stock_opname: (new Date().toJSON().slice(0, 10)),
        notes: '',
        location_rack:''
    });

    const [rowObat, setRowObat] = useState<any>({
        isLoading:false,
        data:[]
    })

    const selectLocationRackAct = async(value: string): Promise<void> => {
        setData('location_rack', value)

        setRowObat((rowObat:any) => ({
            ...rowObat,
            isLoading:true
        }))

        try {
            const { data:responseData} = await axios.get<any>(route('api.medicines.get-by-location-rack', value))

            setRowObat((rowObat:any) => ({
                ...rowObat,
                isLoading:false,
                data:responseData.data.results
            }))
            
            setData(data => ({
                ...data,
                medicine_stock_opnames:responseData.data.results
            }))

        } catch(error) {
            if(axios.isAxiosError(error)) {
                toast({
                  variant: "destructive",
                  title: "Error!",
                  description: error.response?.data.message,
                })
            }
        }
    }

    const stockDisplayAct = (
        event: KeyboardEvent<HTMLInputElement> 
             | ChangeEvent<HTMLInputElement>,
        key: number,
        k: number
    ): void => {

        const medicineStockOpnames = data.medicine_stock_opnames

        const stockDisplayValue = parseInt((event.target as HTMLInputElement).value)

        const stockComputer     = medicineStockOpnames[key][k].stock_computer
        const capitalPrice      = medicineStockOpnames[key][k].price
        let stockDeviation      = 0
        let subValue            = 0

        stockDeviation = stockComputer - stockDisplayValue
        subValue = stockDisplayValue * capitalPrice

        medicineStockOpnames[key][k].stock_deviation = stockDeviation
        medicineStockOpnames[key][k].sub_value       = subValue
        medicineStockOpnames[key][k].stock_display   = stockDisplayValue

        setData(data => ({
            ...data,
            medicine_stock_opnames:medicineStockOpnames
        }))
    }

    const submitForm: FormEventHandler = (event) => {
        event.preventDefault()

        post(route('administrator.stock-opnames.store'))
    }

    console.log(data)
    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="stok-opname"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Stok Opname</h2>}
        >
            <Head title="Form Stok Opname" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary" asChild>
                                <Link href={route('administrator.stock-opnames')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div>
                                <InputLabel htmlFor="date_stock_opname" value="Tanggal Stok Opname" />

                                <Input
                                    id="date_stock_opname"
                                    type="date"
                                    name="date_stock_opname"
                                    value={data.date_stock_opname}
                                    className="mt-1 block w-full"
                                    autoComplete="date_stock_opname"
                                    onChange={(e) => setData('date_stock_opname', e.target.value)}
                                />

                                <InputError message={errors.date_stock_opname} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="notes" value="Keterangan" />

                                <Input
                                    id="notes"
                                    type="text"
                                    name="notes"
                                    value={data.notes}
                                    className="mt-1 block w-full"
                                    autoComplete="notes"
                                    onChange={(event) => setData('notes', event.target.value)}
                                />

                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="location_rack" value="Lokasi Rak" />

                                <Select onValueChange={(value) => selectLocationRackAct(value)}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="=== Pilih Lokasi Rak ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  {
                                    location_racks.map((row, key) => (
                                        <SelectItem value={row.location_rack} key={key}>{row.location_rack}</SelectItem>
                                    ))
                                  }
                                  </SelectContent>
                                </Select>

                                <InputError message={errors.location_rack} className="mt-2" />
                            </div>

                            <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                                <Button disabled={processing}>Simpan</Button>
                            </div>

                        </form>
                    </div>
                </div>
                {
                    rowObat.isLoading ?
                    <div className="w-full mx-auto sm:px-6 lg:px-8 mt-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                            <p className="text-center text-lg">Loading...</p>
                        </div>
                    </div>
                    :
                    data.medicine_stock_opnames.length != 0 ? 
                    data.medicine_stock_opnames.map((row, key) => (    
                        <div className="w-full mx-auto sm:px-6 lg:px-8 mt-6" key={key}>
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                                <Table className="w-full border-collapse border border-slate-200">
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="border border-slate-200">No</TableHead>
                                      <TableHead className="border border-slate-200">Nama Obat</TableHead>
                                      <TableHead className="border border-slate-200">Satuan</TableHead>
                                      <TableHead className="border border-slate-200">Harga Hna</TableHead>
                                      <TableHead className="border border-slate-200">Stok Komputer</TableHead>
                                      <TableHead className="border border-slate-200">Stok Fisik</TableHead>
                                      <TableHead className="border border-slate-200">Stok Selisih</TableHead>
                                      <TableHead className="border border-slate-200">Nilai</TableHead>
                                      <TableHead className="border border-slate-200">Tanggal Exp</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {
                                        row.length != 0 ?
                                        row?.map((r, k) => (
                                            <TableRow key={k}>
                                                <TableCell className="border border-slate-200">
                                                    {k+1}
                                                </TableCell>
                                                <TableCell className="border border-slate-200">
                                                    {r?.medicine_name}
                                                </TableCell>
                                                <TableCell className="border border-slate-200">
                                                    {r?.unit_medicine}
                                                </TableCell>
                                                <TableCell className="border border-slate-200">
                                                    Rp. {formatRupiah(r?.price)}
                                                </TableCell>
                                                <TableCell className="border border-slate-200">
                                                    {r?.stock_computer}
                                                </TableCell>
                                                <TableCell className="border border-slate-200">
                                                    <Input 
                                                        type="number"
                                                        onKeyUp={(event) => stockDisplayAct(event, key, k)}
                                                        onChange={(event) => stockDisplayAct(event, key, k)}
                                                    />
                                                </TableCell>
                                                <TableCell className="border border-slate-200">
                                                    {r?.stock_deviation}
                                                </TableCell>
                                                <TableCell className="border border-slate-200">
                                                    Rp. {formatRupiah(r?.sub_value)}
                                                </TableCell>
                                                <TableCell className="border border-slate-200">
                                                    {r?.date_expired}
                                                </TableCell>
                                            </TableRow>
                                        )) : ''
                                    }
                                  </TableBody>
                                </Table>
                            </div>
                        </div>
                    )) : ''
                }
            </div>
        </AdministratorLayout>
    )
}