import React from 'react';
import { atom, SetStateAction, useAtom } from 'jotai';
import { svgAtom } from '../store/store';
import { useMeasure, useMouseWheel } from 'react-use';
import { eventToLocation, getViewPort } from '../svg/svg-utils';
import { useEventListener } from '../hooks/useEventListener';

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

// function mousewheel(event: { deltaY: number; event: WheelEvent, }) {
//     const scale = Math.pow(1.005, event.deltaY);
//     const pt = eventToLocation(event.event);

//     this.zoomViewPort(scale, pt);
// }

// function zoomViewPort(scale: number, pt?: { x: number, y: number; }) {
//     if (!pt) {
//         pt = { x: this.viewPortX + 0.5 * this.viewPortWidth, y: this.viewPortY + 0.5 * this.viewPortHeight };
//     }
//     const w = scale * this.viewPortWidth;
//     const h = scale * this.viewPortHeight;
//     const x = this.viewPortX + ((pt.x - this.viewPortX) - scale * (pt.x - this.viewPortX));
//     const y = this.viewPortY + ((pt.y - this.viewPortY) - scale * (pt.y - this.viewPortY));

//     this.viewPort.emit({ x, y, w, h });
// }

const zoomAtom = atom(0);

function Canvas() {
    const [svg] = useAtom(svgAtom);
    const [ref, { width, height }] = useMeasure<HTMLDivElement>();
    console.log({ width, height });
    

    const viewPort = getViewPort(width, height, svg.targetLocations());

    const parentRef = React.useRef<HTMLDivElement>();

    const [zoom, setZoom] = useAtom(zoomAtom);

    const cb = React.useCallback((event: WheelEvent) => {
        setZoom((prev) => {
            return prev + event.deltaY;
        });
    }, []);

    useEventListener('wheel', cb, parentRef);

    return (
        // <div ref={parentRef} className="absolute w-full h-full -z-10">
        // <div ref={parentRef} className="absolute w-full h-full" onWheel={onMouseWheel}>
        <div ref={(el) => el && (ref(el), parentRef.current = el)} className="absolute w-full h-full">
            {/* <div ref={ref} className="absolute w-full h-full -z-10"> */}
            {/* <svg ref={parentRef} viewBox={viewPort.port.join(" ")}> */}
            <svg viewBox={viewPort.port.join(" ")}>
                <GridPattern />
                <rect x={viewPort.port[0]} y={viewPort.port[1]} width="100%" height="100%" fill="#040d1c" /> #002846
                <rect x={viewPort.port[0]} y={viewPort.port[1]} width="100%" height="100%" fill="url(#grid-patt-c)" />
                <path d={svg.asString()} fill="white" stroke={"red"} strokeWidth={viewPort.stroke} />
            </svg>
        </div>
    );
}

export default Canvas;
