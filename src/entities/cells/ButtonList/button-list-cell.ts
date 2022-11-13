import { CustomCell,CustomRenderer,getMiddleCenterBias,GridCellKind,interpolateColors } from "@glideapps/glide-data-grid";

type PackedColor = string | readonly [normal: string, hover: string];

interface ButtonListCellProps{
    readonly kind: "button-list-cell";
    readonly title:string[];
    readonly onCLick?:Function[];
    readonly backgroundColor?: PackedColor[];
    readonly color?: PackedColor[];
    readonly borderColor?: PackedColor[];
    readonly borderRadius?: number[];
}

export type ButtonListCell = CustomCell<ButtonListCellProps> & {readonly:true}

const render:CustomRenderer<ButtonListCell>={
    kind:GridCellKind.Custom,
    isMatch: (c): c is ButtonListCell=>(c.data as any).kind === "button-list-cell",
    needsHover:true,
    onSelect:e=>e.preventDefault(),
    draw:(args,cell)=>{
        return true
    }

}