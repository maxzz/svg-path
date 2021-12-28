import React from 'react';
import { mergeRef } from '../hooks/utils';
import { atom, SetStateAction, useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
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

/*
function mousewheel(canvasSize: CanvasSize, canvasContainer: HTMLElement, accDeltaY: number, event: WheelEvent): ViewBox {
    const scale = Math.pow(1.005, accDeltaY);
    const pt = eventToLocation(canvasSize, canvasContainer, event);
    console.log('scale', scale, 'pt', pt);

    return zoomViewPort(canvasSize.port, scale, pt);
}
*/

const zoomAtom = atom(0);
const viewBoxAtom = atom<[number, number, number, number,]>([0, 0, 0, 0]);
const viewBoxStrokeAtom = atom(0);

const setZoomAtom = atom(null, (get, set, { newZoom, unscaledViewBox }: { newZoom: number, unscaledViewBox: ViewBox; }) => {

    const scale = Math.pow(1.005, newZoom);
    const newPort = zoomViewPort(unscaledViewBox, scale);
    // const newPort = zoomViewPort(pointsViewBoxRef.current, scale);
    set(viewBoxAtom, newPort);
});

function Canvas() {
    const [svg] = useAtom(svgAtom);
    const [ref, { width, height }] = useMeasure<HTMLDivElement>();
    const parentRef = React.useRef<HTMLDivElement>();

    const [zoom, setZoom] = useAtom(zoomAtom);

    const [canvasSize, setCanvasSize] = React.useState(nullCanvesSize);
    const pointsViewBoxRef = React.useRef<[number, number, number, number,]>([0, 0, 0, 0]);

    const [viewBox, setViewBox] = useAtom(viewBoxAtom);
    const [viewBoxStroke, setViewBoxStroke] = useAtom(viewBoxStrokeAtom);
    const setZoom2 = useUpdateAtom(setZoomAtom);

    React.useEffect(() => {
        if (!parentRef.current) { return; }
        const { width, height } = parentRef.current.getBoundingClientRect();

        const newCanvasSize = getFitViewPort(width, height, svg.targetLocations());
        pointsViewBoxRef.current = newCanvasSize.port;

        setViewBoxStroke(newCanvasSize.stroke);
        setViewBox(newCanvasSize.port);

        //setCanvasSize(newCanvasSize);
    }, [parentRef, svg]);

    const cbSetCanvasSize = React.useCallback(throttle((newZoom: number) => {
        /*
        setCanvasSize((prev) => {
            const scale = Math.pow(1.005, newZoom);
            const newPort = zoomViewPort(pointsViewBoxRef.current, scale);

            console.log(`setCanvasSize wheel=${('' + newZoom).padEnd(4, ' ')}`, `scale=${scale.toFixed(2)}`,
                '     ----in----', formatViewBox(prev.port), '----out----', formatViewBox(newPort));

            return { ...prev, port: newPort, };
        });
        */
        setZoom2({ newZoom: newZoom, unscaledViewBox: pointsViewBoxRef.current });
    }), []);

    React.useEffect(() => {
        cbSetCanvasSize(zoom);
    }, [zoom]);

    const onWheel = React.useCallback((event: React.WheelEvent) => setZoom((prev) => Math.min(1000, Math.max(-450, prev + event.deltaY))), []);

    return (
        <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full overflow-hidden" onWheel={onWheel}>
            <svg viewBox={viewBox.join(" ")}>
                <GridPattern />
                <rect x={viewBox[0]} y={viewBox[1]} width="100%" height="100%" fill="#040d1c" /> #002846
                <rect x={viewBox[0]} y={viewBox[1]} width="100%" height="100%" fill="url(#grid-patt-c)" />
                <path d={svg.asString()} fill="white" stroke={"red"} strokeWidth={viewBoxStroke} />
            </svg>
        </div>
    );
}

export default Canvas;
