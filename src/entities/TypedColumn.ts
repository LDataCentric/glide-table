import { SizedGridColumn } from "@glideapps/glide-data-grid";
import { label } from "./labelProps";

export interface TypedColumn extends SizedGridColumn{
    isSort:boolean,
    type: dataType,
    labels?: label[],
    id:string,
    readonly:boolean
}

export enum dataType{
    TEXT="TEXT",
    NUMBER="NUMBER",
    TIME_SERIES="TIME_SERIES",
    IMAGE="IMAGE",
    AUDIO="AUDIO",
    BUTTON="BUTTON",
    SINGLE_LABEL_TAG_LIST="SINGLE_LABEL_TAG_LIST",
    MULT_LABEL_TAG_LIST="MULT_LABEL_TAG_LIST",
    BUBBLE="BUBBLE"
}

