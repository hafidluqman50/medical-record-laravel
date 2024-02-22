import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button'
import axios from 'axios'
import TransactionLayout from '@/Layouts/TransactionLayout'
import { Label } from '@/Components/ui/label'

import { Separator } from '@/Components/ui/separator'

import { 
    useEffect, 
    useState, 
    KeyboardEvent, 
    MouseEvent,
    useRef, 
    Ref,
    ChangeEvent,
    FormEventHandler
} from 'react'

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"

import { DataTable } from "@/Components/DataTable"

import {
    type TransactionUpdsPageProps,
    RowObat
} from './typeProps'

import {
    columns,
    columnLists
} from './columnDatatable'

import { useToast } from '@/Components/ui/use-toast'

export default function TransactionHv({kode_transaksi, price_parameter, medicine_price_parameters}: TransactionUpdsPageProps) {

    const { toast } = useToast();

    const medicine_id: string[] = []
    const price: number[]       = []
    const qty: number[]         = []
    const sub_total: number[]   = []
    const disc: number[]        = []
    const total: number[]       = []

    const { data, setData, post, processing, errors, reset } = useForm({
        medicine_id,
        price,
        qty,
        sub_total,
        disc,
        total,
        sub_total_grand:0,
        total_grand:0,
        diskon_grand:0,
        diskon_bayar:0,
        bayar:0,
        kembalian:0,
        kode_transaksi,
        jenis_pembayaran:'tunai'
    });

    const [open, setOpen]                             = useState<boolean>(false)
    const [cekHargaObatDialog, setCekHargaObatDialog] = useState<boolean>(false)
    const [bayarDialog, setBayarDialog]               = useState<boolean>(false)
    const [diskon, setDiskon]                         = useState<number>(0)
    const [subTotal, setSubTotal]                     = useState<number>(0)
    const [isHjaNet, setIsHjaNet]                     = useState<boolean>(false)
    const [priceMedicine, setPriceMedicine]           = useState<number>(0)
    const [indexRowObat, setIndexRowObat]             = useState<number | null>(null)

    const [rowObat, setRowObat]   = useState<RowObat[]>([])
    const [jualObat, setJualObat] = useState<any>([])

    const obatId         = useRef<any>()
    const kodeObat       = useRef<any>()
    const namaObat       = useRef<any>()
    const hargaObat      = useRef<any>()
    const satuanObat     = useRef<any>()
    const jumlahHarga    = useRef<any>()
    const qtyObat        = useRef<any>()
    const diskonObat     = useRef<any>()
    const bayarTransaksi = useRef<any>()
    const submitBayarRef = useRef<any>()

    const openEnterDialog = async(
        event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        if((event as KeyboardEvent).keyCode === 13) {
            setOpen(true)
            try {
                const { data } = await axios.get(
                    route('api.medicines.get-all'),
                    {
                        params:{
                            medicine:(event.target as HTMLInputElement).value,
                            data_location:'kasir'
                        }
                    }
                )

                const medicines = data.medicines

                setJualObat(medicines)
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
    }

    const selectObatAct = async(
        event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        if((event as KeyboardEvent).keyCode == 13) {
            try {
                const { data } = await axios.get(route('api.medicines.get-by-id', (event.target as HTMLInputElement).value))
                setOpen(false)
                setIsHjaNet(data.medicine.is_hja_net)
                setPriceMedicine(data.medicine.price)

                obatId.current.value     = data.medicine.id
                kodeObat.current.value   = data.medicine.code
                namaObat.current.value   = data.medicine.name
                hargaObat.current.value  = data.medicine.price
                satuanObat.current.value = data.medicine.unit_medicine
                qtyObat.current.value    = ""

                setJualObat([])
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
    }
    
    const batalAct = (): void => {
        setRowObat([])
        setIsHjaNet(false)
        setPriceMedicine(0)
        setJualObat([])
        reset()
    }

    const qtyJualAct = (
        event: KeyboardEvent<HTMLInputElement>
    ): void => {
        
        const keyEvent = (event as KeyboardEvent)

        let jumlah: number = 0
        if(qtyObat.current.value == "") {
            jumlah = 0
        }
        else {
            if(isHjaNet) {
                jumlah = parseInt(qtyObat.current.value) * parseInt(hargaObat.current.value)
            } else {
                jumlah = Math.round(
                        (parseInt(qtyObat.current.value) * parseInt(hargaObat.current.value) * price_parameter.upds) / price_parameter.pembulatan
                    ) * price_parameter.pembulatan
            }
        }

        jumlahHarga.current.value = jumlah

        if(keyEvent.keyCode == 13) {
            diskonObat.current.focus()
            diskonObat.current.value = ""
        }
    }

    const diskonObatAct = (
        event: KeyboardEvent<HTMLInputElement>
    ): void => {

        const keyEvent = (event as KeyboardEvent)

        let jumlah: number    = 0
        let diskon: number    = 0
        let calculate: number = Math.round(
                        (parseInt(qtyObat.current.value) * parseInt(hargaObat.current.value) * price_parameter.upds) / price_parameter.pembulatan
                    ) * price_parameter.pembulatan

        if(diskonObat.current.value == "") {
            jumlah = 0
        }
        else {
            if(diskonObat.current.value.includes('%')) {
                diskon = Math.round(((calculate * parseInt(diskonObat.current.value)) / 100) / price_parameter.pembulatan) * price_parameter.pembulatan
                jumlah = Math.round((calculate - diskon) / price_parameter.pembulatan) * price_parameter.pembulatan
            }
            else {
                diskon = parseInt(diskonObat.current.value)
                jumlah = Math.round((calculate - diskon) / price_parameter.pembulatan) * price_parameter.pembulatan
            }
        }

        setSubTotal(calculate)

        setDiskon(diskon)

        jumlahHarga.current.value = jumlah 

        if(keyEvent.keyCode == 13) {

            let medicineIdData    = data.medicine_id
            let qtyData           = data.qty
            let priceData         = data.price
            let subTotalData      = data.sub_total
            let discData          = data.disc
            let totalData         = data.total
            let subTotalGrandData = data.sub_total_grand + subTotal
            let totalGrandData    = data.total_grand + parseInt(jumlahHarga.current.value)
            let diskonGrandData   = data.diskon_grand + diskon

            if(indexRowObat != null) {
                qtyData[indexRowObat] = qtyObat.current.value
                
                priceData[indexRowObat] = hargaObat.current.value
                
                subTotalData[indexRowObat] = subTotal
                
                discData[indexRowObat] =  diskon

                totalData[indexRowObat] = jumlahHarga.current.value

                const result = rowObat

                result[indexRowObat].qty = qtyData[indexRowObat]
                result[indexRowObat].sell_price = priceData[indexRowObat]
                result[indexRowObat].sub_total = subTotalData[indexRowObat]
                result[indexRowObat].disc = discData[indexRowObat]
                result[indexRowObat].total = totalData[indexRowObat]

                setRowObat(result)
                setIndexRowObat(null)

            } else {

                const result = [{
                    code: kodeObat.current.value,
                    name: namaObat.current.value,
                    unit_medicine: satuanObat.current.value,
                    sell_price: hargaObat.current.value,
                    qty: qtyObat.current.value,
                    sub_total: subTotal,
                    disc: diskon,
                    total: jumlahHarga.current.value
                }]
                setRowObat([
                    ...rowObat,
                    ...result
                ])

                medicineIdData = [...data.medicine_id, obatId.current.value]
                
                qtyData = [...data.qty, qtyObat.current.value]
                
                priceData = [...data.price, hargaObat.current.value]
                
                subTotalData = [...data.sub_total, subTotal]
                
                discData = [...data.disc, diskon]

                totalData = [...data.total, jumlahHarga.current.value]
            }


            setData(data => ({
                ...data,
                medicine_id:medicineIdData,
                qty:qtyData,
                price:priceData,
                sub_total:subTotalData,
                disc:discData,
                total:totalData,
                sub_total_grand:subTotalGrandData,
                total_grand:totalGrandData,
                diskon_grand:diskonGrandData
            }))

            kodeObat.current.value = ""
            namaObat.current.value = ""
            satuanObat.current.value = ""
            hargaObat.current.value = ""
            diskonObat.current.value = ""
            qtyObat.current.value = ""
            jumlahHarga.current.value = ""
            setSubTotal(0)
            setDiskon(0)

            kodeObat.current.focus()
        }
    }

    const rowObatAct = (
        event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
    ): void => {
        event.preventDefault()

        const keyEvent = (event as KeyboardEvent)

        const targetValue = parseInt((event.target as HTMLInputElement).value)

        if(keyEvent.keyCode == 118) {
            setRowObat(row => row.filter((r, i) => (i != targetValue)))

            const medicineIdData    = data.medicine_id.filter((row, i) => (i != targetValue))
            const qtyData           = data.qty.filter((row, i) => (i != targetValue))
            const priceData         = data.price.filter((row, i) => (i != targetValue))
            const subTotalData      = data.sub_total.filter((row, i) => (i != targetValue))
            const discData          = data.disc.filter((row, i) => (i != targetValue))
            const totalData         = data.total.filter((row, i) => (i != targetValue))
            const subTotalGrandData = data.sub_total_grand - data.sub_total[targetValue]
            const totalGrandData    = data.total_grand - data.total[targetValue]
            const diskonGrandData   = data.diskon_grand - data.disc[targetValue]

            setData(data => ({...data,
                medicine_id:medicineIdData,
                qty:qtyData,
                price:priceData,
                sub_total:subTotalData,
                disc:discData,
                total:totalData,
                sub_total_grand:subTotalGrandData,
                total_grand:totalGrandData,
                diskon_grand:diskonGrandData
            }))
        }
    }

    const dblClickAct = (
        event: MouseEvent<HTMLTableRowElement>,
        index: number
    ): void => {
        
        const keyEvent = (event as MouseEvent)
        
        let getRowObat        = rowObat
        let qtyData           = data.qty
        let priceData         = data.price
        let subTotalData      = data.sub_total
        let discData          = data.disc
        let totalData         = data.total

        if(keyEvent.detail == 2) {
            setIndexRowObat(index)
            kodeObat.current.value    = getRowObat[index].code
            namaObat.current.value    = getRowObat[index].name
            satuanObat.current.value  = getRowObat[index].unit_medicine
            hargaObat.current.value   = getRowObat[index].sell_price
            diskonObat.current.value  = getRowObat[index].disc
            qtyObat.current.value     = getRowObat[index].qty
            jumlahHarga.current.value = getRowObat[index].total

            setSubTotal(getRowObat[index].sub_total)

            setDiskon(getRowObat[index].disc)

            const subTotalGrandData = data.sub_total_grand - getRowObat[index].sub_total
            const diskonGrandData   = data.diskon_grand - getRowObat[index].disc
            const totalGrandData    = data.total_grand - getRowObat[index].total

            setData(data => ({
                ...data,
                sub_total_grand:subTotalGrandData,
                diskon_grand:diskonGrandData,
                total_grand:totalGrandData
            }))

            getRowObat[index].qty = 0
            getRowObat[index].sub_total = 0
            getRowObat[index].disc = 0
            getRowObat[index].total = 0

            setRowObat(getRowObat)
        }
    }

    const calculateBayar = (
        event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
    ): void => {
        event.preventDefault()

        const keyEvent = (event as KeyboardEvent)

        const targetValue = (event.target as HTMLInputElement).value

        setData(data => ({...data, bayar:parseInt(targetValue)}))
        const total_grand = data.total_grand

        let calculate = total_grand - parseInt(targetValue)

        setData(data => ({...data, kembalian:calculate}))

        if(keyEvent.keyCode == 13) {

            post(route('administrator.transaction-upds.store'))
            submitBayarRef.current.focus()

        }
    }

    const calculateDiskon = (
        event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
    ): void => {
        event.preventDefault()

        const keyEvent = (event as KeyboardEvent)

        const targetValue = (event.target as HTMLInputElement).value

        if(keyEvent.keyCode == 13)
        {
            const total_grand = data.total_grand

            let calculate = 0

            let discount = 0

            if(targetValue.includes('%')) {
                discount = ((total_grand * parseInt(targetValue)) / 100)
                calculate = Math.round(total_grand - discount / price_parameter.pembulatan) * price_parameter.pembulatan
            } else {
                discount = parseInt(targetValue)
                calculate = Math.round((total_grand - discount) / price_parameter.pembulatan) * price_parameter.pembulatan
            }

            setData(data => ({...data, diskon_bayar:discount}))

            setData(data => ({...data, total_grand:calculate}))

            bayarTransaksi.current.focus()
        }
    }

    const submitTransaction = (): void => {
        console.log('test')
    }

    const onKeyDownAct = (event: any): void => {
        if(event.ctrlKey && event.altKey && event.keyCode == 80) {
            window.open(
                route('administrator.dashboard'),
                '_blank'
            )
        }
        else if(event.keyCode == 114) {
            window.open(
                route('administrator.transaction-hv'),
                '_blank'
            )
        }
        else if(event.keyCode == 118) {
            event.preventDefault()

            setRowObat([])
            setIsHjaNet(false)
            setPriceMedicine(0)
            setJualObat([])
            reset()
        }
        else if(event.altKey && event.keyCode == 81) {
            qtyObat.current?.focus()
        }
        else if(event.ctrlKey && event.altKey && event.keyCode == 79) {
            setCekHargaObatDialog(true)
        }
        else if(event.keyCode == 123) {
            event.preventDefault()

            setBayarDialog(true)
        }
    }

    useEffect(() => {
        
        document.addEventListener('keydown', onKeyDownAct)

        return () => {
            document.removeEventListener('keydown', onKeyDownAct)
        }
    },[])

    return(
        <TransactionLayout
            title="Penjualan HV"
            bgColor="bg-emerald-500"
        >

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent onCloseAutoFocus={(event) => {
                    if(kodeObat.current.value != "") {
                        qtyObat.current.focus()
                    }
                }}  className="max-w-5xl">
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
                        <TableRow key={key} onDoubleClick={(event) => dblClickAct(event, key)}>
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

            <Dialog open={cekHargaObatDialog} onOpenChange={setCekHargaObatDialog}>
              <DialogContent className="max-w-7xl">
                <DialogHeader>
                  <DialogTitle>Data Harga Obat</DialogTitle>
                </DialogHeader>
                <DataTable columns={columns} data={medicine_price_parameters} columnLists={columnLists}/>
              </DialogContent>
            </Dialog>

            <Dialog open={bayarDialog} onOpenChange={setBayarDialog}>
                <DialogContent className="max-w-l">
                    <DialogHeader>
                        <DialogTitle>Pembayaran</DialogTitle>
                    </DialogHeader>
                <Separator />
                <form onSubmit={(event) => event.preventDefault()}>
                    <div className="flex">
                        <div className="w-3/6">
                            <Label htmlFor="kode-transaksi">Jenis Bayar</Label>
                        </div>
                        <div className="w-full">
                            <Select defaultValue={data.jenis_pembayaran} onValueChange={(value) => setData('jenis_pembayaran', value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="=== Pilih Jenis Pembayaran ===" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={"tunai"}>Tunai</SelectItem>
                                <SelectItem value={"kartu-debit-kredit"}>Kartu Debit/Kredit</SelectItem>
                              </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex mt-4">
                        <div className="w-3/6 pt-[1%]">
                            <Label htmlFor="kode-transaksi">Sub Total</Label>
                        </div>
                        <div className="w-full">
                            <Input type="text" name="sub_total_grand" className="bg-slate-200" value={data.sub_total_grand} readOnly />
                        </div>
                    </div>
                    <div className="flex mt-4">
                        <div className="w-3/6 pt-[1%]">
                            <Label htmlFor="kode-transaksi">Diskon</Label>
                        </div>
                        <div className="w-full">
                            <Input type="text" name="diskon" onChange={calculateDiskon} onKeyUp={calculateDiskon} />
                        </div>
                    </div>
                    <div className="flex mt-4">
                        <div className="w-3/6 pt-[1%]">
                            <Label htmlFor="kode-transaksi">Total</Label>
                        </div>
                        <div className="w-full">
                            <Input type="text" name="total_grand" className="bg-slate-200" value={data.total_grand} readOnly />
                        </div>
                    </div>
                    <div className="flex mt-4">
                        <div className="w-3/6 pt-[1%]">
                            <Label htmlFor="kode-transaksi">Bayar</Label>
                        </div>
                        <div className="w-full">
                            <Input 
                                ref={bayarTransaksi} 
                                type="number" 
                                name="bayar" 
                                value={data.bayar} 
                                onChange={calculateBayar} 
                                onKeyUp={calculateBayar} 
                            />
                        </div>
                    </div>
                    <div className="flex mt-4 mb-4">
                        <div className="w-3/6 pt-[1%]">
                            <Label htmlFor="kode-transaksi">Kembali</Label>
                        </div>
                        <div className="w-full">
                            <Input type="text" name="kembali" className="bg-slate-200" value={data.kembalian} readOnly />
                        </div>
                    </div>
                    <Separator />
                    <Button 
                        ref={submitBayarRef} 
                        variant="success" 
                        className="mt-4" 
                        disabled={processing}
                        onClick={submitTransaction}
                    >Bayar</Button>
                </form>
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
                <a href={route('administrator.transaction-resep')} target="_blank">
                    <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40">RESEP [F1]</Button>
                </a>
                <a href={route('administrator.transaction-upds')} target="_blank">
                    <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40">
                        UPDS [F2]
                    </Button>
                </a>
                <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40" onClick={batalAct}>BATAL [F7]</Button>
                <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40">HAPUS [F8]</Button>
                <Button 
                    size="lg" 
                    variant="secondary" 
                    className="shadow-sm shadow-slate-500/40"
                    onClick={() => setBayarDialog(!bayarDialog)}
                >BAYAR [F12]</Button>
            </div>
            <Separator className="bg-slate-200" />
            <div className="grid grid-cols-4 gap-4 mt-4 mb-4">
                <div className="flex flex-col gap-2">
                    <div className="flex space-x-2">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi">Transaksi : </Label>
                        </div>
                        <div>
                            <Input className="bg-slate-200" type="text" value={data.kode_transaksi} readOnly/>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi">Kode Obat : </Label>
                        </div>
                        <div>
                            <input type="hidden" ref={obatId} />
                            <Input 
                                ref={kodeObat}
                                className="border border-slate-100" 
                                type="text" 
                                name="kode_obat"
                                onChange={openEnterDialog} 
                                onKeyUp={openEnterDialog} 
                                autoFocus 
                            />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi">Harga Obat : </Label>
                        </div>
                        <div>
                            <Input ref={hargaObat} id="harga-obat" type="text" className="bg-slate-200" readOnly />
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="flex flex-col gap-2">
                        <div className="mt-11">
                            <Input ref={namaObat} type="text" className="bg-slate-200" readOnly />
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-1/6">
                                <Label htmlFor="kode-transaksi">Qty Jual : </Label>
                            </div>
                            <div>
                                <Input ref={qtyObat} id="qty-jual-obat" onKeyUp={qtyJualAct} type="number"/>
                            </div>
                            <div className="w-1/6">
                                <Label htmlFor="kode-transaksi">Diskon : </Label>
                            </div>
                            <div>
                                <Input ref={diskonObat} id="diskon-obat" onKeyUp={diskonObatAct} type="text"/>
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
                            <Input className="bg-slate-200" type="text" value="HV" readOnly/>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi">Satuan : </Label>
                        </div>
                        <div>
                            <Input ref={satuanObat} className="bg-slate-200" type="text" readOnly />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi">Jumlah : </Label>
                        </div>
                        <div>
                            <Input ref={jumlahHarga} className="bg-slate-200" type="text" readOnly />
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
                        : 
                        rowObat.map((row, key) => (
                            <TableRow key={key}>
                                <TableCell className="border border-slate-100">
                                    <input type="radio" name="medicine_id" onKeyDown={rowObatAct} value={key} />
                                </TableCell>
                                <TableCell className="border border-slate-100">
                                    {key+1}
                                </TableCell>
                                <TableCell className="border border-slate-100">{row.name}</TableCell>
                                <TableCell className="border border-slate-100">{row.unit_medicine}</TableCell>
                                <TableCell className="border border-slate-100">{row.sell_price}</TableCell>
                                <TableCell className="border border-slate-100">{row.qty}</TableCell>
                                <TableCell className="border border-slate-100">{row.sub_total}</TableCell>
                                <TableCell className="border border-slate-100">{row.disc}</TableCell>
                                <TableCell className="border border-slate-100">{row.total}</TableCell>
                                <TableCell className="border border-slate-100">UP</TableCell>
                            </TableRow>
                        ))
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
                        <Input className="bg-slate-200" type="text" value={data.sub_total_grand} readOnly />
                    </div>
                </div>
                <div className="col-start-2 flex space-x-4">
                    <div className="w-20">
                        <Label htmlFor="kode-transaksi">Diskon : </Label>
                    </div>
                    <div>
                        <Input className="bg-slate-200" type="text" value={data.diskon_grand} readOnly />
                    </div>
                </div>
                <div className="col-start-2 flex space-x-4">
                    <div className="w-20">
                        <Label htmlFor="kode-transaksi">Total : </Label>
                    </div>
                    <div>
                        <Input className="bg-slate-200" type="text" value={data.total_grand} readOnly />
                    </div>
                </div>
            </div>
        </TransactionLayout>
    )
}