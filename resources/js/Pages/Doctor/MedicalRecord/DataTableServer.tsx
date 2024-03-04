import { useState } from "react";

import { useQuery, QueryFunctionContext } from "@tanstack/react-query";

import axios from "axios";

import { router, Link } from "@inertiajs/react";

import {
  TransactionPrescription,
  PrescriptionList,
  PrescriptionDetail,
  ResepTunaiForm,
  RowObat,
} from "./typeProps";

import { Medicine } from "@/Pages/Administrator/Medicine/type";

import {
  MedicalRecord,
  MedicalRecordList,
  MedicalRecordDetail,
} from "@/Pages/Administrator/MedicalRecord/type";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/Components/ui/table";

import { Button } from "@/Components/ui/button";

import { Input } from "@/Components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import { useToast } from "@/Components/ui/use-toast";

import { formatRupiah } from "@/lib/helper";

export function DataTableMasterObat() {
  const { toast } = useToast();

  const [pageNum, setPageNum] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("name");
  const [disabledButton, setDisabledButton] = useState<number>(0);

  const fetchMasterObat = async ({
    queryKey,
  }: QueryFunctionContext<[string, number]>): Promise<{
    medicines: Medicine[];
    max_page: number;
  }> => {
    const [_, pageNum] = queryKey;
    const response = await axios.get<{
      medicines: Medicine[];
      max_page: number;
    }>(route("api.medicines.get-all"), {
      params: {
        page_num: pageNum,
        search,
        filter,
      },
    });
    return response.data;
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["masterObat", pageNum],
    queryFn: fetchMasterObat,
  });

  const setStatusMedicine = async (id: number): Promise<void> => {
    setDisabledButton(id);
    try {
      await axios.get<void>(route("api.medicines.set-status", id));
      setDisabledButton(0);
      refetch();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: error.response?.data.message,
        });
      }
    }
  };

  return (
    <>
      <div className="flex w-full space-x-4">
        <Select
          defaultValue={filter}
          value={filter}
          onValueChange={(value) => setFilter(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="=== Filter ===" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nama</SelectItem>
            <SelectItem value="composition">Komposisi</SelectItem>
            <SelectItem value="generic">Generic</SelectItem>
          </SelectContent>
        </Select>
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
            <TableHead className="border border-slate-200">Komposisi</TableHead>
            <TableHead className="border border-slate-200">Satuan</TableHead>
            <TableHead className="border border-slate-200">Stok Obat</TableHead>
            <TableHead className="border border-slate-200">
              Harga Obat
            </TableHead>
            <TableHead className="border border-slate-200">
              Harga Obat + PPn
            </TableHead>
            <TableHead className="border border-slate-200">Hja/Net</TableHead>
            <TableHead className="border border-slate-200">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={10}>
                <p className="text-center">Loading ... </p>
              </TableCell>
            </TableRow>
          ) : data?.medicines.length == 0 ? (
            <TableRow>
              <TableCell colSpan={10}>
                <p className="text-center">Empty Data!</p>
              </TableCell>
            </TableRow>
          ) : (
            data?.medicines.map((row, key) => (
              <TableRow key={key}>
                <TableCell>{key + pageNum + 1}</TableCell>
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
                    {row.is_active == 1 ? "AKTIF" : "TIDAK AKTIF"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={10}>
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

export function DataTableRekamMedis() {
  const { toast } = useToast();

  const [pageNum, setPageNum] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [medicalRecordId, setMedicalRecordId] = useState<number>(0);
  const [medicalRecordListId, setMedicalRecordListId] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<string>("pasien");

  const fetchMedicalRecord = async ({
    queryKey,
  }: QueryFunctionContext<[string, number]>): Promise<{
    medical_records: MedicalRecord[];
    max_page: number;
  }> => {
    const [_, pageNum] = queryKey;
    const response = await axios.get<{
      data: {
        medical_records: MedicalRecord[];
        max_page: number;
      };
    }>(route("api.medical-records.get-patients"), {
      params: {
        page_num: pageNum,
        search,
      },
    });
    return response.data.data;
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["medicalRecord", pageNum],
    queryFn: fetchMedicalRecord,
  });

  const cekRiwayatAct = async (id: number): Promise<void> => {
    setOpenDialog("riwayat");
    setMedicalRecordId(id);
  };

  console.log(data);

  return (
    <>
      {openDialog == "pasien" ? (
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
                <TableHead className="border border-slate-200">
                  Nama Pasien
                </TableHead>
                <TableHead className="border border-slate-200">#</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <p className="text-center">Loading ... </p>
                  </TableCell>
                </TableRow>
              ) : data?.medical_records.length == 0 ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <p className="text-center">Empty Data!</p>
                  </TableCell>
                </TableRow>
              ) : (
                data?.medical_records.map((row, key) => (
                  <TableRow key={key}>
                    <TableCell>{key + pageNum + 1}</TableCell>
                    <TableCell>{row.patient.name}</TableCell>
                    <TableCell>
                      <Button onClick={() => cekRiwayatAct(row.id)}>
                        Cek Riwayat
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={10}>
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
      ) : openDialog == "riwayat" ? (
        <DataTableRekamMedisRiwayat
          id={medicalRecordId}
          setOpenDialog={setOpenDialog}
          setMedicalRecordListId={setMedicalRecordListId}
        />
      ) : openDialog == "detail" ? (
        <DataTableRekamMedisDetail
          medicalRecordId={medicalRecordId}
          medicalRecordListId={medicalRecordListId}
          setOpenDialog={setOpenDialog}
        />
      ) : (
        ""
      )}
    </>
  );
}

export function DataTableRekamMedisRiwayat({
  id,
  setOpenDialog = () => {},
  setMedicalRecordListId = () => {},
}: {
  id: number;
  setOpenDialog: CallableFunction;
  setMedicalRecordListId: CallableFunction;
}) {
  const { toast } = useToast();

  const [pageNum, setPageNum] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const fetchMedicalRecord = async ({
    queryKey,
  }: QueryFunctionContext<[string, number, number]>): Promise<{
    medical_record_lists: MedicalRecordList[];
    max_page: number;
  }> => {
    const [_, pageNum, id] = queryKey;
    const response = await axios.get<{
      data: {
        medical_record_lists: MedicalRecordList[];
        max_page: number;
      };
    }>(route("api.medical-records.get-medical-record-lists", id), {
      params: {
        page_num: pageNum,
        search,
      },
    });
    const result = response.data.data;
    return result;
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["medicalRecordList", pageNum, id],
    queryFn: fetchMedicalRecord,
  });

  const cekDetailAct = async (id: number): Promise<void> => {
    setOpenDialog("detail");
    setMedicalRecordListId(id);
  };

  return (
    <>
      <Button
        variant="secondary"
        className="w-20"
        onClick={() => setOpenDialog("pasien")}
      >
        Kembali
      </Button>
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
            <TableHead className="border border-slate-200">
              Nama Pasien
            </TableHead>
            <TableHead className="border border-slate-200">
              Nama Dokter
            </TableHead>
            <TableHead className="border border-slate-200">
              Tanggal Periksa
            </TableHead>
            <TableHead className="border border-slate-200">
              Tinggi Badan
            </TableHead>
            <TableHead className="border border-slate-200">
              Berat Badan
            </TableHead>
            <TableHead className="border border-slate-200">
              Suhu Badan
            </TableHead>
            <TableHead className="border border-slate-200">
              Tekanan Darah
            </TableHead>
            <TableHead className="border border-slate-200">Keluhan</TableHead>
            <TableHead className="border border-slate-200">Diagnosa</TableHead>
            <TableHead className="border border-slate-200">Anemnesis</TableHead>
            <TableHead className="border border-slate-200">
              Pemeriksaan Fisik
            </TableHead>
            <TableHead className="border border-slate-200">
              Pemeriksaan Penunjang
            </TableHead>
            <TableHead className="border border-slate-200">
              Tindakan Lab
            </TableHead>
            <TableHead className="border border-slate-200">Terapi</TableHead>
            <TableHead className="border border-slate-200">Rujukan</TableHead>
            <TableHead className="border border-slate-200">
              Keterangan
            </TableHead>
            <TableHead className="border border-slate-200">
              Tanggal Kontrol Selanjutnya
            </TableHead>
            <TableHead className="border border-slate-200">#</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={19}>
                <p className="text-center">Loading ... </p>
              </TableCell>
            </TableRow>
          ) : data?.medical_record_lists.length == 0 ? (
            <TableRow>
              <TableCell colSpan={19}>
                <p className="text-center">Empty Data!</p>
              </TableCell>
            </TableRow>
          ) : (
            data?.medical_record_lists.map((row, key) => (
              <TableRow key={key}>
                <TableCell>{key + pageNum + 1}</TableCell>
                <TableCell className="border border-slate-200">
                  {row.registration.patient.name}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.registration.doctor.name}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.date_check_up}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.body_height} Cm
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.body_weight} Kg
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.body_temp} &deg;C
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.blood_pressure} mmHg
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.main_complaint}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.diagnose}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.anemnesis}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.physical_examinations}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.supporting_examinations}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.lab_action?.name ?? "-"}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.therapy}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.referral}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.notes}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.next_control_date}
                </TableCell>
                <TableCell>
                  <Button onClick={() => cekDetailAct(row.id)}>
                    Cek Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={19}>
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

