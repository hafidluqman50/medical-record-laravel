import { useState } from "react";

import { useQuery, QueryFunctionContext } from "@tanstack/react-query";

import axios from "axios";

import { Medicine } from "@/Pages/Administrator/Medicine/type";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/Components/ui/table";

import { Button } from "@/Components/ui/button";

import { Input } from "@/Components/ui/input";


import { useToast } from "@/Components/ui/use-toast";


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