import { 
    useState, 
    useRef,
    useEffect, 
    FormEventHandler, 
    SetStateAction, 
    ChangeEvent, 
    KeyboardEvent 
} from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps, PatientCategory } from '@/types'

import { Input } from '@/Components/ui/input'

import { DrugClassification } from '@/Pages/Administrator/DrugClassification/type'
import { MedicalSupplier } from '@/Pages/Administrator/MedicalSupplier/type'
import { MedicineFactory } from '@/Pages/Administrator/MedicineFactory/type'
import { Ppn } from '@/Pages/Administrator/Ppn/type'

import { MedicineForm } from './type'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Button } from '@/Components/ui/button'
import { Checkbox } from '@/Components/ui/checkbox'

type MedicineCreateProps = {
    code:string;
    drug_classifications:DrugClassification[]
    medical_suppliers:MedicalSupplier[]
    medicine_factories:MedicineFactory[]
    ppn:Ppn;
}

interface Result {
    drug_classification:{
        is_prekursor:number,
        is_narcotic:number,
        is_psychotropic:number
    }
}

export default function Create({
    auth, code, drug_classifications, medical_suppliers, medicine_factories, ppn
}: PageProps & MedicineCreateProps) {

    const [isPrekursor, setIsPrekursor] = useState<number>(0)
    const [isNarcotic, setIsNarcotic] = useState<number>(0)
    const [isPsychotropic, setIsPsychotropic] = useState<number>(0)

    const { data, setData, post, processing, errors, reset } = useForm<MedicineForm>({
        code,
        date_expired:'',
        batch_number:'',
        barcode:'',
        name:'',
        drug_classification_id:null,
        medical_supplier_id:null,
        medicine_factory_id:null,
        min_stock_supplier:null,
        is_generic:0,
        is_active:0,
        is_prescription:0,
        stock:null,
        piece_weight:1,
        pack_medicine:'',
        unit_medicine:'',
        medicinal_preparations:'',
        location_rack:'',
        dose:null,
        composition:'',
        is_fullpack:0,
        capital_price:null,
        capital_price_vat:null,
        sell_price:null
    });

    // USE REF SECTION //
    const batchNumberRef           = useRef<any>()
    const medicineFactoryRef       = useRef<any>()
    const drugClassificationRef    = useRef<any>()
    const compositionRef           = useRef<any>()
    const locationRackRef          = useRef<any>()
    const genericRef               = useRef<any>({})
    const nameRef                  = useRef<any>()
    const dateExpiredRef           = useRef<any>()
    const packMedicineRef          = useRef<any>()
    const stockRef                 = useRef<any>()
    const unitMedicineRef          = useRef<any>()
    const doseRef                  = useRef<any>()
    const pieceWeightRef           = useRef<any>()
    const bobotSatuanRef           = useRef<any>()
    const medicinalPreparationsRef = useRef<any>()
    const barcodeRef               = useRef<any>()
    const isFullpackRef            = useRef<any>()
    const capitalPriceRef          = useRef<any>()
    const capitalPriceVatRef       = useRef<any>()
    const sellPriceRef             = useRef<any>()
    const medicalSupplierRef       = useRef<any>()
    const minStockSupplierRef      = useRef<any>()
    const activeRef                = useRef<any>()
    const prescriptionRef          = useRef<any>()
    const submitBtnRef             = useRef<any>()

    // END USE REF SECTION //

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('administrator.medicines.store'));
    }

    const onChangeAct = async(value: string) => {
        
        setData('drug_classification_id', parseInt(value))

        try {
            const { data } = await axios.get<Result>(route('api.drug-classifications.get-by-id', value))
            setIsPrekursor(data.drug_classification.is_prekursor)
            setIsNarcotic(data.drug_classification.is_narcotic)
            setIsPsychotropic(data.drug_classification.is_psychotropic)
        } catch(error) {
            console.error(error)
        }

    }

    const calculatePpn = (event: ChangeEvent<HTMLInputElement>): void => {
        let value: number        = parseInt(event.target.value)
        const { nilai_ppn }: Ppn = ppn
        let result: number       = 0

        result = value + ((value * nilai_ppn) / 100)

        setData(data => ({
            ...data,
            capital_price: value,
            capital_price_vat: result
        }))
    }

    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="data-obat"
            routeChild="data-obat"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Obat</h2>}
        >
            <Head title="Form Obat" />

            <div className="py-12">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary" asChild>
                                <Link href={route('administrator.medicines')}>Kembali</Link>
                            </Button>
                        </div>
                        {/*<form onSubmit={submitForm}>*/}
                        <div className="grid grid-cols-2 gap-5">
                            <div id="section-1">
                                <fieldset className="border border-black p-[1.4rem] m-[1rem] rounded-md">
                                    <legend className="mb-[5px] p-[10px] font-medium">Kode</legend>
                                    <div className="flex">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="code" value="Kode Obat" />
                                        </div>
                                        <div className="w-full">
                                            <Input
                                                id="code"
                                                type="text"
                                                name="code"
                                                value={data.code}
                                                className="mt-1 block w-full"
                                                readOnly
                                            />
                                            
                                            <InputError message={errors.code} className="mt-2" />
                                        </div>

                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="batch_number" value="Nomor Batch" />
                                        </div>
                                        <div className="w-full">
                                            <Input
                                                ref={batchNumberRef}
                                                id="batch_number"
                                                type="text"
                                                name="batch_number"
                                                value={data.batch_number}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('batch_number',e.target.value)}
                                                onKeyDown={(event) => {
                                                    if(event.keyCode == 13) {
                                                        medicineFactoryRef.current.focus()
                                                    }
                                                }}
                                                autoFocus
                                            />
                                            
                                            <InputError message={errors.batch_number} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="medicine_factory_id" value="Pabrik Obat" />
                                        </div>
                                        
                                        <div className="w-full">
                                            <Select onValueChange={(value) => setData('medicine_factory_id', parseInt(value))}>
                                              <SelectTrigger ref={medicineFactoryRef} id="medicine_factory_id" className="w-full">
                                                <SelectValue placeholder="=== Pilih Pabrik Obat ===" />
                                              </SelectTrigger>
                                              <SelectContent onCloseAutoFocus={(event) => {
                                                event.preventDefault()
                                                drugClassificationRef.current.focus()
                                              }}>
                                                {
                                                    medicine_factories.map((row, key) => (
                                                        <SelectItem value={row.id.toString()} key={key}>{row.name}</SelectItem>
                                                    ))
                                                }
                                              </SelectContent>
                                            </Select>
                                            
                                            <InputError message={errors.medicine_factory_id} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="drug_classification_id" value="Golongan Obat" />
                                        </div>
                                        
                                        <div className="w-full">
                                            <Select onValueChange={(value) => onChangeAct(value)}>
                                              <SelectTrigger ref={drugClassificationRef} id="drug_classification_id" className="w-full">
                                                <SelectValue placeholder="=== Pilih Golongan Obat ===" />
                                              </SelectTrigger>
                                              <SelectContent onCloseAutoFocus={(event) => {
                                                event.preventDefault()
                                                compositionRef.current.focus()
                                              }}>
                                                {
                                                    drug_classifications.map((row, key) => (
                                                        <SelectItem value={row.id.toString()} key={key}>{row.name}</SelectItem>
                                                    ))
                                                }
                                              </SelectContent>
                                            </Select>
                                            
                                            <InputError message={errors.drug_classification_id} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="composition" value="Komposisi" />
                                        </div>
                                        <div className="w-full">
                                            <Input
                                                ref={compositionRef}
                                                id="composition"
                                                type="text"
                                                name="composition"
                                                value={data.composition}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('composition',e.target.value)}
                                                onKeyDown={(event) => {
                                                    if(event.keyCode == 13) {
                                                        locationRackRef.current.focus()
                                                    }
                                                }}
                                            />
                                            
                                            <InputError message={errors.composition} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="location_rack" value="Lokasi Rak" />
                                        </div>
                                        <div className="w-full">
                                            <Input
                                                ref={locationRackRef}
                                                id="location_rack"
                                                type="text"
                                                name="location_rack"
                                                value={data.location_rack}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('location_rack',e.target.value)}
                                                onKeyDown={(event) => {
                                                    if(event.keyCode == 13) {
                                                        genericRef.current['is_true'].focus()
                                                    }
                                                }}
                                            />

                                            <InputError message={errors.location_rack} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="is_generic" value="Generic" />
                                        </div>
                                        <div className="w-full gap-5 flex">
                                            <div>
                                                <input 
                                                    ref={ref => genericRef.current['is_true'] = ref} 
                                                    type="radio" 
                                                    id="is_generic" 
                                                    name="is_generic" 
                                                    value={1} 
                                                    onClick={() => setData('is_generic',1)} 
                                                    onKeyDown={(event) => {
                                                        if(event.keyCode == 13) {
                                                            nameRef.current.focus()
                                                        }
                                                    }}
                                                /> YA
                                            </div>
                                            <div>
                                                <input 
                                                    ref={ref => genericRef.current['is_false'] = ref} 
                                                    type="radio" 
                                                    id="is_generic" 
                                                    name="is_generic" 
                                                    value={0} 
                                                    onClick={() => setData('is_generic',0)} 
                                                    onKeyDown={(event) => {
                                                        if(event.keyCode == 13) {
                                                            nameRef.current.focus()
                                                        }
                                                    }}
                                                /> TIDAK
                                            </div>
                                            <InputError message={errors.is_generic} className="mt-2" />
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="border border-black p-[1.4rem] m-[1rem] rounded-md">
                                    <legend className="mb-[5px] p-[10px] font-medium">Nama</legend>
                                    <div className="flex">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="name" value="Nama Obat" />
                                        </div>
                                        <div className="w-full">
                                            <Input
                                                ref={nameRef}
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('name', e.target.value)}
                                                onKeyDown={(event) => {
                                                    if(event.keyCode == 13) {
                                                        dateExpiredRef.current.focus()
                                                    }
                                                }}
                                            />
                                            
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="date_expired" value="Tanggal Expired" />
                                        </div>
                                        <div className="w-full">
                                            <Input
                                                ref={dateExpiredRef}
                                                id="date_expired"
                                                type="date"
                                                name="date_expired"
                                                value={data.date_expired}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('date_expired',e.target.value)}
                                                onKeyDown={(event) => {
                                                    if(event.keyCode == 13) {
                                                        packMedicineRef.current.focus()
                                                    }
                                                }}
                                            />
                                            
                                            <InputError message={errors.date_expired} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="flex mt-4">
                                            <div className="w-full pt-[2%]">
                                                <InputLabel htmlFor="pack_medicine" value="Kemasan" />
                                            </div>
                                            
                                            <div className="w-full">
                                                <Input
                                                    ref={packMedicineRef}
                                                    id="pack_medicine"
                                                    type="text"
                                                    name="pack_medicine"
                                                    value={data.pack_medicine}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData('pack_medicine', e.target.value)}
                                                    onKeyDown={(event) => {
                                                        if(event.keyCode == 13) {
                                                            stockRef.current.focus()
                                                        }
                                                    }}
                                                />
                                                
                                                <InputError message={errors.pack_medicine} className="mt-2" />
                                            </div>

                                        </div>

                                        <div className="flex mt-4">
                                            <div className="w-full pt-[2%]">
                                                <InputLabel htmlFor="unit_medicine" value="Satuan" />
                                            </div>
                                            
                                            <div className="w-full">
                                                <Input
                                                    ref={unitMedicineRef}
                                                    id="unit_medicine"
                                                    type="text"
                                                    name="unit_medicine"
                                                    value={data.unit_medicine}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData('unit_medicine', e.target.value)}
                                                    onKeyDown={(event) => {
                                                        if(event.keyCode == 13) {
                                                            doseRef.current.focus()
                                                        }
                                                    }}
                                                />

                                                <InputError message={errors.unit_medicine} className="mt-2" />
                                            </div>

                                        </div>

                                        <div className="flex">
                                            <div className="w-full pt-[2%]">
                                                <InputLabel htmlFor="stock" value="Isi Obat" />
                                            </div>
                                            
                                            <div className="w-full">
                                                <Input
                                                    ref={stockRef}
                                                    id="stock"
                                                    type="number"
                                                    name="stock"
                                                    value={data.stock?.toString()}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData('stock', parseInt(e.target.value))}
                                                    onKeyDown={(event) => {
                                                        if(event.keyCode == 13) {
                                                            unitMedicineRef.current.focus()
                                                        }
                                                    }}
                                                />
                                                
                                                <InputError message={errors.stock} className="mt-2" />
                                            </div>

                                        </div>

                                        <div className="flex">
                                            <div className="w-full pt-[2%]">
                                                <InputLabel htmlFor="dose" value="Dosis Obat" />
                                            </div>
                                            
                                            <div className="w-full">
                                                <Input
                                                    ref={doseRef}
                                                    id="dose"
                                                    type="number"
                                                    name="dose"
                                                    value={data.dose?.toString()}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData('dose', parseInt(e.target.value))}
                                                    onKeyDown={(event) => {
                                                        if(event.keyCode == 13) {
                                                            pieceWeightRef.current.focus()
                                                        }
                                                    }}
                                                />
                                                
                                                <InputError message={errors.dose} className="mt-2" />
                                            </div>

                                        </div>

                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="piece_weight" value="Bobot Satuan" />
                                        </div>
                                        
                                        <div className="w-full">
                                            <div className="w-full">
                                                <Input
                                                    ref={pieceWeightRef}
                                                    id="piece_weight"
                                                    type="number"
                                                    name="piece_weight"
                                                    value={data.piece_weight?.toString()}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData('piece_weight', parseInt(e.target.value))}
                                                    onKeyDown={(event) => {
                                                        if(event.keyCode == 13) {
                                                            medicinalPreparationsRef.current.focus()
                                                        }
                                                    }}
                                                />
                                            </div>
                                            
                                            <InputError message={errors.piece_weight} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="medicinal_preparations" value="Sediaan Obat" />
                                        </div>
                                        
                                        <div className="w-full">
                                            <div className="w-full">
                                                <Input
                                                    ref={medicinalPreparationsRef}
                                                    id="medicinal_preparations"
                                                    type="text"
                                                    name="medicinal_preparations"
                                                    value={data.medicinal_preparations}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) => setData('medicinal_preparations', e.target.value)}
                                                    onKeyDown={(event) => {
                                                        if(event.keyCode == 13) {
                                                            barcodeRef.current.focus()
                                                        }
                                                    }}
                                                />
                                            </div>
                                            
                                            <InputError message={errors.medicinal_preparations} className="mt-2" />
                                        </div>

                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="barcode" value="Barcode" />
                                        </div>
                                        <div className="w-full">
                                            <Input
                                                ref={barcodeRef}
                                                id="barcode"
                                                type="text"
                                                name="barcode"
                                                value={data.barcode}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('barcode',e.target.value)}
                                                onKeyDown={(event) => {
                                                    if(event.keyCode == 13) {
                                                        isFullpackRef.current.focus()
                                                    }
                                                }}
                                            />
                                        </div>
                                        <InputError message={errors.barcode} className="mt-2" />
                                    </div>
                                </fieldset>
                            </div>
                            <div id="section-2">
                                 <fieldset className="border border-black p-[1.4rem] m-[1rem] rounded-md">
                                    <legend className="mb-[5px] p-[10px] font-medium">Harga</legend>

                                    <div className="flex">
                                        <div className="w-12">
                                            <InputLabel htmlFor="is_fullpack" value="Utuh" />
                                        </div>
                                        <div className="w-full">
                                            <Checkbox 
                                                ref={isFullpackRef}
                                                id="is_fullpack" 
                                                name="is_fullpack" 
                                                value={data.is_fullpack} 
                                                onClick={() => setData('is_fullpack', data.is_fullpack == 0 ? 1 : 0)}
                                                onKeyDown={(event) => {
                                                    if(event.keyCode == 13) {
                                                        capitalPriceRef.current.focus()
                                                    }
                                                }}
                                            />
                                            <InputError message={errors.is_fullpack} className="mt-2" />
                                        </div>

                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="capital_price" value="Harga HNA" />
                                        </div>
                                        <div className="w-full">
                                            <Input 
                                                ref={capitalPriceRef}
                                                type="number" 
                                                id="capital_price"
                                                name="capital_price"
                                                value={data.capital_price?.toString()}
                                                onChange={calculatePpn}
                                                onKeyDown={(event) => {
                                                    if(event.keyCode == 13) {
                                                        capitalPriceVatRef.current.focus()
                                                    }
                                                }}
                                            />

                                            <InputError message={errors.capital_price} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="capital_price_vat" value="Harga PPn" />
                                        </div>
                                        <div className="w-full">
                                            <Input 
                                                ref={capitalPriceVatRef}
                                                type="number" 
                                                id="capital_price_vat"
                                                name="capital_price_vat"
                                                value={data.capital_price_vat?.toString()}
                                                onChange={(e) => setData('capital_price_vat',parseInt(e.target.value))}
                                                onKeyDown={(event) => {
                                                    if(event.keyCode == 13) {
                                                        sellPriceRef.current.focus()
                                                    }
                                                }}
                                            />

                                            <InputError message={errors.capital_price_vat} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="sell_price" value="Hja/Net" />
                                        </div>
                                        <div className="w-full">
                                            <Input 
                                                ref={sellPriceRef}
                                                type="number" 
                                                id="sell_price"
                                                name="sell_price"
                                                value={data.sell_price?.toString()}
                                                onChange={(e) => setData('sell_price',parseInt(e.target.value))}
                                                onKeyDown={(event) => {
                                                    if(event.keyCode == 13) {
                                                        medicalSupplierRef.current.focus()
                                                    }
                                                }}
                                            />

                                            <InputError message={errors.sell_price} className="mt-2" />
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="border border-black p-[1.4rem] m-[1rem] rounded-md">
                                    <legend className="mb-[5px] p-[10px] font-medium">Lain - Lain</legend>

                                    <div className="flex">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="medical_supplier_id" value="Kreditur" />
                                        </div>
                                        <div className="w-full">
                                            <Select onValueChange={(value) => setData('medical_supplier_id', parseInt(value))}>
                                              <SelectTrigger ref={medicalSupplierRef} id="medical_supplier_id" className="w-full">
                                                <SelectValue placeholder="=== Pilih Kreditur ===" />
                                              </SelectTrigger>
                                              <SelectContent onCloseAutoFocus={(event) => {
                                                event.preventDefault()
                                                minStockSupplierRef.current.focus()
                                              }}>
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

                                    <div className="flex mt-4">
                                        <div className="w-2/6 pt-[2%]">
                                            <InputLabel htmlFor="min_stock_supplier" value="Min Stok Supplier" />
                                        </div>
                                        <div className="w-full">
                                            <Input 
                                                ref={minStockSupplierRef}
                                                type="number" 
                                                id="min_stock_supplier"
                                                name="min_stock_supplier"
                                                value={data.min_stock_supplier?.toString()}
                                                onChange={(e) => setData('min_stock_supplier',parseInt(e.target.value))}
                                                onKeyDown={(event) => {
                                                    if(event.keyCode == 13) {
                                                        activeRef.current.focus()
                                                    }
                                                }}
                                            />

                                            <InputError message={errors.min_stock_supplier} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-12">
                                            <InputLabel htmlFor="is_active" value="Active" />
                                        </div>
                                        <div className="w-full">
                                            <Checkbox 
                                                ref={activeRef}
                                                id="is_active" 
                                                name="is_active" 
                                                value={data.is_active} 
                                                onClick={() => setData('is_active', data.is_active == 0 ? 1 : 0)}
                                                onKeyDown={(event) => {
                                                    if (event.keyCode == 13) {
                                                        prescriptionRef.current.focus()
                                                    }
                                                }}
                                            />
                                            <InputError message={errors.is_active} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-12">
                                            <InputLabel htmlFor="is_prescription" value="Resep" />
                                        </div>
                                        <div className="w-full">
                                            <Checkbox 
                                                ref={prescriptionRef}
                                                id="is_prescription" 
                                                name="is_prescription" 
                                                value={data.is_prescription} 
                                                onClick={() => setData('is_prescription', data.is_prescription == 0 ? 1 : 0)}
                                                onKeyDown={(event) => {
                                                    if(event.keyCode == 13) {
                                                        submitBtnRef.current.focus()
                                                    }
                                                }}
                                            />
                                            <InputError message={errors.is_prescription} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-20">
                                            <InputLabel htmlFor="is_prekursor" value="Prekursor" />
                                        </div>
                                        <div className="w-full">
                                            <Checkbox
                                                id="is_prekursor" 
                                                name="is_prekursor" 
                                                checked={isPrekursor == 1}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-20">
                                            <InputLabel htmlFor="is_narcotic" value="Narkotika" />
                                        </div>
                                        <div className="w-full">
                                            <Checkbox 
                                                id="is_narcotic" 
                                                name="is_narcotic"
                                                checked={isNarcotic == 1}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <div className="w-28">
                                            <InputLabel htmlFor="is_psychotropic" value="Psikotropika" />
                                        </div>
                                        <div className="w-full">
                                            <Checkbox 
                                                id="is_psychotropic" 
                                                name="is_psychotropic"
                                                checked={isPsychotropic == 1}
                                            />
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                            <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                                <Button ref={submitBtnRef} onClick={submitForm} disabled={processing}>Simpan</Button>
                            </div>

                        {/*</form>*/}
                    </div>
                </div>
            </div>
        </AdministratorLayout>
    )
}