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

export interface PatientCategory {
    id: number;
    name:string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    session:{
        success:string;
        error:string;
    }
    auth: {
        user: User;
    };
    app: {
        url:string;
    }
    ziggy: Config & { location: string };
    page_num:string;
};
