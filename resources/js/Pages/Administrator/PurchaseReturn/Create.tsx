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

interface PurchaseReturnForm {
    invoice_number:string
    date_return:string
    date_return_purchase:string
    medical_supplier_id:number|null
    data_returns:Array<{
        medicine_id:number,
        qty_purchase:number,
        qty_return:number,
        sub_total:number,
        sub_total_custom:number
    }>
    invoice_number_purchase:string
    total_return:number
}

type CreatePageProps = {
    invoice_number:string
}

export default function Create({auth, invoice_number, price_parameters}: PageProps & CreatePageProps) {

    const { data, setData, post, processing, errors, reset } = useForm<PurchaseReturnForm>({
        invoice_number,
        date_return: (new Date().toJSON().slice(0, 10)),
        medical_supplier_id:null,
        date_return_purchase: '',
        invoice_number_purchase: '',
        data_returns: [],
        total_return:0
    });

    const [invoiceNumberPurchases, setNumberInvoicePurchases] = useState<Array<{
        invoice_transaction:string,
        invoice_number:string
    }>>([])

    const [rowObat, setRowObat] = useState<Array<{
        medicine_id:number,
        medicine_name:string,
        price:number,
        qty_purchase:number,
        qty_return:number,
        sub_total:number,
        sub_total_custom:number
    }>>([])

    const [supplierName, setSupplierName] = useState<string>('')

    const qtyReturnRef      = useRef<any>()
    const subTotalRef       = useRef<any>()
    const subTotalCustomRef = useRef<any>()

    const datePurchaseAct = async(event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const dateValue = (event.target as HTMLInputElement).value

        setData('date_return_purchase', dateValue)

        const responseResult = await axios.get<{
            data:{
                results:Array<{
                    invoice_transaction:string,
                    invoice_number:string
                }>
            }
        }>(route('api.purchases.get-by-date', dateValue))

        setNumberInvoicePurchases(responseResult.data.data.results)
    }

    const selectNomorPembelianAct = async(value: string): Promise<void> => {
        setData('invoice_number_purchase', value)

        const responseResult = await axios.get<{
            data:{
                results:Array<{
                    medicine_id:number,
                    medicine_name:string,
                    price:number,
                    qty_purchase:number,
                    qty_return:number,
                    sub_total:number,
                    sub_total_custom:number
                }>,
                medical_supplier_id:number,
                medical_supplier_name:string
            }
        }>(route('api.purchases.get-by-invoice', value))

        const dataRow             = responseResult.data.data.results
        const medical_supplier_id = responseResult.data.data.medical_supplier_id

        console.log(dataRow)

        setRowObat(dataRow)

        setSupplierName(responseResult.data.data.medical_supplier_name ?? '')

        setData(data => ({
            ...data,
            data_returns:dataRow,
            medical_supplier_id
        }))
    }

    const qtyReturnAct = (event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement> , index: number): void => {
        const getRowObat     = rowObat[index]
        const getDataReturns = data.data_returns
        const qtyReturnValue = (event.target as HTMLInputElement).value == '' ? 0 : parseInt((event.target as HTMLInputElement).value)
        const sub_total      = getRowObat.price * qtyReturnValue

        rowObat[index].sub_total         = sub_total
        rowObat[index].qty_return        = qtyReturnValue
        getDataReturns[index].sub_total  = sub_total
        getDataReturns[index].qty_return = qtyReturnValue

        let total_return = 0

        const sumSubTotal = getDataReturns.map(data => total_return += data.sub_total)

        setData(data => ({
            ...data,
            data_returns:getDataReturns,
            total_return
        }))
    }

    const subTotalCustomAct = (event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>, index: number): void => {
        const getRowObat     = rowObat[index]
        const getDataReturns = data.data_returns
        const qtyReturnValue = getDataReturns[index].qty_return
        const sub_total      = getRowObat.price * qtyReturnValue

        console.log(qtyReturnValue)

        rowObat[index].sub_total         = 0
        getDataReturns[index].sub_total  = 0

        let total_return = 0

        getDataReturns.map(data => total_return += data.sub_total)

        setData(data => ({
            ...data,
            data_returns:getDataReturns,
            total_return
        }))

        rowObat[index].sub_total_custom        = parseInt((event.target as HTMLInputElement).value)
        rowObat[index].sub_total               = sub_total
        getDataReturns[index].sub_total_custom = parseInt((event.target as HTMLInputElement).value)
        getDataReturns[index].sub_total        = sub_total

        setData(data => ({
            ...data,
            data_returns:getDataReturns
        }))

        getDataReturns.map(data => total_return += data.sub_total_custom)

        setData(data => ({
            ...data,
            total_return
        }))
    }

    const deleteRowObatAct = (index: number): void => {
        const getSubTotal  = data.data_returns[index].sub_total_custom != 0 ? data.data_returns[index].sub_total_custom : data.data_returns[index].sub_total
        const total_return = data.total_return - getSubTotal

        setRowObat(rowObat => rowObat.filter((r, i) => (i != index)))
        const dataReturns = data.data_returns.filter((r, i) => (i != index))

        setData(data => ({
            ...data,
            data_returns:dataReturns,
            total_return
        }))
    }

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('administrator.purchase-returns.store'));
    }

    console.log(data)

    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="pembelian"
            routeChild="retur-pembelian"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Retur Pembelian</h2>}
        >
            <Head title="Form Retur Pembelian" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary" asChild>
                                <Link href={route('administrator.purchase-returns')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div>
                                <InputLabel htmlFor="invoice_number" value="Nomor Retur" />

                                <Input
                                    id="invoice_number"
                                    type="text"
                                    name="invoice_number"
                                    value={data.invoice_number}
                                    className="mt-1 block w-full bg-slate-200"
                                    autoComplete="invoice_number"
                                    onChange={(e) => setData('invoice_number', e.target.value)}
                                    readOnly
                                />

                                <InputError message={errors.invoice_number} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="date_return" value="Tanggal Retur" />

                                <Input
                                    id="date_return"
                                    type="date"
                                    name="date_return"
                                    value={data.date_return}
                                    className="mt-1 block w-full"
                                    autoComplete="date_return"
                                    onChange={(e) => setData('date_return', e.target.value)}
                                />

                                <InputError message={errors.date_return} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="date_return_purchase" value="Tanggal Retur Pembelian" />

                                <Input
                                    id="date_return_purchase"
                                    type="date"
                                    name="date_return_purchase"
                                    value={data.date_return_purchase}
                                    className="mt-1 block w-full"
                                    autoComplete="date_return_purchase"
                                    onChange={datePurchaseAct}
                                />

                                <InputError message={errors.date_return_purchase} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="invoice_number_purchase" value="Nomor Pembelian" />

                                <Select onValueChange={(value) => selectNomorPembelianAct(value)}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="=== Pilih Nomor Pembelian ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  {
                                    invoiceNumberPurchases.map((row, key) => (
                                        <SelectItem value={row.invoice_transaction} key={key}>{row.invoice_number}</SelectItem>
                                    ))
                                  }
                                  </SelectContent>
                                </Select>

                                <InputError message={errors.date_return_purchase} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="supplier" value="Supplier" />

                                <Input id="supplier" type="text" className="bg-slate-200" value={supplierName} readOnly />

                                <InputError message={errors.medical_supplier_id} className="mt-2" />
                            </div>

                            <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                                <Button disabled={processing}>Simpan</Button>
                            </div>

                        </form>
                    </div>
                </div>
                <div className="w-full mx-auto sm:px-6 lg:px-8 mt-6">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <Table className="w-full border-collapse border border-slate-200">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="border border-slate-200">No</TableHead>
                              <TableHead className="border border-slate-200">Nama Obat</TableHead>
                              <TableHead className="border border-slate-200">Stok Pembelian</TableHead>
                              <TableHead className="border border-slate-200">Stok Retur</TableHead>
                              <TableHead className="border border-slate-200">Harga Retur</TableHead>
                              <TableHead className="border border-slate-200">#</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {
                                rowObat.length == 0 ? 
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Empty Data!
                                    </TableCell>
                                </TableRow>
                                : rowObat.map((row, key) => (
                                    <TableRow key={key}>
                                        <TableCell className="border border-slate-200">
                                            {key+1}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.medicine_name}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            {row.qty_purchase}
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            <Input 
                                                ref={qtyReturnRef} 
                                                type="number" 
                                                min={0} 
                                                onKeyUp={(event) => qtyReturnAct(event, key)}
                                                onChange={(event) => qtyReturnAct(event, key)} 
                                            />
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            <div className="flex gap-4">
                                                <Input className="bg-slate-200" value={row.sub_total} readOnly />
                                                <Input 
                                                    ref={subTotalCustomRef} 
                                                    type="number" 
                                                    min={0} 
                                                    onKeyUp={(event) => subTotalCustomAct(event, key)} 
                                                    onChange={(event) => subTotalCustomAct(event, key)} 
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="border border-slate-200">
                                            <Button variant="destructive" onClick={() => deleteRowObatAct(key)}>X</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4} align="right">
                                    Total :
                                </TableCell>
                                <TableCell colSpan={4}>
                                    Rp. {formatRupiah(data.total_return)}
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