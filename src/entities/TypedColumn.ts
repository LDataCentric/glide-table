import { SizedGridColumn } from "@glideapps/glide-data-grid";

export interface TypedColumn extends SizedGridColumn{
    isSort:boolean,
    type: dataType,
    labels?: any,
    id:string
}

export enum dataType{
    TEXT="TEXT",
    NUMBER="NUMBER",
    TIME_SERIES="TIME_SERIES",
    IMAGE="IMAGE",
    AUDIO="AUDIO",
    BUTTON="BUTTON",
    LABEL_LIST="LABEL_LIST"
}

