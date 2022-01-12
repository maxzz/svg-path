import { atom, useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { activePointAtom, canvasStrokeAtom, containerRefAtom, hoverPointAtom, svgAtom, viewBoxAtom } from "../../store/store";
import { formatNumber, Svg, SvgControlPoint, SvgItem, SvgPoint } from "../../svg/svg";
import { ViewPoint } from "../../svg/svg-utils-viewport";

const ptColor = (active: boolean, hover: boolean): string => active ? '#009cff' : hover ? '#ff4343' : 'white';

class DragPoint {
    constructor(public dragPt: SvgPoint, public startPt: ViewPoint) {
        //console.log('onMouseDown', startPt);
    }
    onDrag(event: MouseEvent, pt: ViewPoint) {
        //console.log('onMouseMove', this.startPt, pt);
    }
    onDragEnd(event: MouseEvent) {
        //console.log('onMouseEnd', this.startPt);
    }
}

//console.log({x: canvasRect.x, y: canvasRect.y, box: JSON.stringify(viewBox.map(_ => _.toFixed(2)))});

const _DragPointAtom = atom<DragPoint | null>(null);
const DragPointEventAtom = atom(null, (get, set, { event, start, end }: { event: MouseEvent, start?: SvgPoint, end?: boolean; }) => {
    const canvasRef = get(containerRefAtom);
    if (!canvasRef) { return; }

    function getEventPt() {
        const canvasRect = canvasRef!.getBoundingClientRect();
        const viewBox = get(viewBoxAtom);
        const canvasStroke = get(canvasStrokeAtom);
        let [viewBoxX, viewBoxY] = viewBox;
        const x = viewBoxX + (event.clientX - canvasRect.x) * canvasStroke;
        const y = viewBoxY + (event.clientY - canvasRect.y) * canvasStroke;
        return { x, y };
    }

    if (start) {
        set(_DragPointAtom, new DragPoint(start, getEventPt()));
    } else {
        const dp = get(_DragPointAtom);
        if (!dp) { return; }
        if (end) {
            dp.onDragEnd(event);
            set(_DragPointAtom, null);
        } else {
            const pt = getEventPt();
            dp.onDrag(event, pt);

            const svg = get(svgAtom);
            svg.setLocation(dp.dragPt, pt);

            const newSvg = new Svg();
            newSvg.path = svg.path;
            set(svgAtom, newSvg);
        }
    }
});

export type SvgPointMouseDown = {
    event: React.MouseEvent;
    pt?: SvgPoint;
    cpt?: SvgControlPoint;
};

export type OnSvgPointMouseDown = ({ event, pt, cpt }: SvgPointMouseDown) => void;

export function TargetPoint({ svgItem, pt, stroke, idx, clk }: { svgItem: SvgItem; pt: SvgPoint, stroke: number; idx: number; clk: OnSvgPointMouseDown; }) {
    const [activePt, setActivePt] = useAtom(activePointAtom);
    const [hoverPt, setHoverPt] = useAtom(hoverPointAtom);
    const active = activePt === idx;
    const hover = hoverPt === idx;

    //const setDragPointEvent = useUpdateAtom(DragPointEventAtom);
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
                //setDragPointEvent({ event: event.nativeEvent, start: pt });
                clk({ event, pt, });
            }}
            onMouseMove={(event) => {
                //setDragPointEvent({ event: event.nativeEvent });
            }}
            onMouseUp={(event) => {
                //event.stopPropagation();
                //setDragPointEvent({ event: event.nativeEvent, end: true });
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </circle>
    </>);
}

export function ControlPoint({ pt, stroke, idx, clk }: { pt: SvgControlPoint, stroke: number; idx: number; clk: OnSvgPointMouseDown; }) {
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
                //event.stopPropagation();
                setActivePt(idx);
                clk({ event, cpt: pt });
            }}
            onMouseUp={(event) => {
                //event.stopPropagation();
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </rect>
    </>);
}
