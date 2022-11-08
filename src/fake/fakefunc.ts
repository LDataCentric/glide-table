import { PredictionColumn } from './../entities/TypedColumn';
import { atributeColumn, TypedColumn, dataType, TaskColumn } from "../entities/TypedColumn";

export default function generateColumns():Array<TypedColumn>{
    let columns = []
    let attributeText:atributeColumn={type:dataType.TEXT,id:"1",isSort:true,title:"joão"}
    let attributeImage:atributeColumn={type:dataType.IMAGE,id:"2",isSort:true,title:"fotos"}
    let attributeNumber:atributeColumn={type:dataType.NUMBER,id:"3",isSort:true,title:"index"}
    let attributeTimeSeries:atributeColumn={type:dataType.TIME_SERIES,id:"4",isSort:true,title:"cotas"}
    
    let task:TaskColumn={id:"5",isSort:false,labels:[{name:"yes",color:"red"}],title:"click-bait"}
    let prediction:PredictionColumn={id:"6",isSort:false,title:"click-bait"}
    columns.push(attributeText,attributeImage,attributeNumber,attributeTimeSeries,task,prediction)
    
    return columns
}