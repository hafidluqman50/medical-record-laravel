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
  resep_kredit : string
  enggros_faktur : string
}

export type TransactionResepPageProps = {
    kode_transaksi:string
    price_parameter:PriceParameter
    medicines:Medicine[]
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
    name:string
    unit_medicine:string
    sell_price:number
    qty:number
    sub_total:number
    jasa:number
    total:number
    faktor:string
    prefixNum:string
}