import React from 'react';
import { mergeRef } from '../../hooks/utils';
import { useAtom } from 'jotai';
import { activeCpPointAtom, activePathPointAtom, hoverCpPointAtom, hoverPathPointAtom, showGridAtom, svgAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { SvgControlPoint, SvgPoint } from '../../svg/svg';
import { BackgroundGrid } from './BackgroundGrid';
import CanvasControlsPanel from './CanvasControlsPanel';
import { ViewBox } from '../../svg/svg-utils';

function TargetPoint({ pt, stroke, idx }: { pt: SvgPoint, stroke: number; idx: number; }) {
    const [activePathPt, setActivePathPt] = useAtom(activePathPointAtom);
    const [activeCpPt, setActiveCpPt] = useAtom(activeCpPointAtom);
    const [hoverPathPt, setHoverPathPt] = useAtom(hoverPathPointAtom);
    const [hoverCpPt, setHoverCpPt] = useAtom(hoverCpPointAtom);

    const active = activePathPt === idx;
    const hover = hoverPathPt === idx;

    //TODO: add point transparent border for ease mouse pointing
    return (
        <circle
            className={`${active ? 'fill-[blue] cursor-pointer' : hover ? 'fill-[red] cursor-pointer' : 'fill-[white]'}`}
            cx={pt.x} cy={pt.y} r={stroke * 3} strokeWidth={stroke * 12}
            onMouseEnter={(event) => {
                activePathPt !== idx && setHoverPathPt(idx);
                activeCpPt !== -1 && setHoverCpPt(-1);
            }}
            onMouseLeave={(event) => {
                hoverPathPt !== -1 && setHoverPathPt(-1);
            }}
            onClick={() => {
                setActivePathPt(idx);
            }}
        />
    );
}

function ControlPoint({ pt, stroke, idx }: { pt: SvgControlPoint, stroke: number; idx: number; }) {
    const [activePathPt, setActivePathPt] = useAtom(activePathPointAtom);
    const [activeCpPt, setActiveCpPt] = useAtom(activeCpPointAtom);
    const [hoverPathPt, setHoverPathPt] = useAtom(hoverPathPointAtom);
    const [hoverCpPt, setHoverCpPt] = useAtom(hoverCpPointAtom);

    const active = activeCpPt === idx;
    const hover = hoverCpPt === idx;

    return (
        <>
            <circle
                className={`${active ? 'fill-[blue] cursor-pointer' : hover ? 'fill-[red] cursor-pointer' : 'fill-[white]'}`}
                cx={pt.x} cy={pt.y} r={stroke * 3} strokeWidth={stroke * 12}
                onMouseEnter={(event) => {
                    activeCpPt !== idx && setHoverCpPt(idx);
                    activePathPt !== -1 && setHoverPathPt(-1);
                }}
                onMouseLeave={(event) => {
                    hoverCpPt !== -1 && setHoverCpPt(-1);
                }}
                onClick={() => {
                    setActivePathPt(idx);
                }}
                />
            {pt.relations.map((rel, idx) => (
                <React.Fragment key={idx}>
                    <line className="stroke-[#fff7]" x1={pt.x} y1={pt.y} x2={rel.x} y2={rel.y} strokeWidth={stroke} />
                </React.Fragment>
            ))}
        </>
    );
}

function SvgCanvas({ viewBox, viewBoxStroke }: { viewBox: ViewBox; viewBoxStroke: number; }) {
    const [svg] = useAtom(svgAtom);
    const pathPoints = svg.targetLocations();
    const cpPoints = svg.controlLocations();
    return (
        <svg viewBox={viewBox.join(" ")}>
            <BackgroundGrid x={viewBox[0]} y={viewBox[1]} />

            <path d={svg.asString()} fill="#94a3b830" stroke="white" strokeWidth={viewBoxStroke} />

            <g className="pathPts">
                {pathPoints.map((pt, idx) => (
                    <TargetPoint pt={pt} stroke={viewBoxStroke} idx={idx} key={idx} />
                ))}
            </g>

            <g className="cpPts">
                {cpPoints.map((pt, idx) => (
                    <ControlPoint pt={pt} stroke={viewBoxStroke} idx={idx} key={idx} />
                ))}
            </g>
        </svg>
    );
}

const CanvasControlsPanelMemo = React.memo(CanvasControlsPanel);

function Canvas() {
    const { viewBox, viewBoxStroke, ref, parentRef, onWheel, } = useContainerZoom();
    return (
        <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full overflow-hidden" onWheel={onWheel}>
            <SvgCanvas viewBox={viewBox} viewBoxStroke={viewBoxStroke} />
            <CanvasControlsPanelMemo />
        </div>
    );
}

export default Canvas;
