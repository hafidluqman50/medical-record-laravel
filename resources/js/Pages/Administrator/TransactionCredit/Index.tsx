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
    type TransactionCreditPageProps, 
    MedicineResep, 
    ResepCreditForm, 
    RowObat 
} from './typeProps'

import { columns } from './columnDatatable'

import { 
    DataTableMasterObat,
    DataTableTransactionCredit
} from './DataTableServer'

import { useToast } from '@/Components/ui/use-toast'

import { useStateWithCallback } from '@/lib/hooks'

export default function TransactionCredit({
    kode_transaksi, price_parameter, medicine_price_parameters, patients, medicines, debitur, customers
}: TransactionCreditPageProps) {

    const { toast } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm<ResepCreditForm>({
        medicines: [],
        patient_id: null,
        doctor_id: null,
        date_prescription:(new Date()).toJSON().slice(0,10),
        group_name: '',
        customer_id:debitur.id,
        sub_total_grand: 0,
        total_grand: 0,
        kode_transaksi
    });

    /* DIALOG USE STATE HOOKS */
    const [open, setOpen]                             = useState<boolean>(false)
    const [openWarningJasa, setOpenWarningJasa]       = useState<boolean>(false)
    const [cekHargaObatDialog, setCekHargaObatDialog] = useState<boolean>(false)
    const [openPasienDialog, setOpenPasienDialog]     = useState<boolean>(false)
    const [openDoctorDialog, setOpenDoctorDialog]     = useState<boolean>(false)
    const [openMasterObat, setOpenMasterObat]         = useState<boolean>(false)
    const [openTransaction, setOpenTransaction]       = useState<boolean>(false)
    /* END DIALOG USE STATE HOOKS */

    /* MECHANISM TRANSACTION USE STATE HOOKS */
    const [faktor, setFaktor]                         = useState<string>('UM')
    const [isRacikan, setIsRacikan]                   = useState<boolean>(false)
    const [bayarDialog, setBayarDialog]               = useState<boolean>(false)
    const [jasa, setJasa]                             = useState<number>(0)
    const [subTotal, setSubTotal]                     = useState<number>(0)
    const [isHjaNet, setIsHjaNet]                     = useState<boolean>(false)
    const [priceMedicine, setPriceMedicine]           = useState<number>(0)
    const [indexRowObat, setIndexRowObat]             = useStateWithCallback<number|null>(null)
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
    // const faktorRef     = useRef<any>()

    /* PATIENT USE REF */
    const patientNameRef = useRef<any>()
    /* END PATIENT USE REF */

    /* DOCTOR USE REF */
    const doctorNameRef = useRef<any>()
    const doctorCodeRef = useRef<any>()
    /* END DOCTOR USE REF */

    const groupRef = useRef<any>()

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

    const bungkusAct = (event: KeyboardEvent<HTMLInputElement>): void => {
        if(event.keyCode == 13 && bungkusRef.current?.value != '')
        {
            kodeObat.current.focus()
        }
    }

    const selectObatAct = async(event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>): Promise<void> => {
        if((event as KeyboardEvent).keyCode == 13) {
            try {
                const { data } = await axios.get(route('api.medicines.get-by-id', (event.target as HTMLInputElement).value))
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

    const dosisRacikAct = (event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>): void => {
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

        if((event as KeyboardEvent).keyCode == 13 && dosisRacikRef.current.value != '')
        {
            qtyObat.current.focus()
        }
    }

    const qtyJualAct = (event: KeyboardEvent<HTMLInputElement>): void => {

        setSubTotal(jumlahHarga.current.value)

        if(!isRacikan) {
            const hargaObatVal = parseInt(hargaObat.current.value)
            const qtyObatVal   = parseInt(qtyObat.current.value)

            let calculateJumlah = qtyObatVal * hargaObatVal

            jumlahHarga.current.value = calculateJumlah
        }

        let prefixNum: string        = ''
        let prefixNumDisplay: string = ''

        let subTotalGrandData: number = 0
        let totalGrandData: number    = 0

        let medicinesData: Array<any> = []

        if(event.keyCode == 13) {
            if(indexRowObat != null) {
                const getRowObat = rowObat
                
                getRowObat[indexRowObat].qty                = parseInt(qtyObat.current.value)
                getRowObat[indexRowObat].prescription_packs = bungkusRef.current.value
                getRowObat[indexRowObat].sub_total          = subTotal
                getRowObat[indexRowObat].dose               = dosisRacikRef.current.value
                getRowObat[indexRowObat].jasa               = jasa
                getRowObat[indexRowObat].total              = parseInt(jumlahHarga.current.value)

                subTotalGrandData = getRowObat[indexRowObat].sub_total + data.sub_total_grand
                totalGrandData    = getRowObat[indexRowObat].total + data.total_grand
                
                medicinesData   = data.medicines

                medicinesData[indexRowObat] = getRowObat[indexRowObat]

            } else {
                if(isRacikan) {
                    prefixNum        = `R${racikNum}`
                    prefixNumDisplay = `R${racikNum}`
                    setNonRacikNum(nonRacikNum => nonRacikNum + 1)
                }
                else {
                    prefixNum        = `tanpa-racik`
                    prefixNumDisplay = `P${nonRacikNum}`

                    setNonRacikNum(nonRacikNum => nonRacikNum + 1)
                }

                const result = [{
                    code: kodeObat.current.value,
                    id: obatId.current.value,
                    name: namaObat.current.value,
                    unit_medicine: satuanObat.current.value,
                    dose_medicine: dosisObatRef.current.value,
                    sell_price: parseInt(hargaObat.current.value),
                    qty: parseInt(qtyObat.current.value),
                    prescription_packs: bungkusRef.current.value,
                    sub_total: subTotal,
                    dose:dosisRacikRef.current.value,
                    jasa,
                    total: parseInt(jumlahHarga.current.value),
                    faktor,
                    prefixNum,
                    prefixNumDisplay
                }]
                setRowObat([
                    ...rowObat,
                    ...result
                ])

                subTotalGrandData = result[0].sub_total + data.sub_total_grand
                totalGrandData    = result[0].total + data.total_grand
                medicinesData = [...data.medicines, ...result]

            }

            setIndexRowObat(null)

            setData(data => ({
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

            setData(data => ({
                ...data,
                medicines:medicinesData,
                sub_total_grand: subTotalGrandData,
                total_grand:totalGrandData
            }))

            bungkusRef.current.focus()
        }
    }

    const dblClickAct = (
        event: MouseEvent<HTMLTableRowElement>,
        index: number
    ): void => {
        const getRowObat = rowObat

        kodeObat.current.value      = getRowObat[index].code
        dosisObatRef.current.value  = getRowObat[index].dose_medicine
        namaObat.current.value      = getRowObat[index].name
        hargaObat.current.value     = getRowObat[index].sell_price
        satuanObat.current.value    = getRowObat[index].unit_medicine
        qtyObat.current.value       = getRowObat[index].qty
        dosisRacikRef.current.value = getRowObat[index].dose
        bungkusRef.current.value    = getRowObat[index].prescription_packs
        jumlahHarga.current.value   = getRowObat[index].total
        jasaRef.current.value       = getRowObat[index].jasa

        setSubTotal(getRowObat[index].sub_total)

        setJasa(getRowObat[index].jasa)

        setIndexRowObat(index)

        const subTotalGrandData = data.sub_total_grand - getRowObat[index].sub_total
        const totalGrandData    = data.total_grand - getRowObat[index].total

        setData(data => ({
            ...data,
            medicines:getRowObat,
            sub_total_grand:subTotalGrandData,
            total_grand:totalGrandData
        }))

        getRowObat[index].sell_price = 0
        getRowObat[index].qty        = 0
        getRowObat[index].dose       = 0
        getRowObat[index].sub_total  = 0
        getRowObat[index].total      = 0
        getRowObat[index].jasa       = 0

        setRowObat(getRowObat)

        dosisRacikRef.current.focus()
    }

    const rowObatAct = (event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>): void => {
        
        const keyEvent = event as KeyboardEvent
        const targetValue = parseInt((event.target as HTMLInputElement).value)

        if(keyEvent.keyCode == 119) {
            setRowObat(row => row.filter((r, i) => (i != targetValue)))

            const medicinesData: Array<any> = data.medicines.filter((row: any, i: number) => (i != targetValue))
            const subTotalGrandData: number = data.sub_total_grand - data.medicines[targetValue].sub_total
            const totalGrandData: number    = data.total_grand - data.medicines[targetValue].total

            setData(data => ({...data,
                medicines:medicinesData,
                sub_total_grand:subTotalGrandData,
                total_grand:totalGrandData
            }))
        }
    }

    const calculateBayar = (event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>): void => {
        const keyEvent = event as KeyboardEvent
        const targetValue = parseInt((event.target as HTMLInputElement).value)

        setData(data => ({...data, bayar:targetValue}))
        const total_grand: number = data.total_grand

        let calculate: number = total_grand - targetValue

        setData(data => ({...data, kembalian:calculate}))

        if(keyEvent.keyCode == 13) {
            post(route('administrator.transaction-resep.store'))
            submitBayarRef.current.focus()
        }

    }

    const pasienKeyUpAct = async(event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
        if(event.keyCode == 13) {
            setOpenPasienDialog(true)
            try {
                const { data } = await axios.get<{
                        data:{
                            patients:Array<{
                                id:number,
                                name:string
                            }>
                        }
                    }>(route('api.patients.get-all'))

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
        const keyEvent = event as KeyboardEvent
        const targetValue = parseInt((event.target as HTMLInputElement).value)

        if(keyEvent.keyCode == 13) {
            try {
                const responseData = await axios.get<{
                        data:{
                            patient:{
                                id:number,
                                name:string
                            }
                        }
                    }>(route('api.patients.get-by-id', targetValue))

                patientNameRef.current.value        = responseData.data.data.patient.name

                setOpenPasienDialog(false)

                setRowPatients([])

                setData(data => ({
                    ...data,
                    patient_id:responseData.data.data.patient.id
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

    const doctorKeyUpAct = async(event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
        if(event.keyCode == 13) {
            setOpenDoctorDialog(true)
            try {
                const { data } = await axios.get<{
                        data:{
                            doctors:Array<{
                                id:number, 
                                code:string, 
                                name:string
                            }>
                        }
                    }>(route('api.doctors.get-all'))

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
        const keyEvent = event as KeyboardEvent
        const targetValue = parseInt((event.target as HTMLInputElement).value)

        if(keyEvent.keyCode == 13) {
            try {
                const responseData = await axios.get<{
                        data:{
                            doctor:{
                                id:number, 
                                code:string, 
                                name:string
                            }
                        }
                    }>(route('api.doctors.get-by-id', targetValue))

                doctorCodeRef.current.value = responseData.data.data.doctor.code ?? ''
                doctorNameRef.current.value = responseData.data.data.doctor.name

                setOpenDoctorDialog(false)

                setRowDoctors([])

                setData(data => ({
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

    const hapusAct = (): void => {
        if(indexRowObat != null) {
            setRowObat(row => row.filter((r, i) => (i != indexRowObat)))

            const medicinesData: Array<any> = data.medicines.filter((row: any, i: number) => (i != indexRowObat))
            const subTotalGrandData: number = data.sub_total_grand - data.medicines[indexRowObat].sub_total
            const totalGrandData: number    = data.total_grand - data.medicines[indexRowObat].total

            setData(data => ({...data,
                medicines:medicinesData,
                sub_total_grand:subTotalGrandData,
                total_grand:totalGrandData
            }))
        }
    }

    const batalAct = (): void => {
        setRowObat([])
        setIsHjaNet(false)
        setPriceMedicine(0)
        setJualObat([])
        reset()
    }

    const groupNameAct = (event: KeyboardEvent<HTMLInputElement>): void => {
        if(event.keyCode == 13 && groupRef.current.value != '') {
            post(route('administrator.transaction-credit'))
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
        else if(event.keyCode == 119) {
            hapusAct()
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
        else if(event.ctrlKey && event.altKey && event.keyCode == 79) {
            setCekHargaObatDialog(true)
        }
        else if(event.keyCode == 123) {
            event.preventDefault()

            setBayarDialog(true)
        }
    }

    useEffect(() => {
        
        document.addEventListener('keydown',onKeyDownAct)

        return () => {
            document.removeEventListener('keydown',onKeyDownAct)
        }
    },[])

    return(
        <TransactionLayout
            title="Penjualan Resep Tunai"
            bgColor="bg-violet-500"
        >

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent onCloseAutoFocus={(event) => {
                    if(kodeObat.current.value != "") {
                        dosisRacikRef.current.focus()
                    }
                }} className="max-w-5xl overflow-y-scroll max-h-screen">
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

            <Dialog open={cekHargaObatDialog} onOpenChange={setCekHargaObatDialog}>
              <DialogContent className="max-w-7xl overflow-y-scroll max-h-screen">
                <DialogHeader>
                  <DialogTitle>Data Pelanggan</DialogTitle>
                </DialogHeader>
                <DataTable columns={columns} data={customers} />
              </DialogContent>
            </Dialog>

            <Dialog open={openMasterObat} onOpenChange={setOpenMasterObat}>
              <DialogContent className="max-w-7xl overflow-y-scroll max-h-screen">
                <DialogHeader>
                  <DialogTitle>Data Master Obat</DialogTitle>
                </DialogHeader>
                <DataTableMasterObat />
              </DialogContent>
            </Dialog>

            <Dialog open={openTransaction} onOpenChange={setOpenTransaction}>
              <DialogContent className="max-w-7xl overflow-y-scroll max-h-screen">
                <DialogHeader>
                  <DialogTitle>Data Transaksi</DialogTitle>
                </DialogHeader>
                <DataTableTransactionCredit onOpenTransaction={setOpenTransaction} />
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

            <Dialog open={openPasienDialog} onOpenChange={setOpenPasienDialog}>
                
              <DialogContent onCloseAutoFocus={(event) => {
                    if(patientNameRef.current.value != "") {
                        doctorCodeRef.current.focus()
                    }
                }} className="max-w-5xl">
                <DialogHeader>
                  <DialogTitle>Data Pasien</DialogTitle>
                </DialogHeader>
                 
              <Table className="border-collapse border border-slate-100 mt-4">
                <TableHeader>
                    <TableRow>
                      <TableHead className="border border-slate-100">#</TableHead>
                      <TableHead className="border border-slate-100">No</TableHead>
                      <TableHead className="border border-slate-100">Nama Pasien</TableHead>
                      <TableHead className="border border-slate-100">Nomor HP</TableHead>
                      <TableHead className="border border-slate-100">Alamat</TableHead>
                      <TableHead className="border border-slate-100">Kota</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {
                    rowPatients.length == 0 ? 
                    <TableRow>
                        <TableCell colSpan={8} align="center">Pasien Tidak Ada!</TableCell>
                    </TableRow>
                    :
                    rowPatients.map((row: any, key: number) => (
                        <TableRow key={key}>
                            <TableCell className="border border-slate-100">
                            {
                                key == 0 ?
                                <input type="radio" name="select_patient" value={row.id} onKeyUp={selectPatientAct} autoFocus/>
                                : <input type="radio" name="select_patient" value={row.id} onKeyUp={selectPatientAct} />
                            }
                            </TableCell>
                            <TableCell className="border border-slate-100">{key+1}</TableCell>
                            <TableCell className="border border-slate-100">{row.name}</TableCell>
                            <TableCell className="border border-slate-100">{row.phone_number}</TableCell>
                            <TableCell className="border border-slate-100">{row.address}</TableCell>
                            <TableCell className="border border-slate-100">{row.city_place}</TableCell>
                        </TableRow>
                    ))
                }
                </TableBody>
              </Table>
              </DialogContent>
            </Dialog>

            <Dialog open={openDoctorDialog} onOpenChange={setOpenDoctorDialog}>
                
              <DialogContent className="max-w-5xl">
                <DialogHeader>
                  <DialogTitle>Data Dokter</DialogTitle>
                </DialogHeader>
                 
              <Table className="border-collapse border border-slate-100 mt-4">
                <TableHeader>
                    <TableRow>
                      <TableHead className="border border-slate-100">#</TableHead>
                      <TableHead className="border border-slate-100">No</TableHead>
                      <TableHead className="border border-slate-100">Kode Dokter</TableHead>
                      <TableHead className="border border-slate-100">Nama Dokter</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {
                    rowDoctors.length == 0 ? 
                    <TableRow>
                        <TableCell colSpan={8} align="center">Pasien Tidak Ada!</TableCell>
                    </TableRow>
                    :
                    rowDoctors.map((row: any, key: number) => (
                        <TableRow key={key}>
                            <TableCell className="border border-slate-100">
                            {
                                key == 0 ?
                                <input type="radio" name="select_doctor" value={row.id} onKeyUp={selectDoctorAct} autoFocus/>
                                : <input type="radio" name="select_doctor" value={row.id} onKeyUp={selectDoctorAct} />
                            }
                            </TableCell>
                            <TableCell className="border border-slate-100">{key+1}</TableCell>
                            <TableCell className="border border-slate-100">{row.code}</TableCell>
                            <TableCell className="border border-slate-100">{row.name}</TableCell>
                        </TableRow>
                    ))
                }
                </TableBody>
              </Table>
              </DialogContent>
            </Dialog>

            <Dialog open={bayarDialog} onOpenChange={setBayarDialog}>
                <DialogContent className="max-w-l">
                    <DialogHeader>
                        <DialogTitle>Proses Kredit</DialogTitle>
                    </DialogHeader>
                <Separator />
                <form onSubmit={(event) => event.preventDefault()}>
                <Separator />
                <div className="mb-4 flex space-x-4">
                    <div>
                        <Label htmlFor="nomor-debitur">Nomor Debitur :</Label>
                        <Input 
                            id="nomor-debitur" 
                            type="text" 
                            className="bg-slate-200"
                            value={debitur.debitur_number} 
                            readOnly
                        />
                    </div>
                    <div className="w-full">
                        <Label htmlFor="tanggal-resep">Debitur :</Label>
                        <Select defaultValue={debitur.id.toString()} onValueChange={(value) => setData('customer_id', parseInt(value))}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="=== Pilih Debitur ===" />
                          </SelectTrigger>
                          <SelectContent>
                          {
                            customers.map((row, key) => (
                                <SelectItem value={row.id.toString()} key={key}>{row.name}</SelectItem>
                            ))
                          }
                          </SelectContent>
                        </Select>
                    </div>
                </div>
                <Separator />
                <div className="mb-4 mt-4">
                    <Label htmlFor="tanggal-resep">Tanggal Resep :</Label>
                    <Input 
                        id="tanggal-resep" 
                        type="date" 
                        value={data.date_prescription} 
                        onChange={(event) => setData('date_prescription', event.target.value)} 
                    />
                </div>
                <Separator />
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <div className="w-full">
                                <Label htmlFor="kode-transaksi">Pasien :</Label>
                                <Input ref={patientNameRef} id="pasien" type="text" onKeyUp={pasienKeyUpAct} />
                            </div>
                        </div>
                        <div>
                            <div className="w-3/6">
                                <Label htmlFor="kode-transaksi">Dokter :</Label>
                            </div>
                            <div className="w-full flex">
                                <div className="w-3/6">
                                    <Input ref={doctorCodeRef} id="pasien" type="text" onKeyUp={doctorKeyUpAct} />
                                </div>
                                <div className="w-full">
                                    <Input ref={doctorNameRef} id="pasien" type="text" />
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="w-full">
                                <Label htmlFor="group-name">Group :</Label>
                                <Input 
                                    ref={groupRef} 
                                    id="group-name" 
                                    type="text" 
                                    onChange={(event) => setData('group_name', event.target.value)} 
                                    onKeyUp={groupNameAct}
                                />
                            </div>
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
                    PELANGGAN [CTRL+ALT+O]
                </Button>
                <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40" onClick={batalAct}>BATAL [F7]</Button>
                <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40">HAPUS [F8]</Button>
                <Button 
                    size="lg" 
                    variant="secondary" 
                    className="shadow-sm shadow-slate-500/40"
                    onClick={() => setBayarDialog(!bayarDialog)}
                >PROSES [F12]</Button>
            </div>
            <Separator className="bg-slate-200" />
            <div className="grid grid-cols-4 gap-4 mt-4 mb-4">
                <div className="flex flex-col gap-2">
                    <div className="flex space-x-2">
                        <div className="w-2/6">
                            <Label htmlFor="kode-transaksi">Debitur : </Label>
                        </div>
                        <div>
                            <Input className="bg-slate-200" type="text" value={debitur.name} readOnly/>
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
                        <div className="flex">
                            <div className="w-1/6">
                                <Label htmlFor="kode-transaksi">Nomor : </Label>
                            </div>
                            <div className="w-full">
                                <Input ref={namaObat} type="text" className="bg-slate-200" value={data.kode_transaksi} readOnly />
                            </div>
                        </div>
                        <div>
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
                    {/*<div className="flex space-x-4">
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
                    </div>*/}
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
                        rowObat.length == 0 ?
                        <TableRow>
                            <TableCell className="border border-slate-100" colSpan={11} align="center">Tidak Ada Transaksi Obat</TableCell>
                        </TableRow>
                        : 
                        rowObat.map((row, key) => (
                            <TableRow key={key} onDoubleClick={(event) => dblClickAct(event, key)}>
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
                                <TableCell className="border border-slate-100">{row.prefixNumDisplay}</TableCell>
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
                <div className="flex space-x-4">
                    <Button size="lg" variant="secondary" className="shadow-sm shadow-slate-500/40" onClick={() => setOpenTransaction(!openTransaction)}>Transaksi</Button>
                </div>
            </div>
        </TransactionLayout>
    )
}