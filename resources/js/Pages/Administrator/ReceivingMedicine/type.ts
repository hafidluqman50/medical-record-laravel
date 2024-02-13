export interface ReceivingMedicine {
    id: number;
    invoice_number: string;
    date_receive: string;
    total_grand: number;
    user:{
        id:number,
        name:string
    }
}

export interface ReceivingMedicineDetail {
    id: number;
    receiving_medicine_id: number;
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
    notes: string
}