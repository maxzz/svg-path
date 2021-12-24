import { useAtom } from 'jotai';
import React, { SVGProps } from 'react';
import { useMeasure } from 'react-use';
import { svgAtom } from '../store/store';

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

function Canvas(props: SVGProps<SVGSVGElement>) {
    const [svg] = useAtom(svgAtom);
    const [ref, { width, height }] =  useMeasure<SVGSVGElement>();
    //console.log({ width, height });
    
    return (
        <svg ref={ref} {...props}>
            <GridPattern />
            <rect width="100%" height="100%" fill="#040d1c" /> {/* #002846 */}
            <rect width="100%" height="100%" fill="url(#c)" />
            <path d={svg.asString()} fill="white" stroke={"red"} strokeWidth={2} />
        </svg>
    );
}

export default Canvas;
