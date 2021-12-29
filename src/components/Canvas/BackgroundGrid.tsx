import React from "react";
import { useAtom } from "jotai";
import { showGridAtom } from "../../store/store";

function GridPattern({ x, y }: { x: number; y: number; }) {
    return (<>
        <defs>
            {/* grid lines */}
            <pattern id="grid-patt-a" width={10} height={10} patternUnits="userSpaceOnUse">
                <path
                    d="M10 0H0v10"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={0.3}
                    strokeOpacity={0.5}
                />
            </pattern>
            {/* 100-ticks */}
            <pattern id="grid-patt-b" width={100} height={100} patternUnits="userSpaceOnUse">
                <path fill="url(#grid-patt-a)" d="M0 0h100v100H0z" />
                <path
                    d="M100 0H0v100"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeOpacity={0.2}
                />
            </pattern>
            {/* 200-ticks */}
            <pattern id="grid-patt-c" width={200} height={200} patternUnits="userSpaceOnUse">
                <path fill="url(#grid-patt-b)" d="M0 0h200v200H0z" />
                <path
                    d="M200 0H0v200"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeOpacity={0.2}
                />
            </pattern>
        </defs>
        <rect x={x} y={y} width="100%" height="100%" fill="url(#grid-patt-c)" />
    </>);
}

export function BackgroundGrid({ x, y }: { x: number; y: number; }) {
    const [showGrid, setShowGrid] = useAtom(showGridAtom);
    return (
        <g className="grid">
            <rect x={x} y={y} width="100%" height="100%" fill="#040d1c" /> {/* #002846 */}
            {showGrid && <GridPattern x={x} y={y} />}
        </g>
    );
}
