import React from 'react';
import { useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { mergeRef } from '../../hooks/utils';
import { activePointAtom, canvasStrokeAtom, containerRefAtom, pathUnsafeAtom, precisionAtom, snapToGridAtom, svgAtom, svgEditRootAtom, viewBoxAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { SvgControlPoint, SvgItem, SvgPoint } from '../../svg/svg';
//import { CanvasControlsPanel } from '../Panels/PanelCanvasControls';
import { ViewBox } from '../../svg/svg-utils-viewport';
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
    const [viewBox, setViewBox] = useAtom(viewBoxAtom);
    const canvasStroke = useAtomValue(canvasStrokeAtom);
    const containerRef = useAtomValue(containerRefAtom);

    const svgEditRoot = useAtomValue(svgEditRootAtom);
    const points = useAtomValue(svgEditRoot.pointsAtom);
    const pathPoints = points.targets;
    const cpPoints = points.controls;

    const edits = svgEditRoot.edits;

    const doUpdatePoint = useUpdateAtom(svgEditRoot.doUpdatePointAtom);
    const setActivePt = useUpdateAtom(activePointAtom);

    function onMouseDown(event: React.MouseEvent) {
        setActivePt(-1); // TODO: set it on mouse up only if where no move
        startDragEventRef.current = { event, startXY: getEventPt(containerRef!, event.clientX, event.clientY), svgItemIdx: -1 };
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

    function onMouseMove(event: React.MouseEvent) {
        if (!containerRef || !startDragEventRef.current) { return; }

        event.stopPropagation();

        if (startDragEventRef.current.pt) {
            const nowXY = getEventPt(containerRef, event.clientX, event.clientY);

            const decimals = snapToGrid ? 0 : event.ctrlKey ? precision ? 0 : 3 : precision;
            nowXY.x = parseFloat(nowXY.x.toFixed(decimals));
            nowXY.y = parseFloat(nowXY.y.toFixed(decimals));
            //console.log('move', nowXY.x, nowXY.y);

            restorePtByIdx(pathPoints, cpPoints, startDragEventRef.current);
            doUpdatePoint({ pt: startDragEventRef.current.pt, newXY: nowXY, svgItemIdx: startDragEventRef.current.svgItemIdx });
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
                return newViewBox;
            });
        }
    }

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
                {edits.map((edit, idx) => {
                    const controls = edit.svgItem.controlLocations();
                    controls.forEach((cpt, idx) => cpt.subIndex = idx);
                    return controls.map((pt) => (
                        <ControlPoint key={idx} pt={pt} stroke={canvasStroke} svgItemIdx={cpToTargetIdx(pathPoints, pt.itemReference)} clk={onPointClick} />
                    ));
                })}
            </g>

            <g className="pathPts">
                {pathPoints.map((pt, idx) => (
                    <TargetPoint key={idx} pt={pt} stroke={canvasStroke} svgItemIdx={idx} clk={onPointClick} asStringAtom={svgEditRoot.edits[idx].asStringAtom} />
                ))}
            </g>
        </svg>
    );

    // return (
    //     <svg viewBox={viewBox.join(" ")} className="bg-[#040d1c] select-none"
    //         onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
    //     // onClick={() => setActivePt(-1)}
    //     >
    //         <CanvasTicks />

    //         <path d={points.asString} fill="#94a3b830" stroke="white" strokeWidth={canvasStroke} />

    //         <g className="cpPts">
    //             {cpPoints.map((pt, idx) => (
    //                 <ControlPoint key={idx} pt={pt} stroke={canvasStroke} svgItemIdx={cpToTargetIdx(pathPoints, pt.itemReference)} clk={onPointClick} />
    //             ))}
    //         </g>

    //         <g className="pathPts">
    //             {pathPoints.map((pt, idx) => (
    //                 <TargetPoint key={idx} pt={pt} stroke={canvasStroke} svgItemIdx={idx} clk={onPointClick} asStringAtom={svgEditRoot.edits[idx].asStringAtom} />
    //             ))}
    //         </g>
    //     </svg>
    //     // TODO: svgEditRoot.edits[idx].asStringAtom failed if remove last or any svgItem
    // );
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
