import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import React from 'react';
import { useMeasure } from 'react-use';
import { canvasSizeAtom, svgAtom, viewBoxAtom, canvasStrokeAtom, containerRefAtom, updateZoomAtom, UpdateZoomEvent } from '../../store/store';
import { getFitViewPort, ViewPoint } from '../../svg/svg-utils-viewport';
import throttle from '../../utils/throttle';

function eventClientPoint(event: MouseEvent | TouchEvent, idx = 0): ViewPoint {
    const touch = event instanceof MouseEvent ? event : event.touches[idx];
    return {
        x: touch.clientX,
        y: touch.clientY,
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

function mousewheel(canvasSize: CanvasSize, canvasContainer: HTMLElement, accDeltaY: number, event: WheelEvent): ViewBox {
    const scale = Math.pow(1.005, accDeltaY);
    const pt = eventToLocation(canvasSize, canvasContainer, event);
    console.log('scale', scale, 'pt', pt);

    return zoomViewPort(canvasSize.port, scale, pt);
}
*/

export function useContainerZoom() {
    const [svg] = useAtom(svgAtom);
    const [ref, { width, height }] = useMeasure<HTMLDivElement>();
    const parentRef = React.useRef<HTMLElement>();

    const setViewBox = useUpdateAtom(viewBoxAtom);
    const setCanvasStroke = useUpdateAtom(canvasStrokeAtom);
    //const setUnscaledPathBoundingBox = useUpdateAtom(unscaledPathBoundingBoxAtom);
    const setCanvasSize = useUpdateAtom(canvasSizeAtom);
    const setContainerRef = useUpdateAtom(containerRefAtom);

    const updateZoom = useUpdateAtom(updateZoomAtom);

    React.useEffect(() => {
        setContainerRef(parentRef.current);
        if (!parentRef.current) { return; }

        const { width: w, height: h } = parentRef.current.getBoundingClientRect();
        const port = getFitViewPort(w, h, svg.targetLocations());

        //console.log('update', width, w, height, h);

        setCanvasSize({ w, h });
        setCanvasStroke(port.stroke);
        //setUnscaledPathBoundingBox(port.port);
        setViewBox(port.port);

        updateZoom({ deltaY: 0 });
    }, [parentRef, width, height, svg]);

    const setThrottledZoom = React.useCallback(throttle((zoomEvent: UpdateZoomEvent) => {
        updateZoom(zoomEvent);
    }), []);

    const onWheel = React.useCallback((event: React.WheelEvent) => {
        if (!parentRef.current) { return; }

        const { left, top } = parentRef.current.getBoundingClientRect();
        const { clientX: x, clientY: y } = event;
        //console.log('whell', 'client', { left, top }, 'mouse', { x, y }, 'calc', { x: x - left, y: y - top });

        setThrottledZoom({ deltaY: event.deltaY, pt: { x: x - left, y: y - top } });
    }, [parentRef]);

    return {
        ref,
        parentRef,
        onWheel,
    };
}
