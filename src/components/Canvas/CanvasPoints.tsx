import React from "react";
import { Atom, PrimitiveAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { canvasStrokeAtom, doSetStateAtom, CanvasDragEvent, SvgItemEditState, doCanvasPointClkAtom, SvgItemEdit } from "../../store/store";
import { formatNumber, SvgControlPoint, SvgPoint } from "../../svg/svg";
import { doTrace } from "../../utils/debugging";
import { getSvgItemAbsType } from "../../svg/svg-utils";

type CanvasDragHandler = (event: CanvasDragEvent) => void;

const pointColor = (active: boolean, hover: boolean, sectionEnabled: boolean): string => !sectionEnabled ? '#777c' : active ? '#009cff' : hover ? '#ff4343' : 'white';
const editorColor = (active: boolean, hover: boolean, sectionEnabled: boolean): string => !sectionEnabled ? '#777c' : active ? '#9c00ffa0' : hover ? '#ffad40' : 'white';
const stokeCpLineColor = (active: boolean, hover: boolean, sectionEnabled: boolean): string => !sectionEnabled ? '#777c' : active ? '#9c00ffa0' : hover ? '#ffad40' : '#fff5';

export function TargetPoint({ svgItemEdit, sectionEnabledAtom }: { svgItemEdit: SvgItemEdit; sectionEnabledAtom: Atom<boolean>; }) {
    const asString = useAtomValue(svgItemEdit.standaloneStringAtom); // The main purpose is to trigger update
    const sectionEnabled = useAtomValue(sectionEnabledAtom);
    const stroke = useAtomValue(canvasStrokeAtom);
    const doCanvasPointClk = useUpdateAtom(doCanvasPointClkAtom);

    const svgItemIdx = svgItemEdit.svgItemIdx;
    const stateAtom = svgItemEdit.stateAtom;

    const pt: SvgPoint = svgItemEdit.svgItem.targetLocation();
    const ptType = getSvgItemAbsType(svgItemEdit.svgItem);
    const isMCommand = ptType === 'M';

    const setState = useUpdateAtom(doSetStateAtom);
    const state = useAtomValue(stateAtom);
    const activeEd = state.activeRow && state.activeEd === -1;
    const hoverEd = state.hoverRow && state.hoverEd === -1;

    doTrace && console.log(`%c--PT-- [${svgItemEdit.svgItemIdx}. ] re-rendder, state`, 'color: #bbb', state);

    if (ptType === 'Z') {
        return null;
    }
    return (<>
        {/* A piece of this point path. No more condition: state.activeRow || state.hoverRow since there is no more complete path render */}
        <g className="hover:cursor-move">
            <path
                style={{ stroke: pointColor(state.activeRow, state.hoverRow, sectionEnabled), fill: 'none' }}
                strokeWidth={stroke}
                d={asString}
                onMouseMove={() => {
                    console.log('path');
                }}
            />
        </g>
        <g className="hover:cursor-move stroke-transparent hover:stroke-orange-400">
            <path
                style={{ fill: 'none' }}
                // style={{ stroke: 'transparent', fill: 'none' }}
                strokeWidth={stroke * 3}
                d={asString}
                onMouseMove={() => {
                    console.log('path');
                }}
            />
        </g>
        {/* Active or hover circle marker */}
        {(activeEd || hoverEd) &&
            <circle
                style={{ stroke: '#9c00ff63', fill: editorColor(activeEd, hoverEd, sectionEnabled) }}
                cx={pt.x} cy={pt.y} r={stroke * 8} strokeWidth={stroke * 16}
            />
        }
        {/* Path point as circle */}
        <circle
            cx={pt.x} cy={pt.y} r={isMCommand ? stroke * 5 : stroke * 3}
            style={
                isMCommand
                    ? { stroke: pointColor(state.activeRow, state.hoverRow, sectionEnabled), fill: '#fff3', strokeWidth: stroke * 1.2, }
                    : { stroke: 'transparent', fill: pointColor(state.activeRow, state.hoverRow, sectionEnabled), strokeWidth: stroke * 12, }
            }
            className="cursor-pointer"

            onMouseEnter={() => setState({ atom: stateAtom, states: { hoverRow: true } })}
            onMouseLeave={() => setState({ atom: stateAtom, states: { hoverRow: false } })}
            onMouseDown={(event) => {
                event.stopPropagation();
                setState({ atom: stateAtom, states: { activeRow: true } });
                doCanvasPointClk({ mdownEvent: event, mdownPt: pt, svgItemIdx });
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </circle>
    </>);
}

export function ControlPoint({ svgItemEdit, cpIdx, sectionEnabledAtom }: { svgItemEdit: SvgItemEdit; cpIdx: number; sectionEnabledAtom: Atom<boolean>; }) {
    const asString = useAtomValue(svgItemEdit.standaloneStringAtom); // The main purpose is to trigger update
    const sectionEnabled = useAtomValue(sectionEnabledAtom);
    const stroke = useAtomValue(canvasStrokeAtom);
    const doCanvasPointClk = useUpdateAtom(doCanvasPointClkAtom);
    const setState = useUpdateAtom(doSetStateAtom);
    const svgItemIdx = svgItemEdit.svgItemIdx;
    const stateAtom = svgItemEdit.stateAtom;

    const controls: SvgControlPoint[] = svgItemEdit.svgItem.controlLocations();
    const pt: SvgControlPoint = controls[cpIdx];

    const state = useAtomValue(stateAtom);
    const activeEd = state.activeRow && state.activeEd === pt.subIndex;
    const hoverEd = state.hoverRow && state.hoverEd === pt.subIndex;

    doTrace && console.log(`%c  cp   [${svgItemIdx}.${pt.subIndex}] re-rendder, state`, 'color: gray', state);

    return (<>
        {/* Connected lines */}
        {pt.relations.map((rel, idx) => (
            <line
                //style={{ stroke: stokeCpLineColor(activeEd, hoverEd), strokeDasharray: `${stroke * 3} ${stroke * 5}` }}
                style={{ stroke: stokeCpLineColor(state.activeRow, state.hoverRow, sectionEnabled), strokeWidth: stroke * 1.5, strokeDasharray: `${stroke * 3} ${stroke * 5}` }}
                x1={pt.x} y1={pt.y} x2={rel.x} y2={rel.y} strokeWidth={stroke} key={idx}
            />
        ))}
        {/* Active or hover square marker */}
        {
            (activeEd || hoverEd) &&
            <rect
                className="cursor-pointer"
                style={{ stroke: '#9c00ff63', fill: editorColor(activeEd, hoverEd, sectionEnabled) }}
                x={pt.x - 8 * stroke} y={pt.y - 8 * stroke} width={stroke * 16} height={stroke * 16} strokeWidth={stroke * 16}
            />
        }
        {/* Control point as square */}
        <rect
            x={pt.x - 3 * stroke} y={pt.y - 3 * stroke} width={stroke * 6} height={stroke * 6} strokeWidth={stroke * 12}
            style={{ stroke: 'transparent', fill: pointColor(state.activeRow, state.hoverRow, sectionEnabled) }}
            className="cursor-pointer"

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
                doCanvasPointClk({ mdownEvent: event, mdownPt: pt, svgItemIdx });

                doTrace && console.log(`       [${svgItemIdx}.${pt.subIndex}] cp mouse down done`);
            }}
        >
            <title>abs: {formatNumber(pt.x, 2)},{formatNumber(pt.y, 2)}</title>
        </rect>
    </>);
}

//TODO: SVG z command
//  * not following first m command (as asString is not triggering updates). - done
//  * there can be two z commands - done
//  * z coomand should highlight corresponding first command in case of compound path - will not do

//TODO: click on canvas point should enable disabled sub-path