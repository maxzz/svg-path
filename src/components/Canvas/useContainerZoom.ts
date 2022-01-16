import React from 'react';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useMeasure } from 'react-use';
import { canvasSizeAtom, svgAtom, containerRefAtom, doUpdateZoomAtom, UpdateZoomEvent, doUpdateViewBoxAtom } from '../../store/store';
import throttle from '../../utils/throttle';

export function useContainerZoom() {
    const [svg] = useAtom(svgAtom);
    const [ref, { width, height }] = useMeasure<HTMLDivElement>();
    const parentRef = React.useRef<HTMLElement>();

    const setCanvasSize = useUpdateAtom(canvasSizeAtom);
    const setContainerRef = useUpdateAtom(containerRefAtom);
    const doUpdateViewBox = useUpdateAtom(doUpdateViewBoxAtom);
    const doUpdateZoom = useUpdateAtom(doUpdateZoomAtom);

    const setThrottledZoom = React.useCallback(throttle((zoomEvent: UpdateZoomEvent) => {
        doUpdateZoom(zoomEvent);
    }), []);

    const onWheel = React.useCallback((event: React.WheelEvent) => {
        if (!parentRef.current) { return; }

        const { left, top } = parentRef.current.getBoundingClientRect();
        const { clientX: x, clientY: y } = event;
        //console.log('whell', 'client', { left, top }, 'mouse', { x, y }, 'calc', { x: x - left, y: y - top });

        setThrottledZoom({ deltaY: event.deltaY, pt: { x: x - left, y: y - top } });
    }, [parentRef]);

    React.useEffect(() => {
        setContainerRef(parentRef.current);
        setCanvasSize({ w: width, h: height });
        doUpdateViewBox();
    }, [parentRef, width, height]);

    React.useEffect(() => {
        doUpdateViewBox();
    }, [svg]);

    return {
        ref,
        parentRef,
        onWheel,
    };
}
