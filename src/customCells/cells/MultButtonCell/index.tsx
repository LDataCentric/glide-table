import {
    CustomCell,
    measureTextCached,
    CustomRenderer,
    getMiddleCenterBias,
    GridCellKind,
    blend,
} from "@glideapps/glide-data-grid";
import * as React from "react";
import { roundedRect } from "../../draw-fns";
import ListButtonCellPortal from "./editor";

interface LinksCellProps {
    readonly kind: "links-cell";
    /**
     * Used to hand tune the position of the underline as this is not a native canvas capability, it can need tweaking
     * for different fonts.
     */
    readonly buttons: readonly{
        onClick?:()=>void,
        enable?:boolean,
        borderColor:string,
        bgColor:string,
        fontColor:string,
        hoverColor:string,
        text:string
    }[];
    readonly isMulti:boolean,
    butonHeight?:number,
    rounding:number,
    disableBorder?:boolean,
    hoverShadow:boolean
}

export type LinksCell = CustomCell<LinksCellProps>;

function onClickSelect(e: Parameters<NonNullable<CustomRenderer<LinksCell>["onSelect"]>>[0]) {
    // const useCtrl = e.cell.data.navigateOn !== "click";
    // if (useCtrl !== e.ctrlKey) return undefined;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    if (ctx === null) return;
    const { posX: hoverX, bounds: rect, cell, theme,posY:hoverY } = e;
    const font = `${theme.baseFontStyle} ${theme.fontFamily}`;
    ctx.font = font;
    const { buttons } = cell.data;
    const moreButtonWidht=30
    let haveMoreButton=false;
    console.log(e)

    const xPad = theme.cellHorizontalPadding;
    const middleCenterBias = getMiddleCenterBias(ctx, font);

    let drawX = rect.x + xPad;
    const tempHeight=32
    const height = tempHeight??Math.ceil(rect.height-theme.cellVerticalPadding*2-1)/2
    const drawY = rect.y + rect.height / 2 + middleCenterBias;
    const marginX = 10
    const padinX = 10
    const moreButtonPadding = 10
    const rectHoverX = rect.x + hoverX;
    const rectHoverY = rect.y +hoverY
    
    for (const [index, button] of Object.entries(buttons)) {
        const metrics = measureTextCached(button.text, ctx);
        if(drawX-rect.x>rect.width-metrics.width-moreButtonWidht*1.5){
            haveMoreButton = true
            break
        }
         const isHovered = (rectHoverX > drawX && rectHoverX < drawX + metrics.width+padinX*2)
         && (rectHoverY>drawY-height/2 && rectHoverY<drawY+height/2);
        if (isHovered) {
            return button;
        }
        drawX += metrics.width+padinX*2 + marginX;
    }
    if(haveMoreButton){
        const isHovered = (rectHoverX > drawX && rectHoverX < drawX + moreButtonWidht+moreButtonPadding*2) && (rectHoverY>drawY-height/2 && rectHoverY<drawY+height/2);
        if(isHovered){
            return {onClick:()=>console.log("extra")}
        }
    }
    return undefined;
}

