import {DataEditor,Item,GridCell, TextCell, GridCellKind, GridColumn, isEditableGridCell, CustomCell, CompactSelection, GridSelection, EditableGridCell} from "@glideapps/glide-data-grid"
import { useExtraCells, ButtonCellType, } from "@glideapps/glide-data-grid-cells"
import type { SparklineCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/sparkline-cell"
import type { ButtonListCell } from "../entities/cells/ButtonList/button-list-cell"
import "@glideapps/glide-data-grid/dist/index.css"
import { useCallback, useState, useMemo } from "react"
import { TypedColumn } from "../entities/TypedColumn"
import {generateColumns, generateFakeData} from "../fake/fakefunc"
import { render as ButtonListRender } from "../entities/cells/ButtonList/button-list-cell"
import { useEventListener } from "../util/util"
import range from "lodash/range.js";
import { render } from "@testing-library/react"
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
    if(col >1){
      return {
        data:databaseInfo[row].content,
        displayData:databaseInfo[row].content+"     dsdsfffdsfhfdskjfdfkdshkfdkfdkhfkfdkfkhf",
        allowOverlay:true,
        readonly:false,
        kind:GridCellKind.Text
      }
    }
    else if(col ===1)
    {
      num = row + 1;
      const values = range(0, 15).map(() => rand() * 100 - 50);
      // console.log(values)
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
      const b:ButtonListCell={
        kind:GridCellKind.Custom,
        cursor:"pointer",
        allowOverlay:true,
        copyData:"data",
        readonly:true,
        data:{
          kind:"button-list-cell",
          title:"options",
          backgroundColor:["transparent","#6572ffee"],
          color:["accentColor","accentFg"],
          borderColor:"#6572ffa0",
          borderRadius:9,
          onClick:(a)=>console.log(a)
        },
        themeOverride:{
          baseFontStyle:"700 12px"
        }
      }
      return b
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
    if (newValue.kind !== GridCellKind.Text) {
        return;
    }
    const [col, row] = cell;
    databaseInfo[row].content = newValue.data
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
  return (<DataEditor customRenderers={[...(useExtraCells().customRenderers),ButtonListRender]} onCellEdited={onCellEdited} onDelete={onDelete} onColumnResize={onColumnResize} showSearch={showSearch}
    getCellsForSelection={true} onSearchClose={() => setShowSearch(false)} gridSelection={selection} 
    onColumnMoved={onColMoved} onGridSelectionChange={setSelection} getCellContent={getData}
    smoothScrollY={true} smoothScrollX={true}
  columns={sortableResizableCols} rows={databaseInfo.length} rowMarkers="both" height={600} isDraggable={false}></DataEditor>)


}