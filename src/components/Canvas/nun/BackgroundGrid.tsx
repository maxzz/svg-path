import React from "react";
import { showGridAtom, showTicksAtom } from "../../../store/store";
import { useAtomValue } from "jotai/utils";
//import { a } from "@react-spring/web";

function GridPattern({ x, y }: { x: number; y: number; }) {
    const showGrid = useAtomValue(showGridAtom);
    const showTicks = useAtomValue(showTicksAtom);
    return (<>
        {showGrid && (<>
            <defs>
                {/* grid lines */}
                <pattern id="grid-patt-a" width={10} height={10} patternUnits="userSpaceOnUse">
                    <path d="M10 0H0v10" fill="none" stroke="#fff" strokeWidth={0.3} strokeOpacity={0.5} />
                </pattern>
                {showTicks && <>
                    {/* 100-ticks */}
                    <pattern id="grid-patt-b" width={100} height={100} patternUnits="userSpaceOnUse">
                        <path d="M0 0h100v100H0z" fill="url(#grid-patt-a)" />
                        <path d="M100 0H0v100" fill="none" stroke="#fff" strokeWidth={2} strokeOpacity={0.2} />
                    </pattern>
                    {/* 200-ticks */}
                    <pattern id="grid-patt-c" width={200} height={200} patternUnits="userSpaceOnUse">
                        <path d="M0 0h200v200H0z" fill="url(#grid-patt-b)" />
                        <path d="M200 0H0v200" fill="none" stroke="#fff" strokeWidth={2} strokeOpacity={0.2} />
                    </pattern>
                </>}
            </defs>
            <rect x={x} y={y} width="100%" height="100%" fill={`url(#grid-patt-${showTicks ? 'c' : 'a'})`} />
        </>)}
    </>);
}

export function BackgroundGrid({ x, y, onClick }: { x: number; y: number; onClick?: () => void; }) {
    return (
        <g className="grid" onClick={onClick}>
            <rect x={x} y={y} width="100%" height="100%" fill="#040d1c" /> {/* #002846 */}
            <GridPattern x={x} y={y} />
        </g >
    );
}

//TODO: show the axis center cross lines
//TODO: show numbers
