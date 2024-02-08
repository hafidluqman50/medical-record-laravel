
import { PriceParameter } from '@/Pages/Administrator/PriceParameter/type'

export type TransactionUpdsPageProps = {
    kode_transaksi:string
    price_parameter:PriceParameter
    medicine_price_parameters: MedicinePriceParameters[]
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
    name:string
    unit_medicine:string
    sell_price:number
    qty:number
    sub_total:number
    disc:number
    total:number
}