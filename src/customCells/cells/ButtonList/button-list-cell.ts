import { CustomCell,CustomRenderer,getMiddleCenterBias,GridCellKind,interpolateColors } from "@glideapps/glide-data-grid";
import { roundedRect } from "../../draw-fns";

type PackedColor = string | readonly [normal: string, hover: string];

interface ButtonListCellProps{
    readonly kind: "button-list-cell";
    readonly title:string[];
    readonly onClick:Function[] | ((index:number)=>void);
    readonly backgroundColor?: PackedColor;
    readonly color?: PackedColor;
    readonly borderColor?: PackedColor;
    readonly borderRadius?: number;
}

export type ButtonListCell = CustomCell<ButtonListCellProps> & {readonly:true}

function unpackColor(color: PackedColor, theme: Record<string, any>, hoverAmount: number): string {
    if (typeof color === "string") {
        if (theme[color] !== undefined) return theme[color];
        return color;
    }

    let [normal, hover] = color;
    if (theme[normal] !== undefined) normal = theme[normal];
    if (theme[hover] !== undefined) hover = theme[hover];
    return interpolateColors(normal, hover, hoverAmount);
}


export const render:CustomRenderer<ButtonListCell>={
    kind:GridCellKind.Custom,
    isMatch: (c): c is ButtonListCell=>{
        if((c.data as any).kind === "button-list-cell" && ((c.data as any).title.length === (c.data as any).onClick.length || typeof((c.data as any).onClick)=="function")){
            return true
        }
        return false
    },
    needsHover:true,
    onSelect:e=>e.preventDefault(),

    onClick:gridData=>{
        let buttonWidth = gridData.bounds.width/gridData.cell.data.title.length
        let clicked = Math.floor(gridData.posX/buttonWidth)
        if(gridData.cell.data.onClick.length >= 2){
            gridData.cell.data.onClick[clicked]()
        }
        else{
            (gridData.cell.data.onClick as Function)(clicked)
        }
        return undefined;
        
    },
    draw:(args,cell)=>{
        const button = new Path2D();
        const {ctx,theme,rect,hoverAmount} = args
        const{title,backgroundColor,color,borderColor,borderRadius}=cell.data
        let x = Math.floor(rect.x+theme.cellHorizontalPadding+1)
        let y = Math.floor(rect.y+theme.cellHorizontalPadding/2)

        const width = Math.ceil(rect.width-theme.cellHorizontalPadding*2-1)/title.length
        const height = Math.ceil(rect.height-theme.cellVerticalPadding*2-1)

        for(let i =0;i<title.length;i++){
            let button_r = new Path2D();
            
            if(backgroundColor!==undefined){
                roundedRect(button_r,x,y,width,height,borderRadius??0)
                ctx.fillStyle = unpackColor(backgroundColor,theme,hoverAmount)
                ctx.fill(button_r);
                
            }
            if(borderColor!==undefined){
                roundedRect(button_r,x+0.5,y+0.5,width-1,height-1,borderRadius??0)
                ctx.strokeStyle = unpackColor(borderColor,theme,hoverAmount)
                ctx.lineWidth=1;
                ctx.stroke(button_r);
            }
            ctx.fillStyle = unpackColor(color??theme.accentColor,theme,hoverAmount)
            ctx.fillText(title[i],x+width/2,y+height/2+getMiddleCenterBias(ctx,`${theme.baseFontStyle} ${theme.fontFamily}`))
            x+=width+theme.cellHorizontalPadding/Math.floor(title.length)
        }

        return true
    },
    drawPrep: args=>{
        const {ctx} = args;
        ctx.textAlign="center"
        return {
            deprep:a=>
            {
                a.ctx.textAlign="start"
            }
        }
    },
    provideEditor:undefined
}