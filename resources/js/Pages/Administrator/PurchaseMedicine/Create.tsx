import { 
    useState, 
    useEffect, 
    useCallback,
    FormEventHandler, 
    useRef,
    KeyboardEvent,
    ChangeEvent
} from 'react'
import axios from 'axios'
import { useQuery, QueryFunctionContext } from "@tanstack/react-query";

import {default as ReactSelect} from 'react-select'
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
import { Combobox } from '@/Components/Combobox'
import { formatRupiah } from '@/lib/helper'

interface PurchaseMedicineForm {
    order:Array<{
        medicine_id: number,
        medicine_name: string,
        unit_medicine: string,
        qty: number,
        price: number,
        ppn: number,
        disc_1: number,
        disc_2: number,
        disc_3: number,
        ppn_type: string,
        sub_total: number
    }>;
    medical_supplier_id:number|null;
    invoice_number:string
    code:string;
    date_receive:string;
    debt_time:number|null;
    due_date:string;
    type:string;
    total_dpp:number
    total_ppn:number
    total_discount:number
    total_grand:number
}

type CreateFormProps = {
    medical_suppliers:MedicalSupplier[]
    medicines: Medicine[]
    kode_pembelian:string
}

export default function Create({auth, medical_suppliers, medicines, kode_pembelian}: PageProps & CreateFormProps) {

    const { data, setData, post, processing, errors, reset } = useForm<PurchaseMedicineForm>({
        order:[],
        medical_supplier_id:null,
        code:kode_pembelian,
        invoice_number:'',
        date_receive:'',
        debt_time:null,
        due_date:'',
        type:'',
        total_dpp:0,
        total_ppn:0,
        total_discount:0,
        total_grand:0,
    });

    const [rowOrders, setRowOrders] = useState<Array<{
        medicine_id: number,
        medicine_name: string,
        unit_medicine: string,
        qty: number,
        price: number,
        ppn: number,
        disc_1: number,
        disc_2: number,
        disc_3: number,
        ppn_type: string,
        sub_total: number
    }>>([])
    const [ppnType, setPpnType]   = useState<string>('')
    const [obat, setObat]         = useState<number>(0)
    const [namaObat, setNamaObat] = useState<string>('')
    const [selectedMedicalSupplier, setSelectedMedicalSupplier] = useState<string>(medical_suppliers[0].id.toString())
    
    const [listObat, setListObat] = useState<Array<{value:number,label:string}>>([])
    
    const [searchObat, setSearchObat] = useState<string|null>(null)
    
    const [pageNum, setPageNum] = useState<number>(0)

    const typeRef          = useRef<any>()
    const dateReceiveRef   = useRef<any>()
    const ppnTypeRef       = useRef<any>()
    const debtTimeRef      = useRef<any>()

    const invoiceNumberRef = useRef<any>()
    const hnaRef           = useRef<any>()
    const satuanRef        = useRef<any>()
    const jumlahRef        = useRef<any>()
    const diskonRef        = useRef<any>()
    const obatRef          = useRef<any>()
    const inputBeliRef     = useRef<any>()

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        if(ppnType != '') {
            post(route('administrator.purchase-medicines.store'));
        }
    }

    const selectMedicalSupplierAct = async(value: number): Promise<void> => {
        const requestData = await axios.get<{data:{
            medical_supplier:{
                abbreviation_name:string
            }
        }}>(route('api.medical-suppliers.get-by-id', value))

        const invoice_number = `${requestData.data.data.medical_supplier.abbreviation_name}-${kode_pembelian}`

        setData(data => ({
            ...data,
            medical_supplier_id:value,
            invoice_number
        }))
    }

    const debtTimeAct = (event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>): void => {

        setData(data => ({
            ...data,
            debt_time:parseInt((event.target as HTMLInputElement).value)
        }))

        let result = new Date(data.date_receive);
        result.setDate(result.getDate() + parseInt((event.target as HTMLInputElement).value));

        let month:number|string = result.getMonth()+1;
        month = `0${month}`.slice(-2);

        let date:number|string  = result.getDate();
        date = `0${date}`.slice(-2);

        let new_date = `${result.getFullYear()}-${month}-${date}`

        setData(data => ({
            ...data,
            due_date:new_date
        }))
    }
    
    const fetchListObat = async ({
      queryKey,
    }: QueryFunctionContext<[string, number, string|null]>): Promise<Array<{
      value:number,
      label:string
    }>> => {
      const [_, pageNum, searchObat] = queryKey;
      const response = await axios.get<{
          medicines: Medicine[];
          max_page: number;
        }>(route("api.medicines.get-all"), {
        params: {
          page_num: pageNum,
          medicine: searchObat,
          data_location:'gudang',
          limit: 20
        },
      });
      
      const listObatMap = response.data.medicines.map((map) => {
        return {
          value:map.id,
          label:`${map.name} - ${map.batch_number}`
        }
      })
      
      setListObat([...listObat, ...listObatMap])
      
      return response.data.medicines.map((map) => {
        return {
          value:map.id,
          label:`${map.name} - ${map.batch_number}`
        }
      });
    };
  
    const { isLoading, isError, data: dataQuery, error, refetch } = useQuery({
      queryKey: ["listObat", pageNum, searchObat],
      queryFn: fetchListObat,
    });
    
    const handleScrollBottom = useCallback(() => {
        // key.current += 1;
        //setKey(key + 1);
        setPageNum(pageNum => pageNum + 20)
    }, [pageNum]);

    const selectObatAct = async(value: number): Promise<void> => {
        setObat(value)

        const responseData = await axios.get<{medicine:{
                name:string,
                capital_price:string,
                unit_medicine:string
            }
        }>(route('api.medicines.get-by-id', value))

        hnaRef.current.value = responseData.data.medicine.capital_price
        satuanRef.current.value = responseData.data.medicine.unit_medicine

        setNamaObat(responseData.data.medicine.name)
    }

    const inputActPembelian = (): void => {

        const calculate        = parseInt(jumlahRef.current.value) * parseInt(hnaRef.current.value)
        const discount         = parseInt(diskonRef.current.value ?? 0)

        let calculate_discount = 0
        let ppn                = 0
        let sub_total          = 0
        let total_ppn          = 0 + data.total_ppn
        let total_dpp          = 0 + data.total_dpp
        let total_discount     = 0 + data.total_discount
        let total_grand        = 0 + data.total_grand

        ppn = ((calculate * 11) / 100)

        if(ppnType == 'include-ppn') {
            calculate_discount = ((calculate + ppn) * discount) / 100
            sub_total = calculate + ppn - calculate_discount
            total_dpp += calculate + ppn
            ppn = 0
        }
        else if(ppnType == 'exclude-ppn') {
            calculate_discount = ((calculate + ppn) * discount) / 100
            sub_total = calculate + ppn - calculate_discount
            total_dpp += calculate
            total_ppn += ppn
        }
        else {
            calculate_discount = (calculate * discount) / 100
            sub_total += calculate - calculate_discount
            total_dpp += calculate
        }

        total_discount += calculate_discount

        total_grand = ((total_dpp + total_ppn) - total_discount)

        let order = data.order

        const result = [{
            medicine_id: obat,
            medicine_name: namaObat,
            unit_medicine: satuanRef.current.value,
            qty: jumlahRef.current.value,
            price: hnaRef.current.value,
            ppn,
            disc_1: calculate_discount,
            disc_2: 0,
            disc_3: 0,
            ppn_type: ppnType,
            sub_total: sub_total
        }]

        order = [...data.order, ...result]

        setRowOrders([
            ...rowOrders,
            ...result
        ])

        setData(data => ({
            ...data,
            order,
            total_dpp,
            total_ppn,
            total_discount,
            total_grand
        }))

        setObat(0)
        jumlahRef.current.value = ''
        satuanRef.current.value = ''
        hnaRef.current.value    = ''
        diskonRef.current.value = ''
        obatRef.current.clearValue()
        obatRef.current.focus()
    }

    const rowOrderAct = (index: number): void => {
        const getRowOrder = rowOrders[index]

        let total_ppn = 0
        let total_dpp = 0

        if(getRowOrder.ppn_type == 'exclude-ppn') {
            total_ppn      = data.total_ppn - getRowOrder.ppn
            total_dpp      = data.total_dpp - (((getRowOrder.qty * getRowOrder.price) + getRowOrder.ppn) - getRowOrder.disc_1)
        }
        else {
            total_ppn      = data.total_ppn - 0
            total_dpp      = data.total_dpp - getRowOrder.sub_total - getRowOrder.disc_1
        }

        let total_discount = data.total_discount - (getRowOrder.disc_1)
        let total_grand    = data.total_grand
        const order        = data.order.filter((row, i) => (i != index))

        total_grand = ((total_dpp + total_ppn) - total_discount)

        setData(data => ({
            ...data,
            order,
            total_dpp,
            total_ppn,
            total_discount,
            total_grand
        }))

        setRowOrders(rowOrder => rowOrder.filter((r, i) => (i != index)))
    }

    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="pembelian"
            routeChild="data-pembelian-obat"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Pembelian Obat</h2>}
        >
            <Head title="Form Pembelian Obat" />

            <div className="py-12">
                <div className="w-full mx-auto sm:px-6 lg:px-8 flex space-x-4">
                    <div className="w-6/12 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary" asChild>
                                <Link href={route('administrator.purchase-medicines')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="grid grid-cols-1">
                                <div>
                                    <InputLabel htmlFor="code" value="Kode Pembelian" />

                                    <Input
                                        id="code"
                                        type="text"
                                        name="code"
                                        value={data.code}
                                        className="mt-1 block w-full bg-slate-200"
                                        autoComplete="code"
                                        onChange={(e) => setData('code', e.target.value)}
                                        readOnly
                                    />

                                    <InputError message={errors.code} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="medical_supplier_id" value="Supplier" />

                                    {/*<Select onValueChange={(value) => selectMedicalSupplierAct(parseInt(value))}>
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
                                    </Select>*/}
                                    <Combobox 
                                        // ref={}
                                        data={medical_suppliers} 
                                        placeholder="Supplier Obat" 
                                        nextRef={typeRef}
                                        onValueChange={selectMedicalSupplierAct}
                                    />

                                    <InputError message={errors.medical_supplier_id} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="invoice_number" value="Nomor Faktur" />

                                    <Input
                                        id="invoice_number"
                                        type="text"
                                        name="invoice_number"
                                        value={data.invoice_number}
                                        className="mt-1 block w-full"
                                        autoComplete="invoice_number"
                                        onChange={(e) => setData('invoice_number', e.target.value)}
                                    />

                                    <InputError message={errors.invoice_number} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="type" value="Jenis Beli" />

                                    <Select onValueChange={(value) => {
                                        if(value != 'tunai') {
                                            setData('type', value)
                                        }
                                        else {
                                            setData(data => ({
                                                ...data,
                                                type:value,
                                                debt_time:0
                                            }))
                                        }
                                    }}>
                                      <SelectTrigger ref={typeRef} className="w-full mt-1">
                                        <SelectValue placeholder="=== Pilih Jenis Beli ===" />
                                      </SelectTrigger>
                                      <SelectContent onCloseAutoFocus={(event) => {
                                        event.preventDefault()
                                        dateReceiveRef.current.focus()
                                      }}>
                                        <SelectItem value="tunai">Tunai</SelectItem>
                                        <SelectItem value="kredit">Kredit</SelectItem>
                                        <SelectItem value="konsinyasi">Konsinyasi</SelectItem>
                                      </SelectContent>
                                    </Select>

                                    <InputError message={errors.type} className="mt-2" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1">
                                <div>
                                    <InputLabel htmlFor="date_receive" value="Tanggal Terima" />

                                    <Input
                                        ref={dateReceiveRef}
                                        id="date_receive"
                                        type="date"
                                        name="date_receive"
                                        value={data.date_receive}
                                        className="mt-1 block w-full"
                                        autoComplete="date_receive"
                                        onChange={(e) => setData('date_receive', e.target.value)}
                                        onKeyPress={(event) => {
                                            if(event.key == 'Enter') {
                                                if(data.debt_time == 0) {
                                                    ppnTypeRef.current.focus()
                                                }
                                                else {
                                                    debtTimeRef.current.focus()
                                                }
                                            }
                                        }}
                                    />

                                    <InputError message={errors.date_receive} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="debt_time" value="Waktu Hutang" />

                                    <Input
                                        ref={debtTimeRef}
                                        id="debt_time"
                                        type="number"
                                        name="debt_time"
                                        value={data.debt_time ?? ''}
                                        className="mt-1 block w-full"
                                        autoComplete="debt_time"
                                        onKeyUp={debtTimeAct}
                                        onChange={debtTimeAct}
                                    />

                                    <InputError message={errors.debt_time} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="due_date" value="Tanggal Jatuh Tempo" />

                                    <Input
                                        id="due_date"
                                        type="date"
                                        name="due_date"
                                        value={data.due_date?.toString()}
                                        className="mt-1 block w-full bg-slate-200"
                                        autoComplete="due_date"
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        readOnly
                                    />

                                    <InputError message={errors.due_date} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="ppn_type" value="Jenis PPn" />

                                    <Select onValueChange={(value) => setPpnType(value)}>
                                      <SelectTrigger ref={ppnTypeRef} id="ppn_type" className="w-full mt-1">
                                        <SelectValue placeholder="=== Pilih Jenis Ppn ===" />
                                      </SelectTrigger>
                                      <SelectContent onCloseAutoFocus={(event) => {
                                        event.preventDefault()
                                        obatRef.current.focus()
                                      }}>
                                        <SelectItem value="include-ppn">Include PPn</SelectItem>
                                        <SelectItem value="exclude-ppn">Exclude PPn</SelectItem>
                                        <SelectItem value="no-ppn">Tanpa PPn</SelectItem>
                                      </SelectContent>
                                    </Select>

                                    {/*<InputError message={errors.ppn_type} className="mt-2" />*/}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                            <Button disabled={processing}>Simpan</Button>
                        </div>
                        </form>
                    </div>
                    <div className="w-6/12 h-1/2 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <Separator />
                        <div className="grid grid-cols-2 gap-5 mt-4">
                            <div className="grid grid-cols-1">
                                <div>
                                    <InputLabel htmlFor="medicines" value="Obat" />

                                    {/*<Select defaultValue={obat == 0 ? '' : obat.toString()} value={obat == 0 ? '' : obat.toString()} onValueChange={(value) => selectObatAct(parseInt(value))}>
                                      <SelectTrigger ref={obatRef} className="w-full mt-1">
                                        <SelectValue placeholder="=== Pilih Obat ===" />
                                      </SelectTrigger>
                                      <SelectContent>
                                      {
                                        medicines.map((row, key) => (
                                            <SelectItem value={row.id.toString()} key={key}>{row.name}</SelectItem>
                                        ))
                                      }
                                      </SelectContent>
                                    </Select>*/}

                                    {/* <Combobox
                                        data={medicines}
                                        placeholder="Obat"
                                        nextRef={jumlahRef}
                                        onValueChange={selectObatAct}
                                        defaultValue={obat == 0 ? '' : obat.toString()}
                                        ref={obatRef}
                                    /> */}
                                    
                                    <ReactSelect 
                                        ref={obatRef}
                                        className="basic-single text-sm" 
                                        classNamePrefix="select" 
                                        options={listObat}
                                        name="list-obat"
                                        onMenuScrollToBottom={handleScrollBottom}
                                        onChange={(event) => {
                                          if(event != null) {  
                                            selectObatAct(event.value)
                                          }
                                          jumlahRef.current.focus()
                                        }}
                                        onInputChange={(event) => {
                                          setSearchObat(event)
                                        }}
                                    />
                                    <InputError message={errors.order} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="qty" value="Jumlah" />

                                    <Input
                                        ref={jumlahRef}
                                        id="qty"
                                        type="text"
                                        name="qty"
                                        // value={data.qty}
                                        className="mt-1 block w-full"
                                        autoComplete="qty"
                                        // onChange={(e) => setData('qty', e.target.value)}
                                        onKeyPress={(event) => {
                                            if(event.key == 'Enter') {
                                                diskonRef.current.focus()
                                            }
                                        }}
                                    />

                                    {/*<InputError message={errors.qty} className="mt-2" />*/}
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="unit_medicine" value="Satuan" />

                                    <Input
                                        ref={satuanRef}
                                        id="unit_medicine"
                                        type="text"
                                        name="unit_medicine"
                                        // value={data.unit_medicine}
                                        className="mt-1 block w-full bg-slate-200"
                                        autoComplete="unit_medicine"
                                        readOnly
                                        // onChange={(e) => setData('unit_medicine', e.target.value)}
                                    />

                                    {/*<InputError message={errors.unit_medicine} className="mt-2" />*/}
                                </div>
                            </div>
                            <div className="grid grid-cols-1">
                                <div className="w-full h-[0.1rem]">
                                    <InputLabel htmlFor="hna" value="Hna" />

                                    <Input
                                        ref={hnaRef}
                                        id="hna"
                                        type="number"
                                        name="hna"
                                        // value={data.hna}
                                        className="mt-1 block w-full"
                                        autoComplete="hna"
                                        // onChange={(e) => setData('hna', e.target.value)}
                                    />

                                    {/*<InputError message={errors.hna} className="mt-2" />*/}
                                </div>

                                <div>
                                    <InputLabel htmlFor="disc" value="Diskon" />
                                    <div className="flex">
                                        <Input
                                            ref={diskonRef}
                                            id="disc"
                                            type="number"
                                            name="disc"
                                            // value={data.disc}
                                            className="mt-1 block w-full"
                                            autoComplete="disc"
                                            // onChange={(e) => setData('disc', e.target.value)}
                                            onKeyPress={(event) => {
                                                if(event.key === 'Enter') {
                                                    inputBeliRef.current.focus()
                                                }
                                            }}
                                        />
                                        <Button variant="ghost" className="mt-1" type="button" disabled>%</Button>
                                    </div>
                                    {/*<InputError message={errors.disc} className="mt-2" />*/}
                                </div>

                            </div>
                        </div>

                        <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                            <Button ref={inputBeliRef} onClick={() => inputActPembelian()}>Input</Button>
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
                                  <TableHead className="border-slate-200">Jumlah</TableHead>
                                  <TableHead className="border-slate-200">Harga</TableHead>
                                  <TableHead className="border-slate-200">Disc</TableHead>
                                  <TableHead className="border-slate-200">Total</TableHead>
                                  <TableHead className="border-slate-200" colSpan={2}>#</TableHead>
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
                                        <TableCell>{row.qty}</TableCell>
                                        <TableCell>Rp. {formatRupiah(row.price)}</TableCell>
                                        <TableCell>Rp. {formatRupiah(row.disc_1)}</TableCell>
                                        <TableCell>Rp. {formatRupiah(row.sub_total)}</TableCell>
                                        <TableCell colSpan={2}><Button variant="destructive" onClick={() => rowOrderAct(key)}>X</Button></TableCell>
                                    </TableRow>
                                ))
                            }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className="border-slate-200">DPP :</TableCell>
                                    <TableCell className="border-slate-200">Rp. {formatRupiah(data.total_dpp)}</TableCell>
                                    <TableCell className="border-slate-200">PPn :</TableCell>
                                    <TableCell className="border-slate-200">Rp. {formatRupiah(data.total_ppn)}</TableCell>
                                    <TableCell className="border-slate-200">Diskon :</TableCell>
                                    <TableCell className="border-slate-200">Rp. {formatRupiah(data.total_discount)}</TableCell>
                                    <TableCell className="border-slate-200">Total Semua :</TableCell>
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