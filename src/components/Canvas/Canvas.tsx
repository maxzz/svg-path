import React from 'react';
import { useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { mergeRef } from '../../hooks/utils';
import { activePointAtom, canvasStrokeAtom, containerRefAtom, pathUnsafeAtom, precisionAtom, snapToGridAtom, svgAtom, svgEditRootAtom, viewBoxAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { Svg, SvgControlPoint, SvgItem, SvgPoint } from '../../svg/svg';
//import { CanvasControlsPanel } from '../Panels/PanelCanvasControls';
import { ViewBox, zoomAuto } from '../../svg/svg-utils-viewport';
import { ControlPoint, StartDragEvent, TargetPoint } from './CanvasPoints';
import { CanvasTicks } from './CanvasTicks';
import { _fViewBox, _ViewBox, _ViewPoint } from '../../utils/debugging';
import { useThrottle } from 'react-use';

const cpToTargetIdx = (targetLocations: SvgPoint[], ref: SvgItem) => targetLocations.findIndex((pt) => pt.itemReference === ref);

function initPtIdx(pathPoints: SvgPoint[], cpPoints: SvgControlPoint[], ev: StartDragEvent) {
    ev.ptIdx = (ev.isCp ? cpPoints : pathPoints).findIndex(pt => pt === ev.pt);
}

function restorePtByIdx(pathPoints: SvgPoint[], cpPoints: SvgControlPoint[], ev: StartDragEvent) {
    ev.pt = (ev.isCp ? cpPoints : pathPoints)[ev.ptIdx!];
}

function SvgCanvas() {
    const [containerRef] = useAtom(containerRefAtom);
    const [viewBox, setViewBox] = useAtom(viewBoxAtom);
    const [canvasStroke, setCanvasStroke] = useAtom(canvasStrokeAtom);

    const [svgEditRoot] = useAtom(svgEditRootAtom);
    const [points] = useAtom(svgEditRoot.pointsAtom);

    const pathPoints = points.targets;
    const cpPoints = points.controls;
    // const pathPoints = svgEditRoot.svg.targetLocations();
    // const cpPoints = svgEditRoot.svg.controlLocations();

    const setActivePt = useUpdateAtom(activePointAtom);

    function onMouseDown(event: React.MouseEvent) {
        setActivePt(-1);
        startDragEventRef.current = { event, startXY: getEventPt(containerRef!, event.clientX, event.clientY) };
    }

    function onMouseUp() {
        startDragEventRef.current = null;
    }

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

    /**/
    function onMouseMove(event: React.MouseEvent) {
        if (!containerRef || !startDragEventRef.current) { return; }

        event.stopPropagation();

        if (startDragEventRef.current.pt) {
            
            const nowXY = getEventPt(containerRef, event.clientX, event.clientY);

            const decimals = snapToGrid ? 0 : event.ctrlKey ? precision ? 0 : 3 : precision;
            nowXY.x = parseFloat(nowXY.x.toFixed(decimals));
            nowXY.y = parseFloat(nowXY.y.toFixed(decimals));
            console.log('move', nowXY.x, nowXY.y);

            // svg.setLocation(startDragEventRef.current.pt as SvgPoint, pt);
            // const newSvg = new Svg();
            // newSvg.path = svg.path;
            // setSvg(newSvg);

            restorePtByIdx(pathPoints, cpPoints, startDragEventRef.current);
/*
            svg.setLocation(startDragEventRef.current.pt as SvgPoint, nowXY); // no anymore this point
            console.log('set new path', svg.asString());
            
            const newSvg = new Svg(svg.asString());
            setSvg(newSvg);
*/
        } else {
            // const startPt = getEventPt(containerRef, startDragEventRef.current.event.clientX, startDragEventRef.current.event.clientY);
            const startXY = startDragEventRef.current.startXY!;
            const nowXY = getEventPt(containerRef, event.clientX, event.clientY);

            //console.log('move startPt', _ViewPoint(startPt).padEnd(20, ' '), 'pt', _ViewPoint(pt).padEnd(20, ' '), '--------------------------------', _fViewBox(viewBox));

            setViewBox((prev) => {
                const newViewBox: ViewBox = [
                    prev[0] + startXY.x - nowXY.x,
                    prev[1] + startXY.y - nowXY.y,
                    prev[2],
                    prev[3],
                ];
                //console.log('-------------set view box prev', _fViewBox(prev), '--------new', _fViewBox(newViewBox));
                return newViewBox;
            });
        }
    }
    /**/

    //console.log('viewBox', _ViewBox(viewBox));

    function onPointClick(ev: StartDragEvent) {
        if (ev.event.button === 0) {
            startDragEventRef.current = ev;
            initPtIdx(pathPoints, cpPoints, ev);
        }
    }

    return (
        <svg viewBox={viewBox.join(" ")} className="bg-[#040d1c] select-none"
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
        // onClick={() => setActivePt(-1)}
        >
            <CanvasTicks />

            <path d={points.asString} fill="#94a3b830" stroke="white" strokeWidth={canvasStroke} />

            <g className="cpPts">
                {cpPoints.map((pt, idx) => (
                    <ControlPoint key={idx} pt={pt} stroke={canvasStroke} pathPtIdx={cpToTargetIdx(pathPoints, pt.itemReference)} clk={onPointClick} />
                ))}
            </g>

            <g className="pathPts">
                {pathPoints.map((pt, idx) => (
                    <TargetPoint key={idx} pt={pt} stroke={canvasStroke} pathPtIdx={idx} clk={onPointClick} asStringAtom={svgEditRoot.atoms[idx].asStringAtom} />
                ))}
            </g>
        </svg>
    );
}

// const CanvasControlsPanelMemo = React.memo(CanvasControlsPanel);

export function PathCanvas() {
    const { ref, parentRef, onWheel, } = useContainerZoom();
    return (
        <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full overflow-hidden" onWheel={onWheel}>
            <SvgCanvas />
            {/* <CanvasControlsPanelMemo /> */}
        </div>
    );
}
