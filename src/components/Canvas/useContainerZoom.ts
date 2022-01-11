import { atom, useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import React from 'react';
import { useMeasure } from 'react-use';
import { canvasSizeAtom, unscaledPathBoundingBoxAtom, svgAtom, viewBoxAtom, canvasStrokeAtom, zoomAtom, containerRefAtom } from '../../store/store';
import { CanvasSize, getFitViewPort, ViewBox, ViewPoint } from '../../svg/svg-utils-viewport';
import throttle from '../../utils/throttle';

function formatViewBox(box: ViewBox) {
    return box.map(pt => pt.toFixed(0).padStart(4, ' ')).join(" ");
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

    return [x, y, w, h];
}

function eventClientXY(event: MouseEvent | TouchEvent, idx = 0) {
    const touch = event instanceof MouseEvent ? event : event.touches[idx];
    return {
        clientX: touch.clientX,
        clientY: touch.clientY,
    };
}
/*
function eventToClient(canvasSize: CanvasSize, canvasContainer: HTMLElement, event: MouseEvent | TouchEvent, idx = 0): { x: number, y: number; } {
    const rect = canvasContainer.getBoundingClientRect();
    const touch = event instanceof MouseEvent ? event : event.touches[idx];
    let [x, y] = canvasSize.port;
    x += (touch.clientX - rect.left) * canvasSize.stroke;
    y += (touch.clientY - rect.top) * canvasSize.stroke;
    return { x, y };
}
*/
/*
function mousewheel(canvasSize: CanvasSize, canvasContainer: HTMLElement, accDeltaY: number, event: WheelEvent): ViewBox {
    const scale = Math.pow(1.005, accDeltaY);
    const pt = eventToLocation(canvasSize, canvasContainer, event);
    console.log('scale', scale, 'pt', pt);

    return zoomViewPort(canvasSize.port, scale, pt);
}
*/

type ZoomEvent = {
    deltaY: number;
    pt?: ViewPoint;
};

const updateZoomAtom = atom(null, (get, set, { deltaY, pt }: ZoomEvent) => {

    let zoom = Math.min(1000, Math.max(-450, get(zoomAtom) + deltaY));
    set(zoomAtom, zoom);

    // let stroke = get(viewBoxStrokeAtom);
    // let [x, y] = get(viewBoxAtom);
    // x += pt.x;
    // y += pt.y;
    // console.log('update', { x, y });

    const unscaledPathBoundingBox = get(unscaledPathBoundingBoxAtom);

    const scale = Math.pow(1.005, zoom);
    const newPort = zoomViewPort(unscaledPathBoundingBox, scale);
    // const newPort = zoomViewPort(unscaledPathBoundingBox, scale, pt);
    // const newPort = zoomViewPort(unscaledPathBoundingBox, scale, { x, y });
    set(viewBoxAtom, newPort);
});

export function useContainerZoom() {
    const [svg] = useAtom(svgAtom);
    const [ref, { width, height }] = useMeasure<HTMLDivElement>();
    const parentRef = React.useRef<HTMLElement>();

    const setViewBox = useUpdateAtom(viewBoxAtom);
    const setCanvasStroke = useUpdateAtom(canvasStrokeAtom);
    const setUnscaledPathBoundingBox = useUpdateAtom(unscaledPathBoundingBoxAtom);
    const setCanvasSize = useUpdateAtom(canvasSizeAtom);
    const setContainerRef = useUpdateAtom(containerRefAtom);

    const updateZoom = useUpdateAtom(updateZoomAtom);

    React.useEffect(() => {
        setContainerRef(parentRef.current);
        if (!parentRef.current) { return; }

        const { width: w, height: h } = parentRef.current.getBoundingClientRect();
        const port = getFitViewPort(w, h, svg.targetLocations());

        setCanvasSize({ w, h });
        setCanvasStroke(port.stroke);
        setUnscaledPathBoundingBox(port.port);
        setViewBox(port.port);

        updateZoom({ deltaY: 0 });
    }, [parentRef, width, height, svg]);

    const setThrottledZoom = React.useCallback(throttle((zoomEvent: ZoomEvent) => {
        updateZoom(zoomEvent);
    }), []);

    const onWheel = React.useCallback((event: React.WheelEvent) => {
        if (!parentRef.current) { return; }
        const { left, top } = parentRef.current.getBoundingClientRect();

        const { clientX: x, clientY: y } = event;
        //console.log('whell', 'client', { left, top }, 'mouse', { x, y }, 'calc', { x: x - left, y: y - top });
        setThrottledZoom({
            deltaY: event.deltaY,
            pt: { x: x - left, y: y - top }
        });
    }, [parentRef]);

    return {
        ref,
        parentRef,
        onWheel,
    };
}
