import React from 'react';
import { useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { mergeRef } from '../../hooks/utils';
import { activePointAtom, canvasStrokeAtom, containerRefAtom, pathUnsafeAtom, precisionAtom, snapToGridAtom, svgAtom, viewBoxAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { Svg, SvgItem, SvgPoint } from '../../svg/svg';
import { CanvasControlsPanel } from './CanvasControlsPanel';
import { ViewBox } from '../../svg/svg-utils-viewport';
import { ControlPoint, StartDragEvent, TargetPoint } from './CanvasPoints';
import { CanvasTicks } from './CanvasTicks';
import { _fViewBox, _ViewBox, _ViewPoint } from '../../utils/debugging';

const cpToTargetIdx = (targetLocations: SvgPoint[], ref: SvgItem) => targetLocations.findIndex((pt) => pt.itemReference === ref);

function SvgCanvas() {

    const [viewBox, setViewBox] = useAtom(viewBoxAtom);
    const [canvasStroke] = useAtom(canvasStrokeAtom);

    const [svg, setSvg] = useAtom(svgAtom);
    const pathPoints = svg.targetLocations();
    const cpPoints = svg.controlLocations();

    const setActivePt = useUpdateAtom(activePointAtom);

    function onMouseDown(event: React.MouseEvent) {
        setActivePt(-1);
        startDragEventRef.current = { event, start: getEventPt(containerRef!, event.clientX, event.clientY) };
    }

    function onMouseUp() {
        startDragEventRef.current = null;
    }

    const [containerRef] = useAtom(containerRefAtom);
    function getEventPt(containerRef: HTMLElement, eventClientX: number, eventClientY: number) {
        const canvasRect = containerRef.getBoundingClientRect();
        let [viewBoxX, viewBoxY] = viewBox;
        const x = viewBoxX + (eventClientX - canvasRect.x) * canvasStroke;
        const y = viewBoxY + (eventClientY - canvasRect.y) * canvasStroke;
        return { x, y };
    }

    const startDragEventRef = React.useRef<StartDragEvent | null>(null);

    const [precision] = useAtom(precisionAtom);
    const [snapToGrid] = useAtom(snapToGridAtom);

    function onMouseMove(event: React.MouseEvent) {
        if (!containerRef || !startDragEventRef.current) { return; }

        event.stopPropagation();

        if (startDragEventRef.current.pt) {
            const pt = getEventPt(containerRef, event.clientX, event.clientY);

            const decimals = snapToGrid ? 0 : event.ctrlKey ? precision ? 0 : 3 : precision;
            pt.x = parseFloat(pt.x.toFixed(decimals));
            pt.y = parseFloat(pt.y.toFixed(decimals));
            //console.log('move', pt.x, pt.y);

            svg.setLocation(startDragEventRef.current.pt as SvgPoint, pt);
            const newSvg = new Svg();
            newSvg.path = svg.path;
            setSvg(newSvg);
        } else {
            // const startPt = getEventPt(containerRef, startDragEventRef.current.event.clientX, startDragEventRef.current.event.clientY);
            const startPt = startDragEventRef.current.start!;
            const pt = getEventPt(containerRef, event.clientX, event.clientY);

            console.log('move startPt', _ViewPoint(startPt).padEnd(20, ' '), 'pt', _ViewPoint(pt).padEnd(20, ' '), '--------------------------------', _fViewBox(viewBox));

            setViewBox((prev) => {
                const newViewBox: ViewBox = [
                    prev[0] + startPt.x - pt.x,
                    prev[1] + startPt.y - pt.y,
                    prev[2],
                    prev[3],
                ];
                //console.log('-------------set view box prev', _fViewBox(prev), '--------new', _fViewBox(newViewBox));
                return newViewBox;
            });
        }
    }

    //console.log('viewBox', _ViewBox(viewBox));

    function onPointClick(ev: StartDragEvent) {
        if (ev.event.button === 0) {
            startDragEventRef.current = ev;
        }
    }

    return (
        <svg viewBox={viewBox.join(" ")} className="bg-[#040d1c] select-none"
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
        // onClick={() => setActivePt(-1)}
        >
            <CanvasTicks />

            <path d={svg.asString()} fill="#94a3b830" stroke="white" strokeWidth={canvasStroke} />

            <g className="cpPts">
                {cpPoints.map((pt, idx) => (
                    <ControlPoint key={idx} pt={pt} stroke={canvasStroke} pathPtIdx={cpToTargetIdx(pathPoints, pt.itemReference)} clk={onPointClick} />
                ))}
            </g>

            <g className="pathPts">
                {pathPoints.map((pt, idx) => (
                    <TargetPoint key={idx} pt={pt} stroke={canvasStroke} pathPtIdx={idx} clk={onPointClick} svgItem={svg.path[idx]} />
                ))}
            </g>
        </svg>
    );
}

const CanvasControlsPanelMemo = React.memo(CanvasControlsPanel);

export function PathCanvas() {
    const { ref, parentRef, onWheel, } = useContainerZoom();
    return (
        <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full overflow-hidden" onWheel={onWheel}>
            <SvgCanvas />
            <CanvasControlsPanelMemo />
        </div>
    );
}
