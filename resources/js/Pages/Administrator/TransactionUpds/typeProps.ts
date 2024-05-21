
import { PriceParameter } from '@/Pages/Administrator/PriceParameter/type'

export type TransactionUpdsPageProps = {
    kode_transaksi:string
    price_parameter:PriceParameter
    medicine_price_parameters: MedicinePriceParameters[]
}

export interface UpdsForm {
    indexObat:number|null
    medicine_id:string[]
    price:number[]
    qty:number[]
    sub_total:number[]
    disc:number[]
    total:number[]
    faktor: string[]
    sub_total_grand:number
    total_grand:number
    diskon_grand:number
    diskon_bayar:number
    bayar:number
    kembalian:number
    kode_transaksi:string
    jenis_pembayaran:string   
}

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

export interface RowObat {
    is_hja_net:boolean
    code:string
    name:string
    unit_medicine:string
    sell_price:number
    qty:number
    sub_total:number
    disc:number
    total:number
    faktor:string
}