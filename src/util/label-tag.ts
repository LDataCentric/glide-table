import { label } from "../entities/labelProps";

export function getTagsFromDataLabel(labels:label[], data:any):string[]|null{
    let labelName:string;
    if(data){
        labels.forEach(label=>{
            if(label.id===data.labelId){
                labelName=label.name
            }
        })
        return [labelName]
    }
    return null
}

export function getLabelIdFromTag(labels:label[],tag:string):string|null{
    let i = labels.findIndex(label=>label.name===tag)
    if(i===-1){
        return null
    }
    return labels[i].id
}

export function setLabelFromTags(data:any){

}