import { TypedColumn } from "../entities/TypedColumn"

export type TableProps=
{
    data: Array<any>,
    columns:Array<TypedColumn>,
    emptyMessage:string,
    height:number,
    rounding?:number
}