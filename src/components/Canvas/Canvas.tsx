import React from 'react';
import { mergeRef } from '../../hooks/utils';
import { useAtom } from 'jotai';
import { showGridAtom, svgAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { SvgControlPoint, SvgPoint } from '../../svg/svg';
import { BackgroundGrid } from './BackgroundGrid';

function TargetPoint({ pt, stroke }: { pt: SvgPoint, stroke: number; }) {
    return (
        <circle className="fill-[white]" cx={pt.x} cy={pt.y} r={stroke * 3} strokeWidth={stroke * 12} />
    );
}

function ControlPoint({ pt, stroke }: { pt: SvgControlPoint, stroke: number; }) {
    return (
        <>
            <circle className="fill-[white]" cx={pt.x} cy={pt.y} r={stroke * 3} strokeWidth={stroke * 12} />
            {pt.relations.map((rel, idx) => (
                <React.Fragment key={idx}>
                    <line className="stroke-[#fff7]" x1={pt.x} y1={pt.y} x2={rel.x} y2={rel.y} strokeWidth={stroke} />
                </React.Fragment>
            ))}
        </>
    );
}

function Canvas() {
    const [svg] = useAtom(svgAtom);

    const {
        viewBox,
        viewBoxStroke,
        ref,
        parentRef,
        onWheel,
    } = useContainerZoom();

    const pathPoints = svg.targetLocations();
    const cpPoints = svg.controlLocations();

    return (
        <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full overflow-hidden" onWheel={onWheel}>
            <svg viewBox={viewBox.join(" ")}>
                <BackgroundGrid x={viewBox[0]} y={viewBox[1]} />

                <path d={svg.asString()} fill="#7777" stroke="white" strokeWidth={viewBoxStroke} />

                <g className="pathPts">
                    {pathPoints.map((pt, idx) => (
                        <TargetPoint pt={pt} stroke={viewBoxStroke} key={idx} />
                    ))}
                </g>

                <g className="cpPts">
                    {cpPoints.map((pt, idx) => (
                        <ControlPoint pt={pt} stroke={viewBoxStroke} key={idx} />
                    ))}
                </g>
            </svg>
        </div>
    );
}

export default Canvas;
