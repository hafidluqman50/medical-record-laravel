export interface PurchaseReturn {
    id:number;
    invoice_number:string;
    invoice_number_purchase:string;
    medical_supplier:{
        name:string
    }
    date_return:string;
    total_return:number;
}

export interface PurchaseReturnDetail {
    id:number;
    medicine:{
        name:string
    };
    qty_purchase:number;
    qty_return:number;
    sub_total:number;
    sub_total_custom:number;
}