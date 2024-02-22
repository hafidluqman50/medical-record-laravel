import { PriceParameter } from '@/Pages/Administrator/PriceParameter/type'
import { Patient } from '@/Pages/Administrator/Patient/type'
import { Medicine } from '@/Pages/Administrator/Medicine/type'
import { Customer } from '@/Pages/Administrator/Customer/type'

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
  resep_kredit : string
  enggros_faktur : string
}

export type TransactionCreditPageProps = {
    kode_transaksi:string
    price_parameter:PriceParameter
    patients:Patient[]
    medicines:Medicine[]
    debitur: Customer
    customers: Customer[]
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

export interface ResepCreditForm {
    medicines: Array<MedicineResep>
    patient_id: number|null
    doctor_id: number|null
    date_prescription: string
    group_name: string
    customer_id: number
    sub_total_grand: number
    total_grand: number
    kode_transaksi: string
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

export interface TransactionCredit {
    id:number;
    prescription_id:number
    invoice_number:string;
    date_transaction:string;
    date_prescription:string;
    customer_id:number;
    customer:{
        name:string;
    }
    group_name:string;
    prescription:{
        patient:{
            name:string
        },
        doctor:{
            name:string
        }
    }
    sub_total:number
    total:number
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