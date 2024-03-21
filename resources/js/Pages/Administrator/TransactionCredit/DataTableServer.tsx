import { useState } from 'react'

import { useQuery, QueryFunctionContext } from '@tanstack/react-query'

import { router } from '@inertiajs/react'

import axios from 'axios'

import { 
    TransactionCredit, 
    PrescriptionList,
    PrescriptionDetail
} from './typeProps'

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

import { formatRupiah } from '@/lib/helper'

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
        const response = await axios.get<{medicines:Medicine[], max_page:number}>(
            route('api.medicines.get-all'),
            {
                params: {
                    page_num: pageNum,
                    search,
                    filter
                }
        });
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

export function DataTableHargaObat() {
  
  const { toast } = useToast();

  const [pageNum, setPageNum] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const fetchHargaObat = async ({
    queryKey,
  }: QueryFunctionContext<[string, number]>): Promise<{
    medicine_price_parameters: Medicine[];
    max_page: number;
  }> => {
    const [_, pageNum] = queryKey;
    const response = await axios.get<{
      data:{
        medicine_price_parameters: Medicine[];
        max_page: number;
      }
    }>(route("api.medicines.get-all-with-price-parameters"), {
      params: {
        page_num: pageNum,
        search,
      },
    });
    return response.data.data;
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["hargaObat", pageNum],
    queryFn: fetchHargaObat,
  });

  return (
    <>
      <div className="flex w-full space-x-4">
        <Input
          type="search"
          placeholder="Cari ..."
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button variant="secondary" onClick={() => refetch()}>
          Cari
        </Button>
      </div>
      <Table className="border-collapse border border-slate-200">
        <TableHeader>
          <TableRow>
            <TableHead className="border border-slate-200">No</TableHead>
            <TableHead className="border border-slate-200">Nama Obat</TableHead>
            <TableHead className="border border-slate-200">Pabrik</TableHead>
            <TableHead className="border border-slate-200">Satuan</TableHead>
            <TableHead className="border border-slate-200">Stok Obat</TableHead>
            <TableHead className="border border-slate-200">
              Harga Obat
            </TableHead>
            <TableHead className="border border-slate-200">
              Harga Obat + PPn
            </TableHead>
            <TableHead className="border border-slate-200">Hja/Net</TableHead>
            <TableHead className="border border-slate-200">Harga Resep Tunai</TableHead>
            <TableHead className="border border-slate-200">Harga UPDS</TableHead>
            <TableHead className="border border-slate-200">Harga HV/OTC</TableHead>
            <TableHead className="border border-slate-200">Harga Resep Kredit</TableHead>
            <TableHead className="border border-slate-200">Harga Enggros Faktur</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={13}>
                <p className="text-center">Loading ... </p>
              </TableCell>
            </TableRow>
          ) : data?.medicine_price_parameters.length == 0 ? (
            <TableRow>
              <TableCell colSpan={13}>
                <p className="text-center">Empty Data!</p>
              </TableCell>
            </TableRow>
          ) : (
            data?.medicine_price_parameters.map((row, key) => (
              <TableRow key={key}>
                <TableCell>{key + pageNum + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.medicine_factory.name}</TableCell>
                <TableCell>{row.unit_medicine}</TableCell>
                <TableCell>{row.stock}</TableCell>
                <TableCell>{row.capital_price}</TableCell>
                <TableCell>{row.capital_price_vat}</TableCell>
                <TableCell>{row.sell_price}</TableCell>
                <TableCell>{row.resep_tunai_price}</TableCell>
                <TableCell>{row.upds_price}</TableCell>
                <TableCell>{row.hv_otc_price}</TableCell>
                <TableCell>{row.resep_kredit_price}</TableCell>
                <TableCell>{row.enggros_faktur_price}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={13}>
              <div className="flex w-full items-center justify-center">
                <div className="mx-2">
                  <Button
                    variant="outline"
                    onClick={() => setPageNum((pageNum) => pageNum - 5)}
                    disabled={pageNum == 0}
                  >
                    Prev
                  </Button>
                </div>
                <div className="mx-2">
                  <p className="text-center">
                    {pageNum == 0 ? 1 : pageNum / 5 + 1} of {data?.max_page}
                  </p>
                </div>
                <div className="mx-2">
                  <Button
                    variant="outline"
                    onClick={() => setPageNum((pageNum) => pageNum + 5)}
                    disabled={pageNum / 5 + 1 == data?.max_page}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

export function DataTableTransactionCredit({onOpenTransaction}: { onOpenTransaction:CallableFunction }) {
    const { toast } = useToast();

    const [pageNum, setPageNum]                       = useState<number>(0)
    const [search, setSearch]                         = useState<string>('')
    const [prescriptionId, setPrescriptionId]         = useState<number>(0)
    const [prescriptionListId, setPrescriptionListId] = useState<number>(0)
    const [openDialog, setOpenDialog]                 = useState<string>('transaksi')
    const [disabledButton, setDisabledButton]         = useState<number>(0)

    const fetchTransaksi = async ({queryKey}: QueryFunctionContext<[
        string,
        number
    ]>): Promise<{transaction_credit:TransactionCredit[], max_page:number}> => {
        const [_, pageNum] = queryKey
        const response = await axios.get<{
            data: {
                transaction_credit:TransactionCredit[], max_page:number
            }
        }>(
            route('api.transactions.get-transaction-credit'),
            {
                params: {
                    page_num: pageNum,
                    search
                }
        });
        const result = response.data.data;
        return result;
    };

    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey:['transaksi', pageNum],
        queryFn:fetchTransaksi
    })

    const setStatusCredit = async(id: number): Promise<void> => {
        setDisabledButton(id)
        try {
            await axios.get<void>(route('api.transactions.set-status-credit', id))
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

    const lihatRacikAct = (id: number): void => {
        setPrescriptionId(id)
        setOpenDialog('racik')
    }

    console.log(error)

    return(
        <>
        {
            openDialog == 'transaksi' ? 
            <>
            <div className="flex w-full space-x-4">
                <Input type="search" placeholder="Cari ..." onChange={(event) => setSearch(event.target.value)} />
                <Button variant="secondary" onClick={() => refetch()}>Cari</Button>
            </div>
            <Table className="border-collapse border border-slate-200">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-slate-200">No</TableHead>
                  <TableHead className="border border-slate-200">Nomor Transaksi</TableHead>
                  <TableHead className="border border-slate-200">Tanggal Transaksi</TableHead>
                  <TableHead className="border border-slate-200">Tanggal Resep</TableHead>
                  <TableHead className="border border-slate-200">Nama Customer</TableHead>
                  <TableHead className="border border-slate-200">Nama Group</TableHead>
                  <TableHead className="border border-slate-200">Nama Pasien</TableHead>
                  <TableHead className="border border-slate-200">Nama Dokter</TableHead>
                  <TableHead className="border border-slate-200">Harga Total</TableHead>
                  <TableHead className="border border-slate-200">Input By</TableHead>
                  <TableHead className="border border-slate-200">#</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                    isLoading ?
                    <TableRow>
                        <TableCell colSpan={11}><p className="text-center">Loading ... </p></TableCell>
                    </TableRow>
                    :
                    data?.transaction_credit.length == 0 ? 
                    <TableRow>
                        <TableCell colSpan={10}><p className="text-center">Empty Data!</p></TableCell>
                    </TableRow> :
                    data?.transaction_credit.map((row, key) => (
                        <TableRow key={key}>
                            <TableCell>{key+pageNum+1}</TableCell>
                            <TableCell>{row.invoice_number}</TableCell>
                            <TableCell>{row.date_transaction}</TableCell>
                            <TableCell>{row.date_prescription}</TableCell>
                            <TableCell>{row.customer.name}</TableCell>
                            <TableCell>{row.group_name}</TableCell>
                            <TableCell>{row.prescription.patient.name}</TableCell>
                            <TableCell>{row.prescription.doctor.name}</TableCell>
                            <TableCell>Rp. {formatRupiah(row.total)}</TableCell>
                            <TableCell>{row.user.name}</TableCell>
                            <TableCell className="space-y-2 flex flex-col">
                                <Button
                                    className="bg-cyan-500"
                                    asChild
                                >
                                    <a href={route('administrator.transaction-credit.print-invoice', row.id)}>Print</a>
                                </Button>
                                <Button 
                                    variant={row.status_transaction == 1 ? "success" : "destructive"}
                                    onClick={() => setStatusCredit(row.id)}
                                    disabled={disabledButton == row.id || row.status_transaction == 1}
                                >
                                    {row.status_transaction == 1 ? 'Lunas' : 'Hutang'}
                                </Button>
                                <Button 
                                    onClick={() => lihatRacikAct(row.prescription_id)}
                                >
                                    Lihat Racik
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                    <TableCell colSpan={11}>
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
            </> : openDialog == 'racik' ? 
            <DataTableRacik 
                prescriptionId={prescriptionId}
                setPrescriptionListId={setPrescriptionListId}
                onOpenTransaction={setOpenDialog}
            /> : openDialog == 'detail-racik' ? 
            <DataTableRacikDetail 
                prescriptionId={prescriptionId}
                prescriptionListId={prescriptionListId}
                onOpenTransaction={setOpenDialog}
            /> : ''
        }
        </>
    )
}

export function DataTableRacik({
    prescriptionId, setPrescriptionListId, onOpenTransaction
}: {prescriptionId: number, setPrescriptionListId:CallableFunction, onOpenTransaction:CallableFunction}) {

    const { toast } = useToast();

    const [pageNum, setPageNum]                       = useState<number>(0)
    const [search, setSearch]                         = useState<string>('')

    const fetchRacik = async ({queryKey}: QueryFunctionContext<[
        string,
        number,
        number
    ]>): Promise<{racik:PrescriptionList[], max_page:number}> => {
        const [_, pageNum, prescriptionId] = queryKey
        const response = await axios.get<{
            data: {
                racik:PrescriptionList[], max_page:number
            }
        }>(
            route('api.transactions.get-prescription-lists', prescriptionId),
            {
                params: {
                    page_num: pageNum,
                    search
                }
        });
        const result = response.data.data;
        return result;
    };

    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey:['racik', pageNum, prescriptionId],
        queryFn:fetchRacik
    })

    const detailRacikAct = (id: number): void => {
        setPrescriptionListId(id)
        onOpenTransaction('detail-racik')
    }

    return(
        <>
            <Button variant="secondary" className="w-20" onClick={() => onOpenTransaction('transaksi')}>Kembali</Button>
            <div className="flex w-full space-x-4">
                <Input type="search" placeholder="Cari ..." onChange={(event) => setSearch(event.target.value)} />
                <Button variant="secondary" onClick={() => refetch()}>Cari</Button>
            </div>
            <Table className="border-collapse border border-slate-200">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-slate-200">No</TableHead>
                  <TableHead className="border border-slate-200">Nama Resep</TableHead>
                  <TableHead className="border border-slate-200">Jasa Racik</TableHead>
                  <TableHead className="border border-slate-200">Total Biaya</TableHead>
                  <TableHead className="border border-slate-200">Jumlah Racik</TableHead>
                  <TableHead className="border border-slate-200">#</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                    isLoading ?
                    <TableRow>
                        <TableCell colSpan={11}><p className="text-center">Loading ... </p></TableCell>
                    </TableRow>
                    :
                    data?.racik.length == 0 ? 
                    <TableRow>
                        <TableCell colSpan={10}><p className="text-center">Empty Data!</p></TableCell>
                    </TableRow> :
                    data?.racik.map((row, key) => (
                        <TableRow key={key}>
                            <TableCell>{key+pageNum+1}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>Rp. {formatRupiah(row.service_fee)}</TableCell>
                            <TableCell>Rp. {formatRupiah(row.total_costs)}</TableCell>
                            <TableCell>{row.total_prescription_packs}</TableCell>
                            <TableCell>
                                <Button 
                                    onClick={() => detailRacikAct(row.id)}
                                >
                                    Detail Racik
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                    <TableCell colSpan={11}>
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

export function DataTableRacikDetail({
    prescriptionId, prescriptionListId, onOpenTransaction
}: {prescriptionId: number, prescriptionListId: number, onOpenTransaction:CallableFunction}) {


    const { toast } = useToast();

    const [pageNum, setPageNum]                       = useState<number>(0)
    const [search, setSearch]                         = useState<string>('')

    const fetchRacik = async ({queryKey}: QueryFunctionContext<[
        string,
        number,
        number,
        number
    ]>): Promise<{racik_detail:PrescriptionDetail[], max_page:number}> => {
        const [_, pageNum, prescriptionId, prescriptionListId] = queryKey
        const response = await axios.get<{
            data: {
                racik_detail:PrescriptionDetail[], max_page:number
            }
        }>(
            route('api.transactions.get-prescription-details', {
                prescription_id:prescriptionId,
                prescription_list_id:prescriptionListId
            }),
            {
                params: {
                    page_num: pageNum,
                    search
                }
        });
        const result = response.data.data;
        return result;
    };

    const { isLoading, isError, data, error, refetch } = useQuery({
        queryKey:['racik_detail', pageNum, prescriptionId, prescriptionListId],
        queryFn:fetchRacik
    })

    return(
        <>
            <Button variant="secondary" className="w-20" onClick={() => onOpenTransaction('racik')}>Kembali</Button>
            <div className="flex w-full space-x-4">
                <Input type="search" placeholder="Cari ..." onChange={(event) => setSearch(event.target.value)} />
                <Button variant="secondary" onClick={() => refetch()}>Cari</Button>
            </div>
            <Table className="border-collapse border border-slate-200">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-slate-200">No</TableHead>
                  <TableHead className="border border-slate-200">Nama Obat</TableHead>
                  <TableHead className="border border-slate-200">Qty</TableHead>
                  <TableHead className="border border-slate-200">Dosis</TableHead>
                  <TableHead className="border border-slate-200">Sub Total</TableHead>
                  <TableHead className="border border-slate-200">Jasa</TableHead>
                  <TableHead className="border border-slate-200">Total</TableHead>
                  <TableHead className="border border-slate-200">Faktor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                    isLoading ?
                    <TableRow>
                        <TableCell colSpan={11}><p className="text-center">Loading ... </p></TableCell>
                    </TableRow>
                    :
                    data?.racik_detail.length == 0 ? 
                    <TableRow>
                        <TableCell colSpan={10}><p className="text-center">Empty Data!</p></TableCell>
                    </TableRow> :
                    data?.racik_detail.map((row, key) => (
                        <TableRow key={key}>
                            <TableCell>{key+pageNum+1}</TableCell>
                            <TableCell>{row.medicine.name}</TableCell>
                            <TableCell>{row.qty}</TableCell>
                            <TableCell>{row.dose}</TableCell>
                            <TableCell>Rp. {formatRupiah(row.sub_total)}</TableCell>
                            <TableCell>Rp. {formatRupiah(row.service_fee)}</TableCell>
                            <TableCell>Rp. {formatRupiah(row.total)}</TableCell>
                            <TableCell>{row.faktor}</TableCell>
                        </TableRow>
                    ))
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                    <TableCell colSpan={11}>
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