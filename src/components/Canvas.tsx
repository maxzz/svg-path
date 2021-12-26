import React from 'react';
import { atom, SetStateAction, useAtom } from 'jotai';
import { svgAtom } from '../store/store';
import { useMeasure, useMouseWheel } from 'react-use';
import { CanvasSize, eventToLocation, getViewPort } from '../svg/svg-utils';
import { useCommittedRef, useEventListener } from '../hooks/useEventListener';
import { mergeRef } from '../hooks/utils';

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

function mousewheel(canvasSize: CanvasSize, canvasContainer: HTMLElement, accDeltaY: number, event: WheelEvent) {
    const scale = Math.pow(1.005, accDeltaY);
    const pt = eventToLocation(canvasSize, canvasContainer, event);
    console.log('scale', scale, 'pt', pt);

    return zoomViewPort(canvasSize, scale, pt);
}

function zoomViewPort(canvasSize: CanvasSize, scale: number, pt?: { x: number, y: number; }) {
    const [viewPortX, viewPortY, viewPortWidth, viewPortHeight] = canvasSize.port;
    pt = pt || {
        x: viewPortX + 0.5 * viewPortWidth,
        y: viewPortY + 0.5 * viewPortHeight
    };

    const w = scale * viewPortWidth;
    const h = scale * viewPortHeight;
    const x = viewPortX + ((pt.x - viewPortX) - scale * (pt.x - viewPortX));
    const y = viewPortY + ((pt.y - viewPortY) - scale * (pt.y - viewPortY));

    return [x, y, w, h];
}

const zoomAtom = atom(0);

function Canvas() {
    const [svg] = useAtom(svgAtom);
    const [ref, { width, height }] = useMeasure<HTMLDivElement>();

    const canvasSize = React.useMemo(() => getViewPort(width, height, svg.targetLocations()), [width, height, svg]);

    const parentRef = React.useRef<HTMLDivElement>();
    const [zoom, setZoom] = useAtom(zoomAtom);

    //console.log('ini', zoom, canvasSize.port);

    /* OK * /
    const cb = React.useCallback((event: WheelEvent) => {
        setZoom((prev) => {
            //mousewheel(canvasSize, )
            console.log(canvasSize.port);

            return prev + event.deltaY;
        });
    }, []);

    useEventListener('wheel', cb, parentRef);
    /**/

    /* OK */
    const cb = React.useCallback((event: React.WheelEvent) => {
        if (parentRef.current) {
            setZoom((prev) => {
                const newPort = mousewheel(canvasSize, parentRef.current!, prev + event.deltaY, event.nativeEvent);
                console.log('cb', prev + event.deltaY, canvasSize.port, newPort);

                return prev + event.deltaY;
            });
        }
    }, [canvasSize, ref]);
    /**/

    /* OK * /
    const cb = (event: React.WheelEvent) => {
        setZoom((prev) => {
            //mousewheel(canvasSize, )
            console.log(canvasSize.port);

            return prev + event.deltaY;
        });
    };
    /**/

    return (
        // <div ref={parentRef} className="absolute w-full h-full -z-10">
        // <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full">
        // <div ref={ref} className="absolute w-full h-full" onWheel={cb}>
        <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full" onWheel={cb}>
            <svg viewBox={canvasSize.port.join(" ")}>
                <GridPattern />
                <rect x={canvasSize.port[0]} y={canvasSize.port[1]} width="100%" height="100%" fill="#040d1c" /> #002846
                <rect x={canvasSize.port[0]} y={canvasSize.port[1]} width="100%" height="100%" fill="url(#grid-patt-c)" />
                <path d={svg.asString()} fill="white" stroke={"red"} strokeWidth={canvasSize.stroke} />
            </svg>
        </div>
    );
}

export default Canvas;
