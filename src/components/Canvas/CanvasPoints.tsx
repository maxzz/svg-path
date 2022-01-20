import { Atom, atom, useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { activePointAtom, editorActivePointAtom, editorHoverPointAtom, hoverPointAtom } from "../../store/store";
import { formatNumber, Svg, SvgControlPoint, SvgItem, SvgPoint } from "../../svg/svg";
import { ViewPoint } from "../../svg/svg-utils-viewport";

/*
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
*/

export type StartDragEvent = {
    event: React.MouseEvent;
    pt?: SvgPoint | SvgControlPoint;
    isCp?: boolean;
    startXY?: ViewPoint;
    ptIdx?: number;
};

export type StartDragEventHandler = (event: StartDragEvent) => void;

const pointColor = (active: boolean, hover: boolean): string => active ? '#009cff' : hover ? '#ff4343' : 'white';
const editorColor = (active: boolean, hover: boolean): string => active ? '#9c00ff' : hover ? '#ffad40' : 'white';

export function TargetPoint({ pt, stroke, pathPtIdx, clk, asStringAtom }: { pt: SvgPoint, stroke: number; pathPtIdx: number; clk: StartDragEventHandler; asStringAtom: Atom<string>; }) {
    const [activePt, setActivePt] = useAtom(activePointAtom);
    const [hoverPt, setHoverPt] = useAtom(hoverPointAtom);
    const active = activePt === pathPtIdx;
    const hover = hoverPt === pathPtIdx;

    const [editorActivePt] = useAtom(editorActivePointAtom);
    const [editorHoverPt] = useAtom(editorHoverPointAtom);
    const editorActive = editorActivePt?.[0] === pathPtIdx && editorActivePt?.[1] === -1;
    const editorHover = editorHoverPt?.[0] === pathPtIdx && editorHoverPt?.[1] === -1;

    const [asString] = useAtom(asStringAtom);

    //console.log(' pt', 'active', editorActivePt, 'hover', editorHoverPt);

    return (<>
        {(active || hover) &&
            <path style={{ stroke: pointColor(active, hover), fill: 'none' }} strokeWidth={stroke} d={asString} />
        }
        {(editorActive || editorHover) &&
            <circle
                style={{ stroke: 'transparent', fill: editorColor(editorActive, editorHover) }}
                cx={pt.x} cy={pt.y} r={stroke * 6} strokeWidth={stroke * 12}
            />
        }
        <circle
            className="cursor-pointer"
            style={{ stroke: 'transparent', fill: pointColor(active, hover) }}
            cx={pt.x} cy={pt.y} r={stroke * 3} strokeWidth={stroke * 12}

            onMouseEnter={() => { setHoverPt(pathPtIdx); }}
            onMouseLeave={() => setHoverPt(-1)}
            onMouseDown={(event) => {
                event.stopPropagation();
                setActivePt(pathPtIdx);
                clk({ event, pt, });
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </circle>
    </>);
}

export function ControlPoint({ pt, stroke, pathPtIdx, clk}: { pt: SvgControlPoint, stroke: number; pathPtIdx: number; clk: StartDragEventHandler; }) {
    const [activePt, setActivePt] = useAtom(activePointAtom);
    const [hoverPt, setHoverPt] = useAtom(hoverPointAtom);
    const active = activePt === pathPtIdx;
    const hover = hoverPt === pathPtIdx;

    const [editorActivePt] = useAtom(editorActivePointAtom);
    const [editorHoverPt] = useAtom(editorHoverPointAtom);
    const editorActive = editorActivePt?.[0] === pathPtIdx && editorActivePt?.[1] === pt.subIndex;
    const editorHover = editorHoverPt?.[0] === pathPtIdx && editorHoverPt?.[1] === pt.subIndex;

    //console.log('cpt', 'active', editorActivePt, 'hover', editorHoverPt, 'pathPtIdx', pathPtIdx, 'cPtIdx', pt.subIndex);

    return (<>
        {pt.relations.map((rel, idx) => (
            <line
                className="stroke-[#fff7]"
                x1={pt.x} y1={pt.y} x2={rel.x} y2={rel.y} strokeWidth={stroke} key={idx}
            />
        ))}
        {
        (editorActive || editorHover) &&
            <rect
                className="cursor-pointer"
                style={{ stroke: 'transparent', fill: editorColor(editorActive, editorHover) }}
                x={pt.x - 6 * stroke} y={pt.y - 6 * stroke} width={stroke * 12} height={stroke * 12} strokeWidth={stroke * 12}
            />
        }
        <rect
            className="cursor-pointer"
            style={{ stroke: 'transparent', fill: pointColor(active, hover) }}
            x={pt.x - 3 * stroke} y={pt.y - 3 * stroke} width={stroke * 6} height={stroke * 6} strokeWidth={stroke * 12}

            onMouseEnter={(event) => { setHoverPt(pathPtIdx); }}
            onMouseLeave={() => setHoverPt(-1)}
            onMouseDown={(event) => {
                event.stopPropagation();
                setActivePt(pathPtIdx);
                clk({ event, pt, isCp: true });
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </rect>
    </>);
}
