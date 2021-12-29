import React from 'react';
import { mergeRef } from '../../hooks/utils';
import { useAtom } from 'jotai';
import { svgAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';

function GridPattern() {
    return (
        <defs>
            <pattern id="grid-patt-a" width={10} height={10} patternUnits="userSpaceOnUse">
                <path
                    d="M10 0H0v10"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={0.3}
                    strokeOpacity={0.5}
                />
            </pattern>
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
    );
}

function Canvas() {
    const [svg] = useAtom(svgAtom);
    const {
        viewBox,
        viewBoxStroke,
        ref,
        parentRef,
        onWheel,
    } = useContainerZoom();

    const pathPoints = svg.targetLocations();

    return (
        <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full overflow-hidden" onWheel={onWheel}>
            <svg viewBox={viewBox.join(" ")}>
                <GridPattern />
                <rect x={viewBox[0]} y={viewBox[1]} width="100%" height="100%" fill="#040d1c" /> #002846
                <rect x={viewBox[0]} y={viewBox[1]} width="100%" height="100%" fill="url(#grid-patt-c)" />
                <path d={svg.asString()} fill="none" stroke="white" strokeWidth={viewBoxStroke} />
                {pathPoints.map((pt, idx) => (
                    <circle className="fill-[white]" cx={pt.x} cy={pt.y} r={viewBoxStroke * 3} strokeWidth={viewBoxStroke * 12} key={idx} />
                ))}
            </svg>
        </div>
    );
}

export default Canvas;
