import { ColumnDef, createColumnHelper } from "@tanstack/react-table"

import { MedicinePriceParameters } from './typeProps'

import { Medicine } from '@/Pages/Administrator/Medicine/type'

import { Patient } from '@/Pages/Administrator/Patient/type'

import { Customer } from '@/Pages/Administrator/Customer/type'

const columnHelper = createColumnHelper<Customer>()

export const columns: ColumnDef<Customer, any>[] = [
  columnHelper.display({
     id:'No.',
     header:() => 'No.',
    cell: (row) => row.row.index+1,
  }),
  columnHelper.accessor('debitur_number', {
     header:() => 'Nomor Debitur',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('name', {
     header:() => 'Nama Debitur',
    cell: info => info.getValue(),
  }),
]