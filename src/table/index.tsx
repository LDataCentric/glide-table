import {DataEditor,Item,GridCell, TextCell, GridCellKind, GridColumn, isEditableGridCell, CustomCell, CompactSelection, GridSelection} from "@glideapps/glide-data-grid"
import { useExtraCells, ButtonCell, ButtonCellType } from "@glideapps/glide-data-grid-cells"
import "@glideapps/glide-data-grid/dist/index.css"
import { useCallback, useState, useMemo } from "react"
import { TypedColumn } from "../entities/TypedColumn"
import {generateColumns, generateFakeData} from "../fake/fakefunc"
import { useEventListener } from "../util/util"
export default function GLideTable(){

  const [selection, setSelection] = useState<GridSelection>({
    rows: CompactSelection.empty(),
    columns: CompactSelection.empty(),
  });
  
  
  const columns: TypedColumn[] = useMemo(()=>generateColumns(),[])
  const getData = useCallback(([col,row]: Item): GridCell => {
    return {
      data:generateFakeData(col+row).content,
      displayData:generateFakeData(col+row).content,
      allowOverlay:true,
      kind:GridCellKind.Text
    }
  },[])

  const [sortableCols, setSortableCols] = useState(columns);

  const onColMoved = useCallback((startIndex: number, endIndex: number): void => {
    setSortableCols(old => {
        const newCols = [...old];
        const [toMove] = newCols.splice(startIndex, 1);
        newCols.splice(endIndex, 0, toMove);
        return newCols;
    });
}, []);

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

  function printSelection(newSelection:GridSelection){
    newSelection.rows.toArray().forEach(num=>{
      for(let i=0;i<columns.length;i++){
        console.log((getData([i,num]) as TextCell).displayData)
      }
    })
    
    setSelection(newSelection)
  }
  return (<DataEditor showSearch={showSearch} getCellsForSelection={true} onSearchClose={() => setShowSearch(false)} gridSelection={selection} onColumnMoved={onColMoved} freezeColumns={1} onGridSelectionChange={printSelection} getCellContent={getData} 
  columns={sortableCols} rows={40} rowMarkers="both" height={500} isDraggable={false}></DataEditor>)


}