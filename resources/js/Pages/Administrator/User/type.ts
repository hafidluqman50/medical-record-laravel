export interface User {
    id:number;
    name:string;
    username:string;
    status_user:number;
    role:Role
    role_id:number
}

export interface Role {
    id:number;
    name:string;
    slug_name:string
}