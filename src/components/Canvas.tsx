import React from 'react';
import { mergeRef } from '../hooks/utils';
import { atom, SetStateAction, useAtom } from 'jotai';
import { svgAtom } from '../store/store';
import { useMeasure } from 'react-use';
import { CanvasSize, eventToLocation, getFitViewPort, nullCanvesSize, ViewBox, ViewPoint } from '../svg/svg-utils';
import throttle from '../utils/throttle';

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

function formatviewBox(box: ViewBox) {
    return box.map(pt => +pt.toFixed(0).padStart(3, ' ')).join(" ");
}

function zoomViewPort(viewBox: ViewBox, scale: number, pt?: ViewPoint): ViewBox {
    const [viewPortX, viewPortY, viewPortWidth, viewPortHeight] = viewBox;

    pt = pt || {
        x: viewPortX + 0.5 * viewPortWidth,
        y: viewPortY + 0.5 * viewPortHeight
    };

    const x = viewPortX + ((pt.x - viewPortX) - scale * (pt.x - viewPortX));
    const y = viewPortY + ((pt.y - viewPortY) - scale * (pt.y - viewPortY));
    const w = scale * viewPortWidth;
    const h = scale * viewPortHeight;

    console.log('-------- zoomViewPort: scale', scale.toFixed(2), '----in----', viewBox.map(pt => pt.toFixed(0)).join(" "), '----out----', [x, y, w, h].map(pt => pt.toFixed(0)).join(" "));

    return [x, y, w, h];
}

function mousewheel(canvasSize: CanvasSize, canvasContainer: HTMLElement, accDeltaY: number, event: WheelEvent): ViewBox {
    const scale = Math.pow(1.005, accDeltaY);
    const pt = eventToLocation(canvasSize, canvasContainer, event);
    console.log('scale', scale, 'pt', pt);

    return zoomViewPort(canvasSize.port, scale, pt);
}

const zoomAtom = atom(0);

function Canvas() {
    const [svg] = useAtom(svgAtom);
    const [ref, { width, height }] = useMeasure<HTMLDivElement>();

    const [canvasSize, setCanvasSize] = React.useState(nullCanvesSize);

    React.useEffect(() => {
        const newCanvasSize = getFitViewPort(width, height, svg.targetLocations());
        newCanvasSize.port = zoomViewPort(newCanvasSize.port, 2);
        setCanvasSize(newCanvasSize);
    }, [width, height, svg]);

    const parentRef = React.useRef<HTMLDivElement>();
    const [zoom, setZoom] = useAtom(zoomAtom);

    // const cbSetCanvasSize = React.useCallback(throttle((newPort: ViewBox) => {
    //     console.log('throttle', zoom);
    //     setCanvasSize((prev) => ({ ...prev, port: newPort, }));
    // }), []);
    //
    // React.useEffect(() => {
    //     setCanvasSize((prev) => {
    //         const newZoom = Math.pow(1.005, zoom);
    //         const newPort = zoomViewPort(prev.port, newZoom);
    //         console.log('setCanvasSize zoom', zoom, 'newZoom', newZoom.toFixed(2), '----newPort----', newPort.map(pt => pt.toFixed(0)).join(" "));
    //         return { ...prev, port: newPort, }
    //     });
    // }, [zoom]);

    const cbSetCanvasSize = React.useCallback(throttle((zoom: number) => {
        setCanvasSize((prev) => {
            const scale = Math.pow(1.005, zoom);
            const newPort = zoomViewPort(prev.port, scale);

            console.log('setCanvasSize zoom', zoom, 'scale', scale.toFixed(2), '----newPort----', newPort.map(pt => pt.toFixed(0)).join(" "));
    
            return { ...prev, port: newPort, }
        });
    }), []);

    React.useEffect(() => {
        cbSetCanvasSize(zoom);
    }, [zoom]);

    // React.useEffect(() => {
    //     const newZoom = Math.pow(1.005, zoom);
    //     const newPort = zoomViewPort(canvasSize.port, newZoom);

    //     console.log('zoom change', zoom, 'newZoom', newZoom.toFixed(2));

    //     setCanvasSize((prev) => ({ ...prev, port: newPort, }));

    //     // const newZoom = Math.pow(1.005, zoom);
    //     // const newPort = zoomViewPort(canvasSize.port, newZoom);

    //     // console.log('zoom', zoom);
    //     // cbSetCanvasSize(newPort)
    // }, [zoom]);

    //console.log('ini', zoom, canvasSize.port);

    /** /
    const cbSetZoomDelta = React.useCallback(throttle((delta: number) => {
        //console.log('throttle delta', delta);
        setZoom((prev) => {
            //console.log('new delta', delta);
            return delta;
            // return prev + delta;
        });
    }), []);

    const cb = React.useCallback((event: React.WheelEvent) => {
        if (parentRef.current) {
            console.log('event delta', event.deltaY);
            cbSetZoomDelta(event.deltaY);
        }
    }, [canvasSize, ref]);
    /**/

    const onWheel = React.useCallback((event: React.WheelEvent) => {
        setZoom((prev) => {
            //const newPort = mousewheel(canvasSize, parentRef.current!, prev + event.deltaY, event.nativeEvent);
            //console.log('cb', prev + event.deltaY, canvasSize.port, newPort);

            //console.log('event delta', prev + event.deltaY);
            return prev + event.deltaY;
        });
    }, []);

    // const onWheel = React.useCallback((event: React.WheelEvent) => {
    //     if (parentRef.current) {
    //         setZoom((prev) => {
    //             //const newPort = mousewheel(canvasSize, parentRef.current!, prev + event.deltaY, event.nativeEvent);
    //             //console.log('cb', prev + event.deltaY, canvasSize.port, newPort);

    //             //console.log('event delta', prev + event.deltaY);
    //             return prev + event.deltaY;
    //         });
    //     }
    // }, [canvasSize, ref]);

    //console.log('SVG viewBox', canvasSize.port.map(pt => pt.toFixed(2)).join(" "), '          raw', canvasSize.port.join(" "));

    return (
        // <div ref={parentRef} className="absolute w-full h-full -z-10">
        <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full" onWheel={onWheel}>
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

//TODO: throttle
//zoom, move
