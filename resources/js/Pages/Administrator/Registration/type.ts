export interface Registration {
    id: number;
    number_register:string;
    patient:{
        name:string
    };
    doctor:{
        name:string
    };
    date_register:string;
    body_height:number;
    body_weight:number;
    body_temp:number;
    blood_pressure:string;
    complains_of_pain:string;
    supporting_examinations:string;
    status_register:number;
}