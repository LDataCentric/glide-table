import {DataEditor,Item,GridCell, TextCell, GridCellKind, GridColumn, isEditableGridCell, CustomCell} from "@glideapps/glide-data-grid"
import { useExtraCells, ButtonCell, ButtonCellType } from "@glideapps/glide-data-grid-cells"
import "@glideapps/glide-data-grid/dist/index.css"
import { useCallback } from "react"

export default function GLideTable(){
  const columns: GridColumn[] = [{title:"column one",id:"one"},{title:"column two",id:"two"}]
  const getData = useCallback(([col,row]: Item): GridCell => {
    return {
      data:"data",
      displayData:"data"+ col+" "+row,
      allowOverlay:true,
      kind:GridCellKind.Text
    }
  },[])
  return (<DataEditor getCellContent={getData} columns={columns} rows={40} isDraggable="header" height={500} ></DataEditor>)


}