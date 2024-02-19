export interface StockOpname {
    id:number;
    date_stock_opname:string;
    notes:string;
    location_rack:string;
    user:{
        name:string
    }
    stock_opname_details:Array<StockOpnameDetail>
}

export interface StockOpnameDetail {
    id:number;
    stock_opname_id:number;
    medicine_id:number;
    unit_medicine:string;
    medicine:{
        name:string
    }
    stock_computer:number;
    stock_display:number;
    stock_deviation:string;
    price:number;
    sub_value:number;
    date_expired:string;
}