import React from 'react';
import { useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { mergeRef } from '../../hooks/utils';
import { activePointAtom, canvasStrokeAtom, containerElmAtom, doClearActiveAtom, precisionAtom, snapToGridAtom, svgEditRootAtom, viewBoxAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
//import { CanvasControlsPanel } from '../Panels/PanelCanvasControls';
import { ControlPoint, StartDragEvent, TargetPoint } from './CanvasPoints';
import { CanvasTicks } from './CanvasTicks';
import { _fViewBox, _ViewBox, _ViewPoint } from '../../utils/debugging';
import { ViewBox } from '../../svg/svg-utils-viewport';
//import { useThrottle } from 'react-use';

function getEventPt(viewBox: ViewBox, canvasStroke: number, containerElm: HTMLElement, eventClientX: number, eventClientY: number) {
    const canvasRect = containerElm.getBoundingClientRect();
    let [viewBoxX, viewBoxY] = viewBox;
    const x = viewBoxX + (eventClientX - canvasRect.x) * canvasStroke;
    const y = viewBoxY + (eventClientY - canvasRect.y) * canvasStroke;
    return { x, y };
}

function useMouseHandlers() {
    const [viewBox, setViewBox] = useAtom(viewBoxAtom);
    const canvasStroke = useAtomValue(canvasStrokeAtom);
    const containerElm = useAtomValue(containerElmAtom);

    const svgEditRoot = useAtomValue(svgEditRootAtom);

    const doUpdatePoint = useUpdateAtom(svgEditRoot.doUpdatePointAtom);
    //const setActivePt = useUpdateAtom(activePointAtom);
    const doClearActive = useUpdateAtom(doClearActiveAtom);

    const dragEventRef = React.useRef<StartDragEvent | null>(null);

    const onPointClick = React.useCallback((e: StartDragEvent) => (e.event.button === 0) && (dragEventRef.current = e), []);

    const onMouseDown = React.useCallback((event: React.MouseEvent) => {
        //setActivePt(-1); 
        doClearActive(); // TODO: set it on mouse up only if where no move
        dragEventRef.current = { event, startXY: getEventPt(viewBox, canvasStroke, containerElm!, event.clientX, event.clientY), svgItemIdx: -1 };
    }, [dragEventRef, containerElm]);

    const onMouseUp = React.useCallback(() => {
        dragEventRef.current = null;
    }, [dragEventRef]);

    const [precision] = useAtom(precisionAtom);
    const [snapToGrid] = useAtom(snapToGridAtom);

    const onMouseMove = React.useCallback((event: React.MouseEvent) => {
        if (!containerElm || !dragEventRef.current) { return; }

        event.stopPropagation();

        if (dragEventRef.current.pt) {
            const nowXY = getEventPt(viewBox, canvasStroke, containerElm, event.clientX, event.clientY);

            const decimals = snapToGrid
                ? 0
                : event.ctrlKey
                    ? precision
                        ? 0
                        : 3
                    : precision;
            nowXY.x = parseFloat(nowXY.x.toFixed(decimals));
            nowXY.y = parseFloat(nowXY.y.toFixed(decimals));
            //console.log('move', nowXY.x, nowXY.y);

            doUpdatePoint({ pt: dragEventRef.current.pt, newXY: nowXY, svgItemIdx: dragEventRef.current.svgItemIdx });
        } else {
            //const startPt = getEventPt(containerRef, dragEventRef.current.event.clientX, dragEventRef.current.event.clientY);
            const startXY = dragEventRef.current.startXY!;
            const nowXY = getEventPt(viewBox, canvasStroke, containerElm, event.clientX, event.clientY);
            //console.log('move startPt', _ViewPoint(startPt).padEnd(20, ' '), 'pt', _ViewPoint(pt).padEnd(20, ' '), '--------------------------------', _fViewBox(viewBox));

            setViewBox((prev) => ([
                prev[0] + startXY.x - nowXY.x,
                prev[1] + startXY.y - nowXY.y,
                prev[2],
                prev[3],
            ]));
        }
    }, [dragEventRef, containerElm]);

    return {
        onPointClick,
        onMouseDown,
        onMouseUp,
        onMouseMove,
    }
}

function SvgCanvas() {
    const [viewBox, setViewBox] = useAtom(viewBoxAtom);
    const canvasStroke = useAtomValue(canvasStrokeAtom);
    const containerElm = useAtomValue(containerElmAtom);

    const svgEditRoot = useAtomValue(svgEditRootAtom);
    const points = useAtomValue(svgEditRoot.pointsAtom);

    const edits = svgEditRoot.edits;





    /*
    const doUpdatePoint = useUpdateAtom(svgEditRoot.doUpdatePointAtom);
    //const setActivePt = useUpdateAtom(activePointAtom);
    const doClearActive = useUpdateAtom(doClearActiveAtom);

    const dragEventRef = React.useRef<StartDragEvent | null>(null);

    const onPointClick = React.useCallback((e: StartDragEvent) => (e.event.button === 0) && (dragEventRef.current = e), []);

    function onMouseDown(event: React.MouseEvent) {
        //setActivePt(-1); // TODO: set it on mouse up only if where no move
        doClearActive();
        dragEventRef.current = { event, startXY: getEventPt(viewBox, canvasStroke, containerElm!, event.clientX, event.clientY), svgItemIdx: -1 };
    }

    function onMouseUp() {
        dragEventRef.current = null;
    }

    const [precision] = useAtom(precisionAtom);
    const [snapToGrid] = useAtom(snapToGridAtom);

    function onMouseMove(event: React.MouseEvent) {
        if (!containerElm || !dragEventRef.current) { return; }

        event.stopPropagation();

        if (dragEventRef.current.pt) {
            const nowXY = getEventPt(viewBox, canvasStroke, containerElm, event.clientX, event.clientY);

            const decimals = snapToGrid
                ? 0
                : event.ctrlKey
                    ? precision
                        ? 0
                        : 3
                    : precision;
            nowXY.x = parseFloat(nowXY.x.toFixed(decimals));
            nowXY.y = parseFloat(nowXY.y.toFixed(decimals));
            //console.log('move', nowXY.x, nowXY.y);

            doUpdatePoint({ pt: dragEventRef.current.pt, newXY: nowXY, svgItemIdx: dragEventRef.current.svgItemIdx });
        } else {
            //const startPt = getEventPt(containerRef, dragEventRef.current.event.clientX, dragEventRef.current.event.clientY);
            const startXY = dragEventRef.current.startXY!;
            const nowXY = getEventPt(viewBox, canvasStroke, containerElm, event.clientX, event.clientY);
            //console.log('move startPt', _ViewPoint(startPt).padEnd(20, ' '), 'pt', _ViewPoint(pt).padEnd(20, ' '), '--------------------------------', _fViewBox(viewBox));

            setViewBox((prev) => ([
                prev[0] + startXY.x - nowXY.x,
                prev[1] + startXY.y - nowXY.y,
                prev[2],
                prev[3],
            ]));
        }
    }
    */

    const {onMouseDown, onMouseMove, onMouseUp, onPointClick} = useMouseHandlers();





    console.log('canvas re-render', 'canvasStroke', canvasStroke, _fViewBox(viewBox, 4), 'elm', containerElm);
    

    return (
        <svg viewBox={viewBox.join(" ")} className="bg-[#040d1c] select-none"
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
        // onClick={() => setActivePt(-1)}
        >
            <CanvasTicks />

            <path d={points.asString} fill="#94a3b830" stroke="white" strokeWidth={canvasStroke} />

            <g className="cpPts">
                {edits.map((edit, editIdx) => {
                    const controls = edit.svgItem.controlLocations();
                    controls.forEach((cpt, idx) => cpt.subIndex = idx);
                    return controls.map((cpt, idx) => (
                        <ControlPoint key={`${idx}${editIdx}`} clk={onPointClick} pt={cpt} stroke={canvasStroke} svgItemIdx={editIdx} stateAtom={edit.stateAtom} />
                    ));
                })}
            </g>

            <g className="pathPts">
                {edits.map((edit, editIdx) => (
                    <TargetPoint key={editIdx} clk={onPointClick} pt={edit.svgItem.targetLocation()} stroke={canvasStroke} svgItemIdx={editIdx} stateAtom={edit.stateAtom} asStringAtom={edit.asStringAtom} />
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
