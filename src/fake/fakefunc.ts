import { PredictionColumn } from './../entities/TypedColumn';
import { atributeColumn, TypedColumn, dataType, TaskColumn } from "../entities/TypedColumn";

export function generateColumns():Array<TypedColumn>{
    let columns = []
    let attributeText:atributeColumn={type:dataType.TEXT,id:"1",isSort:true,width:300,title:"joão"}
    let attributeImage:atributeColumn={type:dataType.IMAGE,id:"2",isSort:true,width:300,title:"fotos"}
    let attributeNumber:atributeColumn={type:dataType.NUMBER,id:"3",isSort:true,width:300,title:"index"}
    let attributeTimeSeries:atributeColumn={type:dataType.TIME_SERIES,id:"4",isSort:true,width:300,title:"cotas"}
    
    let task:TaskColumn={id:"5",width:300,isSort:false,labels:[{name:"yes",color:"red"}],title:"click-bait"}
    let prediction:PredictionColumn={id:"6",width:300,isSort:false,title:"click-bait"}
    columns.push(attributeText,attributeImage,attributeNumber,attributeTimeSeries,task,prediction)
    
    return columns
}

export function generateFakeData(variations:number):any{

    let data = {content:"content"+variations,id:variations,label:"false",prediction:Math.sin(variations),predictionText:"false",img:"https://ca.slack-edge.com/T01RA4X4X35-U047PNY4AT0-006f4fc77a8f-512"}
    return data
}