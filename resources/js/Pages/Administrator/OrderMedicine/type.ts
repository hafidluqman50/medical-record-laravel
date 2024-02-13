export interface OrderMedicine {
    id: number;
    invoice_number: string;
    date_order: number;
    total_grand: number;
    user:{
        id:number,
        name:string
    }
}

export interface OrderMedicineDetail {
    id: number;
    order_medicine_id: number;
    medicine_id: number;
    medicine:{
        id:number;
        name:string;
        unit_medicine:string;
        medicine_factory:{
            id:number;
            name:string;
        }
    }
    qty: number;
    price: number;
    sub_total: number;
}