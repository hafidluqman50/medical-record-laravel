import { ColumnDef, createColumnHelper } from "@tanstack/react-table"

import { MedicinePriceParameters } from './typeProps'

import { Medicine } from '@/Pages/Administrator/Medicine/type'

import { Patient } from '@/Pages/Administrator/Patient/type'

interface ColumnLists {
    columnFilter:string
    columnName:string
}

const columnHelper = createColumnHelper<MedicinePriceParameters>()

export const columns: ColumnDef<MedicinePriceParameters, any>[] = [
  columnHelper.display({
     id:'No.',
     header:() => 'No.',
    cell: (row) => row.row.index+1,
  }),
  columnHelper.accessor('name', {
     header:() => 'Nama Obat',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('medicine_factory_name', {
     header:() => 'Pabrik',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('unit_medicine', {
     header:() => 'Satuan',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('stock', {
     header:() => 'Stok Obat',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('capital_price', {
     header:() => 'Harga Hna',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('capital_price_vat', {
     header:() => 'Harga Hna + PPn',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('sell_price', {
     header:() => 'Hja/Net',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('resep_tunai_price', {
     header:() => 'Harga Resep Tunai',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('upds_price', {
     header:() => 'Harga UPDS',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('hv_otc_price', {
     header:() => 'Harga HV/OTC',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('resep_kredit_price', {
    header:() => 'Harga Resep Kredit',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('enggros_faktur_price', {
     header:() => 'Harga Enggros Faktur',
    cell: info => info.getValue(),
  }),
]

const columnHelperPatient = createColumnHelper<Patient>()

export const columnPatients: ColumnDef<Patient, any>[] = [
    columnHelperPatient.display({
     id:'No.',
     header:() => 'No.',
    cell: (row) => row.row.index+1,
  }),
  columnHelperPatient.accessor('name', {
     header:() => 'Nama Pasien',
    cell: info => info.getValue(),
  }),
  columnHelperPatient.accessor('patient_category.name', {
     header:() => 'Kategori Pasien',
    cell: info => info.getValue(),
  }),
  columnHelperPatient.accessor('address', {
     header:() => 'Alamat Pasien',
    cell: info => info.getValue(),
  }),
  columnHelperPatient.accessor('phone_number', {
     header:() => 'Nomor HP',
    cell: info => info.getValue(),
  }),
]

export const columnListPatients: ColumnLists[] = [
  {
    columnFilter: "name",
    columnName: "Nama Pasien",
  },
  {
    columnFilter: "patient_category.name",
    columnName: "Kategori Pasien",
  },
  {
    columnFilter: "address",
    columnName: "Alamat",
  },
  {
    columnFilter: "phone_number",
    columnName: "Nomor Telepon",
  }
]

export const columnMedicines: ColumnDef<Medicine>[] = [
  {
    accessorKey: "name",
    header: "Nama Obat",
  },
  {
    accessorKey: "medicine_factory.name",
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
]

export const columnListMedicines: ColumnLists[] = [
  {
    columnFilter: "name",
    columnName: "Nama Obat",
  },
  {
    columnFilter: "medicine_factory_name",
    columnName: "Pabrik",
  },
]