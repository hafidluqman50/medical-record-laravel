
export interface Patients {
    data:Array<{
        id: number,
        code:string,
        bpjs_number:string,
        patient_category_id:number,
        patient_category:Array<{
            id:number,
            name:string
        }>,
        name:string,
        phone_number:number,
        address:string,
        city_place:string,
        birth_date:string,
        gender:string
    }>;
    current_page:number;
    per_page:number;
    links:Array<{
        url?:string,
        label:string,
        active:boolean
    }>;
}

export type PatientIndexProps = {
    patients:Patients
}

export interface Patient {
    id: number,
    code:string,
    bpjs_number:string,
    patient_category_id:number,
    patient_category:{
        name:string
    }
    name:string,
    phone_number:number,
    address:string,
    city_place:string,
    birth_date:string,
    gender:string
}