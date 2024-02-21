import React from 'react'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"

import { Button } from '@/Components/ui/button'

import { Input } from '@/Components/ui/input'

import { Label } from '@/Components/ui/label'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"

interface ColumnLists {
    columnFilter:string
    columnName:string
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  columnLists?: ColumnLists[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  columnLists,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [selectColumn, setSelectColumn] = React.useState<string>(columnLists !== undefined ? columnLists[0].columnFilter : '')
  const [globalFilter, setGlobalFilter] = React.useState<string>('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
        pagination:{
            pageSize:5
        }
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      globalFilter
    },
  })

  const selectColumnAct = (value: string) => {
    setSelectColumn(value)
  }

  return (
        <>
        <div className="grid grid-cols-2 items-end gap-7 py-4">
        {
            columnLists !== undefined ?
            <Select onValueChange={selectColumnAct}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="=== Filter Kolom ===" />
                </SelectTrigger>
                <SelectContent>
                        {
                            columnLists.map((column, key) => (
                                <SelectItem key={key} value={column.columnFilter}>{column.columnName}</SelectItem>
                            ))
                        }
                </SelectContent>
            </Select>
            : ''
            }
            <Input
                placeholder={`Cari ...`}
                value={globalFilter ?? ""}
                onChange={(event) => 
                    setGlobalFilter(event.target.value)
                }
                className="max-w-md"
                autoFocus
            />
      </div>
      <Table className="border border-slate-100">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="border border-slate-100">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, key) => (
              <TableRow
                key={row.id}
                className="border border-slate-100"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border border-slate-100">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length+1} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Label>{table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      </>
  )
}
