export interface Customer {
    id:number;
    debitur_number:string;
    name:string
    price_parameter_id:number;
    price_parameter:{
        id:number,
        label:string
    }
}