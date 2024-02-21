export interface Medicine {
    id: number;
    code:string;
    date_expired:string;
    barcode:string;
    batch_number:string;
    name:string;
    medicine_factory:{
        name:string
    }
    drug_classification:{
        is_prekursor:number,
        is_narcotic:number,
        is_psychotropic:number
    }
    drug_classification_id:number;
    medical_supplier_id:number;
    medicine_factory_id:number;
    min_stock_supplier:number;
    is_generic:number;
    is_active:number;
    is_prescription:number;
    stock:number;
    piece_weight:number;
    pack_medicine:string;
    unit_medicine:string;
    medicinal_preparations:string;
    location_rack:string;
    dose:number;
    composition:string;
    is_fullpack:number;
    capital_price:number|string;
    capital_price_vat:number|string;
    sell_price:number|string;
}

export interface Medicines {
    data:Array<Medicine>;
    links:Array<{
        url?:string,
        label:string,
        active:boolean
    }>;
}

export type MedicineIndexProps = {
    medicines:Medicines
}

export interface MedicineForm {
    code:string
    date_expired:string
    barcode?:string
    batch_number:string
    name:string
    drug_classification_id:number|null
    medical_supplier_id:number|null
    medicine_factory_id:number|null
    min_stock_supplier:number|null
    is_generic:number
    is_active:number
    is_prescription:number
    stock:number|null
    piece_weight:number
    pack_medicine:string
    unit_medicine:string
    medicinal_preparations:string
    location_rack:string
    dose:number|null
    composition:string
    is_fullpack:number
    capital_price:number|null
    capital_price_vat:number|null
    sell_price:number|null
}

export interface MedicineEditForm {
    code:string
    date_expired:string
    barcode:string|null
    batch_number:string
    name:string
    drug_classification_id:number
    medical_supplier_id:number
    medicine_factory_id:number
    min_stock_supplier:number
    is_generic:number
    is_active:number
    is_prescription:number
    stock:number
    piece_weight:number
    pack_medicine:string
    unit_medicine:string
    medicinal_preparations:string
    location_rack:string
    dose:number
    composition:string
    is_fullpack:number
    capital_price:number
    capital_price_vat:number
    sell_price:number
}