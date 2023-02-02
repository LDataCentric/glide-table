import {
    CustomCell,
    Rectangle,
    measureTextCached,
    CustomRenderer,
    getMiddleCenterBias,
    GridCellKind,
} from "@glideapps/glide-data-grid";
import "./style.css"
import { roundedRect } from "../../draw-fns";

interface ClickableLabelProps {
    readonly kind: "labels-cell";
    readonly tags: readonly string[];
    readonly readonly?: boolean;
    readonly possibleTags: readonly {
        tag: string;
        color: string;
        textColor?:string;
    }[];
}

export type ClickableLabel = CustomCell<ClickableLabelProps>;

const tagHeight = 20;
const innerPad = 6;

const renderer: CustomRenderer<ClickableLabel> = {
    kind: GridCellKind.Custom,
    isMatch: (c): c is ClickableLabel => (c.data as any).kind === "labels-cell",
    draw: (args, cell) => {
        const { ctx, theme, rect } = args;
        const { possibleTags, tags } = cell.data;

        const drawArea: Rectangle = {
            x: rect.x + theme.cellHorizontalPadding,
            y: rect.y + theme.cellVerticalPadding,
            width: rect.width - 2 * theme.cellHorizontalPadding,
            height: rect.height - 2 * theme.cellVerticalPadding,
        };
        const rows = Math.max(1, Math.floor(drawArea.height / (tagHeight + innerPad)));

        let x = drawArea.x;
        let row = 1;
        let y = drawArea.y + (drawArea.height - rows * tagHeight - (rows - 1) * innerPad) / 2;
        for (const tag of tags) {
            ctx.beginPath();
            const color = possibleTags.find(t => t.tag === tag)?.color ?? theme.bgBubble;
            const Textcolor = possibleTags.find(t => t.tag === tag)?.textColor ?? theme.textDark;

            ctx.font = `12px ${theme.fontFamily}`;
            const metrics = measureTextCached(tag, ctx);
            const width = metrics.width + innerPad * 2;
            const textY = tagHeight / 2;

            if (x !== drawArea.x && x + width > drawArea.x + drawArea.width && row < rows) {
                row++;
                y += tagHeight + innerPad;
                x = drawArea.x;
            }

            ctx.fillStyle = color;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.lineWidth = 1.5;
            roundedRect(ctx, x, y, width, tagHeight, tagHeight / 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle =  Textcolor;
            ctx.fillText(tag, x + innerPad, y + textY + getMiddleCenterBias(ctx, `12px ${theme.fontFamily}`));

            x += width + 8;
            if (x > drawArea.x + drawArea.width && row >= rows) break;
        }

        return true;
    },
    provideEditor: () => {
        // eslint-disable-next-line react/display-name
        return p => {
            const { onChange, value } = p;
            const { possibleTags, tags, readonly = false } = value.data;
            return (
                <div className={"EditorWrap" + (readonly ? "readonly" : "")}>
                    {possibleTags.map(t => {
                        const selected = tags.indexOf(t.tag) !== -1;
                        return (
                            <label key={t.tag}>
                                {!readonly && (
                                    <input
                                        className="gdg-input"
                                        type="radio" 
                                        checked={selected}
                                        name="tag-group"
                                        //empty function to avoid console warning
                                        onChange={()=>{}}
                                        onClick={() => {
                                            const newTags = selected ? [] : [t.tag];
                                            onChange({
                                                ...p.value,
                                                data: {
                                                    ...value.data,
                                                    tags: newTags,
                                                },
                                            });
                                        }}
                                    />
                                )}
                                <div
                                    className={"pill " + (selected ? "selected" : "unselected")}
                                    style={{ backgroundColor: selected ? t.color : undefined, color:selected? t.textColor??"black":undefined}}>
                                    {t.tag}
                                </div>
                            </label>
                        );
                    })}
                </div>
            );
        };
    },
    onPaste: (v, d) => ({
        ...d,
        tags: d.possibleTags
            .map(x => x.tag)
            .filter(x =>
                v
                    .split(",")
                    .map(s => s.trim())
                    .includes(x)
            ),
    }),
};

export default renderer;