import { PriceParameter } from '@/Pages/Administrator/PriceParameter/type'
import { Patient } from '@/Pages/Administrator/Patient/type'
import { Medicine } from '@/Pages/Administrator/Medicine/type'

export interface MedicinePriceParameters {
  id: string
  name: number
  medicine_factory_name: string
  stock: number
  unit_medicine: string
  capital_price: string
  capital_price_vat: string
  sell_price: string
  resep_tunai_price: string
  upds_price : string
  hv_otc_price : string
  resep_kredit_price : string
  enggros_faktur_price : string
}

export interface TransactionPrescription {
    id:number;
    prescription_id:number
    invoice_number:string;
    date_transaction:string;
    prescription:{
        patient:{
            name:string
        },
        doctor:{
            name:string
        }
    }
    discount:number
    total:number
    pay_total:number
    change_money:number
    user:{
        name:string
    }
    status_transaction:number
}

export interface PrescriptionList {
    id:number;
    prescription_id:number;
    name:string;
    service_fee:number;
    total_costs:number;
    total_prescription_packs:number
}

export interface PrescriptionDetail {
    id:number;
    medicine:{
        name:string
    }
    qty:number
    dose:number
    sub_total:number
    service_fee:number
    total:number
    faktor:string
}

export type TransactionResepPageProps = {
    kode_transaksi:string
    price_parameter:PriceParameter
    patients:Patient[]
    medicines:Medicine[]
    medicine_price_parameters: MedicinePriceParameters[]
}

export interface MedicineResep {
    name: string,
    unit_medicine: string,
    sell_price: number,
    qty: number,
    sub_total: number,
    jasa: number,
    total: number,
    faktor: string,
    prefixNum: string
}

export interface ResepTunaiForm {
    medicines: Array<MedicineResep>
    patient_id: number|null
    patient_name: string
    patient_address: string
    patient_phone_number: string
    patient_city_place: string
    doctor_id: number|null
    doctor_code: string
    doctor_name: string
    sub_total_grand: number
    diskon_grand: number
    total_grand: number
    bayar: number
    kembalian: number
    kode_transaksi: string
    jenis_pembayaran: string
}

export interface RowObat {
    code:string
    name:string
    unit_medicine:string
    sell_price:number
    dose_medicine:number
    qty:number
    sub_total:number
    jasa:number
    total:number
    faktor:string
    prefixNum:string
    prefixNumDisplay:string
    prescription_packs:number
    dose:number
}