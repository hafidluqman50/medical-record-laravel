import { 
    useState, 
    useEffect, 
    FormEventHandler, 
    useRef,
    KeyboardEvent,
    ChangeEvent
} from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Input } from '@/Components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types'
import { MedicalSupplier } from '@/Pages/Administrator/MedicalSupplier/type'
import { Medicine } from '@/Pages/Administrator/Medicine/type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
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
import { Separator } from '@/Components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog"
import { formatRupiah } from '@/lib/helper'

interface DistributionMedicineForm {
    order:Array<{
        medicine_name: string,
        medicine_factory_name: string
        qty: number,
        stock_per_unit: number,
        unit_medicine: string,
        data_location: string
    }>;
    invoice_number:string;
    date_distribution:string;
}

type CreateFormProps = {
    invoice_number:string
}

export default function Create({auth, invoice_number}: PageProps & CreateFormProps) {

    const { data, setData, post, processing, errors, reset } = useForm<DistributionMedicineForm>({
        order:[],
        invoice_number,
        date_distribution:'',
    });

    const [rowOrders, setRowOrders] = useState<Array<{
        medicine_name: string,
        medicine_factory_name: string
        qty: number,
        stock_per_unit: number,
        unit_medicine: string,
        data_location: string
    }>>([])

    const [jualObat, setJualObat] = useState<any>({
        isLoading:false,
        data:[]
    })

    const [dialogObat, setDialogObat] = useState<boolean>(false)

    const [dataLocation, setDataLocation] = useState<string>('')

    const obatIdRef        = useRef<any>()
    const kodeObatRef      = useRef<any>()
    const medicineBatchRef = useRef<any>()
    const namaObatRef      = useRef<any>()
    const pabrikObatRef    = useRef<any>()
    const qtyRef           = useRef<any>()
    const isiObatRef       = useRef<any>()
    const satuanRef        = useRef<any>()
    const dataLocationRef  = useRef<any>()
    const btnInputRef      = useRef<any>()

    const obatAct = async(event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>): Promise<void> => {
        if((event as KeyboardEvent).key === 'Enter') {
            setDialogObat(true)

            setJualObat((jualObat: any) => ({
                ...jualObat,
                isLoading:true
            }))

            try {
                const { data } = await axios.get(
                    route('api.medicines.get-all'),
                    {
                        params:{
                            medicine:(event.target as HTMLInputElement).value
                        }
                    }
                )

                const medicines = data.medicines

                setJualObat((jualObat: any) => ({
                    ...jualObat,
                    isLoading:false,
                    data:medicines
                }))
            } catch(error) {
                console.error(error)
            }
        }
    }

    const selectObatAct = async(event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>): Promise<void> => {
        if((event as KeyboardEvent).keyCode == 13) {
            try {
                const { data } = await axios.get(route('api.medicines.get-by-id', (event.target as HTMLInputElement).value))
                
                setDialogObat(false)

                obatIdRef.current.value        = data.medicine.id
                kodeObatRef.current.value      = data.medicine.code
                namaObatRef.current.value      = data.medicine.name
                medicineBatchRef.current.value = data.medicine.batch_number
                pabrikObatRef.current.value    = data.medicine.medicine_factory.name
                qtyRef.current.value           = 1
                satuanRef.current.value        = data.medicine.unit_medicine
                isiObatRef.current.value       = 1

                setJualObat((jualObat: any) => ({
                    ...jualObat,
                    data:[]
                }))
            } catch(error) {
                console.error(error)
            }
        }
    }

    const qtyAct = (event: KeyboardEvent<HTMLInputElement>): void => {
        if((event as KeyboardEvent).keyCode == 13) {
            isiObatRef.current.focus()
        }
    }

    const isiObatAct = (event: KeyboardEvent<HTMLInputElement>): void => {
        if((event as KeyboardEvent).keyCode == 13) {
            dataLocationRef.current.focus()
        }
    }

    const inputActDistribusi = (): void => {

        const result = [{
            medicine_id: obatIdRef.current.value,
            medicine_name: namaObatRef.current.value,
            medicine_batch_number: medicineBatchRef.current.value,
            medicine_factory_name: pabrikObatRef.current.value,
            unit_medicine: satuanRef.current.value,
            stock_per_unit: parseInt(isiObatRef.current.value),
            qty: parseInt(qtyRef.current.value),
            data_location: dataLocation
        }]

        let order       = data.order

        order = [...data.order, ...result]

        setRowOrders([
            ...rowOrders,
            ...result
        ])

        setData(data => ({
            ...data,
            order
        }))

        obatIdRef.current.value        = ""
        kodeObatRef.current.value      = ""
        namaObatRef.current.value      = ""
        medicineBatchRef.current.value = ""
        pabrikObatRef.current.value    = ""
        qtyRef.current.value           = ""
        satuanRef.current.value        = ""
        isiObatRef.current.value       = ""

        setDataLocation('')

        kodeObatRef.current.focus()
    }

    const rowOrderAct = (index: number): void => {
        const getRowOrder = rowOrders[index]
        const order       = data.order.filter((row, i) => (i != index))

        setData(data => ({
            ...data,
            order
        }))

        setRowOrders(rowOrder => rowOrder.filter((r, i) => (i != index)))
    }

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('administrator.distribution-medicines.store'));
    }

    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="pembelian"
            routeChild="data-distribusi-obat"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Distribusi Obat</h2>}
        >
            <Head title="Form Distribusi Obat" />

            <Dialog open={dialogObat} onOpenChange={setDialogObat}>
              <DialogContent onCloseAutoFocus={(event) => {
                    if(kodeObatRef.current.value != "") {
                        qtyRef.current.focus()
                    }
                }} className="max-w-5xl">
                <DialogHeader>
                  <DialogTitle>List Obat</DialogTitle>
                </DialogHeader>
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
                {
                    jualObat.isLoading ?
                    <TableRow>
                        <TableCell colSpan={8} align="center">Loading...</TableCell>
                    </TableRow>
                    :
                    jualObat.data.length == 0 ? 
                    <TableRow>
                        <TableCell colSpan={8} align="center">Obat Tidak Ada!</TableCell>
                    </TableRow>
                    :
                    jualObat.data.map((row: any, key: number) => (
                        <TableRow key={key}>
                            <TableCell className="border border-slate-100">
                            {
                                key == 0 ?
                                <input type="radio" name="select_obat" value={row.id} onKeyUp={selectObatAct} autoFocus/>
                                : <input type="radio" name="select_obat" value={row.id} onKeyUp={selectObatAct} />
                            }
                            </TableCell>
                            <TableCell className="border border-slate-100">{key+1}</TableCell>
                            <TableCell className="border border-slate-100">{row.name}</TableCell>
                            <TableCell className="border border-slate-100">{row.medicine_factory.name}</TableCell>
                            <TableCell className="border border-slate-100">{row.pack_medicine}</TableCell>
                            <TableCell className="border border-slate-100">{row.capital_price_vat}</TableCell>
                            <TableCell className="border border-slate-100">{row.sell_price}</TableCell>
                            <TableCell className="border border-slate-100">{row.stock}</TableCell>
                        </TableRow>
                    ))
                }
                </TableBody>
              </Table>
              </DialogContent>
            </Dialog>

            <div className="py-12">
                <div className="w-full mx-auto sm:px-6 lg:px-8 flex space-x-4">
                    <div className="w-4/12 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary" asChild>
                                <Link href={route('administrator.distribution-medicines')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                        <div className="grid grid-cols-1">
                            <div>
                                <InputLabel htmlFor="invoice_number" value="Kode Distribusi" />

                                <Input
                                    id="invoice_number"
                                    type="text"
                                    name="invoice_number"
                                    value={data.invoice_number}
                                    className="mt-1 block w-full bg-slate-200"
                                    autoComplete="invoice_number"
                                    readOnly
                                />

                                <InputError message={errors.invoice_number} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="date_distribution" value="Tanggal Distribusi" />

                                <Input
                                    id="date_distribution"
                                    type="date"
                                    name="date_distribution"
                                    value={data.date_distribution}
                                    className="mt-1 block w-full"
                                    autoComplete="date_distribution"
                                    autoFocus
                                    onChange={(e) => setData('date_distribution', e.target.value)}
                                    onKeyPress={(event) => {
                                        if(event.key === 'Enter') {
                                            kodeObatRef.current.focus()
                                        }
                                    }}
                                />

                                <InputError message={errors.date_distribution} className="mt-2" />
                            </div>
                        </div>
                        <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                            <Button disabled={processing}>Simpan</Button>
                        </div>
                        </form>
                    </div>
                    <div className="w-8/12 h-1/2 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <Separator />
                        <div className="flex-wrap space-y-4 mt-4">
                            <div className="w-full flex space-x-4 space-y-4">
                                <div className="w-4/12">
                                    <InputLabel htmlFor="medicine_id" value="Nama Obat" />

                                    <Input 
                                        ref={kodeObatRef}
                                        id="medicine_id"
                                        type="text"
                                        name="medicine_id"
                                        className="mt-1 block w-full"
                                        autoComplete="medicine_id"
                                        onKeyPress={obatAct}
                                        onChange={obatAct}
                                    />
                                    
                                    <Input type="hidden" ref={obatIdRef} />
                                    <Input type="hidden" ref={medicineBatchRef} />
                                    <Input type="hidden" ref={pabrikObatRef} />

                                    {/*<InputError message={errors.medicine_id} className="mt-2" />*/}
                                </div>
                                <div className="w-8/12">
                                    <Input 
                                        ref={namaObatRef}
                                        id="medicine_id"
                                        type="text"
                                        name="medicine_id"
                                        className="mt-2 block w-full"
                                        autoComplete="medicine_id"
                                        onKeyUp={() => console.log('sip')}
                                        onChange={() => console.log('sipS')}
                                    />

                                    {/*<InputError message={errors.medicine_id} className="mt-2" />*/}
                                </div>
                            </div>
                            <div className="w-full flex space-x-4">
                                <div className="w-4/12">
                                    <InputLabel htmlFor="qty" value="Qty BPBA" />

                                    <Input 
                                        ref={qtyRef}
                                        id="qty"
                                        type="number"
                                        name="qty"
                                        className="mt-1 block w-full"
                                        autoComplete="qty"
                                        onKeyUp={qtyAct}
                                    />
                                </div>
                                <div className="w-4/12">
                                    <InputLabel htmlFor="isi_obat" value="Isi Obat" />

                                    <Input 
                                        ref={isiObatRef}
                                        id="isi_obat"
                                        type="number"
                                        name="isi_obat"
                                        className="mt-1 block w-full"
                                        autoComplete="isi_obat"
                                        onKeyUp={isiObatAct}
                                    />
                                </div>
                                <div className="w-4/12">
                                    <InputLabel htmlFor="satuan" value="Satuan" />

                                    <Input 
                                        ref={satuanRef}
                                        id="satuan"
                                        type="text"
                                        name="satuan"
                                        className="mt-1 block w-full"
                                        autoComplete="satuan"
                                    />
                                </div>
                            </div>
                            <div className="w-full flex space-x-4">
                                <div className="w-4/12">
                                    <InputLabel htmlFor="data_location" value="Lokasi Distribusi" />

                                    <Select defaultValue={dataLocation} value={dataLocation} onValueChange={(value) => setDataLocation(value)}>
                                      <SelectTrigger ref={dataLocationRef} className="w-full">
                                        <SelectValue placeholder="=== Pilih Lokasi Distribusi ===" />
                                      </SelectTrigger>
                                      <SelectContent onCloseAutoFocus={(event) => {
                                        event.preventDefault()
                                        btnInputRef.current.focus()
                                      }}>
                                        <SelectItem value="kasir">Kasir</SelectItem>
                                      </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                            <Button ref={btnInputRef} onClick={() => inputActDistribusi()}>Input</Button>
                        </div>
                    </div>
                </div>
                <div className="w-full mx-auto sm:px-6 lg:px-8 mt-4">
                    <div className="w-full bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <Table className="border-collapse border border-slate-200">
                            <TableHeader>
                                <TableRow>
                                  <TableHead className="border-slate-200">No</TableHead>
                                  <TableHead className="border-slate-200">Nama Obat</TableHead>
                                  <TableHead className="border-slate-200">Pabrik</TableHead>
                                  <TableHead className="border-slate-200">Satuan</TableHead>
                                  <TableHead className="border-slate-200">Qty</TableHead>
                                  <TableHead className="border-slate-200">Lokasi Distribusi</TableHead>
                                  <TableHead className="border-slate-200">#</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {
                                rowOrders.length == 0 ? 
                                <TableRow>
                                    <TableCell colSpan={7} align="center">Empty Data!</TableCell>
                                </TableRow> : 
                                rowOrders.map((row: any, key: number) => (
                                    <TableRow key={key}>
                                        <TableCell>{key+1}</TableCell>
                                        <TableCell>{row.medicine_name}</TableCell>
                                        <TableCell>{row.medicine_factory_name}</TableCell>
                                        <TableCell>{row.unit_medicine}</TableCell>
                                        <TableCell>{row.qty}</TableCell>
                                        <TableCell>{row.data_location}</TableCell>
                                        <TableCell><Button variant="destructive" onClick={() => rowOrderAct(key)}>X</Button></TableCell>
                                    </TableRow>
                                ))
                            }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AdministratorLayout>
    )
}