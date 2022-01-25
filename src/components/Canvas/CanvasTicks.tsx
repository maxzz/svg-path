import React from 'react';
import { useAtomValue } from 'jotai/utils';
import { ViewBox } from '../../svg/svg-utils-viewport';
import { canvasSizeAtom, showGridAtom, showTicksAtom, tickIntevalAtom, viewBoxAtom, canvasStrokeAtom } from '../../store/store';

function calcGrid(viewBox: ViewBox, canvasWidth: number) {
    const doGrid = 5 * viewBox[2] <= canvasWidth;
    return {
        xGrid: doGrid ? Array(Math.ceil(viewBox[2]) + 1).fill(null).map((_, i) => Math.floor(viewBox[0]) + i) : [],
        yGrid: doGrid ? Array(Math.ceil(viewBox[3]) + 1).fill(null).map((_, i) => Math.floor(viewBox[1]) + i) : [],
    };
}

export function CanvasTicks() {
    const viewBox = useAtomValue(viewBoxAtom);
    const canvasSize = useAtomValue(canvasSizeAtom);
    const canvasStroke = useAtomValue(canvasStrokeAtom);
    const showTicks = useAtomValue(showTicksAtom);
    const tickInteval = useAtomValue(tickIntevalAtom);
    const showGrid = useAtomValue(showGridAtom);
    if (!showGrid) {
        return null;
    }
    const grid = calcGrid(viewBox, canvasSize.w);
    return (
        <g className="svg-ticks">
            {/* X axis (vertical lines) */}
            {grid.xGrid.map((v) =>
                <line
                    x1={v} x2={v} y1={viewBox[1]} y2={viewBox[1] + viewBox[3]} key={`x${v}`}
                    className={`${v === 0 ? 'stroke-[#f005]' : v % tickInteval === 0 ? 'stroke-[#8888]' : 'stroke-[#8884]'}`}
                    style={{ strokeWidth: canvasStroke }}
                />
            )}
            {/* Y axis (horizontal lines) */}
            {grid.yGrid.map((v) =>
                <line
                    y1={v} y2={v} x1={viewBox[0]} x2={viewBox[0] + viewBox[2]} key={`y${v}`}
                    className={`${v === 0 ? 'stroke-[#f005]' : v % tickInteval === 0 ? 'stroke-[#8888]' : 'stroke-[#8884]'}`}
                    style={{ strokeWidth: canvasStroke }}
                />
            )}

            {showTicks && <>
                {/* X axis numbers */}
                {grid.xGrid.map((v) => <React.Fragment key={v}>
                    {v % tickInteval === 0 &&
                        <text className="fill-[#744]"
                            y={-5 * canvasStroke}
                            x={v - 5 * canvasStroke}
                            style={{ fontSize: canvasStroke * 10 + 'px', stroke: "white", strokeWidth: canvasStroke * .2 }}
                        >
                            {v}
                        </text>
                    }
                </React.Fragment>)}
                {/* Y axis numbers */}
                {grid.yGrid.map((v) => <React.Fragment key={v}>
                    {v % tickInteval === 0 &&
                        <text className="fill-[#744]"
                            x={-5 * canvasStroke}
                            y={v - 5 * canvasStroke}
                            style={{ fontSize: canvasStroke * 10 + 'px', stroke: "white", strokeWidth: canvasStroke * .2 }}
                        >
                            {v}
                        </text>
                    }
                </React.Fragment>)}
            </>}
        </g>
    );
}

// TODO: font-mono allows align by number of chars.
