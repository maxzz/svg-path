import React from 'react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { mergeRef } from '../../hooks/utils';
import { canvasSizeAtom, canvasStrokeAtom, doClearActiveAtom, CanvasDragEvent, svgEditRootAtom, viewBoxAtom, doCanvasMouseDownAtom, doCanvasMouseMoveAtom, doCanvasMouseUpAtom, doCanvasPointClkAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
//import { CanvasControlsPanel } from '../Panels/PanelCanvasControls';
import { ControlPoint, TargetPoint } from './CanvasPoints';
import { CanvasTicks } from './CanvasTicks';
import { _fViewBox, _ViewBox, _ViewPoint } from '../../utils/debugging';
//import { useThrottle } from 'react-use';

function useMouseHandlers() {
    const doCanvasMouseDown = useUpdateAtom(doCanvasMouseDownAtom);
    const doCanvasMouseMove = useUpdateAtom(doCanvasMouseMoveAtom);
    const doCanvasMouseUp = useUpdateAtom(doCanvasMouseUpAtom);
    const doCanvasPointClk = useUpdateAtom(doCanvasPointClkAtom);
    const doClearActive = useUpdateAtom(doClearActiveAtom);

    const onMouseDown = React.useCallback(function onMouseDown(event: React.MouseEvent) {
        doClearActive(); // TODO: set it on mouse up only if where no move
        doCanvasMouseDown(event);
    }, []);

    const onMouseUp = React.useCallback(() => doCanvasMouseUp(), []);
    const onMouseMove = React.useCallback((event: React.MouseEvent) => doCanvasMouseMove(event), []);
    const onPointClick = React.useCallback((event: CanvasDragEvent) => (event.event.button === 0) && doCanvasPointClk(event), []);

    return {
        onMouseDown,
        onMouseUp,
        onMouseMove,
        onPointClick,
    };
}

function RenderPath() {
    const svgEditRoot = useAtomValue(svgEditRootAtom);
    const points = useAtomValue(svgEditRoot.pointsAtom);
    const canvasStroke = useAtomValue(canvasStrokeAtom);
    return (
        <path d={points.asString} fill="#94a3b830" stroke="white" strokeWidth={canvasStroke} />
    );
}

function RenderControlPoints({ onPointClick }: { onPointClick: (e: CanvasDragEvent) => void; }) {
    const svgEditRoot = useAtomValue(svgEditRootAtom);
    const edits = svgEditRoot.edits;
    const points = useAtomValue(svgEditRoot.pointsAtom); // just to trigger re-render
    return (
        <g className="cpPts">
            {edits.map((edit, editIdx) => {
                const controls = edit.svgItem.controlLocations();
                controls.forEach((cpt, idx) => cpt.subIndex = idx);
                return controls.map((cpt, idx) => (
                    <ControlPoint key={`${idx}${editIdx}`} clk={onPointClick} pt={cpt} svgItemIdx={editIdx} stateAtom={edit.stateAtom} />
                ));
            })}
        </g>
    );
}

function RenderPoints({ onPointClick }: { onPointClick: (e: CanvasDragEvent) => void; }) {
    const svgEditRoot = useAtomValue(svgEditRootAtom);
    const edits = svgEditRoot.edits;
    const points = useAtomValue(svgEditRoot.pointsAtom); // just to trigger re-render
    return (
        <g className="pathPts">
            {edits.map((edit, editIdx) => (
                <TargetPoint key={editIdx} clk={onPointClick} pt={edit.svgItem.targetLocation()} svgItemIdx={editIdx} stateAtom={edit.stateAtom} asStringAtom={edit.asStringAtom} />
            ))}
        </g>
    );
}

function SvgCanvas() {
    const size = useAtomValue(canvasSizeAtom);
    const viewBox = useAtomValue(viewBoxAtom);
    console.log('--------------------------Canvas re-render -------------------------', _fViewBox(viewBox, 4));
    const { onMouseDown, onMouseMove, onMouseUp, onPointClick } = useMouseHandlers();
    if (!size.w || !size.h) {
        return null;
    }
    return (
        <svg viewBox={viewBox.join(" ")} className="bg-[#040d1c] select-none" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
            <CanvasTicks />
            <RenderPath />
            <RenderControlPoints onPointClick={onPointClick} />
            <RenderPoints onPointClick={onPointClick} />
        </svg>
    );
}

//TODO: hover row and hover ed should be separate

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
