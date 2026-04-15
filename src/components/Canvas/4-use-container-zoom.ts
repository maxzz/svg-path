import { useCallback, useEffect, useRef, type WheelEvent as ReactWheelEvent } from 'react';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useMeasure } from 'react-use';
import { throttle } from '../../utils/throttle';
import { canvasSizeAtom, containerElmAtom, doUpdateZoomAtom, UpdateZoomEvent, doUpdateViewBoxAtom, svgEditRootAtom } from '../../store/store';

export function useContainerZoom() {
    const [svgEditRoot] = useAtom(svgEditRootAtom);
    const [ref, { width, height }] = useMeasure<HTMLDivElement>();
    const parentRef = useRef<HTMLElement>();

    const setCanvasSize = useUpdateAtom(canvasSizeAtom);
    const setContainerElm = useUpdateAtom(containerElmAtom);
    const doUpdateViewBox = useUpdateAtom(doUpdateViewBoxAtom);
    const doUpdateZoom = useUpdateAtom(doUpdateZoomAtom);

    const setThrottledZoom = useCallback(
        throttle((zoomEvent: UpdateZoomEvent) => {
            doUpdateZoom(zoomEvent);
        }),
        []);

    const onWheel = useCallback(
        (event: ReactWheelEvent) => {
            if (!parentRef.current) { return; }

            const { left, top } = parentRef.current.getBoundingClientRect();
            const { clientX: x, clientY: y } = event; //console.log('whell', 'client', { left, top }, 'mouse', { x, y }, 'calc', { x: x - left, y: y - top });

            setThrottledZoom({ deltaY: event.deltaY, pt: { x: x - left, y: y - top } });
        },
        [parentRef]);

    useEffect(
        () => { //console.log('--------------- useContainerZoom.useEffect[parentRef]', parentRef, width, height);
            setContainerElm(parentRef.current);
        },
        [parentRef]);

    useEffect(
        () => { //console.log('--------------- useContainerZoom.useEffect[width, height]', parentRef, width, height);
            setCanvasSize({ w: width, h: height });
            doUpdateViewBox();
        },
        [width, height]);

    useEffect(
        () => { //console.log('--------------- useContainerZoom.useEffect[svgEditRoot]', parentRef, width, height);
            doUpdateViewBox();
        },
        [svgEditRoot]);

    return {
        ref,
        parentRef,
        onWheel,
    };
}
