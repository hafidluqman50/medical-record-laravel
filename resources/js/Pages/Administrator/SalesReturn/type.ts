export interface SalesReturn {
    id:number;
    invoice_number:string;
    invoice_number_transaction:string;
    date_return:string;
    total_return:number;
}

export interface SalesReturnDetail {
    id:number;
    medicine:{
        name:string
    };
    qty_transaction:number;
    qty_return:number;
    sub_total:number;
    sub_total_custom:number;
}