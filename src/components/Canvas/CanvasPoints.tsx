import { Atom, PrimitiveAtom, useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { canvasStrokeAtom, doSetStateAtom, CanvasDragEvent, SvgItemEditState } from "../../store/store";
import { formatNumber, SvgControlPoint, SvgPoint } from "../../svg/svg";
import { doTrace } from "../../utils/debugging";

type CanvasDragHandler = (event: CanvasDragEvent) => void;

const pointColor = (active: boolean, hover: boolean): string => active ? '#009cff' : hover ? '#ff4343' : 'white';
const editorColor = (active: boolean, hover: boolean): string => active ? '#9c00ffa0' : hover ? '#ffad40' : 'white';
const stokeCpLineColor = (active: boolean, hover: boolean): string => active ? '#9c00ffa0' : hover ? '#ffad40' : '#fff5';

export function TargetPoint({ pt, clk, svgItemIdx, stateAtom, standaloneStringAtom }: {
    pt: SvgPoint;
    svgItemIdx: number;
    clk: CanvasDragHandler;
    standaloneStringAtom: Atom<string>;
    stateAtom: PrimitiveAtom<SvgItemEditState>;
}) {
    const stroke = useAtomValue(canvasStrokeAtom);
    const [asString] = useAtom(standaloneStringAtom);

    const setState = useUpdateAtom(doSetStateAtom);
    const state = useAtomValue(stateAtom);
    const activeEd = state.activeRow && state.activeEd === -1;
    const hoverEd = state.hoverRow && state.hoverEd === -1;

    const isMCommand = pt.itemReference.getType().toUpperCase() === 'M';

    doTrace && console.log(`%c--PT-- [${svgItemIdx}. ] re-rendder, state`, 'color: #bbb', state);

    return (<>
        {/* A piece of path */}
        {(state.activeRow || state.hoverRow) &&
            <path style={{ stroke: pointColor(state.activeRow, state.hoverRow), fill: 'none' }} strokeWidth={stroke} d={asString} />
        }
        {/* Active or hover circle marker */}
        {(activeEd || hoverEd) &&
            <circle
                style={{ stroke: '#9c00ff63', fill: editorColor(activeEd, hoverEd) }}
                cx={pt.x} cy={pt.y} r={stroke * 8} strokeWidth={stroke * 16}
            />
        }
        {/* Path point as circle */}
        <circle
            className="cursor-pointer"
            style={isMCommand
                ? { stroke: pointColor(state.activeRow, state.hoverRow), fill: '#fff3', strokeWidth: stroke * 1.2, }
                : { stroke: 'transparent', fill: pointColor(state.activeRow, state.hoverRow), strokeWidth: stroke * 12, }
            }
            cx={pt.x} cy={pt.y} r={isMCommand ? stroke * 5 : stroke * 3}
            // r={stroke * 3} 
            // strokeWidth={stroke * 12}

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

export function ControlPoint({ pt, clk, svgItemIdx, stateAtom, }: {
    pt: SvgControlPoint;
    svgItemIdx: number;
    clk: CanvasDragHandler;
    stateAtom: PrimitiveAtom<SvgItemEditState>;
}) {
    const stroke = useAtomValue(canvasStrokeAtom);
    const state = useAtomValue(stateAtom);
    const setState = useUpdateAtom(doSetStateAtom);
    const activeEd = state.activeRow && state.activeEd === pt.subIndex;
    const hoverEd = state.hoverRow && state.hoverEd === pt.subIndex;

    doTrace && console.log(`%c  cp   [${svgItemIdx}.${pt.subIndex}] re-rendder, state`, 'color: gray', state);

    return (<>
        {/* Connected lines */}
        {pt.relations.map((rel, idx) => (
            <line
                //style={{ stroke: stokeCpLineColor(activeEd, hoverEd), strokeDasharray: `${stroke * 3} ${stroke * 5}` }}
                style={{ stroke: stokeCpLineColor(state.activeRow, state.hoverRow), strokeWidth: stroke * 1.5, strokeDasharray: `${stroke * 3} ${stroke * 5}` }}
                x1={pt.x} y1={pt.y} x2={rel.x} y2={rel.y} strokeWidth={stroke} key={idx}
            />
        ))}
        {/* Active or hover square marker */}
        {
            (activeEd || hoverEd) &&
            <rect
                className="cursor-pointer"
                style={{ stroke: 'transparent', fill: editorColor(activeEd, hoverEd) }}
                x={pt.x - 8 * stroke} y={pt.y - 8 * stroke} width={stroke * 16} height={stroke * 16} strokeWidth={stroke * 16}
            />
        }
        {/* Control point as square */}
        <rect
            className="cursor-pointer"
            style={{ stroke: 'transparent', fill: pointColor(state.activeRow, state.hoverRow) }}
            x={pt.x - 3 * stroke} y={pt.y - 3 * stroke} width={stroke * 6} height={stroke * 6} strokeWidth={stroke * 12}

            onMouseEnter={() => {
                doTrace && console.log(`%c       [${svgItemIdx}.${pt.subIndex}] cp mouse enter`, 'color: limegreen');

                setState({ atom: stateAtom, states: { hoverRow: true, hoverEd: pt.subIndex } });

                doTrace && console.log(`       [${svgItemIdx}.${pt.subIndex}] cp mouse enter done`);
            }}
            onMouseLeave={() => {
                doTrace && console.log(`%c       [${svgItemIdx}.${pt.subIndex}] cp mouse leave`, 'color: limegreen');

                setState({ atom: stateAtom, states: { hoverRow: false, hoverEd: -1 } });

                doTrace && console.log(`       [${svgItemIdx}.${pt.subIndex}] cp mouse leave done`);
            }}
            onMouseDown={(event) => {
                doTrace && console.log(`%c       [${svgItemIdx}.${pt.subIndex}] cp mouse down`, 'color: limegreen');

                event.stopPropagation();
                setState({ atom: stateAtom, states: { activeRow: true } });
                clk({ mdownEvent: event, mdownPt: pt, svgItemIdx });

                doTrace && console.log(`       [${svgItemIdx}.${pt.subIndex}] cp mouse down done`);
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </rect>
    </>);
}
