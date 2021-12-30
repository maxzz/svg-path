import React from 'react';
import { mergeRef } from '../../hooks/utils';
import { useAtom } from 'jotai';
import { activePointAtom, hoverPointAtom, showGridAtom, svgAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { SvgControlPoint, SvgItem, SvgPoint } from '../../svg/svg';
import { BackgroundGrid } from './BackgroundGrid';
import CanvasControlsPanel from './CanvasControlsPanel';
import { ViewBox } from '../../svg/svg-utils';
import { useUpdateAtom } from 'jotai/utils';

function ptClassNames<K extends 'circle'>(active: boolean, hover: boolean, key: K) {
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
    const [activePt, setActivePt] = useAtom(activePointAtom);
    const [hoverPt, setHoverPt] = useAtom(hoverPointAtom);

    const active = activePt === idx;
    const hover = hoverPt === idx;

    return (
        <>
            {(active || hover) &&
                <path className="stroke-[red] fill-[none]" strokeWidth={stroke} d={svgItem.asStandaloneString()} />
            }
            <circle
                className={ptClassNames(active, hover, 'circle')}
                style={{ stroke: 'transparent' }}
                cx={pt.x} cy={pt.y} r={stroke * 3} strokeWidth={stroke * 12}
                onMouseEnter={(event) => {
                    event.stopPropagation();
                    setHoverPt(idx);
                }}
                onMouseLeave={(event) => {
                    setHoverPt(-1);
                }}
                onClick={() => {
                    setActivePt(idx);
                }}
            />
        </>
    );
}

//TODO: add point transparent border for ease mouse pointing

function ControlPoint({ pt, stroke, idx }: { pt: SvgControlPoint, stroke: number; idx: number; }) {
    const [activePt, setActivePt] = useAtom(activePointAtom);
    const [hoverPt, setHoverPt] = useAtom(hoverPointAtom);

    const active = activePt === idx;
    const hover = hoverPt === idx;

    return (
        <>
            {pt.relations.map((rel, idx) => (
                <line
                    className="stroke-[#fff7]"
                    x1={pt.x} y1={pt.y} x2={rel.x} y2={rel.y} strokeWidth={stroke} key={idx}
                />
            ))}
            <circle
                className={ptClassNames(active, hover, 'circle')}
                style={{ stroke: 'transparent' }}
                cx={pt.x} cy={pt.y} r={stroke * 3} strokeWidth={stroke * 12}
                onMouseEnter={(event) => {
                    event.stopPropagation();
                    setHoverPt(idx);
                }}
                onMouseLeave={(event) => {
                    setHoverPt(-1);
                }}
                onClick={() => {
                    setActivePt(idx);
                }}
            />
        </>
    );
}

const cpToTargetIdx = (targetLocations: SvgPoint[], ref: SvgItem) => targetLocations.findIndex((pt) => pt.itemReference === ref);

function SvgCanvas({ viewBox, viewBoxStroke }: { viewBox: ViewBox; viewBoxStroke: number; }) {
    const [svg] = useAtom(svgAtom);
    const pathPoints = svg.targetLocations();
    const cpPoints = svg.controlLocations();
    const setActivePt = useUpdateAtom(activePointAtom);
    return (
        <svg viewBox={viewBox.join(" ")}>
            <BackgroundGrid x={viewBox[0]} y={viewBox[1]} onClick={() => setActivePt(-1)} />

            <path d={svg.asString()} fill="#94a3b830" stroke="white" strokeWidth={viewBoxStroke} />

            <g className="cpPts">
                {cpPoints.map((pt, idx) => (
                    <ControlPoint pt={pt} stroke={viewBoxStroke} idx={cpToTargetIdx(pathPoints, pt.itemReference)} key={idx} />
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
