import { TypedColumn, dataType } from "../entities/TypedColumn";
import { timeSeries } from "./timeseries";


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function generateColumns():Array<TypedColumn>{
    let columns = []
    let attributeText:TypedColumn={type:dataType.TEXT,id:"1",isSort:true,width:300,title:"texto",readonly:false}
    let attributeImage:TypedColumn={type:dataType.IMAGE,id:"2",isSort:false,width:300,title:"fotos",readonly:false}
    let attributeNumber:TypedColumn={type:dataType.NUMBER,id:"3",isSort:true,width:300,title:"index",readonly:false}
    let attributeTimeSeries:TypedColumn={type:dataType.TIME_SERIES,id:"4",isSort:true,width:300,title:"cotas",readonly:true}
    let task:TypedColumn={id:"5",width:300,isSort:false,labels:[{name:"yes",color:"#FEE2E2",id:"15"},{name:"label",id:"14",color:"#FEE2E2"},{name:"outro",id:"16",color:"green"}],title:"click-bait",type:dataType.SINGLE_LABEL_TAG_LIST,readonly:false}
    let prediction:TypedColumn={id:"6",width:300,isSort:false,title:"prediction",type:dataType.BUBBLE,readonly:true}
    columns.push(attributeText,attributeImage,attributeNumber,attributeTimeSeries,task,prediction)
    
    return columns
}

export function generateFakeData(variations:number):Array<any>{
    
    let dataArray = []
    for(let i=0;i<variations;i++){
    dataArray.push({texto:"data type texto"+i,_id:i.toString(),"6":{confidence:Math.sin(i),id:"15",label:{name:"yes",color:"#FEE2E2"}},
    index:"5",
    cotas:timeSeries,
    fotos:["https://ca.slack-edge.com/T01RA4X4X35-U047PNY4AT0-006f4fc77a8f-512"]
    ,img:"https://ca.slack-edge.com/T01RA4X4X35-U047PNY4AT0-006f4fc77a8f-512"})
    }
    return dataArray
}

export async function fakeDeleteRLA(dataId:any,rlasId:string){
    console.log(dataId);
    console.log(rlasId);
    await sleep(300)
}

export async function fakeAddRLA(data:any,labelingTaskId:string,labelId:string):Promise<string>{
    console.log(data)
    console.log(labelId)
    console.log(labelingTaskId)
    await sleep(300)
    return "dddsdsd"
}