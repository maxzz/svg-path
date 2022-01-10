import React from 'react';
import { atom, useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { ViewBox } from '../../svg/svg-utils-viewport';
import { canvasSizeAtom, showGridAtom, showTicksAtom, tickIntevalAtom, viewBoxAtom, canvasStrokeAtom } from '../../store/store';

function calcGrid(viewBox: ViewBox, canvasWidth: number) {
    const doGrid = 5 * viewBox[2] <= canvasWidth;
    return {
        xGrid: doGrid ? Array(Math.ceil(viewBox[2]) + 1).fill(null).map((_, i) => Math.floor(viewBox[0]) + i) : [],
        yGrid: doGrid ? Array(Math.ceil(viewBox[3]) + 1).fill(null).map((_, i) => Math.floor(viewBox[1]) + i) : [],
    };
}

export function CanvasTicks({ onClick }: { onClick?: () => void; }) {

    const [viewBox] = useAtom(viewBoxAtom);
    const [canvasSize] = useAtom(canvasSizeAtom);
    const [canvasStroke] = useAtom(canvasStrokeAtom);
    const [tickInteval] = useAtom(tickIntevalAtom);
    const showGrid = useAtomValue(showGridAtom);
    const showTicks = useAtomValue(showTicksAtom);

    if (!showGrid) {
        return null;
    }

    const grid = calcGrid(viewBox, canvasSize.w);
    
    return (
        <g className="bg-red-400 font-numbers" onClick={onClick}> {/* TODO: font-mono allows align by number of chars */}
            {grid.xGrid.map((v) =>
                <line
                    x1={v} x2={v} y1={viewBox[1]} y2={viewBox[1] + viewBox[3]} key={`x${v}`}
                    className={`${v ===0 ? 'stroke-[#f005]' : v % tickInteval === 0 ? 'stroke-[#8888]' : 'stroke-[#8884]'}`}
                    style={{ strokeWidth: canvasStroke }}
                />
            )}
            {grid.yGrid.map((v) =>
                <line
                    y1={v} y2={v} x1={viewBox[0]} x2={viewBox[0] + viewBox[2]} key={`y${v}`}
                    className={`${v ===0 ? 'stroke-[#f005]' : v % tickInteval === 0 ? 'stroke-[#8888]' : 'stroke-[#8884]'}`}
                    style={{ strokeWidth: canvasStroke }}
                />
            )}

            {showTicks && <>
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
