export interface PurchaseHistory {
    id:number;
    invoice_number:string,
    date_purchase:string,
    medical_supplier:{
        name:string
    },
    qty:number,
    unit_medicine:string,
    sub_total:number
}