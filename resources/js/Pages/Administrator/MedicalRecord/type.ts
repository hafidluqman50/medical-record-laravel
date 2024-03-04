import { Registration } from "@/Pages/Administrator/Registration/type";

import { MedicineResep } from "@/Pages/Administrator/TransactionResep/typeProps";

import { Medicine } from "@/Pages/Administrator/Medicine/type";

import { PriceParameter } from "@/Pages/Administrator/PriceParameter/type";

import { LabAction } from "@/Pages/Administrator/LabAction/type";

import { Doctor } from "@/Pages/Administrator/Doctor/type";

import { Patient } from "@/Pages/Administrator/Patient/type";

export interface MedicalRecord {
  id: number;
  patient_id: number;
  patient: {
    name: string;
  };
}

export interface MedicalRecordList {
  id: number;
  medical_record_id: number;
  registration: {
    patient: {
      name: string;
    };
    doctor: {
      name: string;
    };
  };
  date_check_up: string;
  body_height: number;
  body_weight: number;
  body_temp: number;
  blood_pressure: string;
  main_complaint: string;
  diagnose: string;
  anemnesis: string;
  physical_examinations: string;
  supporting_examinations: string;
  lab_action: {
    name: string;
  };
  therapy: string;
  referral: string;
  notes: string;
  next_control_date: string;
}

export interface MedicalRecordDetail {
  id: number;
  medical_record_list_id: number;
  medical_record_list: {
    id: number;
    medical_record_id: number;
  };
  medicine: {
    name: string;
  };
  dose: number;
  qty: number;
}

export interface PaginationData {
  url?: string;
  label: string;
  active: boolean;
}

export interface AxiosGetRegistration {
  data: {
    registration: {
      body_height: number;
      body_weight: number;
      body_temp: number;
      blood_pressure: string;
      complains_of_pain: string;
      supporting_examinations: string;
    };
  };
}

export type FormCreateProps = {
  registrations: Registration[];
  kode_transaksi: string;
  medicines: Medicine[];
  price_parameter: PriceParameter;
  doctors: Doctor[];
  lab_actions: LabAction[];
  patients: Patient[];
};

export interface MedicalRecordForm {
  indexObat: number | null;
  registration_id: number | null;
  body_height: number | null;
  body_weight: number | null;
  body_temp: number | null;
  blood_pressure: string;
  complains_of_pain: string;
  anemnesis: string;
  physical_examinations: string;
  supporting_examinations: string;
  diagnose: string;
  lab_action_id: number | null;
  therapy: string;
  referral: string;
  next_control_date: string;
  notes: string;
  medicines: Array<MedicineResep>;
  sub_total_grand: number;
  diskon_grand: number;
  total_grand: number;
  bayar: number;
  kembalian: number;
  kode_transaksi: string;
  jenis_pembayaran: string;
}
