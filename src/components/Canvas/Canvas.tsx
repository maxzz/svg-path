import React from 'react';
import { useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { mergeRef } from '../../hooks/utils';
import { activePointAtom, canvasSizeAtom, canvasStrokeAtom, containerElmAtom, doClearActiveAtom, precisionAtom, snapToGridAtom, CanvasDragEvent, svgEditRootAtom, viewBoxAtom, getEventPt, doCanvasMouseDownAtom, doCanvasMouseMoveAtom, doCanvasMouseUpAtom, doCanvasPointClkAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
//import { CanvasControlsPanel } from '../Panels/PanelCanvasControls';
import { ControlPoint, TargetPoint } from './CanvasPoints';
import { CanvasTicks } from './CanvasTicks';
import { _fViewBox, _ViewBox, _ViewPoint } from '../../utils/debugging';
//import { useThrottle } from 'react-use';

function useMouseHandlers() {
    const doCanvasPointClk = useUpdateAtom(doCanvasPointClkAtom);
    const doCanvasMouseDown = useUpdateAtom(doCanvasMouseDownAtom);
    const doCanvasMouseMove = useUpdateAtom(doCanvasMouseMoveAtom);
    const doCanvasMouseUp = useUpdateAtom(doCanvasMouseUpAtom);
    const doClearActive = useUpdateAtom(doClearActiveAtom);

    const onPointClick = React.useCallback((e: CanvasDragEvent) => (e.event.button === 0) && doCanvasPointClk(e), []);

    const onMouseDown = React.useCallback(function onMouseDown(event: React.MouseEvent) {
        doClearActive(); // TODO: set it on mouse up only if where no move
        doCanvasMouseDown(event);
    }, []);

    const onMouseUp = React.useCallback(function onMouseUp() {
        doCanvasMouseUp();
    }, []);

    const onMouseMove = React.useCallback(function onMouseMove(event: React.MouseEvent) {
        doCanvasMouseMove(event);
    }, []);

    console.log(`------------------------- re-render useMouseHandlers -------------------------`);

    return {
        onPointClick,
        onMouseDown,
        onMouseUp,
        onMouseMove,
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
    const { onMouseDown, onMouseMove, onMouseUp, onPointClick } = useMouseHandlers();

    const viewBox = useAtomValue(viewBoxAtom);
    const size = useAtomValue(canvasSizeAtom);

    console.log('canvas re-render', _fViewBox(viewBox, 4));

    return (
        <svg viewBox={viewBox.join(" ")} className="bg-[#040d1c] select-none"
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
        // onClick={() => setActivePt(-1)}
        >

            {
                size.w && size.h && (<>
                    <CanvasTicks />

                    {/* <path d={points.asString} fill="#94a3b830" stroke="white" strokeWidth={canvasStroke} /> */}
                    <RenderPath />

                    <RenderControlPoints onPointClick={onPointClick} />
                    <RenderPoints onPointClick={onPointClick} />
                </>)
            }
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
