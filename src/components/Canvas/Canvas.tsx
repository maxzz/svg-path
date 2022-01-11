import React from 'react';
import { atom, useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { mergeRef } from '../../hooks/utils';
import { activePointAtom, canvasStrokeAtom, svgAtom, viewBoxAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { SvgItem, SvgPoint } from '../../svg/svg';
import { CanvasControlsPanel } from './CanvasControlsPanel';
import { ViewBox } from '../../svg/svg-utils-viewport';
import { ControlPoint, TargetPoint } from './CanvasPoints';
import { CanvasTicks } from './CanvasTicks';

const cpToTargetIdx = (targetLocations: SvgPoint[], ref: SvgItem) => targetLocations.findIndex((pt) => pt.itemReference === ref);

function SvgCanvas() {

    const [viewBox] = useAtom(viewBoxAtom);
    const [canvasStroke] = useAtom(canvasStrokeAtom);

    const [svg] = useAtom(svgAtom);
    const pathPoints = svg.targetLocations();
    const cpPoints = svg.controlLocations();

    const setActivePt = useUpdateAtom(activePointAtom);

    const mouseDownEv = React.useRef<MouseEvent | null>(null);

    function onMouseDown(event: React.MouseEvent) {
        mouseDownEv.current = event.nativeEvent;
        setActivePt(-1);
        //console.log('onMouseDown', event.target);
    }

    function onMouseMove(event: React.MouseEvent) {
        if (mouseDownEv.current) {
            //console.log('onMouseMove', event.target);
        }
    }

    function onMouseUp(event: React.MouseEvent) {
        mouseDownEv.current = null;
        //console.log('onMouseUp', event.target);
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
                    <ControlPoint pt={pt} stroke={canvasStroke} idx={cpToTargetIdx(pathPoints, pt.itemReference)} key={idx} />
                ))}
            </g>

            <g className="pathPts">
                {pathPoints.map((pt, idx) => (
                    <TargetPoint svgItem={svg.path[idx]} pt={pt} stroke={canvasStroke} idx={idx} key={idx} />
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
