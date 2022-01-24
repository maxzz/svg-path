import { Atom, PrimitiveAtom, useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { canvasStrokeAtom, doSetStateAtom, CanvasDragEvent, SvgItemEditState } from "../../store/store";
import { formatNumber, SvgControlPoint, SvgPoint } from "../../svg/svg";

type CanvasDragHandler = (event: CanvasDragEvent) => void;

const pointColor = (active: boolean, hover: boolean): string => active ? '#009cff' : hover ? '#ff4343' : 'white';
const editorColor = (active: boolean, hover: boolean): string => active ? '#9c00ff' : hover ? '#ffad40' : 'white';

export function TargetPoint({ pt, clk, svgItemIdx, stateAtom, asStringAtom }:
    { pt: SvgPoint; svgItemIdx: number; clk: CanvasDragHandler; asStringAtom: Atom<string>; stateAtom: PrimitiveAtom<SvgItemEditState>; }) {

    const stroke = useAtomValue(canvasStrokeAtom);
    const [asString] = useAtom(asStringAtom);

    const setState = useUpdateAtom(doSetStateAtom);
    const state = useAtomValue(stateAtom);
    const activeEd = state.activeRow && state.activeEd === -1;
    const hoverEd = state.hoverRow && state.hoverEd === -1;

    console.log(`%c--PT-- [${svgItemIdx}. ] re-rendder, state`, 'color: #bbb', state);

    return (<>
        {(state.activeRow || state.hoverRow) &&
            <path style={{ stroke: pointColor(state.activeRow, state.hoverRow), fill: 'none' }} strokeWidth={stroke} d={asString} />
        }
        {(activeEd || hoverEd) &&
            <circle
                style={{ stroke: 'transparent', fill: editorColor(activeEd, hoverEd) }}
                cx={pt.x} cy={pt.y} r={stroke * 8} strokeWidth={stroke * 16}
            />
        }
        <circle
            className="cursor-pointer"
            style={{ stroke: 'transparent', fill: pointColor(state.activeRow, state.hoverRow) }}
            cx={pt.x} cy={pt.y} r={stroke * 3} strokeWidth={stroke * 12}

            onMouseEnter={() => setState({ atom: stateAtom, states: { hoverRow: true } })}
            onMouseLeave={() => setState({ atom: stateAtom, states: { hoverRow: false } })}
            onMouseDown={(event) => {
                event.stopPropagation();
                setState({ atom: stateAtom, states: { activeRow: true } });
                clk({ mdownEvent: event, mdownPt: pt, svgItemIdx });
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </circle>
    </>);
}

export function ControlPoint({ pt, clk, svgItemIdx, stateAtom, }:
    { pt: SvgControlPoint; svgItemIdx: number; clk: CanvasDragHandler; stateAtom: PrimitiveAtom<SvgItemEditState>; }) {

    const stroke = useAtomValue(canvasStrokeAtom);
    const state = useAtomValue(stateAtom);
    const setState = useUpdateAtom(doSetStateAtom);
    const activeEd = state.activeRow && state.activeEd === pt.subIndex;
    const hoverEd = state.hoverRow && state.hoverEd === pt.subIndex;

    console.log(`%c  cp   [${svgItemIdx}.${pt.subIndex}] re-rendder, state`, 'color: gray', state);

    return (<>
        {pt.relations.map((rel, idx) => (
            <line
                className="stroke-[#fff7]"
                x1={pt.x} y1={pt.y} x2={rel.x} y2={rel.y} strokeWidth={stroke} key={idx}
            />
        ))}
        {
            (activeEd || hoverEd) &&
            <rect
                className="cursor-pointer"
                style={{ stroke: 'transparent', fill: editorColor(activeEd, hoverEd) }}
                x={pt.x - 8 * stroke} y={pt.y - 8 * stroke} width={stroke * 16} height={stroke * 16} strokeWidth={stroke * 16}
            />
        }
        <rect
            className="cursor-pointer"
            style={{ stroke: 'transparent', fill: pointColor(state.activeRow, state.hoverRow) }}
            x={pt.x - 3 * stroke} y={pt.y - 3 * stroke} width={stroke * 6} height={stroke * 6} strokeWidth={stroke * 12}

            onMouseEnter={() => {
                console.log(`%c       [${svgItemIdx}.${pt.subIndex}] cp mouse enter`, 'color: limegreen');

                setState({ atom: stateAtom, states: { hoverRow: true, hoverEd: pt.subIndex } });

                console.log(`       [${svgItemIdx}.${pt.subIndex}] cp mouse enter done`);
            }}
            onMouseLeave={() => {
                console.log(`%c       [${svgItemIdx}.${pt.subIndex}] cp mouse leave`, 'color: limegreen');
                
                setState({ atom: stateAtom, states: { hoverRow: false, hoverEd: -1 } });
                
                console.log(`       [${svgItemIdx}.${pt.subIndex}] cp mouse leave done`);
            }}
            onMouseDown={(event) => {
                console.log(`%c       [${svgItemIdx}.${pt.subIndex}] cp mouse down`, 'color: limegreen');
                
                event.stopPropagation();
                setState({ atom: stateAtom, states: { activeRow: true } });
                clk({ mdownEvent: event, mdownPt: pt, svgItemIdx });

                console.log(`       [${svgItemIdx}.${pt.subIndex}] cp mouse down done`);
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </rect>
    </>);
}