export function DataTableRekamMedisDetail({
  medicalRecordId,
  medicalRecordListId,
  setOpenDialog = () => {},
}: {
  medicalRecordId: number;
  medicalRecordListId: number;
  setOpenDialog: CallableFunction;
}) {
  const { toast } = useToast();

  const [pageNum, setPageNum] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const fetchMedicalRecordDetail = async ({
    queryKey,
  }: QueryFunctionContext<[string, number, number, number]>): Promise<{
    medical_record_details: MedicalRecordDetail[];
    max_page: number;
  }> => {
    const [_, pageNum, medicalRecordId, medicalRecordListId] = queryKey;
    const response = await axios.get<{
      data: {
        medical_record_details: MedicalRecordDetail[];
        max_page: number;
      };
    }>(
      route("api.medical-records.get-medical-record-details", {
        medical_record_id: medicalRecordId,
        medical_record_list_id: medicalRecordListId,
      }),
      {
        params: {
          page_num: pageNum,
          search,
        },
      },
    );
    const result = response.data.data;
    return result;
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: [
      "medicalRecordDetails",
      pageNum,
      medicalRecordId,
      medicalRecordListId,
    ],
    queryFn: fetchMedicalRecordDetail,
  });

  return (
    <>
      <Button
        variant="secondary"
        className="w-20"
        onClick={() => setOpenDialog("riwayat")}
      >
        Kembali
      </Button>
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
            <TableHead className="border border-slate-200">Qty</TableHead>
            <TableHead className="border border-slate-200">Dosis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <p className="text-center">Loading ... </p>
              </TableCell>
            </TableRow>
          ) : data?.medical_record_details.length == 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <p className="text-center">Empty Data!</p>
              </TableCell>
            </TableRow>
          ) : (
            data?.medical_record_details.map((row, key) => (
              <TableRow key={key}>
                <TableCell>{key + pageNum + 1}</TableCell>
                <TableCell className="border border-slate-200">
                  {row.medicine.name}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.qty}
                </TableCell>
                <TableCell className="border border-slate-200">
                  {row.dose}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
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

export function DataTableTransaction({
  onOpenTransaction,
  setData,
  setRowObat,
}: {
  onOpenTransaction: CallableFunction;
  setData: CallableFunction;
  setRowObat: CallableFunction;
}) {
  const { toast } = useToast();

  const [pageNum, setPageNum] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [prescriptionId, setPrescriptionId] = useState<number>(0);
  const [prescriptionListId, setPrescriptionListId] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<string>("transaksi");
  const [disabledButton, setDisabledButton] = useState<number>(0);

  const fetchTransaksi = async ({
    queryKey,
  }: QueryFunctionContext<[string, number]>): Promise<{
    transaction_resep: TransactionPrescription[];
    max_page: number;
  }> => {
    const [_, pageNum] = queryKey;
    const response = await axios.get<{
      data: {
        transaction_resep: TransactionPrescription[];
        max_page: number;
      };
    }>(route("api.transactions.get-transaction-resep"), {
      params: {
        page_num: pageNum,
        search,
      },
    });
    const result = response.data.data;
    return result;
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["transaksi", pageNum],
    queryFn: fetchTransaksi,
  });

  const getTransactionResep = async (id: number): Promise<void> => {
    setDisabledButton(id);

    try {
      const responseData = await axios.get<{
        data: {
          result_transaction: ResepTunaiForm;
        };
      }>(route("api.transactions.get-transaction-resep-by-id", id));

      setDisabledButton(0);

      setData(responseData.data.data.result_transaction);
      setRowObat(responseData.data.data.result_transaction.medicines);
      onOpenTransaction(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: error.response?.data.message,
        });
      }
    }
  };

  const lihatRacikAct = (id: number): void => {
    setPrescriptionId(id);
    setOpenDialog("racik");
  };

  return (
    <>
      {openDialog == "transaksi" ? (
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
                <TableHead className="border border-slate-200">
                  Nomor Transaksi
                </TableHead>
                <TableHead className="border border-slate-200">
                  Tanggal Transaksi
                </TableHead>
                <TableHead className="border border-slate-200">
                  Nama Pasien
                </TableHead>
                <TableHead className="border border-slate-200">
                  Nama Dokter
                </TableHead>
                <TableHead className="border border-slate-200">
                  Diskon
                </TableHead>
                <TableHead className="border border-slate-200">
                  Harga Total
                </TableHead>
                <TableHead className="border border-slate-200">Bayar</TableHead>
                <TableHead className="border border-slate-200">
                  Kembalian
                </TableHead>
                <TableHead className="border border-slate-200">
                  Input By
                </TableHead>
                <TableHead className="border border-slate-200">#</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11}>
                    <p className="text-center">Loading ... </p>
                  </TableCell>
                </TableRow>
              ) : data?.transaction_resep.length == 0 ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <p className="text-center">Empty Data!</p>
                  </TableCell>
                </TableRow>
              ) : (
                data?.transaction_resep.map((row, key) => (
                  <TableRow key={key}>
                    <TableCell>{key + pageNum + 1}</TableCell>
                    <TableCell>{row.invoice_number}</TableCell>
                    <TableCell>{row.date_transaction}</TableCell>
                    <TableCell>{row.prescription.patient.name}</TableCell>
                    <TableCell>{row.prescription.doctor.name}</TableCell>
                    <TableCell>Rp. {formatRupiah(row.discount)}</TableCell>
                    <TableCell>Rp. {formatRupiah(row.total)}</TableCell>
                    <TableCell>Rp. {formatRupiah(row.pay_total)}</TableCell>
                    <TableCell>Rp. {formatRupiah(row.change_money)}</TableCell>
                    <TableCell>{row.user.name}</TableCell>
                    <TableCell className="flex flex-col space-y-2">
                      <Button className="bg-cyan-500" asChild>
                        <Link
                          href={route(
                            "administrator.transaction-resep.print-invoice",
                            row.id,
                          )}
                        >
                          Print
                        </Link>
                      </Button>
                      <Button variant="warning" asChild>
                        <Link
                          href={route(
                            "administrator.transaction-resep.print-receipt",
                            row.id,
                          )}
                        >
                          Kwitansi
                        </Link>
                      </Button>
                      <Button
                        variant={
                          row.status_transaction == 1
                            ? "success"
                            : "destructive"
                        }
                        onClick={() => getTransactionResep(row.id)}
                        disabled={
                          disabledButton == row.id ||
                          row.status_transaction == 1
                        }
                      >
                        {row.status_transaction == 1 ? "Terbayar" : "Pending"}
                      </Button>
                      <Button
                        onClick={() => lihatRacikAct(row.prescription_id)}
                      >
                        Lihat Racik
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={11}>
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
      ) : openDialog == "racik" ? (
        <DataTableRacik
          prescriptionId={prescriptionId}
          setPrescriptionListId={setPrescriptionListId}
          onOpenTransaction={setOpenDialog}
        />
      ) : openDialog == "detail-racik" ? (
        <DataTableRacikDetail
          prescriptionId={prescriptionId}
          prescriptionListId={prescriptionListId}
          onOpenTransaction={setOpenDialog}
        />
      ) : (
        ""
      )}
    </>
  );
}

