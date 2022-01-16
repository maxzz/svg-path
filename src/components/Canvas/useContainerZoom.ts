import React from 'react';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useMeasure } from 'react-use';
import { canvasSizeAtom, svgAtom, canvasStrokeAtom, containerRefAtom, updateZoomAtom, UpdateZoomEvent, updateViewBoxAtom, autoZoomAtom } from '../../store/store';
import { getFitViewPort, ViewPoint } from '../../svg/svg-utils-viewport';
import throttle from '../../utils/throttle';
import { _fViewBox } from '../../utils/debugging';

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

    //console.log('%c------->>>>------useContainerZoom hook', 'color: mediumpurple', width, height);

    const setCanvasStroke = useUpdateAtom(canvasStrokeAtom);
    const setCanvasSize = useUpdateAtom(canvasSizeAtom);
    const setContainerRef = useUpdateAtom(containerRefAtom);

    const updateViewBox = useUpdateAtom(updateViewBoxAtom);
    const updateZoom = useUpdateAtom(updateZoomAtom);
    const autoZoom = useUpdateAtom(autoZoomAtom);

    React.useEffect(() => {
        setContainerRef(parentRef.current);
        setCanvasSize({ w: width, h: height });
        updateViewBox();
    }, [parentRef, width, height]);

    /*
    React.useEffect(() => {
        console.log('update SVG', width, height);

        if (width && height) {
            const port = getFitViewPort({ w: width, h: height }, svg.targetLocations());
            port && setCanvasStroke(port.stroke);
        }
    }, [width, height, svg]);
    */

    React.useEffect(() => {
        console.log('update SVG', width, height);
        //autoZoom();
        updateViewBox();
    }, [svg]);

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

    //console.log('%c-------<<<<------useContainerZoom hook', 'color: mediumpurple', width, height);

    return {
        ref,
        parentRef,
        onWheel,
    };
}
