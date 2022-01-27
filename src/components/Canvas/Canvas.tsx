import React from 'react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { mergeRef } from '../../hooks/utils';
import { canvasSizeAtom, canvasStrokeAtom, svgEditRootAtom, viewBoxAtom, doCanvasMouseDownAtom, doCanvasMouseMoveAtom, doCanvasMouseUpAtom, showCPsAtom, fillPathAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { ControlPoint, TargetPoint } from './CanvasPoints';
import { CanvasTicks } from './CanvasTicks';

function useMouseHandlers() {
    const doCanvasMouseDown = useUpdateAtom(doCanvasMouseDownAtom);
    const doCanvasMouseMove = useUpdateAtom(doCanvasMouseMoveAtom);
    const doCanvasMouseUp = useUpdateAtom(doCanvasMouseUpAtom);

    const onMouseDown = React.useCallback((event: React.MouseEvent) => doCanvasMouseDown(event), []);
    const onMouseUp = React.useCallback(() => doCanvasMouseUp(), []);
    const onMouseMove = React.useCallback((event: React.MouseEvent) => doCanvasMouseMove(event), []);

    return {
        onMouseDown,
        onMouseUp,
        onMouseMove,
    };
}

function CanvasSvgElement({ children }: { children: React.ReactNode; }) {
    const size = useAtomValue(canvasSizeAtom);
    const viewBox = useAtomValue(viewBoxAtom);
    const { onMouseDown, onMouseMove, onMouseUp } = useMouseHandlers();
    if (!size.w || !size.h) {
        return null;
    }
    return (
        <svg viewBox={viewBox.join(" ")} className="bg-[#040d1c] select-none" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
            {children}
        </svg>
    );
}

function RenderPath() {
    const svgEditRoot = useAtomValue(svgEditRootAtom);
    const completePath = useAtomValue(svgEditRoot.completePathAtom);
    const stroke = useAtomValue(canvasStrokeAtom);
    const showCPs = useAtomValue(showCPsAtom);
    const fill = useAtomValue(fillPathAtom);
    const fillColor = fill
        ? '#94a3b830'
        : !showCPs
            ? 'none'
            : fill
                ? '#94a3b830'
                : 'none'
            ;
    return (
        <path d={completePath} fill={fillColor} stroke="white" strokeWidth={stroke} />
    );
}

function RenderTargetPoints() {
    const svgEditRoot = useAtomValue(svgEditRootAtom);
    const edits = svgEditRoot.edits;
    return (
        <g className="target-pts">
            {edits.map((edit, editIdx) => (
                <TargetPoint key={editIdx} svgItemEdit={edit} />
            ))}
        </g>
    );
}

function RenderControlPoints() {
    const svgEditRoot = useAtomValue(svgEditRootAtom);
    const edits = svgEditRoot.edits;
    return (
        <g className="ctrl-pts">
            {edits.map((edit, editIdx) => {
                const controls = edit.svgItem.controlLocations();
                return controls.map((cpt, cpIdx) => (
                    <ControlPoint key={`${editIdx}${cpIdx}`} svgItemEdit={edit} cpIdx={cpIdx} />
                ));
            })}
        </g>
    );
}

export function PathCanvas() {
    const { ref, parentRef, onWheel, } = useContainerZoom();
    const showCPs = useAtomValue(showCPsAtom);
    return (
        <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full overflow-hidden" onWheel={onWheel}>
            <CanvasSvgElement>
                <CanvasTicks />
                <RenderPath />
                {showCPs && <g className="pts">
                    <RenderControlPoints />
                    <RenderTargetPoints />
                </g>}
            </CanvasSvgElement>
        </div>
    );
}
