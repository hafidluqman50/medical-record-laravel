import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    username:string;
    email: string;
    email_verified_at: string;
}

export interface Doctor {
    id: number;
    name:string;
    username:string;
    fee:number;
    address:string;
    phone_number:number;
    status_doctor:number;
}

export interface Patient {
    id: number,
    code:string,
    bpjs_number:string,
    patient_category_id:number,
    name:string,
    phone_number:number,
    address:string,
    city_place:string,
    birth_date:string,
    gender:string
}

export interface PatientCategory {
    id: number;
    name:string;
}

export interface PaginationData {
    url?:string
    label:string
    active:boolean
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    session:{
        success:string;
        error:string;
        fail:string;
    }
    auth: {
        user: User;
        doctor: User;
    };
    app: {
        url:string;
    }
    ziggy: Config & { location: string };
    page_num:number;
};
