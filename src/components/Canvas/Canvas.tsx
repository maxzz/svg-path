import React from 'react';
import { atom, useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { mergeRef } from '../../hooks/utils';
import { activePointAtom, canvasStrokeAtom, containerRefAtom, pathUnsafeAtom, svgAtom, viewBoxAtom } from '../../store/store';
import { useContainerZoom } from './useContainerZoom';
import { Svg, SvgControlPoint, SvgItem, SvgPoint } from '../../svg/svg';
import { CanvasControlsPanel } from './CanvasControlsPanel';
import { ViewBox } from '../../svg/svg-utils-viewport';
import { ControlPoint, SvgPointMouseDown, TargetPoint } from './CanvasPoints';
import { CanvasTicks } from './CanvasTicks';

const cpToTargetIdx = (targetLocations: SvgPoint[], ref: SvgItem) => targetLocations.findIndex((pt) => pt.itemReference === ref);

function SvgCanvas() {

    const [viewBox] = useAtom(viewBoxAtom);
    const [canvasStroke] = useAtom(canvasStrokeAtom);

    const [svg, setSvg] = useAtom(svgAtom);
    const pathPoints = svg.targetLocations();
    const cpPoints = svg.controlLocations();

    const setActivePt = useUpdateAtom(activePointAtom);

    const mouseDownEv = React.useRef<MouseEvent | null>(null);

    function onMouseDown(event: React.MouseEvent) {
        mouseDownEv.current = event.nativeEvent;
        setActivePt(-1);
        //console.log('onMouseDown', event.target);
    }

    function onMouseUp(event: React.MouseEvent) {
        svgPointMouseDown.current = null;
        //console.log('onMouseUp', event.target);
        //console.log('onMouseUp', svgPointMouseDown.current);
    }

    const setPathUnsafe = useUpdateAtom(pathUnsafeAtom);
    const svgPrevRef = React.useRef<Svg>();
    React.useEffect(() => {
        svgPrevRef.current = svg;
    }, [svg]);

    function onMouseMove(event: React.MouseEvent) {
        if (svgPointMouseDown.current && containerRef) {
            //console.log('onMouseMove', event.target);
            //console.log('onMouseMove', svgPointMouseDown.current);

            const pt = getEventPt(containerRef, event.clientX, event.clientY);
            //console.log('move', pt.x, pt.y);

            if (svgPrevRef.current) {
                // svgPrevRef.current.setLocation((svgPointMouseDown.current.pt || svgPointMouseDown.current.cpt) as SvgPoint, pt);
                // const newSvg = new Svg();
                // newSvg.path = svgPrevRef.current.path;
                // setSvg(newSvg);

                svg.setLocation((svgPointMouseDown.current.pt || svgPointMouseDown.current.cpt) as SvgPoint, pt);
                const newSvg = new Svg();
                newSvg.path = svg.path;
                setSvg(newSvg);

                // setPathUnsafe(svgPrevRef.current.asString());
            }
        }
    }

    const svgPointMouseDown = React.useRef<SvgPointMouseDown | null>(null);

    const [containerRef] = useAtom(containerRefAtom);

    function getEventPt(containerRef: HTMLElement, eventClientX: number, eventClientY: number) {
        const canvasRect = containerRef.getBoundingClientRect();
        let [viewBoxX, viewBoxY] = viewBox;
        const x = viewBoxX + (eventClientX - canvasRect.x) * canvasStroke;
        const y = viewBoxY + (eventClientY - canvasRect.y) * canvasStroke;
        return { x, y };
    }

    function onPointClick(ev: SvgPointMouseDown) {
        svgPointMouseDown.current = ev;
        console.log(ev);
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
                    <ControlPoint pt={pt} stroke={canvasStroke} idx={cpToTargetIdx(pathPoints, pt.itemReference)} clk={onPointClick} key={idx} />
                ))}
            </g>

            <g className="pathPts">
                {pathPoints.map((pt, idx) => (
                    <TargetPoint svgItem={svg.path[idx]} pt={pt} stroke={canvasStroke} idx={idx} clk={onPointClick} key={idx} />
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
