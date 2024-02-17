import { 
    useEffect, 
    useState, 
    KeyboardEvent, 
    ChangeEvent,
    useRef, 
    Ref,
    ChangeEventHandler,
    FormEventHandler
} from 'react'

import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button'
import axios from 'axios'
import TransactionLayout from '@/Layouts/TransactionLayout'
import { Label } from '@/Components/ui/label'

import { Separator } from '@/Components/ui/separator'


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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"

import { 
    type TransactionResepPageProps, 
    MedicineResep, 
    ResepTunaiForm, 
    RowObat 
} from './typeProps'

import {
    columns,
    columnLists,
    columnPatients,
    columnListPatients,
    columnMedicines,
    columnListMedicines
} from './columnDatatable'

import { useToast } from '@/Components/ui/use-toast'

import { MedicalRecordForm } from './type'

export default function TransactionPrescription({
    kode_transaksi, 
    price_parameter, 
    medicines, 
    data,
    setData = () => {}, 
    reset = () => {},
}: TransactionResepPageProps & { setData:CallableFunction, data:MedicalRecordForm, reset: CallableFunction }) {

    const { toast } = useToast();

    /* DIALOG USE STATE HOOKS */
    const [open, setOpen]                             = useState<boolean>(false)
    const [openWarningJasa, setOpenWarningJasa]       = useState<boolean>(false)
    const [cekHargaObatDialog, setCekHargaObatDialog] = useState<boolean>(false)
    const [openPasienDialog, setOpenPasienDialog]     = useState<boolean>(false)
    const [openDoctorDialog, setOpenDoctorDialog]     = useState<boolean>(false)
    const [openPasienList, setOpenPasienList]         = useState<boolean>(false)
    const [openMasterObat, setOpenMasterObat]         = useState<boolean>(false)
    /* END DIALOG USE STATE HOOKS */

    /* MECHANISM TRANSACTION USE STATE HOOKS */
    const [faktor, setFaktor]                         = useState<string>('UM')
    const [isRacikan, setIsRacikan]                   = useState<boolean>(false)
    const [bayarDialog, setBayarDialog]               = useState<boolean>(false)
    const [jasa, setJasa]                             = useState<number>(0)
    const [subTotal, setSubTotal]                     = useState<number>(0)
    const [isHjaNet, setIsHjaNet]                     = useState<boolean>(false)
    const [priceMedicine, setPriceMedicine]           = useState<number>(0)
    /* END MECHANISM TRANSACTION USE STATE HOOKS */

    /* COUNTER USE STATE HOOKS */
    const [nonRacikNum, setNonRacikNum]               = useState<number>(1)
    const [racikNum, setRacikNum]                     = useState<number>(1)
    /* END COUNTER USE STATE HOOKS */

    /* LIST MEDICINES USE STATE HOOKS */
    const [rowObat, setRowObat]   = useState<RowObat[]>([])
    const [jualObat, setJualObat] = useState<any>([])
    /* END LIST MEDICINES USE STATE HOOKS */

    /* LIST PATIENTS USE STATE HOOKS */
    const [rowPatients, setRowPatients] = useState<any>([])
    /* END LIST PATIENTS USE STATE HOOKS */

    /* LIST DOCTORS USE STATE HOOKS */
    const [rowDoctors, setRowDoctors] = useState<any>([])
    /* END LIST DOCTORS USE STATE HOOKS */

    const obatId        = useRef<any>()
    const namaObat      = useRef<any>()
    const kodeObat      = useRef<any>()
    const dosisObatRef  = useRef<any>()
    const hargaObat     = useRef<any>()

    const dosisRacikRef = useRef<any>()
    const qtyObat       = useRef<any>()
    const satuanObat    = useRef<any>()
    const jumlahHarga   = useRef<any>()

    const bungkusRef    = useRef<any>()
    const jasaRef       = useRef<any>()
    const isRacikRef    = useRef<any>()
    const faktorRef     = useRef<any>()

    /* PATIENT USE REF */
    const patientNameRef        = useRef<any>()
    const patientPhoneNumberRef = useRef<any>()
    const patientAddressRef     = useRef<any>()
    const patientCityPlaceRef   = useRef<any>()
    /* END PATIENT USE REF */

    /* DOCTOR USE REF */
    const doctorNameRef = useRef<any>()
    const doctorCodeRef = useRef<any>()
    /* END DOCTOR USE REF */

    const diskonGrandRef = useRef<any>()
    const bayarTransaksi = useRef<any>()
    const submitBayarRef = useRef<any>()

    const openEnterDialog = async(event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>): Promise<void> => {
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

    const bungkusAct = (event: any): void => {
        if(event.keyCode == 13 && bungkusRef.current?.value != '')
        {
            kodeObat.current.focus()
        }
    }

    const selectObatAct = async(event: any): Promise<void> => {
        if(event.keyCode == 13) {
            try {
                const { data } = await axios.get(route('api.medicines.get-by-id', event.target.value))
                setOpen(false)
                setIsHjaNet(data.medicine.is_hja_net)
                setPriceMedicine(data.medicine.price)

                obatId.current.value        = data.medicine.id
                kodeObat.current.value      = data.medicine.code
                dosisObatRef.current.value  = data.medicine.dose
                namaObat.current.value      = data.medicine.name
                hargaObat.current.value     = data.medicine.price
                satuanObat.current.value    = data.medicine.unit_medicine
                qtyObat.current.value       = ""
                dosisRacikRef.current.value = isRacikan ? '' : 0

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

    const dosisRacikAct = (event: any): void => {
        const dosisObatVal  = parseInt(dosisObatRef.current.value)
        const bungkusVal    = parseInt(bungkusRef.current.value)
        const dosisRacikVal = parseInt(dosisRacikRef.current.value)
        const hargaObatVal  = parseInt(hargaObat.current.value)

        let calculateQty   = isRacikan ? Math.round((dosisRacikVal * bungkusVal) / dosisObatVal) : 0
        let priceCalculate = 0
        
        if(isHjaNet) {
            priceCalculate = Math.round((hargaObatVal * price_parameter.resep_tunai))
        } else {
            priceCalculate = hargaObatVal
        }

        let calculateJumlah = priceCalculate * calculateQty

        setSubTotal(calculateJumlah)

        jumlahHarga.current.value = Math.round((calculateJumlah / price_parameter.pembulatan)) * price_parameter.pembulatan
        qtyObat.current.value = calculateQty

        if(event.keyCode == 13 && dosisRacikRef.current.value != '')
        {
            qtyObat.current.focus()
        }
    }

    const qtyJualAct = (event: any): void => {

        setSubTotal(jumlahHarga.current.value)

        if(!isRacikan) {
            const hargaObatVal = parseInt(hargaObat.current.value)
            const qtyObatVal   = parseInt(qtyObat.current.value)

            let calculateJumlah = qtyObatVal * hargaObatVal

            jumlahHarga.current.value = calculateJumlah
        }

        let prefixNum: string = ''

        if(event.keyCode == 13) {
            if(isRacikan) {
                prefixNum = `R${racikNum}`
                setNonRacikNum(nonRacikNum => nonRacikNum + 1)
            }
            else {
                prefixNum = `tanpa-racik`
                setNonRacikNum(nonRacikNum => nonRacikNum + 1)
            }

            const result = [{
                id: obatId.current.value,
                name: namaObat.current.value,
                unit_medicine: satuanObat.current.value,
                sell_price: parseInt(hargaObat.current.value),
                qty: parseInt(qtyObat.current.value),
                prescription_packs: bungkusRef.current.value,
                dose:dosisRacikRef.current.value,
                sub_total: subTotal,
                jasa,
                total: parseInt(jumlahHarga.current.value),
                faktor,
                prefixNum
            }]
            setRowObat([
                ...rowObat,
                ...result
            ])

            let subTotalGrandData = result[0].sub_total + data.sub_total_grand
            let totalGrandData    = result[0].total + data.total_grand

            const medicinesData = [...data.medicines, ...result]

            setData((data: MedicalRecordForm) => ({
                ...data,
                medicines:medicinesData,
                sub_total_grand:subTotalGrandData,
                total_grand:totalGrandData,
            }))

            kodeObat.current.value      = ""
            dosisObatRef.current.value  = ""
            namaObat.current.value      = ""
            hargaObat.current.value     = ""
            satuanObat.current.value    = ""
            qtyObat.current.value       = ""
            dosisRacikRef.current.value = ""
            jumlahHarga.current.value   = ""

            kodeObat.current.focus()
        }
    }

    const jasaAct = (): void => {
        const jasaVal = jasaRef.current.value
        if(kodeObat.current.value == '') {

            const getIndex    = rowObat.map(el => el.prefixNum).lastIndexOf(`R${racikNum}`)
            let jasaRowObat = rowObat[getIndex]
            jasaRowObat.jasa = parseInt(jasaVal)

            const medicinesData = data.medicines
            medicinesData[getIndex].jasa = jasaVal

            let totalGrandData    = data.total_grand + parseInt(jasaVal)
            let subTotalGrandData = data.sub_total_grand + parseInt(jasaVal)

            setRacikNum(racikNum => racikNum + 1)

            jasaRef.current.value = ""
            bungkusRef.current.value = ""

            setData((data: MedicalRecordForm) => ({
                ...data,
                medicines:medicinesData,
                sub_total_grand: subTotalGrandData,
                total_grand:totalGrandData
            }))

            bungkusRef.current.focus()

        }
    }

    const rowObatAct = (event: any): void => {
        event.preventDefault()

        if(event.keyCode == 118) {
            setRowObat(row => row.filter((r, i) => (i != event.target.value)))

            const medicinesData     = data.medicines.filter((row: any, i: number) => (i != event.target.value))
            const subTotalGrandData = data.sub_total_grand - data.medicines[event.target.value].sub_total
            const totalGrandData    = data.total_grand - data.medicines[event.target.value].total

            setData((data: MedicalRecordForm) => ({...data,
                medicines:medicinesData,
                sub_total_grand:subTotalGrandData,
                total_grand:totalGrandData
            }))
        }
    }

    const pasienKeyUpAct = async(event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
        if((event as KeyboardEvent).keyCode == 13) {
            setOpenPasienDialog(true)
            
            try {
                const { data } = await axios.get(route('api.patients.get-all'))
                setRowPatients(data.data.patients)
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

    const selectPatientAct = async(event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>): Promise<void> => {
        if((event as KeyboardEvent).keyCode == 13) {
            const responseData = await axios.get(route('api.patients.get-by-id', (event.target as HTMLInputElement).value))

            patientNameRef.current.value        = responseData.data.data.patient.name
            patientPhoneNumberRef.current.value = responseData.data.data.patient.phone_number
            patientAddressRef.current.value     = responseData.data.data.patient.address
            patientCityPlaceRef.current.value   = responseData.data.data.patient.city_place

            setOpenPasienDialog(false)

            setRowPatients([])

            setData((data: MedicalRecordForm) => ({
                ...data,
                patient_id:responseData.data.data.patient.id
            }))
        }
    }

    const doctorKeyUpAct = async(event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
        if((event as KeyboardEvent).keyCode == 13) {
            setOpenDoctorDialog(true)

            try {
                const { data } = await axios.get(route('api.doctors.get-all'))

                setRowDoctors(data.data.doctors)
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

    const selectDoctorAct = async(event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>): Promise<void> => {
        if((event as KeyboardEvent).keyCode == 13) {
            try {
                const responseData = await axios.get(route('api.doctors.get-by-id', (event.target as HTMLInputElement).value))

                doctorCodeRef.current.value = responseData.data.data.doctor.code ?? ''
                doctorNameRef.current.value = responseData.data.data.doctor.name

                setOpenDoctorDialog(false)

                setRowDoctors([])

                setData((data: MedicalRecordForm) => ({
                    ...data,
                    doctor_id:responseData.data.data.doctor.id
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
    }

    const calculateDiskon = (event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>): void => {
        event.preventDefault()

        const { value } = (event.target as HTMLInputElement)

        if((event as KeyboardEvent).keyCode == 13)
        {
            const total_grand = data.total_grand

            let calculate = 0

            let diskon_grand = 0

            if(value.includes('%')) {
                diskon_grand = ((total_grand * parseInt(value)) / 100)
                
                calculate = Math.round((total_grand -  diskon_grand) / price_parameter.pembulatan) * price_parameter.pembulatan
            } else {
                diskon_grand = parseInt(value)

                calculate = Math.round((total_grand - diskon_grand) / price_parameter.pembulatan) * price_parameter.pembulatan
            }

            setData((data: MedicalRecordForm) => ({...data, diskon_grand:diskon_grand}))

            setData((data: MedicalRecordForm) => ({...data, total_grand:calculate}))

            bayarTransaksi.current.focus()
        }
    }

    const submitTransaction = (): void => {
        console.log('test')
    }

    const batalAct = (): void => {
        setRowObat([])
        setIsHjaNet(false)
        setPriceMedicine(0)
        setJualObat([])
        setData((data: MedicalRecordForm) => ({
            ...data,
            medicines:[],
            sub_total_grand:0,
            diskon_grand:0,
            total_grand:0,
            bayar:0,
            kembalian:0
        }))
    }

    const onKeyDownAct = (event: any): void => {
        if(event.keyCode == 118) {
            event.preventDefault()

            setRowObat([])
            setIsHjaNet(false)
            setPriceMedicine(0)
            setJualObat([])
            setData((data: MedicalRecordForm) => ({
                ...data,
                medicines:[],
                sub_total_grand:0,
                diskon_grand:0,
                total_grand:0,
                bayar:0,
                kembalian:0
            }))
        }
        else if(event.ctrlKey && event.keyCode == 70) {

            if(faktorRef.current.value == 'RESEP') {
                setFaktor(faktor => 'UP')
                faktorRef.current.value="UPDS"
            } else if(faktorRef.current.value == 'UPDS') {
                setFaktor(faktor => 'HV')
                faktorRef.current.value="HV"
            } else {
                setFaktor(faktor => 'UM')
                faktorRef.current.value="RESEP"
            }

        }
        else if(event.ctrlKey && event.keyCode == 74) {
            jasaRef.current.focus()
        }
        else if(event.altKey && event.keyCode == 81) {
            qtyObat.current.focus()
        }
        else if(event.ctrlKey && event.keyCode == 82) {

            if(isRacikRef.current.value == 'TIDAK') {
                setIsRacikan(isRacikan => true)
                bungkusRef.current.focus()
            } else {
                setIsRacikan(isRacikan => false)
                kodeObat.current.focus()
            }

        }
    }

    useEffect(() => {
        
        document.addEventListener('keydown',onKeyDownAct)

        return () => {
            document.removeEventListener('keydown',onKeyDownAct)
        }
    },[])

    console.log({columns, columnLists})

    return(
        // <TransactionLayout
        //     title="Penjualan Resep Tunai"
        //     bgColor="bg-amber-500"
        // >
        <>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent onCloseAutoFocus={(event) => {
                    if(kodeObat.current.value != "") {
                        dosisRacikRef.current.focus()
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

            <Dialog open={openMasterObat} onOpenChange={setOpenMasterObat}>
              <DialogContent className="max-w-7xl">
                <DialogHeader>
                  <DialogTitle>Data Master Obat</DialogTitle>
                </DialogHeader>
                <DataTable columns={columnMedicines} data={medicines} columnLists={columnListMedicines}/>
              </DialogContent>
            </Dialog>

            <AlertDialog open={openWarningJasa} onOpenChange={setOpenWarningJasa}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah resep sudah benar?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={jasaAct}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex justify-center space-x-2 mb-3">
                <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40" onClick={batalAct}>BATAL [F7]</Button>
                <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40">HAPUS [F8]</Button>
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
                            <Label htmlFor="kode-transaksi">Dosis Obat : </Label>
                        </div>
                        <div>
                            <Input 
                                ref={dosisObatRef}
                                className="bg-slate-200 border border-slate-100" 
                                type="text" 
                                name="dosis_obat"
                                readOnly
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
                        <div className="grid grid-cols-2 space-x-4">
                            <div>
                                <div className="flex gap-5">
                                    <div className="w-2/6">
                                        <Label htmlFor="kode-transaksi">Dosis r/ : </Label>
                                    </div>
                                    <div>
                                        <Input ref={dosisRacikRef} id="dosis-racik" onKeyUp={dosisRacikAct} onChange={dosisRacikAct} type="number"/>
                                    </div>
                                </div>
                                <div className="flex gap-5 mt-2">
                                    <div className="w-2/6">
                                        <Label htmlFor="kode-transaksi">Qty Jual : </Label>
                                    </div>
                                    <div>
                                        <Input ref={qtyObat} id="qty-jual-obat" onKeyUp={qtyJualAct} type="number"/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex gap-5">
                                    <div className="w-2/6">
                                        <Label htmlFor="satuan-obat">Satuan : </Label>
                                    </div>
                                    <div>
                                        <Input className="bg-slate-200" ref={satuanObat} id="satuan-obat" type="text" readOnly/>
                                    </div>
                                </div>
                                <div className="flex gap-5 mt-2">
                                    <div className="w-2/6">
                                        <Label htmlFor="kode-transaksi">Jumlah : </Label>
                                    </div>
                                    <div>
                                        <Input className="bg-slate-200" ref={jumlahHarga} id="jumlah-harga" type="text"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex space-x-4">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi"><u>R</u>acikan : </Label>
                        </div>
                        <div>
                            <Input ref={isRacikRef} className="bg-slate-200" type="text" value={isRacikan ? 'YA' : 'TIDAK'} readOnly/>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi"><u>F</u>aktor : </Label>
                        </div>
                        <div>
                            <Input 
                                ref={faktorRef} 
                                className="bg-slate-200" 
                                type="text" 
                                value={faktor == 'UM' ? 'RESEP' : faktor == 'UP' ? 'UPDS' : 'HV'} 
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi">Bungkus : </Label>
                        </div>
                        <div>
                            <Input ref={bungkusRef} onKeyUp={bungkusAct} type="number" />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi"><u>J</u>asa : </Label>
                        </div>
                        <div>
                            <Input ref={jasaRef} type="number" onKeyUp={(event) => {
                                if(event.keyCode == 13 && jasaRef.current.value != '') {
                                    setOpenWarningJasa(true)
                                }
                            }} />
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
                        <TableHead className="border border-slate-100">Jasa</TableHead>
                        <TableHead className="border border-slate-100">Total</TableHead>
                        <TableHead className="border border-slate-100">#1</TableHead>
                        <TableHead className="border border-slate-100">#2</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data.medicines.length == 0 ?
                        <TableRow>
                            <TableCell className="border border-slate-100" colSpan={11} align="center">Tidak Ada Transaksi Obat</TableCell>
                        </TableRow>
                        : 
                        data.medicines.map((row, key) => (
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
                                <TableCell className="border border-slate-100">{row.jasa}</TableCell>
                                <TableCell className="border border-slate-100">{row.total}</TableCell>
                                <TableCell className="border border-slate-100">{row.faktor}</TableCell>
                                <TableCell className="border border-slate-100">{row.prefixNum}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <Separator className="bg-slate-200" />
            <div className="grid grid-cols-3 place-items-center mt-4 w-full">
                <div className="flex space-x-4">
                    <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40" onClick={() => setOpenMasterObat(!openMasterObat)}>Master Obat</Button>
                </div>
                <div className="flex w-full">
                    <div className="flex-none w-20">
                        <Label htmlFor="kode-transaksi">Total : </Label>
                    </div>
                    <div className="grow w-full">
                        <Input className="bg-slate-200" type="text" value={data.total_grand} readOnly />
                    </div>
                </div>
            </div>
        {/*</TransactionLayout>*/}
        </>
    )
}