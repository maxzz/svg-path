import React from 'react';
import { useAtom } from 'jotai';
import { svgAtom } from '../store/store';
import { useMeasure } from 'react-use';
import { getViewPort } from '../svg/svg-utils';

function GridPattern() {
    return (
        <defs>
            <pattern id="a" width={10} height={10} patternUnits="userSpaceOnUse">
                <path
                    d="M10 0H0v10"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={0.3}
                    strokeOpacity={0.5}
                />
            </pattern>
            <pattern id="b" width={100} height={100} patternUnits="userSpaceOnUse">
                <path fill="url(#a)" d="M0 0h100v100H0z" />
                <path
                    d="M100 0H0v100"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeOpacity={0.2}
                />
            </pattern>
            <pattern id="c" width={200} height={200} patternUnits="userSpaceOnUse">
                <path fill="url(#b)" d="M0 0h200v200H0z" />
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
    const [ref, { width, height }] = useMeasure<HTMLDivElement>();
    console.log({ width, height });

    const viewPort = getViewPort(width, height, svg.targetLocations());
    console.log(viewPort.box);
    

    return (
        <div ref={ref} className="absolute w-full h-full -z-10">
            <svg viewBox={viewPort.box.join(" ")}>
                <GridPattern />
                <rect width="100%" height="100%" fill="#040d1c" /> {/* #002846 */}
                <rect width="100%" height="100%" fill="url(#c)" />
                <path d={svg.asString()} fill="white" stroke={"red"} strokeWidth={viewPort.strokeWidth} />
            </svg>
        </div>
    );
}

export default Canvas;
