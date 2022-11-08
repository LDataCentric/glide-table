import {DataEditor,Item,GridCell, TextCell, GridCellKind, GridColumn, isEditableGridCell, CustomCell, CompactSelection, GridSelection} from "@glideapps/glide-data-grid"
import { useExtraCells, ButtonCell, ButtonCellType } from "@glideapps/glide-data-grid-cells"
import "@glideapps/glide-data-grid/dist/index.css"
import { useCallback, useState, useMemo } from "react"
import { TypedColumn } from "../entities/TypedColumn"
import generateColumns from "../fake/fakefunc"

export default function GLideTable(){

  const [selection, setSelection] = useState<GridSelection>({
    rows: CompactSelection.empty(),
    columns: CompactSelection.empty(),
  });

  let sampleData = {
    content:"fdfdfffd",id:12,label:"false",prediction:0.8,predictionText:"false",img:"https://ca.slack-edge.com/T01RA4X4X35-U047PNY4AT0-006f4fc77a8f-512"
  }


  const columns: TypedColumn[] = useMemo(()=>generateColumns(),[])
  const getData = useCallback(([col,row]: Item): GridCell => {
    return {
      data:sampleData.content,
      displayData:sampleData.content,
      allowOverlay:true,
      kind:GridCellKind.Text
    }
  },[])

  function printSelection(newSelection:GridSelection){
    newSelection.rows.toArray().forEach(num=>{
      for(let i=0;i<columns.length;i++){
        console.log((getData([i,num]) as TextCell).displayData)
      }
    })
    
    setSelection(newSelection)
  }
  return (<DataEditor gridSelection={selection} onGridSelectionChange={printSelection} getCellContent={getData} columns={columns} rows={40} rowMarkers="both" height={500} isDraggable={false} 
  onColumnMoved={(s, e) => {columns[s]=columns[e]}}
  ></DataEditor>)


}