const renderer: CustomRenderer<LinksCell> = {
    kind: GridCellKind.Custom,
    needsHover: true,
    needsHoverPosition: true,
    isMatch: (c): c is LinksCell => (c.data as any).kind === "links-cell",
    onSelect: e => {
        if (onClickSelect(e) !== undefined) {
            e.preventDefault();
        }
    },
    onClick: e => {
        // e.preventDefault();
        const hovered = onClickSelect(e);
        if (hovered !== undefined) {
            hovered.onClick?.();
            e.preventDefault();
        }
        return undefined;
    },
    draw: (args, cell) => {
        let haveMoreButton=false;
        const { ctx, rect, theme, hoverX = -100, highlighted, hoverY=-100 } = args;
        const { buttons,butonHeight,rounding,hoverShadow, disableBorder } = cell.data;

        const xPad = theme.cellHorizontalPadding;

        let drawX = rect.x + xPad;

        const rectHoverX = rect.x + hoverX;
        const rectHoverY = rect.y + hoverY

        const font = `${theme.baseFontStyle} ${theme.fontFamily}`;

        const middleCenterBias = getMiddleCenterBias(ctx, font);
        const drawY = rect.y + rect.height / 2 + middleCenterBias;
        ctx.font = font
        const height = butonHeight??Math.ceil(rect.height-theme.cellVerticalPadding*2-1)/2
        const marginX = 10
        const padinX = 10
        const moreButtonWidht=30

        for (const [index, button] of Object.entries(buttons)) {
            let button_r = new Path2D();
            const metrics = measureTextCached(button.text, ctx);
            if(drawX-rect.x>rect.width-metrics.width-moreButtonWidht*1.5){
                haveMoreButton = true
                break
            }
            // console.log(index,metrics)

            const isHovered = (rectHoverX > drawX && rectHoverX < drawX + metrics.width+padinX*2)
             && (rectHoverY>drawY-height/2 && rectHoverY<drawY+height/2);
            roundedRect(button_r,drawX,drawY-height/2,metrics.width+padinX*2,height,rounding)
            ctx.strokeStyle = button.borderColor
            ctx.lineWidth = 1
            ctx.fillStyle=isHovered?button.hoverColor:button.bgColor
            if(hoverShadow){
            ctx.shadowColor = "#737373";
            ctx.shadowBlur = isHovered?4:0;
            }
            ctx.fill(button_r)
            if(!disableBorder){
                ctx.stroke(button_r)                
            }
            ctx.fillStyle = button.fontColor
            ctx.fillText(button.text, drawX+padinX, drawY);
            // if (isHovered) {
            //     ctx.moveTo(drawX+padinX, Math.floor(drawY + underlineOffset) + 0.5);
            //     ctx.lineTo(drawX + metrics.width+padinX, Math.floor(drawY + underlineOffset) + 0.5);

            //     // ctx.lineWidth = 1;
            //     ctx.strokeStyle = theme.textDark;
            //     ctx.stroke();

            //     ctx.fillStyle = highlighted ? blend(theme.accentLight, theme.bgCell) : theme.bgCell;
            //     // ctx.fillText("text"+index, drawX - 1, drawY);
            //     // ctx.fillText("text"+index, drawX + 1, drawY);

            //     // ctx.fillText("text"+index, drawX - 2, drawY);
            //     // ctx.fillText("text"+index, drawX + 2, drawY);
            // }

            drawX += metrics.width+padinX*2 + marginX;
        }
        if(haveMoreButton){
            let moreButtonPadding = 10
            let dotRadio = 3
            const isHovered = (rectHoverX > drawX && rectHoverX < drawX + moreButtonWidht+moreButtonPadding*2) && (rectHoverY>drawY-height/2 && rectHoverY<drawY+height/2);
            const moreButton = new Path2D()
            roundedRect(moreButton,drawX,drawY-height/2,(moreButtonWidht+moreButtonPadding*2)+dotRadio,height,5)
            ctx.fillStyle=isHovered?"#989898":"#CACACA"
            ctx.fill(moreButton)
            const dotIcon = new Path2D()
            drawX+=moreButtonPadding+dotRadio
            for(let i=1;i<=3;i++){
                dotIcon.arc(drawX,drawY,dotRadio,0,360)
                ctx.fillStyle="#161616"
                ctx.fill(dotIcon)
                drawX+=moreButtonPadding+dotRadio
            }
            
        }

        return true;
    },  
    // eslint-disable-next-line react/display-name
    provideEditor: () => p => {
        const { value, onChange } = p;
        const { buttons} = value.data;
        return (
                <ListButtonCellPortal>
                    
            </ListButtonCellPortal>
        );
    }
};


function ignoreTab(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
        e.stopPropagation();
    }
}

export default renderer;