export function DataTableRacik({
  prescriptionId,
  setPrescriptionListId,
  onOpenTransaction,
}: {
  prescriptionId: number;
  setPrescriptionListId: CallableFunction;
  onOpenTransaction: CallableFunction;
}) {
  const { toast } = useToast();

  const [pageNum, setPageNum] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const fetchRacik = async ({
    queryKey,
  }: QueryFunctionContext<[string, number, number]>): Promise<{
    racik: PrescriptionList[];
    max_page: number;
  }> => {
    const [_, pageNum, prescriptionId] = queryKey;
    const response = await axios.get<{
      data: {
        racik: PrescriptionList[];
        max_page: number;
      };
    }>(route("api.transactions.get-prescription-lists", prescriptionId), {
      params: {
        page_num: pageNum,
        search,
      },
    });
    const result = response.data.data;
    return result;
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["racik", pageNum, prescriptionId],
    queryFn: fetchRacik,
  });

  const detailRacikAct = (id: number): void => {
    setPrescriptionListId(id);
    onOpenTransaction("detail-racik");
  };

  return (
    <>
      <Button
        variant="secondary"
        className="w-20"
        onClick={() => onOpenTransaction("transaksi")}
      >
        Kembali
      </Button>
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
            <TableHead className="border border-slate-200">
              Nama Resep
            </TableHead>
            <TableHead className="border border-slate-200">
              Jasa Racik
            </TableHead>
            <TableHead className="border border-slate-200">
              Total Biaya
            </TableHead>
            <TableHead className="border border-slate-200">
              Jumlah Racik
            </TableHead>
            <TableHead className="border border-slate-200">#</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={11}>
                <p className="text-center">Loading ... </p>
              </TableCell>
            </TableRow>
          ) : data?.racik.length == 0 ? (
            <TableRow>
              <TableCell colSpan={10}>
                <p className="text-center">Empty Data!</p>
              </TableCell>
            </TableRow>
          ) : (
            data?.racik.map((row, key) => (
              <TableRow key={key}>
                <TableCell>{key + pageNum + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>Rp. {formatRupiah(row.service_fee)}</TableCell>
                <TableCell>Rp. {formatRupiah(row.total_costs)}</TableCell>
                <TableCell>{row.total_prescription_packs}</TableCell>
                <TableCell>
                  <Button onClick={() => detailRacikAct(row.id)}>
                    Detail Racik
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={11}>
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

export function DataTableRacikDetail({
  prescriptionId,
  prescriptionListId,
  onOpenTransaction,
}: {
  prescriptionId: number;
  prescriptionListId: number;
  onOpenTransaction: CallableFunction;
}) {
  const { toast } = useToast();

  const [pageNum, setPageNum] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const fetchRacik = async ({
    queryKey,
  }: QueryFunctionContext<[string, number, number, number]>): Promise<{
    racik_detail: PrescriptionDetail[];
    max_page: number;
  }> => {
    const [_, pageNum, prescriptionId, prescriptionListId] = queryKey;
    const response = await axios.get<{
      data: {
        racik_detail: PrescriptionDetail[];
        max_page: number;
      };
    }>(
      route("api.transactions.get-prescription-details", {
        prescription_id: prescriptionId,
        prescription_list_id: prescriptionListId,
      }),
      {
        params: {
          page_num: pageNum,
          search,
        },
      },
    );
    const result = response.data.data;
    return result;
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["racik_detail", pageNum, prescriptionId, prescriptionListId],
    queryFn: fetchRacik,
  });

  return (
    <>
      <Button
        variant="secondary"
        className="w-20"
        onClick={() => onOpenTransaction("racik")}
      >
        Kembali
      </Button>
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
            <TableHead className="border border-slate-200">Qty</TableHead>
            <TableHead className="border border-slate-200">Dosis</TableHead>
            <TableHead className="border border-slate-200">Sub Total</TableHead>
            <TableHead className="border border-slate-200">Jasa</TableHead>
            <TableHead className="border border-slate-200">Total</TableHead>
            <TableHead className="border border-slate-200">Faktor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={11}>
                <p className="text-center">Loading ... </p>
              </TableCell>
            </TableRow>
          ) : data?.racik_detail.length == 0 ? (
            <TableRow>
              <TableCell colSpan={10}>
                <p className="text-center">Empty Data!</p>
              </TableCell>
            </TableRow>
          ) : (
            data?.racik_detail.map((row, key) => (
              <TableRow key={key}>
                <TableCell>{key + pageNum + 1}</TableCell>
                <TableCell>{row.medicine.name}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>{row.dose}</TableCell>
                <TableCell>Rp. {formatRupiah(row.sub_total)}</TableCell>
                <TableCell>Rp. {formatRupiah(row.service_fee)}</TableCell>
                <TableCell>Rp. {formatRupiah(row.total)}</TableCell>
                <TableCell>{row.faktor}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={11}>
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
