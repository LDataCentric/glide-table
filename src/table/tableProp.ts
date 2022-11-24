import { TypedColumn } from "../entities/TypedColumn"


type deleteRlas = (dataId:any,rlasId:string) => Promise<void>
type addRlas = (data:any,labelingTaskId:string,labelId:string)=>Promise<string>

export type TableProps=
{
    data: Array<any>,
    columns:Array<TypedColumn>,
    emptyMessage:string,
    height:number,
    rounding?:number,
    deleteRlas: deleteRlas,
    addRlas: addRlas


}