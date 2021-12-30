import React from 'react';
import { mergeRef } from '../../hooks/utils';
import { useAtom } from 'jotai';
import { activeCpPointAtom, activePathPointAtom, hoverCpPointAtom, hoverPathPointAtom, showGridAtom, svgAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { SvgControlPoint, SvgItem, SvgPoint } from '../../svg/svg';
import { BackgroundGrid } from './BackgroundGrid';
import CanvasControlsPanel from './CanvasControlsPanel';
import { ViewBox } from '../../svg/svg-utils';
import { useUpdateAtom } from 'jotai/utils';

function PointClassNames<K extends 'circle'>(active: boolean, hover: boolean, key: K) {
    const className = {
        circle: `${active
            ? 'fill-[#009cff] cursor-pointer'
            : hover
                ? 'fill-[#ff4343] cursor-pointer'
                : 'fill-[white]'
            }`,
    };
    return className[key];
}

function TargetPoint({ svgItem, pt, stroke, idx }: { svgItem: SvgItem; pt: SvgPoint, stroke: number; idx: number; }) {
    const [activePathPt, setActivePathPt] = useAtom(activePathPointAtom);
    const [activeCpPt, setActiveCpPt] = useAtom(activeCpPointAtom);
    const [hoverPathPt, setHoverPathPt] = useAtom(hoverPathPointAtom);
    const [hoverCpPt, setHoverCpPt] = useAtom(hoverCpPointAtom);

    const active = activePathPt === idx;
    const hover = hoverPathPt === idx;

    return (
        <>
            {(active || hover) &&
                <path className="stroke-[red] fill-[none]" strokeWidth={stroke} d={svgItem.asStandaloneString()} />
            }
            <circle
                className={PointClassNames(active, hover, 'circle')}
                style={{ stroke: 'transparent' }}
                cx={pt.x} cy={pt.y} r={stroke * 3} strokeWidth={stroke * 12}
                onMouseEnter={(event) => {
                    event.stopPropagation();
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
        </>
    );
}

//TODO: add point transparent border for ease mouse pointing

function ControlPoint({ svgItem, pt, stroke, idx }: { svgItem: SvgItem; pt: SvgControlPoint, stroke: number; idx: number; }) {
    const [activePathPt, setActivePathPt] = useAtom(activePathPointAtom);
    const [activeCpPt, setActiveCpPt] = useAtom(activeCpPointAtom);
    const [hoverPathPt, setHoverPathPt] = useAtom(hoverPathPointAtom);
    const [hoverCpPt, setHoverCpPt] = useAtom(hoverCpPointAtom);

    const active = activeCpPt === idx;
    const hover = hoverCpPt === idx;

    return (
        <>
            {pt.relations.map((rel, idx) => (
                <React.Fragment key={idx}>
                    <line
                        className="stroke-[#fff7]"
                        x1={pt.x} y1={pt.y} x2={rel.x} y2={rel.y} strokeWidth={stroke}
                    />
                </React.Fragment>
            ))}
            <circle
                className={PointClassNames(active, hover, 'circle')}
                style={{ stroke: 'transparent' }}
                cx={pt.x} cy={pt.y} r={stroke * 3} strokeWidth={stroke * 12}
                onMouseEnter={(event) => {
                    event.stopPropagation();
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
        </>
    );
}

function SvgCanvas({ viewBox, viewBoxStroke }: { viewBox: ViewBox; viewBoxStroke: number; }) {
    const [svg] = useAtom(svgAtom);
    const pathPoints = svg.targetLocations();
    const cpPoints = svg.controlLocations();

    const setActivePathPt = useUpdateAtom(activePathPointAtom);
    const setActiveCpPt = useUpdateAtom(activeCpPointAtom);

    return (
        <svg viewBox={viewBox.join(" ")}>
            <BackgroundGrid x={viewBox[0]} y={viewBox[1]} onClick={() => { setActivePathPt(-1); setActiveCpPt(-1); }} />

            <path d={svg.asString()} fill="#94a3b830" stroke="white" strokeWidth={viewBoxStroke} />

            <g className="cpPts">
                {cpPoints.map((pt, idx) => (
                    <ControlPoint svgItem={svg.path[idx]} pt={pt} stroke={viewBoxStroke} idx={idx} key={idx} />
                ))}
            </g>

            <g className="pathPts">
                {pathPoints.map((pt, idx) => (
                    <TargetPoint svgItem={svg.path[idx]} pt={pt} stroke={viewBoxStroke} idx={idx} key={idx} />
                ))}
            </g>
        </svg>
    );
}

const CanvasControlsPanelMemo = React.memo(CanvasControlsPanel);

export function PathCanvas() {
    const { viewBox, viewBoxStroke, ref, parentRef, onWheel, } = useContainerZoom();
    return (
        <div ref={mergeRef(ref, parentRef)} className="absolute w-full h-full overflow-hidden" onWheel={onWheel}>
            {/* <svg className="absolute -z-10 w-full h-full">
                <BackgroundGrid x={viewBox[0]} y={viewBox[1]} />
            </svg> */}
            <SvgCanvas viewBox={viewBox} viewBoxStroke={viewBoxStroke} />
            <CanvasControlsPanelMemo />
        </div>
    );
}
