import { useAtom } from 'jotai';
import React, { SVGProps } from 'react';
import { useMeasure } from 'react-use';
import { svgAtom } from '../store/store';
import { SvgPoint } from '../svg/svg';

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

function getPointsBoundingBox(targetPoints: SvgPoint[]): { xmin: number; ymin: number; xmax: number; ymax: number; } {
    let xmin = 0;
    let ymin = 0;
    let xmax = 10;
    let ymax = 10;
    if (targetPoints.length) {
        xmin = Math.min(...targetPoints.map(pt => pt.x));
        ymin = Math.min(...targetPoints.map(pt => pt.y));
        xmax = Math.max(...targetPoints.map(pt => pt.x));
        ymax = Math.max(...targetPoints.map(pt => pt.y));
    }
    return { xmin, ymin, xmax, ymax, };
}

function getViewPort(canvasWidth: number, canvasHeight: number, targetPoints: SvgPoint[]): { x: number; y: number; w: number; h: number; } {

    const box = getPointsBoundingBox(targetPoints);

    let w = box.xmax - box.xmin + 2;
    let h = box.ymax - box.ymin + 2;

    const ratio = canvasHeight / canvasWidth;
    if (ratio < h / w) {
        w = h / ratio;
    } else {
        h = ratio * w;
    }

    return { x: box.xmin - 1, y: box.ymin - 1, w, h, };
}

function Canvas() {
    const [svg] = useAtom(svgAtom);
    const [ref, { width, height }] = useMeasure<HTMLDivElement>();
    //console.log({ width, height });

    //const viewPort = 

    return (
        <div ref={ref} className="absolute w-full h-full -z-10">
            <svg viewBox="0 0 200 100">
                <GridPattern />
                <rect width="100%" height="100%" fill="#040d1c" /> {/* #002846 */}
                <rect width="100%" height="100%" fill="url(#c)" />
                <path d={svg.asString()} fill="white" stroke={"red"} strokeWidth={2} />
            </svg>
        </div>
    );
}

export default Canvas;
