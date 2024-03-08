import {
  useEffect,
  useState,
  KeyboardEvent,
  MouseEvent,
  ChangeEvent,
  useRef,
  Ref,
  ChangeEventHandler,
  FormEventHandler,
} from "react";

import { Head, Link, router, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import TransactionLayout from "@/Layouts/TransactionLayout";
import { Label } from "@/Components/ui/label";

import { Separator } from "@/Components/ui/separator";

import { Input } from "@/Components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import { DataTable } from "@/Components/DataTable";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";

import {
  type TransactionResepPageProps,
  MedicineResep,
  ResepTunaiForm,
  RowObat,
} from "./typeProps";

import {
  columns,
  columnPatients,
  columnMedicines,
  columnListMedicines,
} from "./columnDatatable";

import { useToast } from "@/Components/ui/use-toast";

import {
  DataTableMasterObat,
  DataTableRekamMedis,
  DataTableTransaction,
} from "./DataTableServer";

import { MedicalRecordForm } from "./type";

import { useStateWithCallback } from "@/lib/hooks";

import { formatRupiah } from "@/lib/helper";

export default function TransactionPrescription({
  kode_transaksi,
  price_parameter,
  medicines,
  data,
  setData = () => {},
  reset = () => {},
}: TransactionResepPageProps & {
  setData: CallableFunction;
  data: MedicalRecordForm;
  reset: CallableFunction;
}) {
  const { toast } = useToast();

  /* DIALOG USE STATE HOOKS */
  const [open, setOpen] = useState<boolean>(false);
  const [openWarningJasa, setOpenWarningJasa] = useState<boolean>(false);
  const [cekHargaObatDialog, setCekHargaObatDialog] = useState<boolean>(false);
  const [openPasienDialog, setOpenPasienDialog] = useState<boolean>(false);
  const [openDoctorDialog, setOpenDoctorDialog] = useState<boolean>(false);
  const [openPasienList, setOpenPasienList] = useState<boolean>(false);
  const [openMasterObat, setOpenMasterObat] = useState<boolean>(false);
  const [openRekamMedis, setOpenRekamMedis] = useState<boolean>(false);
  const [openTransaction, setOpenTransaction] = useState<boolean>(false);
  /* END DIALOG USE STATE HOOKS */

  /* MECHANISM TRANSACTION USE STATE HOOKS */
  const [faktor, setFaktor] = useState<string>("UM");
  const [isRacikan, setIsRacikan] = useState<boolean>(false);
  const [bayarDialog, setBayarDialog] = useState<boolean>(false);
  const [jasa, setJasa] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [isHjaNet, setIsHjaNet] = useState<boolean>(false);
  const [priceMedicine, setPriceMedicine] = useState<number>(0);
  const [indexRowObat, setIndexRowObat] = useStateWithCallback<number | null>(
    null,
  );
  const [alertEmptyPatient, setAlertEmptyPatient] = useState<boolean>(false);
  const [alertEmptyDoctor, setAlertEmptyDoctor] = useState<boolean>(false);
  /* END MECHANISM TRANSACTION USE STATE HOOKS */

  /* COUNTER USE STATE HOOKS */
  const [nonRacikNum, setNonRacikNum] = useState<number>(1);
  const [racikNum, setRacikNum] = useState<number>(1);
  /* END COUNTER USE STATE HOOKS */

  /* LIST MEDICINES USE STATE HOOKS */
  const [rowObat, setRowObat] = useState<RowObat[]>([]);
  const [jualObat, setJualObat] = useState<any>({
    isLoading: false,
    data: [],
  });
  /* END LIST MEDICINES USE STATE HOOKS */

  /* LIST PATIENTS USE STATE HOOKS */
  const [rowPatients, setRowPatients] = useState<any>({
    isLoading: false,
    data: [],
  });
  /* END LIST PATIENTS USE STATE HOOKS */

  /* LIST DOCTORS USE STATE HOOKS */
  const [rowDoctors, setRowDoctors] = useState<any>({
    isLoading: false,
    data: [],
  });
  /* END LIST DOCTORS USE STATE HOOKS */

  const [diskon, setDiskon] = useState<string | null>(null);

  const obatId = useRef<any>();
  const namaObat = useRef<any>();
  const kodeObat = useRef<any>();
  const dosisObatRef = useRef<any>();
  const hargaObat = useRef<any>();

  const dosisRacikRef = useRef<any>();
  const qtyObat = useRef<any>();
  const satuanObat = useRef<any>();
  const jumlahHarga = useRef<any>();

  const bungkusRef = useRef<any>();
  const jasaRef = useRef<any>();
  const isRacikRef = useRef<any>();
  const faktorRef = useRef<any>();

  /* PATIENT USE REF */
  const alertEmptyPatientRef = useRef<any>();
  const patientNameRef = useRef<any>();
  const patientPhoneNumberRef = useRef<any>();
  const patientAddressRef = useRef<any>();
  const patientCityPlaceRef = useRef<any>();
  /* END PATIENT USE REF */

  /* DOCTOR USE REF */
  const alertEmptyDoctorRef = useRef<any>();
  const doctorNameRef = useRef<any>();
  const doctorCodeRef = useRef<any>();
  /* END DOCTOR USE REF */

  const jasaClickRef = useRef<any>();
  const jenisBayarRef = useRef<any>();
  const diskonGrandRef = useRef<any>();
  const bayarTransaksi = useRef<any>();
  const submitBayarRef = useRef<any>();
  
  /* ESC USE REF */
  const qtyObatEscRef = useRef<any>()
  const bungkusEscRef = useRef<any>()
  const jumlahHargaEscRef = useRef<any>()
  const dosisRacikEscRef = useRef<any>()
  const jasaEscRef = useRef<any>()
  /* END ESC USE REF */

  const openEnterDialog = async (
    event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if ((event as KeyboardEvent).keyCode === 13) {
      setOpen(true);

      setJualObat((jualObat: any) => ({
        ...jualObat,
        isLoading: true,
      }));

      try {
        const { data } = await axios.get(route("api.medicines.get-all"), {
          params: {
            medicine: (event.target as HTMLInputElement).value,
            data_location: "kasir",
          },
        });

        const medicines = data.medicines;

        setJualObat((jualObat: any) => ({
          ...jualObat,
          isLoading: false,
          data: medicines,
        }));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: error.response?.data.message,
          });
        }
      }
    }
  };

  const bungkusAct = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (indexRowObat != null) {
      const dosisObatVal = parseInt(dosisObatRef.current.value);
      const bungkusVal = parseInt(bungkusRef.current.value);
      const dosisRacikVal = parseInt(dosisRacikRef.current.value);
      const hargaObatVal = parseInt(hargaObat.current.value);

      let calculateQty = isRacikan
        ? Math.round((dosisRacikVal * bungkusVal) / dosisObatVal)
        : 0;
      let priceCalculate = 0;

      if (isHjaNet) {
        priceCalculate = Math.round(hargaObatVal * price_parameter.resep_tunai);
      } else {
        priceCalculate = hargaObatVal;
      }

      let calculateJumlah = priceCalculate * calculateQty;

      setSubTotal(calculateJumlah);

      jumlahHarga.current.value =
        Math.round(calculateJumlah / price_parameter.pembulatan) *
        price_parameter.pembulatan;
      qtyObat.current.value = calculateQty;
    }

    if (event.keyCode == 13 && bungkusRef.current?.value != "") {
      kodeObat.current.focus();
    }
  };

  const selectObatAct = async (
    event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if ((event as KeyboardEvent).keyCode == 13) {
      try {
        const { data } = await axios.get(
          route(
            "api.medicines.get-by-id",
            (event.target as HTMLInputElement).value,
          ),
        );
        setOpen(false);
        setIsHjaNet(data.medicine.is_hja_net);
        setPriceMedicine(data.medicine.price);

        obatId.current.value = data.medicine.id;
        kodeObat.current.value = data.medicine.code;
        dosisObatRef.current.value = data.medicine.dose;
        namaObat.current.value = data.medicine.name;
        hargaObat.current.value = data.medicine.price;
        satuanObat.current.value = data.medicine.unit_medicine;
        qtyObat.current.value = "";
        dosisRacikRef.current.value = isRacikan ? "" : 0;

        setJualObat((jualObat: any) => ({
          ...jualObat,
          data: [],
        }));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: error.response?.data.message,
          });
        }
      }
    }
  };

  const dosisRacikAct = (
    event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
  ): void => {
    if ((event as KeyboardEvent).keyCode != 27) {
      const dosisObatVal = parseInt(dosisObatRef.current.value);
      const bungkusVal = parseInt(bungkusRef.current.value);
      const dosisRacikVal = parseInt(dosisRacikRef.current.value);
      const hargaObatVal = parseInt(hargaObat.current.value);

      let calculateQty = isRacikan
        ? Math.round((dosisRacikVal * bungkusVal) / dosisObatVal)
        : 0;
      let priceCalculate = 0;

      if (isHjaNet) {
        priceCalculate = Math.round(hargaObatVal * price_parameter.resep_tunai);
      } else {
        priceCalculate = hargaObatVal;
      }

      let calculateJumlah = priceCalculate * calculateQty;

      setSubTotal(calculateJumlah);

      jumlahHarga.current.value =
        Math.round(calculateJumlah / price_parameter.pembulatan) *
        price_parameter.pembulatan;
      qtyObat.current.value = calculateQty;

      if (
        (event as KeyboardEvent).keyCode == 13 &&
        dosisRacikRef.current.value != ""
      ) {
        qtyObat.current.focus();
      }
    } else {
      escapeKeyAct();
    }
  };

  const qtyJualAct = (event: KeyboardEvent<HTMLInputElement>): void => {
    // setSubTotal(jumlahHarga.current.value)

    if (!isRacikan) {
      const hargaObatVal = parseInt(hargaObat.current.value);
      const qtyObatVal = parseInt(qtyObat.current.value);

      let calculateJumlah = qtyObatVal * hargaObatVal;

      jumlahHarga.current.value = calculateJumlah;
    }

    let prefixNum: string = "";
    let prefixNumDisplay: string = "";

    let subTotalGrandData: number = 0;
    let totalGrandData: number = 0;

    let medicinesData: Array<any> = [];

    if (event.keyCode == 13) {
      if (data.indexObat != null) {
        const getRowObat = rowObat;

        getRowObat[data.indexObat].qty = parseInt(qtyObat.current.value);
        getRowObat[data.indexObat].prescription_packs = parseInt(
          bungkusRef.current.value,
        );
        getRowObat[data.indexObat].sub_total = parseInt(
          jumlahHarga.current.value,
        );
        getRowObat[data.indexObat].dose = parseInt(dosisRacikRef.current.value);
        getRowObat[data.indexObat].jasa = parseInt(jasaRef.current.value);
        getRowObat[data.indexObat].total = parseInt(jumlahHarga.current.value);

        subTotalGrandData =
          getRowObat[data.indexObat].sub_total +
          data.sub_total_grand +
          getRowObat[data.indexObat].jasa;
        totalGrandData = subTotalGrandData;

        medicinesData = data.medicines;

        medicinesData[data.indexObat] = getRowObat[data.indexObat];
      } else {
        if (isRacikan) {
          prefixNum = `R${racikNum}`;
          prefixNumDisplay = `R${racikNum}`;
          setNonRacikNum((nonRacikNum) => nonRacikNum + 1);
        } else {
          prefixNum = `tanpa-racik`;
          prefixNumDisplay = `P${nonRacikNum}`;

          setNonRacikNum((nonRacikNum) => nonRacikNum + 1);
        }

        const result = [
          {
            code: kodeObat.current.value,
            id: obatId.current.value,
            name: namaObat.current.value,
            unit_medicine: satuanObat.current.value,
            dose_medicine: dosisObatRef.current.value,
            sell_price: parseInt(hargaObat.current.value),
            qty: parseInt(qtyObat.current.value),
            prescription_packs: bungkusRef.current.value,
            sub_total: parseInt(jumlahHarga.current.value),
            dose: dosisRacikRef.current.value,
            jasa,
            total: parseInt(jumlahHarga.current.value),
            faktor,
            prefixNum,
            prefixNumDisplay,
          },
        ];
        setRowObat([...rowObat, ...result]);

        subTotalGrandData = result[0].sub_total + data.sub_total_grand;
        totalGrandData = result[0].total + data.total_grand;
        medicinesData = [...data.medicines, ...result];
      }

      setIndexRowObat(null);

      setData((data: any) => ({
        ...data,
        indexObat: null,
        medicines: medicinesData,
        sub_total_grand: subTotalGrandData,
        total_grand: totalGrandData,
      }));

      kodeObat.current.value = "";
      dosisObatRef.current.value = "";
      namaObat.current.value = "";
      hargaObat.current.value = "";
      satuanObat.current.value = "";
      qtyObat.current.value = "";
      dosisRacikRef.current.value = "";
      jumlahHarga.current.value = "";
      jasaRef.current.value = "";

      kodeObat.current.focus();
    }
  };

  const jasaAct = (): void => {
    const jasaVal = jasaRef.current.value;
    if (kodeObat.current.value == "") {
      const getIndex = rowObat
        .map((el) => el.prefixNum)
        .lastIndexOf(`R${racikNum}`);
      let jasaRowObat = rowObat[getIndex];
      jasaRowObat.jasa = parseInt(jasaVal);

      const medicinesData = data.medicines;
      medicinesData[getIndex].jasa = jasaVal;

      let totalGrandData = data.total_grand + parseInt(jasaVal);
      let subTotalGrandData = data.sub_total_grand + parseInt(jasaVal);

      setRacikNum((racikNum) => racikNum + 1);

      jasaRef.current.value = "";
      bungkusRef.current.value = "";

      setData((data: any) => ({
        ...data,
        medicines: medicinesData,
        sub_total_grand: subTotalGrandData,
        total_grand: totalGrandData,
      }));

      setIsRacikan(false);
      setFaktor("UM");
    }
  };

  const dblClickAct = (
    event: MouseEvent<HTMLTableRowElement>,
    index: number,
  ): void => {
    const getRowObat = rowObat;
    
    kodeObat.current.value      = getRowObat[index].code
    dosisObatRef.current.value  = getRowObat[index].dose_medicine
    namaObat.current.value      = getRowObat[index].name
    hargaObat.current.value     = getRowObat[index].sell_price
    satuanObat.current.value    = getRowObat[index].unit_medicine
    
    qtyObat.current.value       = getRowObat[index].qty
    qtyObatEscRef.current       = getRowObat[index].qty
    dosisRacikRef.current.value = getRowObat[index].dose
    dosisRacikEscRef.current    = getRowObat[index].dose
    bungkusRef.current.value    = getRowObat[index].prescription_packs
    bungkusEscRef.current       = getRowObat[index].prescription_packs
    jumlahHarga.current.value   = getRowObat[index].total
    jumlahHargaEscRef.current   = getRowObat[index].total
    jasaRef.current.value       = getRowObat[index].jasa
    jasaEscRef.current          = getRowObat[index].jasa

    setSubTotal(getRowObat[index].sub_total);

    setJasa(getRowObat[index].jasa);

    setIndexRowObat(index);

    setData((data: any) => ({
      ...data,
      indexObat: index,
    }));

    console.log(data);

    const subTotalGrandData =
      data.sub_total_grand -
      getRowObat[index].sub_total -
      getRowObat[index].jasa;
    const totalGrandData = subTotalGrandData;

    setData((data: any) => ({
      ...data,
      medicines: getRowObat,
      sub_total_grand: subTotalGrandData,
      total_grand: totalGrandData,
    }));

    getRowObat[index].qty = 0;
    getRowObat[index].dose = 0;
    getRowObat[index].sub_total = 0;
    getRowObat[index].total = 0;
    getRowObat[index].jasa = 0;

    setRowObat(getRowObat);

    dosisRacikRef.current.focus();
  };

  const rowObatAct = (
    event:
      | MouseEvent<HTMLInputElement>
      | KeyboardEvent<HTMLInputElement>
      | ChangeEvent<HTMLInputElement>,
    index: number,
  ): void => {
    const keyEvent = event as KeyboardEvent;
    const targetValue = parseInt((event.target as HTMLInputElement).value);

    setData((data: any) => ({
      ...data,
      indexObat: targetValue,
    }));

    if (keyEvent.keyCode == 119) {
      setRowObat((row) => row.filter((r, i) => i != targetValue));

      const medicinesData = data.medicines.filter(
        (row: any, i: number) => i != targetValue,
      );
      const subTotalGrandData =
        data.sub_total_grand - data.medicines[targetValue].sub_total;
      const totalGrandData =
        data.total_grand - data.medicines[targetValue].total;

      setData((data: any) => ({
        ...data,
        medicines: medicinesData,
        sub_total_grand: subTotalGrandData,
        total_grand: totalGrandData,
      }));
    }
  };

  const calculateBayar = (
    event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
  ): void => {
    const keyEvent = event as KeyboardEvent;
    const targetValue = (event.target as HTMLInputElement).value;

    setData((data: any) => ({ ...data, bayar: parseInt(targetValue) }));
    const total_grand = data.total_grand;

    let calculate = parseInt(targetValue) - total_grand;

    setData((data: any) => ({ ...data, kembalian: calculate }));

    if (keyEvent.keyCode == 13) {
      submitBayarRef.current.focus();
    }
  };

  const calculateDiskon = (
    event: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>,
  ): void => {
    const { value } = event.target as HTMLInputElement;

    setDiskon(value);

    if ((event as KeyboardEvent).keyCode == 13 && value != "") {
      const total_grand = data.total_grand;

      let calculate = 0;

      let diskon_grand = 0;

      if (value.includes("%")) {
        diskon_grand = (total_grand * parseInt(value)) / 100;

        calculate =
          Math.round(
            (total_grand - diskon_grand) / price_parameter.pembulatan,
          ) * price_parameter.pembulatan;
      } else {
        diskon_grand = parseInt(value);

        calculate =
          Math.round(
            (total_grand - diskon_grand) / price_parameter.pembulatan,
          ) * price_parameter.pembulatan;
      }

      setData((data: any) => ({ ...data, diskon_grand: diskon_grand }));

      setData((data: any) => ({ ...data, total_grand: calculate }));

      bayarTransaksi.current.focus();
    }
  };

  const hapusAct = (): void => {
    if (data.indexObat != null) {
      setRowObat((row) => row.filter((r, i) => i != data.indexObat));

      const subTotalGrandData =
        data.sub_total_grand -
        data.medicines[data.indexObat].sub_total -
        data.medicines[data.indexObat].jasa;
      const totalGrandData = subTotalGrandData;
      const medicinesData = data.medicines.filter(
        (row: any, i: number) => i != data.indexObat,
      );

      console.log(data.medicines[data.indexObat].sub_total);

      setData((data: any) => ({
        ...data,
        indexObat: null,
        medicines: medicinesData,
        sub_total_grand: subTotalGrandData,
        total_grand: totalGrandData,
      }));
    }
  };

  const escapeKeyAct = (): void => {
    if (data.indexObat != null) {
      let subTotalGrandData: number = 0;
      let totalGrandData: number = 0;

      let medicinesData: Array<any> = [];
      const getRowObat = rowObat;

      getRowObat[data.indexObat].qty                = parseInt(qtyObatEscRef.current)
      getRowObat[data.indexObat].prescription_packs = parseInt(bungkusEscRef.current)
      getRowObat[data.indexObat].sub_total          = parseInt(jumlahHargaEscRef.current)
      getRowObat[data.indexObat].dose               = parseInt(dosisRacikEscRef.current)
      getRowObat[data.indexObat].jasa               = parseInt(jasaEscRef.current)
      getRowObat[data.indexObat].total              = parseInt(jumlahHargaEscRef.current)

      subTotalGrandData =
        getRowObat[data.indexObat].sub_total +
        data.sub_total_grand +
        getRowObat[data.indexObat].jasa;
      totalGrandData = subTotalGrandData;

      medicinesData = data.medicines;

      medicinesData[data.indexObat] = getRowObat[data.indexObat];

      setData((data: any) => ({
        ...data,
        indexObat: null,
        medicines: medicinesData,
        sub_total_grand: subTotalGrandData,
        total_grand: totalGrandData,
      }));

      kodeObat.current.value = "";
      dosisObatRef.current.value = "";
      namaObat.current.value = "";
      hargaObat.current.value = "";
      satuanObat.current.value = "";
      qtyObat.current.value = "";
      dosisRacikRef.current.value = "";
      jumlahHarga.current.value = "";
      jasaRef.current.value = "";
    }
  };

  const batalAct = (): void => {
    setRowObat([]);
    setIsHjaNet(false);
    setPriceMedicine(0);
    setJualObat((jualObat: any) => ({
      ...jualObat,
      isLoading: false,
      data: [],
    }));
    reset();
  };

  const onKeyDownAct = (event: any): void => {
    if (event.ctrlKey && event.altKey && event.keyCode == 80) {
      window.open(route("administrator.dashboard"), "_blank");
    } else if (event.keyCode == 113) {
      window.open(route("administrator.transaction-upds"), "_blank");
    } else if (event.keyCode == 114) {
      window.open(route("administrator.transaction-hv"), "_blank");
    } else if (event.keyCode == 119) {
      hapusAct();
    } else if (event.keyCode == 118) {
      event.preventDefault();

      setRowObat([]);
      setIsHjaNet(false);
      setPriceMedicine(0);
      setJualObat((jualObat: any) => ({
        ...jualObat,
        isLoading: false,
        data: [],
      }));
      reset();
    } else if (event.ctrlKey && event.keyCode == 70) {
      if (faktorRef.current.value == "RESEP") {
        setFaktor((faktor) => "UP");
        faktorRef.current.value = "UPDS";
      } else if (faktorRef.current.value == "UPDS") {
        setFaktor((faktor) => "HV");
        faktorRef.current.value = "HV";
      } else {
        setFaktor((faktor) => "UM");
        faktorRef.current.value = "RESEP";
      }
    } else if (event.ctrlKey && event.keyCode == 74) {
      jasaRef.current.focus();
    } else if (event.altKey && event.keyCode == 81) {
      qtyObat.current.focus();
    } else if (event.ctrlKey && event.keyCode == 82) {
      if (isRacikRef.current.value == "TIDAK") {
        setIsRacikan((isRacikan) => true);
        bungkusRef.current.focus();
      } else {
        setIsRacikan((isRacikan) => false);
        kodeObat.current.focus();
      }
    } else if (event.ctrlKey && event.altKey && event.keyCode == 79) {
      setCekHargaObatDialog(true);
    } else if (event.keyCode == 123) {
      event.preventDefault();

      setBayarDialog(true);
    } else if (event.keyCode == 27) {
      escapeKeyAct();
    }
  };

  console.log(data);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownAct);

    return () => {
      document.removeEventListener("keydown", onKeyDownAct);
    };
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onCloseAutoFocus={(event) => {
            if (kodeObat.current.value != "") {
              if (isRacikan) {
                dosisRacikRef.current.focus();
              } else {
                qtyObat.current.focus();
              }
            }
          }}
          className="max-h-screen max-w-5xl overflow-y-scroll"
        >
          <DialogHeader>
            <DialogTitle>List Obat</DialogTitle>
          </DialogHeader>
          <Table className="mt-4 border-collapse border border-slate-100">
            <TableHeader>
              <TableRow>
                <TableHead className="border border-slate-100">#</TableHead>
                <TableHead className="border border-slate-100">No</TableHead>
                <TableHead className="border border-slate-100">
                  Nama Obat
                </TableHead>
                <TableHead className="border border-slate-100">
                  Pabrik
                </TableHead>
                <TableHead className="border border-slate-100">
                  Kemasan
                </TableHead>
                <TableHead className="border border-slate-100">
                  Hrg PPn
                </TableHead>
                <TableHead className="border border-slate-100">
                  Hrg Hja
                </TableHead>
                <TableHead className="border border-slate-100">Stok</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jualObat.isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : jualObat.data.length == 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Obat Tidak Ada!
                  </TableCell>
                </TableRow>
              ) : (
                jualObat.data.map((row: any, key: number) => (
                  <TableRow key={key}>
                    <TableCell className="border border-slate-100">
                      {key == 0 ? (
                        <input
                          type="radio"
                          name="select_obat"
                          value={row.id}
                          onKeyUp={selectObatAct}
                          autoFocus
                        />
                      ) : (
                        <input
                          type="radio"
                          name="select_obat"
                          value={row.id}
                          onKeyUp={selectObatAct}
                        />
                      )}
                    </TableCell>
                    <TableCell className="border border-slate-100">
                      {key + 1}
                    </TableCell>
                    <TableCell className="border border-slate-100">
                      {row.name}
                    </TableCell>
                    <TableCell className="border border-slate-100">
                      {row.medicine_factory.name}
                    </TableCell>
                    <TableCell className="border border-slate-100">
                      {row.pack_medicine}
                    </TableCell>
                    <TableCell className="border border-slate-100">
                      {row.capital_price_vat}
                    </TableCell>
                    <TableCell className="border border-slate-100">
                      {row.sell_price}
                    </TableCell>
                    <TableCell className="border border-slate-100">
                      {row.stock}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      <Dialog open={openMasterObat} onOpenChange={setOpenMasterObat}>
        <DialogContent className="max-h-screen max-w-7xl overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Data Master Obat</DialogTitle>
          </DialogHeader>
          <DataTableMasterObat />
        </DialogContent>
      </Dialog>

      <AlertDialog open={openWarningJasa} onOpenChange={setOpenWarningJasa}>
        <AlertDialogContent
          onCloseAutoFocus={(event) => {
            if (jasaRef.current.value == "") {
              kodeObat.current.focus();
            }
          }}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            jasaClickRef.current.focus();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah resep sudah benar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction ref={jasaClickRef} onClick={jasaAct}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mb-3 flex justify-center space-x-2">
        <Button
          size="lg"
          variant="secondary"
          className="shadow-sm shadow-slate-500/40"
          onClick={batalAct}
        >
          BATAL [F7]
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="shadow-sm shadow-slate-500/40"
          onClick={hapusAct}
        >
          HAPUS [F8]
        </Button>
      </div>
      <Separator className="bg-slate-200" />
      <div className="mb-4 mt-4 grid grid-cols-4 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex space-x-2">
            <div className="w-2/6">
              <Label htmlFor="kode-transaksi">Transaksi : </Label>
            </div>
            <div>
              <Input
                className="bg-slate-200"
                type="text"
                value={data.kode_transaksi}
                readOnly
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-2/6">
              <Label htmlFor="kode-transaksi">Kode Obat : </Label>
            </div>
            <div>
              <input type="hidden" ref={obatId} />
              <Input
                ref={kodeObat}
                className="border border-slate-100"
                type="text"
                name="kode_obat"
                onChange={openEnterDialog}
                onKeyUp={openEnterDialog}
                autoFocus
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-2/6">
              <Label htmlFor="kode-transaksi">Dosis Obat : </Label>
            </div>
            <div>
              <Input
                ref={dosisObatRef}
                className="border border-slate-100 bg-slate-200"
                type="text"
                name="dosis_obat"
                readOnly
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-2/6">
              <Label htmlFor="kode-transaksi">Harga Obat : </Label>
            </div>
            <div>
              <Input
                ref={hargaObat}
                id="harga-obat"
                type="text"
                className="bg-slate-200"
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex flex-col gap-2">
            <div className="mt-11">
              <Input
                ref={namaObat}
                type="text"
                className="bg-slate-200"
                readOnly
              />
            </div>
            <div className="grid grid-cols-2 space-x-4">
              <div>
                <div className="flex gap-5">
                  <div className="w-2/6">
                    <Label htmlFor="kode-transaksi">Dosis r/ : </Label>
                  </div>
                  <div>
                    <Input
                      ref={dosisRacikRef}
                      id="dosis-racik"
                      onKeyUp={dosisRacikAct}
                      onChange={dosisRacikAct}
                      type="number"
                    />
                  </div>
                </div>
                <div className="mt-2 flex gap-5">
                  <div className="w-2/6">
                    <Label htmlFor="kode-transaksi">Qty Jual : </Label>
                  </div>
                  <div>
                    <Input
                      ref={qtyObat}
                      id="qty-jual-obat"
                      onKeyUp={qtyJualAct}
                      type="number"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex gap-5">
                  <div className="w-2/6">
                    <Label htmlFor="satuan-obat">Satuan : </Label>
                  </div>
                  <div>
                    <Input
                      className="bg-slate-200"
                      ref={satuanObat}
                      id="satuan-obat"
                      type="text"
                      readOnly
                    />
                  </div>
                </div>
                <div className="mt-2 flex gap-5">
                  <div className="w-2/6">
                    <Label htmlFor="kode-transaksi">Jumlah : </Label>
                  </div>
                  <div>
                    <Input
                      className="bg-slate-200"
                      ref={jumlahHarga}
                      id="jumlah-harga"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex space-x-4">
            <div className="w-2/6">
              <Label htmlFor="kode-transaksi">
                <u>R</u>acikan :{" "}
              </Label>
            </div>
            <div>
              <Input
                ref={isRacikRef}
                className="bg-slate-200"
                type="text"
                value={isRacikan ? "YA" : "TIDAK"}
                readOnly
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-2/6">
              <Label htmlFor="kode-transaksi">
                <u>F</u>aktor :{" "}
              </Label>
            </div>
            <div>
              <Input
                ref={faktorRef}
                className="bg-slate-200"
                type="text"
                value={
                  faktor == "UM" ? "RESEP" : faktor == "UP" ? "UPDS" : "HV"
                }
                readOnly
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-2/6">
              <Label htmlFor="kode-transaksi">Bungkus : </Label>
            </div>
            <div>
              <Input ref={bungkusRef} onKeyUp={bungkusAct} type="number" />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-2/6">
              <Label htmlFor="kode-transaksi">
                <u>J</u>asa :{" "}
              </Label>
            </div>
            <div>
              <Input
                ref={jasaRef}
                type="number"
                onKeyUp={(event) => {
                  if (event.keyCode == 13 && jasaRef.current.value != "") {
                    setOpenWarningJasa(true);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Separator className="bg-slate-200" />
      <Table className="mb-4 mt-4 border-collapse border-slate-100">
        <TableHeader>
          <TableRow>
            <TableHead className="border border-slate-100">#</TableHead>
            <TableHead className="border border-slate-100">No.</TableHead>
            <TableHead className="border border-slate-100">Nama Obat</TableHead>
            <TableHead className="border border-slate-100">Satuan</TableHead>
            <TableHead className="border border-slate-100">Harga</TableHead>
            <TableHead className="border border-slate-100">Qty</TableHead>
            <TableHead className="border border-slate-100">Sub Total</TableHead>
            <TableHead className="border border-slate-100">Jasa</TableHead>
            <TableHead className="border border-slate-100">Total</TableHead>
            <TableHead className="border border-slate-100">#1</TableHead>
            <TableHead className="border border-slate-100">#2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.medicines.length == 0 ? (
            <TableRow>
              <TableCell
                className="border border-slate-100"
                colSpan={11}
                align="center"
              >
                Tidak Ada Transaksi Obat
              </TableCell>
            </TableRow>
          ) : (
            data.medicines.map((row, key) => (
              <TableRow
                key={key}
                onDoubleClick={(event) => dblClickAct(event, key)}
              >
                <TableCell className="border border-slate-100">
                  <input
                    type="radio"
                    name="medicine_id"
                    onClick={(event) => rowObatAct(event, key)}
                    onKeyPress={(event) => rowObatAct(event, key)} 
                    value={key}
                  />
                </TableCell>
                <TableCell className="border border-slate-100">
                  {key + 1}
                </TableCell>
                <TableCell className="border border-slate-100">
                  {row.name}
                </TableCell>
                <TableCell className="border border-slate-100">
                  {row.unit_medicine}
                </TableCell>
                <TableCell className="border border-slate-100">
                  Rp. {formatRupiah(row.sell_price)},00
                </TableCell>
                <TableCell className="border border-slate-100">
                  {row.qty}
                </TableCell>
                <TableCell className="border border-slate-100">
                  Rp. {formatRupiah(row.sub_total)},00
                </TableCell>
                <TableCell className="border border-slate-100">
                  Rp. {formatRupiah(row.jasa)},00
                </TableCell>
                <TableCell className="border border-slate-100">
                  Rp. {formatRupiah(row.total)},00
                </TableCell>
                <TableCell className="border border-slate-100">
                  {row.faktor}
                </TableCell>
                <TableCell className="border border-slate-100">
                  {row.prefixNumDisplay}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Separator className="bg-slate-200" />
      <div className="mt-4 grid w-full grid-cols-3 place-items-center">
        <div className="flex space-x-4">
          <Button
            size="lg"
            variant="secondary"
            className="shadow-sm shadow-slate-500/40"
            onClick={() => setOpenMasterObat(!openMasterObat)}
          >
            Master Obat
          </Button>
        </div>
        <div className="flex w-full">
          <div className="w-20 flex-none">
            <Label htmlFor="kode-transaksi">Total : </Label>
          </div>
          <div className="w-full grow">
            <Input
              className="bg-slate-200"
              type="text"
              value={`Rp. ${formatRupiah(data.total_grand)},00`}
              readOnly
            />
          </div>
        </div>
      </div>
    </>
  );
}
