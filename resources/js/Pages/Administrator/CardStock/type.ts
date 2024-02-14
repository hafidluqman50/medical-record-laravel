export interface CardStock {
    id:number;
    invoice_number:string,
    date_stock:string,
    type:string,
    buy:number,
    sell:number,
    return:number,
    accumulated_stock:number,
    notes:string,
}