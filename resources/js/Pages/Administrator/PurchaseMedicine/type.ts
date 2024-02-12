export interface PurchaseMedicine {
    id: number;
    invoice_number: string;
    medical_supplier_id: number;
    medical_supplier:{
        id:number;
        name:string
    }
    code: string;
    date_receive: string;
    debt_time: number;
    due_date: string;
    type: string;
    total_dpp: number;
    total_ppn: number;
    total_grand: number;
    user_id: number;
    user:{
        id:number;
        name:string
    }
}