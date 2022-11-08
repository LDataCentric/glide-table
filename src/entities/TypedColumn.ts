import { AutoGridColumn } from "@glideapps/glide-data-grid";

export interface TypedColumn extends AutoGridColumn{
    isSort:boolean;
}

export interface atributeColumn extends TypedColumn{
    type: dataType
}

export interface TaskColumn extends TypedColumn{
    labels:any[]
}
export interface PredictionColumn extends TypedColumn{

}

export enum dataType{
    TEXT="TEXT",
    NUMBER="NUMBER",
    TIME_SERIES="TIME_SERIES",
    IMAGE="IMAGE",
    AUDIO="AUDIO",
}

