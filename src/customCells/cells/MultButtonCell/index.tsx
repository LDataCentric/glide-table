import {
    CustomCell,
    measureTextCached,
    CustomRenderer,
    getMiddleCenterBias,
    GridCellKind,
    blend,
} from "@glideapps/glide-data-grid";
import * as React from "react";
import LinksCellEditor from "./editor";

interface LinksCellProps {
    readonly kind: "links-cell";
    /**
     * Used to hand tune the position of the underline as this is not a native canvas capability, it can need tweaking
     * for different fonts.
     */
    readonly maxLinks?: number;
    readonly navigateOn?: "click" | "control-click";
    readonly links: readonly {
        readonly title: string;
        readonly href?: string;
        readonly onClick?: () => void;
    }[];
}

export type LinksCell = CustomCell<LinksCellProps>;

function onClickSelect(e: Parameters<NonNullable<CustomRenderer<LinksCell>["onSelect"]>>[0]) {
    const useCtrl = e.cell.data.navigateOn !== "click";
    if (useCtrl !== e.ctrlKey) return undefined;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    if (ctx === null) return;

    const { posX: hoverX, bounds: rect, cell, theme } = e;
    const font = `${theme.baseFontStyle} ${theme.fontFamily}`;
    ctx.font = font;

    const { links } = cell.data;

    const xPad = theme.cellHorizontalPadding;

    let drawX = rect.x + xPad;

    const rectHoverX = rect.x + hoverX;
    
    for (const [index, l] of Object.entries(links)) {
        const needsComma = +index < links.length - 1;
        const metrics = measureTextCached(l.title, ctx);
        const commaMetrics = needsComma ? measureTextCached(l.title + ",", ctx, font) : metrics;

        const isHovered = rectHoverX > drawX && rectHoverX < drawX + metrics.width;

        if (isHovered) {
            return l;
        }

        drawX += commaMetrics.width + 4;
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
        const hovered = onClickSelect(e);
        if (hovered !== undefined) {
            hovered.onClick?.();
            e.preventDefault();
        }
        return undefined;
    },
    draw: (args, cell) => {
        const { ctx, rect, theme, hoverX = -100, highlighted } = args;
        const { links } = cell.data;
        const underlineOffset = 10

        const xPad = theme.cellHorizontalPadding;

        let drawX = rect.x + xPad;

        const rectHoverX = rect.x + hoverX;

        const font = `${theme.baseFontStyle} ${theme.fontFamily}`;

        const middleCenterBias = getMiddleCenterBias(ctx, font);
        const drawY = rect.y + rect.height / 2 + middleCenterBias;

        for (const [index, b] of Object.entries(links)) {
            let button_r = new Path2D();
            const metrics = measureTextCached("text"+index, ctx);
            console.log(index,metrics)
            const commaMetrics = metrics;

            const isHovered = rectHoverX > drawX && rectHoverX < drawX + metrics.width;

            if (isHovered) {
                ctx.moveTo(drawX, Math.floor(drawY + underlineOffset) + 0.5);
                ctx.lineTo(drawX + metrics.width, Math.floor(drawY + underlineOffset) + 0.5);

                // ctx.lineWidth = 1;
                ctx.strokeStyle = theme.textDark;
                ctx.stroke();

                ctx.fillStyle = highlighted ? blend(theme.accentLight, theme.bgCell) : theme.bgCell;
                ctx.fillText("text"+index, drawX - 1, drawY);
                ctx.fillText("text"+index, drawX + 1, drawY);

                ctx.fillText("text"+index, drawX - 2, drawY);
                ctx.fillText("text"+index, drawX + 2, drawY);
            }
            ctx.fillStyle = theme.textDark;
            ctx.fillText("text"+index, drawX, drawY);

            drawX += commaMetrics.width + 4;
        }

        return true;
    },
    // eslint-disable-next-line react/display-name
    provideEditor: () => p => {
        const { value, onChange } = p;
        const { links, maxLinks = Number.MAX_SAFE_INTEGER } = value.data;
        return (
            <div onKeyDown={ignoreTab}>
                <LinksCellEditor >
                {links.map((l, i) => (
                    <LinkTitleEditor
                        key={i}
                        link={l.href ?? ""}
                        title={l.title}
                        focus={i === 0}
                        onDelete={
                            links.length > 1
                                ? () => {
                                      const newLinks = [...links];
                                      newLinks.splice(i, 1);
                                      onChange({
                                          ...value,
                                          data: {
                                              ...value.data,
                                              links: newLinks,
                                          },
                                      });
                                  }
                                : undefined
                        }
                        onChange={(link, title) => {
                            const newLinks = [...links];
                            newLinks[i] = {
                                href: link,
                                title,
                            };
                            onChange({
                                ...value,
                                data: {
                                    ...value.data,
                                    links: newLinks,
                                },
                            });
                        }}
                    />
                ))}
                <button
                    disabled={links.length >= maxLinks}
                    className="add-link"
                    onClick={() => {
                        const newLinks = [...links, { title: "" }];
                        onChange({
                            ...value,
                            data: {
                                ...value.data,
                                links: newLinks,
                            },
                        });
                    }}>
                    Add link
                </button>
            </LinksCellEditor>
            </div>
        );
    },
    onPaste: (v, d) => {
        const split = v.split(",");
        if (d.links.some((l, i) => split[i] !== l.title)) return undefined;
        return {
            ...d,
            links: split.map(l => ({ title: l })),
        };
    },
};


interface LinkTitleEditorProps {
    readonly link: string;
    readonly title: string;
    readonly onChange: (link: string, title: string) => void;
    readonly onDelete?: () => void;
    readonly focus: boolean;
}

function ignoreTab(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
        e.stopPropagation();
    }
}

const LinkTitleEditor: React.VFC<LinkTitleEditorProps> = p => {
    const { link, onChange, title, onDelete, focus } = p;
    return (
        <div className="gdg-link-title-editor">
            <input
                className="gdg-title-input"
                value={title}
                placeholder="Title"
                autoFocus={focus}
                onChange={e => {
                    onChange(link, e.target.value);
                }}
            />
            <input
                className="gdg-link-input"
                value={link}
                placeholder="URL"
                onChange={e => {
                    onChange(e.target.value, title);
                }}
            />
            {onDelete !== undefined && (
                <button onClick={onDelete}>
                    <svg
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        id="icon-import"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3 6L5 6L21 6"
                            stroke="currentColor"
                            strokeWidth="1px"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M17.9019 6C18.491 6 18.9525 6.50676 18.8975 7.09334L17.67 20.1867C17.5736 21.2144 16.711 22 15.6787 22H8.32127C7.28902 22 6.42635 21.2144 6.33 20.1867L5.1025 7.09334C5.04751 6.50676 5.50898 6 6.09813 6H17.9019Z"
                            stroke="currentColor"
                            strokeWidth="1px"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M14.4499 10.211L13.9949 17"
                            stroke="currentColor"
                            strokeWidth="1px"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M9.55499 10.211L10.0049 17"
                            stroke="currentColor"
                            strokeWidth="1px"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M7.5 2.25H16.5"
                            stroke="currentColor"
                            strokeWidth="1px"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default renderer;