import {DataEditor,Item,GridCell, TextCell, GridCellKind, GridColumn, isEditableGridCell, CustomCell, CompactSelection, GridSelection, EditableGridCell, BubbleCell} from "@glideapps/glide-data-grid"
import {TagsCell as TagRender, SparklineCell as SparkRender} from "@glideapps/glide-data-grid-cells"
import type { SparklineCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/sparkline-cell"
import "@glideapps/glide-data-grid/dist/index.css"
import { useCallback, useState, useMemo } from "react"
import { dataType, TypedColumn } from "../entities/TypedColumn"
import { useEventListener } from "../util/util"
import range from "lodash/range.js";
import { TagsCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/tags-cell"
import "@glideapps/glide-data-grid-cells/dist/index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TableProps } from "./tableProp"
import { getTagsFromDataLabel,getLabelIdFromTag } from "../util/label-tag"
import { fakeAddRLA, fakeDeleteRLA } from "../fake/fakefunc"


export default function GLideTable({data, columns,emptyMessage,height, rounding, addRlas, deleteRlas}:TableProps){

  const [selection, setSelection] = useState<GridSelection>({
    rows: CompactSelection.empty(),
    columns: CompactSelection.empty(),
  });
  let [sortableResizableCols, setSortableResizableCols] = useState(columns);
  let [databaseInfo,setDatabaseInfo] = useState(data)
  const [showSearch, setShowSearch] = useState(false);
  
  const getData = useCallback(([col,row]: Item): GridCell => {
    let actualColumn = sortableResizableCols[col]
    let columnType = actualColumn.type

    let cell:GridCell

    switch(columnType){
      case dataType.TEXT:{
        cell={
          data:databaseInfo[row][actualColumn.title],
          kind:GridCellKind.Text,
          allowOverlay:true,
          readonly:actualColumn.readonly,
          displayData:databaseInfo[row][actualColumn.title],
          allowWrapping:true
        }
        break
      }
      case dataType.NUMBER:{
        cell={
          data:databaseInfo[row][actualColumn.title],
          kind:GridCellKind.Number,
          allowOverlay:true,
          readonly:actualColumn.readonly,
          displayData:databaseInfo[row][actualColumn.title],
        }
        break
      }
      case dataType.IMAGE:{
        cell = {
          kind:GridCellKind.Image,
          allowAdd:false,
          allowOverlay:true,
          rounding:rounding??0,
          data:databaseInfo[row][actualColumn.title],
          displayData: databaseInfo[row][actualColumn.title],
        }
        break
      }
      case dataType.SINGLE_LABEL_TAG_LIST:{
        cell={
          kind:GridCellKind.Custom,
          allowOverlay:true,
          copyData:"",
          data:{
            kind:"tags-cell",
            possibleTags: actualColumn.labels.map((label)=>{return {tag:label.name,color:label.color,id:label.id}}),
            readonly: false,
            tags:getTagsFromDataLabel(actualColumn.labels,databaseInfo[row][actualColumn.id]) ?? [emptyMessage]
          }
        } as TagsCell
        break
      }
      case dataType.TIME_SERIES:{
        const values = databaseInfo[row][actualColumn.title]
        cell={
          kind: GridCellKind.Custom,
          allowOverlay: false,
          copyData: "",
          data: {
              kind: "sparkline-cell",
              values,
              displayValues: values.map(x =>(Math.round(x * 100) / 100).toFixed(2).toString()),
              color: row % 2 === 0 ? "#77c4c4" : "#D98466",
              yAxis: [110, 200],
          },
        } as SparklineCell;
        break
      }
      case dataType.BUBBLE:{
        cell={
          data:[databaseInfo[row][actualColumn.id].label.name +" "+ databaseInfo[row][actualColumn.id].confidence],
          allowOverlay:true,
          kind:GridCellKind.Bubble,
          themeOverride:{bgBubble:databaseInfo[row][actualColumn.id].label.color}
        } as BubbleCell
        break
      }
    }
    return cell
  },[databaseInfo,sortableResizableCols])
  
  useEventListener(
    "keydown",
    useCallback(event => {
      if ((event.ctrlKey || event.metaKey) && event.code === "KeyF") {
        setShowSearch(cv => !cv);
        event.stopPropagation();
        event.preventDefault();
      }
    }, []),
    window,
    false,
    true
    );

const onCellEdited = useCallback(async (cell: Item, newValue: EditableGridCell) => {
  
  const [col, row] = cell;
  // console.log(sortableResizableCols[col].labels)
  console.log(col)
  console.log(databaseInfo[row][sortableResizableCols[col].title])
    if (newValue.kind === GridCellKind.Text || newValue.kind === GridCellKind.Number) {
      
      databaseInfo[row][sortableResizableCols[col].title] = newValue.data.toString()
    }
    console.log(databaseInfo[row][sortableResizableCols[col].title])

    if(newValue.kind === GridCellKind.Custom && (newValue.data as any).kind==="tags-cell" && sortableResizableCols[col].type===dataType.SINGLE_LABEL_TAG_LIST){
      let nTags =((newValue.data as any).tags as Array<string>).filter((element)=>element!==emptyMessage)
      if(nTags.length===0){
        await deleteRlas(databaseInfo[row]._id,databaseInfo[row][sortableResizableCols[col].id].rlasId)
        databaseInfo[row][sortableResizableCols[col].id] = undefined
        nTags=[emptyMessage]
      }
      else{
        //limit one tag selection
        nTags = [nTags[nTags.length-1]]
        let rlsaId = await addRlas(databaseInfo[row],sortableResizableCols[col].id,getLabelIdFromTag(sortableResizableCols[col].labels,nTags[0]))
        databaseInfo[row][sortableResizableCols[col].id] = {labelId:getLabelIdFromTag(sortableResizableCols[col].labels,nTags[0]),rlsaId:rlsaId}
      }
    }
  }, [databaseInfo,sortableResizableCols]);
    

  const onColMoved = useCallback((startIndex: number, endIndex: number): void => {
    setSortableResizableCols(old => {
        const newCols = [...old];
        const [toMove] = newCols.splice(startIndex, 1);
        newCols.splice(endIndex, 0, toMove);
        return newCols;
    });
  }, []);

  const onColumnResize = useCallback((column: GridColumn, newSize: number, colIndex:number) => {
    setSortableResizableCols(prevColsMap => {
        const newArray = [...prevColsMap];
        newArray.splice(colIndex, 1, {
            ...prevColsMap[colIndex],
            width: newSize,
        });
        return newArray;
    });
}, []);


  function onDelete(selection:GridSelection):boolean| GridSelection{
    console.log("triggered")
    setDatabaseInfo(_=>{
      const newData = [...databaseInfo]
      selection.rows.toArray().reverse().forEach(rowIndex=>{
        newData.splice(rowIndex,1)
      })
      return newData
    })
    setSelection({rows:CompactSelection.empty(),
      columns: CompactSelection.empty()
    })
    return true
  }
  return (<DataEditor customRenderers={[TagRender,SparkRender]} onCellEdited={onCellEdited} onDelete={onDelete} onColumnResize={onColumnResize} showSearch={showSearch}
    getCellsForSelection={true} onSearchClose={() => setShowSearch(false)} gridSelection={selection} 
    onColumnMoved={onColMoved} onGridSelectionChange={setSelection} getCellContent={getData}
    smoothScrollY={true} smoothScrollX={true}
  columns={sortableResizableCols} rows={databaseInfo.length} rowMarkers="both" height={height} isDraggable={false}></DataEditor>)


}