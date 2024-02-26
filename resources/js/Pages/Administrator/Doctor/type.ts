export interface Doctor {
    id: number;
    code:string;
    name:string;
    username:string;
    fee:number;
    address:string;
    phone_number:number;
    status_doctor:number;
}

export interface DoctorForm {
    code:string;
    name:string;
    username:string;
    password:string;
    fee:number|null;
    address:string;
    phone_number:string|number;
    status_doctor:number|null;
}