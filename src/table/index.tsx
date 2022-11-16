import {DataEditor,Item,GridCell, TextCell, GridCellKind, GridColumn, isEditableGridCell, CustomCell, CompactSelection, GridSelection, EditableGridCell} from "@glideapps/glide-data-grid"
import {TagsCell as TagRender, SparklineCell as SparkRender} from "@glideapps/glide-data-grid-cells"
import type { SparklineCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/sparkline-cell"
import "@glideapps/glide-data-grid/dist/index.css"
import { useCallback, useState, useMemo } from "react"
import { TypedColumn } from "../entities/TypedColumn"
import {generateColumns, generateFakeData} from "../fake/fakefunc"
import { useEventListener } from "../util/util"
import range from "lodash/range.js";
import { TagsCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/tags-cell"
import "@glideapps/glide-data-grid-cells/dist/index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
export default function GLideTable(){

  let num: number = 1;
  function rand(): number {
      return (num = (num * 16807) % 2147483647) / 2147483647;
  }

  const [selection, setSelection] = useState<GridSelection>({
    rows: CompactSelection.empty(),
    columns: CompactSelection.empty(),
  });
  
  let [databaseInfo,setDatabaseInfo] = useState(generateFakeData(200))
  
  const columns: TypedColumn[] = useMemo(()=>generateColumns(),[])
  const getData = useCallback(([col,row]: Item): GridCell => {
    if(col >2){
      return {
        data:databaseInfo[row].content,
        displayData:databaseInfo[row].content,
        allowOverlay:true,
        readonly:false,
        kind:GridCellKind.Text
      }
    }
    else if (col===2){
      return{
        kind:GridCellKind.Image,
        data:["https://ca.slack-edge.com/T01RA4X4X35-U047PNY4AT0-006f4fc77a8f-192","https://ca.slack-edge.com/T01RA4X4X35-U047PNY4AT0-006f4fc77a8f-192"],
        allowAdd:false,
        allowOverlay:true,
        displayData: ["https://ca.slack-edge.com/T01RA4X4X35-U047PNY4AT0-006f4fc77a8f-192","https://ca.slack-edge.com/T01RA4X4X35-U047PNY4AT0-006f4fc77a8f-192"],
         
      }
    }
    else if(col ===1)
    {
      num = row + 1;
      const values = range(0, 15).map(() => rand() * 100 - 50);
      return {
          kind: GridCellKind.Custom,
          allowOverlay: false,
          copyData: "4",
          data: {
              kind: "sparkline-cell",
              values,
              displayValues: values.map(x => Math.round(x).toString()),
              color: row % 2 === 0 ? "#77c4c4" : "#D98466",
              yAxis: [-50, 50],
          },
      } as SparklineCell;
    }
    else{
      let possibleTags= [{tag:"label a",color:"#ff4d4d35"},{tag:"label b",color:"#48ff5735"}]
      num = row + 1;
      rand();
      return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: "4",
          data: {
              kind: "tags-cell",
              possibleTags: possibleTags,
              readonly: false,
              tags: databaseInfo[row].labels ?? ["empty"]
          },
      } as TagsCell;
    }
  },[databaseInfo])

  
  const [showSearch, setShowSearch] = useState(false);
  
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

const onCellEdited = useCallback((cell: Item, newValue: EditableGridCell) => {
  //editing only text cells by now
  const [col, row] = cell;
    if (newValue.kind === GridCellKind.Text) {
      
      databaseInfo[row].content = newValue.data
    }
    if(newValue.kind === GridCellKind.Custom && (newValue.data as any).kind==="tags-cell"){
      console.log(newValue.data);
      // let nTags = ((newValue.data as any).tags as Array<string>).shift();
      let nTags =((newValue.data as any).tags as Array<string>).filter((element)=>element!=="empty")
      if(nTags.length===0){
        nTags=["empty"]
      }
      databaseInfo[row].labels = nTags

    }
  }, []);
    
  const [sortableResizableCols, setSortableResizableCols] = useState(columns);

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
  columns={sortableResizableCols} rows={databaseInfo.length} rowMarkers="both" height={500} isDraggable={false}></DataEditor>)


}