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

interface OrderMedicineForm {
    order:Array<{
        medicine_id: number,
        medicine_name: string,
        medicine_factory_name: string
        qty: number,
        price: number,
        stock_per_unit: number,
        unit_medicine: string,
        sub_total: number
    }>;
    medical_supplier_id:number|null;
    invoice_number:string;
    date_order:string;
    total_grand:number
}

type CreateFormProps = {
    medical_suppliers:MedicalSupplier[]
    invoice_number:string
}

export default function Create({auth, medical_suppliers, invoice_number}: PageProps & CreateFormProps) {

    const { data, setData, post, processing, errors, reset } = useForm<OrderMedicineForm>({
        order:[],
        medical_supplier_id:null,
        invoice_number,
        date_order:'',
        total_grand:0,
    });

    const [rowOrders, setRowOrders] = useState<Array<{
        medicine_id: number,
        medicine_name: string,
        medicine_factory_name: string
        qty: number,
        price: number,
        stock_per_unit: number,
        unit_medicine: string,
        sub_total: number
    }>>([])

    const [jualObat, setJualObat] = useState<any>([])

    const [dialogObat, setDialogObat] = useState<boolean>(false)

    const obatIdRef     = useRef<any>()
    const kodeObatRef   = useRef<any>()
    const namaObatRef   = useRef<any>()
    const pabrikObatRef = useRef<any>()
    const qtyRef        = useRef<any>()
    const isiObatRef    = useRef<any>()
    const jumlahRef     = useRef<any>()
    const satuanRef     = useRef<any>()
    const hnaRef        = useRef<any>()
    const btnInputRef   = useRef<any>()

    const selectMedicalSupplierAct = async(value: number): Promise<void> => {
        const requestData = await axios.get<any>(route('api.medical-suppliers.get-by-id', value))

        setData(data => ({
            ...data,
            medical_supplier_id:value
        }))
    }

    const obatAct = async(event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>): Promise<void> => {
        if((event as KeyboardEvent).keyCode === 13) {
            setDialogObat(true)
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

                setJualObat(medicines)
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

                obatIdRef.current.value     = data.medicine.id
                kodeObatRef.current.value   = data.medicine.code
                namaObatRef.current.value   = data.medicine.name
                pabrikObatRef.current.value = data.medicine.medicine_factory.name
                qtyRef.current.value        = 1
                hnaRef.current.value        = data.medicine.capital_price
                jumlahRef.current.value     = data.medicine.capital_price * 1
                satuanRef.current.value     = data.medicine.unit_medicine
                isiObatRef.current.value    = 1

                setJualObat([])
            } catch(error) {
                console.error(error)
            }
        }
    }

    const calculateJumlahAct = (): void => {
        const harga_hna = hnaRef.current.value
        const qty       = qtyRef.current.value
        const isi_obat  = isiObatRef.current.value

        let result = 0

        result = (qty * isi_obat) * harga_hna

        jumlahRef.current.value = result
    }

    const qtyAct = (event: KeyboardEvent<HTMLInputElement>): void => {
        calculateJumlahAct()

        if((event as KeyboardEvent).keyCode == 13) {
            isiObatRef.current.focus()
        }
    }

    const isiObatAct = (event: KeyboardEvent<HTMLInputElement>): void => {
        calculateJumlahAct()

        if((event as KeyboardEvent).keyCode == 13) {
            btnInputRef.current.focus()
        }
    }

    const inputActPemesanan = (): void => {

        const result = [{
            medicine_id: parseInt(obatIdRef.current.value),
            medicine_name: namaObatRef.current.value,
            medicine_factory_name: pabrikObatRef.current.value,
            unit_medicine: satuanRef.current.value,
            stock_per_unit: parseInt(isiObatRef.current.value),
            price: parseInt(hnaRef.current.value),
            qty: parseInt(qtyRef.current.value),
            sub_total: parseInt(jumlahRef.current.value),
        }]

        let order       = data.order
        let total_grand = data.total_grand + (parseInt(qtyRef.current.value) * parseInt(isiObatRef.current.value)) * parseInt(hnaRef.current.value)

        order = [...data.order, ...result]

        setRowOrders([
            ...rowOrders,
            ...result
        ])

        setData(data => ({
            ...data,
            order,
            total_grand
        }))

        obatIdRef.current.value     = ""
        kodeObatRef.current.value   = ""
        namaObatRef.current.value   = ""
        pabrikObatRef.current.value = ""
        qtyRef.current.value        = ""
        hnaRef.current.value        = ""
        jumlahRef.current.value     = ""
        satuanRef.current.value     = ""
        isiObatRef.current.value    = ""

        kodeObatRef.current.focus()
    }

    const rowOrderAct = (index: number): void => {
        const getRowOrder = rowOrders[index]

        const order       = data.order.filter((row, i) => (i != index))
        const total_grand = data.total_grand - getRowOrder.sub_total

        setData(data => ({
            ...data,
            total_grand
        }))

        setRowOrders(rowOrder => rowOrder.filter((r, i) => (i != index)))
    }

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('administrator.order-medicines.store'));
    }

    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="pembelian"
            routeChild="data-pemesanan"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Pemesanan Obat</h2>}
        >
            <Head title="Form Pemesanan Obat" />

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
                    jualObat.length == 0 ? 
                    <TableRow>
                        <TableCell colSpan={8} align="center">Obat Tidak Ada!</TableCell>
                    </TableRow>
                    :
                    jualObat.map((row: any, key: number) => (
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
                                <Link href={route('administrator.order-medicines')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                        <div className="grid grid-cols-1">
                            <div>
                                <InputLabel htmlFor="invoice_number" value="Kode Pemesanan" />

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
                                <InputLabel htmlFor="date_order" value="Tanggal Pemesanan" />

                                <Input
                                    id="date_order"
                                    type="date"
                                    name="date_order"
                                    value={data.date_order}
                                    className="mt-1 block w-full"
                                    autoComplete="date_order"
                                    onChange={(e) => setData('date_order', e.target.value)}
                                />

                                <InputError message={errors.date_order} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="medical_supplier_id" value="Supplier" />

                                <Select onValueChange={(value) => selectMedicalSupplierAct(parseInt(value))}>
                                  <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="=== Pilih Supplier ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  {
                                    medical_suppliers.map((row, key) => (
                                        <SelectItem value={row.id.toString()} key={key}>{row.name}</SelectItem>
                                    ))
                                  }
                                  </SelectContent>
                                </Select>

                                <InputError message={errors.medical_supplier_id} className="mt-2" />
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
                                        onKeyUp={obatAct}
                                        onChange={obatAct}
                                    />

                                    <Input type="hidden" ref={obatIdRef} />
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
                                    <InputLabel htmlFor="harga_hna" value="Harga HNA" />

                                    <Input 
                                        ref={hnaRef}
                                        id="harga_hna"
                                        type="number"
                                        name="harga_hna"
                                        className="mt-1 block w-full"
                                        autoComplete="harga_hna"
                                    />
                                </div>
                                <div className="w-4/12">
                                    <InputLabel htmlFor="jumlah" value="Jumlah" />

                                    <Input 
                                        ref={jumlahRef}
                                        id="jumlah"
                                        type="number"
                                        name="jumlah"
                                        className="mt-1 block w-full"
                                        autoComplete="jumlah"
                                    />
                                </div>
                            </div>
                            <div className="w-full flex space-x-4">
                                {/*<div className="w-4/12">
                                    <InputLabel htmlFor="qty" value="Qty BPBA" />

                                    <Input 
                                        id="qty"
                                        type="number"
                                        name="qty"
                                        className="mt-1 block w-full"
                                        autoComplete="qty"
                                        onKeyUp={() => console.log('sip')}
                                        onChange={() => console.log('sipS')}
                                    />
                                </div>*/}
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
                        </div>

                        <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                            <Button ref={btnInputRef} onClick={() => inputActPemesanan()}>Input</Button>
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
                                  <TableHead className="border-slate-200">Harga</TableHead>
                                  <TableHead className="border-slate-200">Jumlah</TableHead>
                                  <TableHead className="border-slate-200">#</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {
                                rowOrders.length == 0 ? 
                                <TableRow>
                                    <TableCell colSpan={8} align="center">Empty Data!</TableCell>
                                </TableRow> : 
                                rowOrders.map((row: any, key: number) => (
                                    <TableRow key={key}>
                                        <TableCell>{key+1}</TableCell>
                                        <TableCell>{row.medicine_name}</TableCell>
                                        <TableCell>{row.medicine_factory_name}</TableCell>
                                        <TableCell>{row.unit_medicine}</TableCell>
                                        <TableCell>{row.qty}</TableCell>
                                        <TableCell>Rp. {formatRupiah(row.price)}</TableCell>
                                        <TableCell>Rp. {formatRupiah(row.sub_total)}</TableCell>
                                        <TableCell><Button variant="destructive" onClick={() => rowOrderAct(key)}>X</Button></TableCell>
                                    </TableRow>
                                ))
                            }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className="border-slate-200" colSpan={7} align="right">Total :</TableCell>
                                    <TableCell className="border-slate-200">Rp. {formatRupiah(data.total_grand)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </div>
            </div>
        </AdministratorLayout>
    )
}