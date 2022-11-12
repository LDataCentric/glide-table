import { TypedColumn, dataType } from "../entities/TypedColumn";

export function generateColumns():Array<TypedColumn>{
    let columns = []
    let attributeText:TypedColumn={type:dataType.TEXT,id:"1",isSort:true,width:300,title:"joão"}
    let attributeImage:TypedColumn={type:dataType.IMAGE,id:"2",isSort:true,width:300,title:"fotos"}
    let attributeNumber:TypedColumn={type:dataType.NUMBER,id:"3",isSort:true,width:300,title:"index"}
    let attributeTimeSeries:TypedColumn={type:dataType.TIME_SERIES,id:"4",isSort:true,width:300,title:"cotas"}
    
    let task:TypedColumn={id:"5",width:300,isSort:false,labels:[{name:"yes",color:"red"}],title:"click-bait",type:dataType.BUTTON_LIST}
    let prediction:TypedColumn={id:"6",width:300,isSort:false,title:"click-bait",type:dataType.TEXT}
    columns.push(attributeText,attributeImage,attributeNumber,attributeTimeSeries,task,prediction)
    
    return columns
}

export function generateFakeData(variations:number):Array<any>{
    
    let dataArray = []
    for(let i=0;i<variations;i++){
    dataArray.push({content:""+i,id:i,label:"false",prediction:Math.sin(i),predictionText:"false",img:"https://ca.slack-edge.com/T01RA4X4X35-U047PNY4AT0-006f4fc77a8f-512"})
    }
    return dataArray
}