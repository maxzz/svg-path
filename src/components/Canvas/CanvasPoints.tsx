import { Atom, useAtom } from "jotai";
import { activePointAtom, editorActivePointAtom, editorHoverPointAtom, hoverPointAtom } from "../../store/store";
import { formatNumber, SvgControlPoint, SvgPoint } from "../../svg/svg";
import { ViewPoint } from "../../svg/svg-utils-viewport";

export type StartDragEvent = {
    event: React.MouseEvent;
    pt?: SvgPoint | SvgControlPoint;
    isCp?: boolean;
    startXY?: ViewPoint;
    ptIdx?: number;
    svgItemIdx: number;
};

export type StartDragEventHandler = (event: StartDragEvent) => void;

const pointColor = (active: boolean, hover: boolean): string => active ? '#009cff' : hover ? '#ff4343' : 'white';
const editorColor = (active: boolean, hover: boolean): string => active ? '#9c00ff' : hover ? '#ffad40' : 'white';

export function TargetPoint({ pt, stroke, svgItemIdx, clk, asStringAtom }: { pt: SvgPoint, stroke: number; svgItemIdx: number; clk: StartDragEventHandler; asStringAtom: Atom<string>; }) {
    const [activePt, setActivePt] = useAtom(activePointAtom);
    const [hoverPt, setHoverPt] = useAtom(hoverPointAtom);
    const active = activePt === svgItemIdx;
    const hover = hoverPt === svgItemIdx;

    const [editorActivePt] = useAtom(editorActivePointAtom);
    const [editorHoverPt] = useAtom(editorHoverPointAtom);
    const editorActive = editorActivePt?.[0] === svgItemIdx && editorActivePt?.[1] === -1;
    const editorHover = editorHoverPt?.[0] === svgItemIdx && editorHoverPt?.[1] === -1;

    const [asString] = useAtom(asStringAtom);

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

            onMouseEnter={() => setHoverPt(svgItemIdx)}
            onMouseLeave={() => setHoverPt(-1)}
            onMouseDown={(event) => {
                event.stopPropagation();
                setActivePt(svgItemIdx);
                clk({ event, pt, svgItemIdx });
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </circle>
    </>);
}

export function ControlPoint({ pt, stroke, svgItemIdx, clk}: { pt: SvgControlPoint, stroke: number; svgItemIdx: number; clk: StartDragEventHandler; }) {
    const [activePt, setActivePt] = useAtom(activePointAtom);
    const [hoverPt, setHoverPt] = useAtom(hoverPointAtom);
    const active = activePt === svgItemIdx;
    const hover = hoverPt === svgItemIdx;

    const [editorActivePt] = useAtom(editorActivePointAtom);
    const [editorHoverPt] = useAtom(editorHoverPointAtom);
    const editorActive = editorActivePt?.[0] === svgItemIdx && editorActivePt?.[1] === pt.subIndex;
    const editorHover = editorHoverPt?.[0] === svgItemIdx && editorHoverPt?.[1] === pt.subIndex;

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

            onMouseEnter={() => setHoverPt(svgItemIdx)}
            onMouseLeave={() => setHoverPt(-1)}
            onMouseDown={(event) => {
                event.stopPropagation();
                setActivePt(svgItemIdx);
                clk({ event, pt, isCp: true, svgItemIdx });
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </rect>
    </>);
}
