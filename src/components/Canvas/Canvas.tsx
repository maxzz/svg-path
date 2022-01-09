import React from 'react';
import { atom, useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { mergeRef } from '../../hooks/utils';
import { activePointAtom, canvasSizeAtom, svgAtom, tickIntevalAtom, viewBoxAtom, viewBoxStrokeAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { SvgItem, SvgPoint } from '../../svg/svg';
import { CanvasControlsPanel } from './CanvasControlsPanel';
import { ViewBox } from '../../svg/svg-utils-viewport';
import { ControlPoint, TargetPoint } from './CanvasPoints';

const cpToTargetIdx = (targetLocations: SvgPoint[], ref: SvgItem) => targetLocations.findIndex((pt) => pt.itemReference === ref);

function calcGrid(viewBox: ViewBox, canvasWidth: number) {
    const doGrid = 5 * viewBox[2] <= canvasWidth;
    return {
        xGrid: doGrid ? Array(Math.ceil(viewBox[2]) + 1).fill(null).map((_, i) => Math.floor(viewBox[0]) + i) : [],
        yGrid: doGrid ? Array(Math.ceil(viewBox[3]) + 1).fill(null).map((_, i) => Math.floor(viewBox[1]) + i) : [],
    };
}

function BackgroundGrid({ onClick }: { onClick?: () => void; }) {

    const [viewBox] = useAtom(viewBoxAtom);
    const [canvasSize] = useAtom(canvasSizeAtom);
    const [viewBoxStroke] = useAtom(viewBoxStrokeAtom);
    const [tickInteval] = useAtom(tickIntevalAtom);

    const grid = calcGrid(viewBox, canvasSize.w);

    return (
        <g className="bg-red-400" onClick={onClick}>
            {grid.xGrid.map((v) =>
                <line
                    x1={v} x2={v} y1={viewBox[1]} y2={viewBox[1] + viewBox[3]} key={`x${v}`}
                    className={`${v % tickInteval === 0 ? 'stroke-[#8888]' : 'stroke-[#8884]'}`}
                    style={{ strokeWidth: viewBoxStroke }}
                />
            )}
            {grid.yGrid.map((v) =>
                <line
                    y1={v} y2={v} x1={viewBox[0]} x2={viewBox[0] + viewBox[2]} key={`y${v}`}
                    className={`${v % tickInteval === 0 ? 'stroke-[#8888]' : 'stroke-[#8884]'}`}
                    style={{ strokeWidth: viewBoxStroke }}
                />
            )}
            {grid.xGrid.map((v) => <React.Fragment key={v}>
                {v % tickInteval === 0 &&
                    <text className="fill-[#744]"
                        y={-5 * viewBoxStroke}
                        x={v - 5 * viewBoxStroke}
                        style={{ fontSize: viewBoxStroke * 10 + 'px', stroke:"white", strokeWidth: viewBoxStroke*.2 }}
                    >
                        {v}
                    </text>
                }
            </React.Fragment>)}
            {grid.yGrid.map((v) => <React.Fragment key={v}>
                {v % tickInteval === 0 &&
                    <text className="fill-[#744]"
                        x={-5 * viewBoxStroke}
                        y={v - 5 * viewBoxStroke}
                        style={{ fontSize: viewBoxStroke * 10 + 'px', stroke:"white", strokeWidth: viewBoxStroke*.2 }}
                    >
                        {v}
                    </text>
                }
            </React.Fragment>)}
        </g>
    );
}

function SvgCanvas({ viewBox, viewBoxStroke }: { viewBox: ViewBox; viewBoxStroke: number; }) {
    const [svg] = useAtom(svgAtom);
    const pathPoints = svg.targetLocations();
    const cpPoints = svg.controlLocations();
    const setActivePt = useUpdateAtom(activePointAtom);
    return (
        <svg viewBox={viewBox.join(" ")} className="bg-[#040d1c]">
            <BackgroundGrid onClick={() => setActivePt(-1)} />

            <path d={svg.asString()} fill="#94a3b830" stroke="white" strokeWidth={viewBoxStroke} />

            <g className="cpPts">
                {cpPoints.map((pt, idx) => (
                    <ControlPoint pt={pt} stroke={viewBoxStroke} idx={cpToTargetIdx(pathPoints, pt.itemReference)} key={idx} />
                ))}
            </g>

            <g className="pathPts">
                {pathPoints.map((pt, idx) => (
                    <TargetPoint svgItem={svg.path[idx]} pt={pt} stroke={viewBoxStroke} idx={idx} key={idx} />
                ))}
            </g>
        </svg>
    );
}

const CanvasControlsPanelMemo = React.memo(CanvasControlsPanel);

export function PathCanvas() {
    const { viewBox, viewBoxStroke, ref, parentRef, onWheel, } = useContainerZoom();
    return (
        <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full overflow-hidden" onWheel={onWheel}>
            <SvgCanvas viewBox={viewBox} viewBoxStroke={viewBoxStroke} />
            <CanvasControlsPanelMemo />
        </div>
    );
}
