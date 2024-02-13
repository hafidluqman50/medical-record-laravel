export interface DistributionMedicine {
    id: number;
    invoice_number: string;
    date_distribution: string;
    user:{
        id:number,
        name:string
    }
}

export interface DistributionMedicineDetail {
    id: number;
    distribution_medicine_id: number;
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
    notes: string;
    data_location: string;
}