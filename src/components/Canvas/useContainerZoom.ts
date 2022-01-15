import React from 'react';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useMeasure } from 'react-use';
import { canvasSizeAtom, svgAtom, viewBoxAtom, canvasStrokeAtom, containerRefAtom, updateZoomAtom, UpdateZoomEvent, needInitialZoomAtom, autoZoomAtom } from '../../store/store';
import { getFitViewPort, updateViewPort, ViewPoint, zoomAuto } from '../../svg/svg-utils-viewport';
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

    const [viewBox, setViewBox] = useAtom(viewBoxAtom);
    const setCanvasStroke = useUpdateAtom(canvasStrokeAtom);
    //const setUnscaledPathBoundingBox = useUpdateAtom(unscaledPathBoundingBoxAtom);
    const setCanvasSize = useUpdateAtom(canvasSizeAtom);
    const [containerRef, setContainerRef] = useAtom(containerRefAtom);

    const updateZoom = useUpdateAtom(updateZoomAtom);
    const autoZoom = useUpdateAtom(autoZoomAtom);


    const [needInitialZoom, setNeedInitialZoom] = useAtom(needInitialZoomAtom);

    React.useEffect(() => {
        if (containerRef) {
            const { width, height } = containerRef.getBoundingClientRect();
            const box = width && height && zoomAuto({ w: width, h: height }, []);
            if (box) {
                console.log('update on container change', width, height);

                setViewBox(box.viewBox);
                setCanvasStroke(box.stroke);
            }
        }
    }, [containerRef]);

    React.useEffect(() => {
        console.log('update ini', width, height, _fViewBox(viewBox), parentRef.current);

        setContainerRef(parentRef.current);
        setCanvasSize({ w: width, h: height });

        if (parentRef.current && width && height) {
            console.log('update dim', width, height, _fViewBox(viewBox));

            const newBox = updateViewPort({ w: width, h: height }, ...viewBox);
            if (newBox) {
                setViewBox(newBox.viewBox);
                setCanvasStroke(newBox.stroke);
            }
        }
    }, [parentRef, width, height]);

    React.useEffect(() => {
        if (needInitialZoom && width && height) {
            console.log('zzzzzzzz--------zzzzz');
            //debugger
            autoZoom();
            setNeedInitialZoom(false);
        }
    }, [width, height, needInitialZoom]);

    React.useEffect(() => {
        console.log('update SVG', width, height);

        if (width && height) {
            const port = getFitViewPort({ w: width, h: height }, svg.targetLocations());
            port && setCanvasStroke(port.stroke);
            //setUnscaledPathBoundingBox(port.port);
        }
    }, [width, height, svg]);

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

    console.log('%c-------------useContainerZoom hook', 'color: mediumpurple', width, height);

    return {
        ref,
        parentRef,
        onWheel,
    };
}
