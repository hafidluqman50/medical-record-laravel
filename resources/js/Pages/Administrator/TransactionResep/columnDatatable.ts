import { ColumnDef } from "@tanstack/react-table"

import { MedicinePriceParameters } from './typeProps'

interface ColumnLists {
    columnFilter:string
    columnName:string
}

export const columns: ColumnDef<MedicinePriceParameters>[] = [
  {
    accessorKey: "name",
    header: "Nama Obat",
  },
  {
    accessorKey: "medicine_factory_name",
    header: "Pabrik",
  },
  {
    accessorKey: "unit_medicine",
    header: "Satuan",
  },
  {
    accessorKey: "stock",
    header: "Stok Obat",
  },
  {
    accessorKey: "capital_price",
    header: "Harga Obat",
  },
  {
    accessorKey: "capital_price_vat",
    header: "Harga Obat + PPn",
  },
  {
    accessorKey: "sell_price",
    header: "Hja/Net",
  },
  {
    accessorKey: "resep_tunai_price",
    header: "Harga Resep Tunai",
  },
  {
    accessorKey: "upds_price",
    header: "Harga UPDS",
  },
  {
    accessorKey: "hv_otc_price",
    header: "Harga HV/OTC",
  },
  {
    accessorKey: "resep_kredit_price",
    header: "Harga Resep Kredit",
  },
  {
    accessorKey: "enggros_faktur_price",
    header: "Harga Enggros Faktur",
  },
]

export const columnLists: ColumnLists[] = [
  {
    columnFilter: "name",
    columnName: "Nama Obat",
  },
  {
    columnFilter: "medicine_factory_name",
    columnName: "Pabrik",
  },
]