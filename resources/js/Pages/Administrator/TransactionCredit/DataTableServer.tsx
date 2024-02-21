import { useState } from 'react'

import { useQuery, QueryFunctionContext } from '@tanstack/react-query'

import axios from 'axios'

import { Medicine } from '@/Pages/Administrator/Medicine/type'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/Components/ui/table"

import { Button } from '@/Components/ui/button'

import { Input } from '@/Components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"

import { useToast } from '@/Components/ui/use-toast'

export function DataTableMasterObat() {

    const { toast } = useToast();

    const [pageNum, setPageNum]               = useState<number>(0)
    const [search, setSearch]                 = useState<string>('')
    const [filter, setFilter]                 = useState<string>('name')
    const [disabledButton, setDisabledButton] = useState<number>(0)

    const fetchMasterObat = async ({queryKey}: QueryFunctionContext<[
        string, 
        number
    ]>): Promise<{medicines:Medicine[], max_page:number}> => {
        const [_, pageNum] = queryKey
        const response = await axios.get<{medicines:Medicine[], max_page:number}>(route('api.medicines.get-all',{
            page_num: pageNum,
            search,
            filter
        }));
        return response.data;
    };

    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey:['masterObat', pageNum],
        queryFn:fetchMasterObat
    })

    const setStatusMedicine = async(id: number): Promise<void> => {
        setDisabledButton(id)
        try {
            await axios.get<void>(route('api.medicines.set-status', id))
            setDisabledButton(0)
            refetch()
        } catch(error) {
            if(axios.isAxiosError(error)) {
                toast({
                  variant: "destructive",
                  title: "Error!",
                  description: error.response?.data.message,
                })
            }
        }
    }

    return(
        <>
            <div className="flex w-full space-x-4">
                <Select defaultValue={filter} value={filter} onValueChange={(value) => setFilter(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="=== Filter ===" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Nama</SelectItem>
                        <SelectItem value="composition">Komposisi</SelectItem>
                        <SelectItem value="generic">Generic</SelectItem>
                    </SelectContent>
                </Select>
                <Input type="search" placeholder="Cari ..." onChange={(event) => setSearch(event.target.value)} />
                <Button variant="secondary" onClick={() => refetch()}>Cari</Button>
            </div>
            <Table className="border-collapse border border-slate-200">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-slate-200">No</TableHead>
                  <TableHead className="border border-slate-200">Nama Obat</TableHead>
                  <TableHead className="border border-slate-200">Pabrik</TableHead>
                  <TableHead className="border border-slate-200">Komposisi</TableHead>
                  <TableHead className="border border-slate-200">Satuan</TableHead>
                  <TableHead className="border border-slate-200">Stok Obat</TableHead>
                  <TableHead className="border border-slate-200">Harga Obat</TableHead>
                  <TableHead className="border border-slate-200">Harga Obat + PPn</TableHead>
                  <TableHead className="border border-slate-200">Hja/Net</TableHead>
                  <TableHead className="border border-slate-200">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                    isLoading ?
                    <TableRow>
                        <TableCell colSpan={10}><p className="text-center">Loading ... </p></TableCell>
                    </TableRow>
                    :
                    data?.medicines.length == 0 ? 
                    <TableRow>
                        <TableCell colSpan={10}><p className="text-center">Empty Data!</p></TableCell>
                    </TableRow> :
                    data?.medicines.map((row, key) => (
                        <TableRow key={key}>
                            <TableCell>{key+pageNum+1}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.medicine_factory.name}</TableCell>
                            <TableCell>{row.composition}</TableCell>
                            <TableCell>{row.unit_medicine}</TableCell>
                            <TableCell>{row.stock}</TableCell>
                            <TableCell>{row.capital_price}</TableCell>
                            <TableCell>{row.capital_price_vat}</TableCell>
                            <TableCell>{row.sell_price}</TableCell>
                            <TableCell>
                                <Button 
                                    variant={row.is_active == 1 ? "success" : "destructive"}
                                    onClick={() => setStatusMedicine(row.id)}
                                    disabled={disabledButton == row.id}
                                >
                                    {row.is_active == 1 ? 'AKTIF' : 'TIDAK AKTIF'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                    <TableCell colSpan={10}>
                        <div className="flex items-center justify-center w-full">
                            <div className="mx-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setPageNum((pageNum) => pageNum - 5)} 
                                    disabled={pageNum == 0}
                                >Prev</Button>
                            </div>
                            <div className="mx-2">
                                <p className="text-center">{pageNum == 0 ? 1 : ((pageNum / 5) + 1)} of {data?.max_page}</p>
                            </div>
                            <div className="mx-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setPageNum(pageNum => pageNum + 5)}
                                    disabled={(pageNum / 5) + 1 == data?.max_page}
                                >Next</Button>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
        </>
    )
}