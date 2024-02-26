export interface Transaction {
    id:number;
    invoice_number:string;
    date_transaction:string;
    sub_total:number;
    discount_pay:number;
    discount:number;
    total:number;
    pay_total:number;
    change_money:number;
    transaction_pay_type:string;
    type:string;
    user:{
        name:string
    }
}

export interface TransactionDetail {
    id:number;
    medicine:{
        name:string
    };
    qty:number;
    sub_total:number;
    discount:number;
    total:number;
}