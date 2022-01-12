import React from 'react';
import { atom, useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { mergeRef } from '../../hooks/utils';
import { activePointAtom, canvasStrokeAtom, containerRefAtom, pathUnsafeAtom, precisionAtom, snapToGridAtom, svgAtom, viewBoxAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { Svg, SvgControlPoint, SvgItem, SvgPoint } from '../../svg/svg';
import { CanvasControlsPanel } from './CanvasControlsPanel';
import { ViewBox } from '../../svg/svg-utils-viewport';
import { ControlPoint, StartDragEvent, TargetPoint } from './CanvasPoints';
import { CanvasTicks } from './CanvasTicks';

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
        startDragEventRef.current = { event };
    }

    function onMouseUp(event: React.MouseEvent) {
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
            const startPt = getEventPt(containerRef, startDragEventRef.current.event.clientX, startDragEventRef.current.event.clientY);
            const pt = getEventPt(containerRef, event.clientX, event.clientY);

            const newViewBox: ViewBox = [
                viewBox[0] + startPt.x - pt.x,
                viewBox[1] + startPt.y - pt.y,
                viewBox[2],
                viewBox[3],
            ];
            setViewBox(newViewBox);
        }
    }

    function onPointClick(ev: StartDragEvent) {
        startDragEventRef.current = ev;
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
                    <ControlPoint pt={pt} stroke={canvasStroke} idx={cpToTargetIdx(pathPoints, pt.itemReference)} clk={onPointClick} key={idx} />
                ))}
            </g>

            <g className="pathPts">
                {pathPoints.map((pt, idx) => (
                    <TargetPoint svgItem={svg.path[idx]} pt={pt} stroke={canvasStroke} idx={idx} clk={onPointClick} key={idx} />
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
