import React from 'react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { mergeRef } from '../../hooks/utils';
import { canvasSizeAtom, canvasStrokeAtom, svgEditRootAtom, viewBoxAtom, doCanvasMouseDownAtom, doCanvasMouseMoveAtom, doCanvasMouseUpAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { ControlPoint, TargetPoint } from './CanvasPoints';
import { CanvasTicks } from './CanvasTicks';
//import { _fViewBox } from '../../utils/debugging';
//import { useThrottle } from 'react-use';

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
    //console.log('--------------------------Canvas SVG element re-render -------------------------', _fViewBox(viewBox, 4), '---- canvas size', size);
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
    const canvasStroke = useAtomValue(canvasStrokeAtom);
    const svgEditRoot = useAtomValue(svgEditRootAtom);
    const points = useAtomValue(svgEditRoot.pointsAtom);
    return (
        <path d={points.asString} fill="#94a3b830" stroke="white" strokeWidth={canvasStroke} />
    );
}

function RenderTargetPoints() {
    const svgEditRoot = useAtomValue(svgEditRootAtom);
    const edits = svgEditRoot.edits;
    const points = useAtomValue(svgEditRoot.pointsAtom); // just to trigger re-render
    return (
        <g className="pathPts">
            {edits.map((edit, editIdx) => (
                <TargetPoint
                    key={editIdx}
                    pt={edit.svgItem.targetLocation()}
                    svgItemIdx={editIdx}
                    stateAtom={edit.stateAtom}
                    standaloneStringAtom={edit.standaloneStringAtom}
                />
            ))}
        </g>
    );
}

function RenderControlPoints() {
    const svgEditRoot = useAtomValue(svgEditRootAtom);
    const edits = svgEditRoot.edits;
    const points = useAtomValue(svgEditRoot.pointsAtom); // just to trigger re-render
    return (
        <g className="cpPts">
            {edits.map((edit, editIdx) => {
                const controls = edit.svgItem.controlLocations();
                controls.forEach((cpt, idx) => cpt.subIndex = idx);
                return controls.map((cpt, idx) => (
                    <ControlPoint
                        key={`${idx}${editIdx}`}
                        pt={cpt}
                        svgItemIdx={editIdx}
                        stateAtom={edit.stateAtom}
                    />
                ));
            })}
        </g>
    );
}

export function PathCanvas() {
    const { ref, parentRef, onWheel, } = useContainerZoom();
    return (
        <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full overflow-hidden" onWheel={onWheel}>
            <CanvasSvgElement>
                <CanvasTicks />
                <RenderPath />
                <RenderControlPoints />
                <RenderTargetPoints />
            </CanvasSvgElement>
        </div>
    );
}
