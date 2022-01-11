import { atom, useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { activePointAtom, hoverPointAtom } from "../../store/store";
import { formatNumber, SvgControlPoint, SvgItem, SvgPoint } from "../../svg/svg";
import { ViewPoint } from "../../svg/svg-utils-viewport";

const ptColor = (active: boolean, hover: boolean): string => active ? '#009cff' : hover ? '#ff4343' : 'white';

class DragPoint {
    constructor(public dragItem: SvgItem, startPt: ViewPoint) {
        console.log('onMouseDown', this.dragItem);
    }
    onDrag(event: MouseEvent) {
        console.log('onMouseDown', this.dragItem, event.target);
    }
    onDragEnd(event: MouseEvent) {
        console.log('onMouseDown', this.dragItem, event.target);
    }
}

const _DragPointAtom = atom<DragPoint | null>(null);
const DragPointEventAtom = atom(null, (get, set, { event, start, end }: { event: MouseEvent, start?: SvgItem, end?: boolean; }) => {
    if (start) {
        set(_DragPointAtom, new DragPoint(start, { x: event.clientX, y: event.clientY }));
    } else {
        const dp = get(_DragPointAtom);
        if (!dp) { return; }
        if (end) {
            dp.onDragEnd(event);
            set(_DragPointAtom, null);
        } else {
            dp.onDrag(event);
        }
    }
});

export function TargetPoint({ svgItem, pt, stroke, idx }: { svgItem: SvgItem; pt: SvgPoint, stroke: number; idx: number; }) {
    const [activePt, setActivePt] = useAtom(activePointAtom);
    const [hoverPt, setHoverPt] = useAtom(hoverPointAtom);
    const active = activePt === idx;
    const hover = hoverPt === idx;

    const setDragPointEvent = useUpdateAtom(DragPointEventAtom);
    return (<>
        {(active || hover) &&
            <path style={{ stroke: ptColor(active, hover), fill: 'none' }} strokeWidth={stroke} d={svgItem.asStandaloneString()} />
        }
        <circle
            className="cursor-pointer"
            style={{ stroke: 'transparent', fill: ptColor(active, hover) }}
            cx={pt.x} cy={pt.y} r={stroke * 3} strokeWidth={stroke * 12}

            onMouseEnter={(event) => { setHoverPt(idx); }}
            onMouseLeave={() => setHoverPt(-1)}
            onMouseDown={(event) => {
                event.stopPropagation();
                setActivePt(idx);
                setDragPointEvent({event: event.nativeEvent, start: svgItem});
            }}
            onMouseMove={(event) => {
                setDragPointEvent({event: event.nativeEvent});
            }}
            onMouseUp={(event) => {
                event.stopPropagation();
                setDragPointEvent({event: event.nativeEvent, end: true});
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </circle>
    </>);
}

export function ControlPoint({ pt, stroke, idx }: { pt: SvgControlPoint, stroke: number; idx: number; }) {
    const [activePt, setActivePt] = useAtom(activePointAtom);
    const [hoverPt, setHoverPt] = useAtom(hoverPointAtom);
    const active = activePt === idx;
    const hover = hoverPt === idx;
    return (<>
        {pt.relations.map((rel, idx) => (
            <line
                className="stroke-[#fff7]"
                x1={pt.x} y1={pt.y} x2={rel.x} y2={rel.y} strokeWidth={stroke} key={idx}
            />
        ))}
        <rect
            className="cursor-pointer"
            style={{ stroke: 'transparent', fill: ptColor(active, hover) }}
            x={pt.x - 3 * stroke} y={pt.y - 3 * stroke} width={stroke * 6} height={stroke * 6} strokeWidth={stroke * 12}

            onMouseEnter={(event) => { event.stopPropagation(); setHoverPt(idx); }}
            onMouseLeave={() => setHoverPt(-1)}
            onMouseDown={(event) => {
                event.stopPropagation();
                setActivePt(idx);
            }}
            onMouseUp={(event) => {
                event.stopPropagation();
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </rect>
    </>);
}
