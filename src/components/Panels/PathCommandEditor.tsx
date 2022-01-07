import { atom, PrimitiveAtom, SetStateAction, useAtom, WritableAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import React, { useEffect } from "react";
import { useHoverDirty } from "react-use";
import atomWithCallback, { OnValueChange } from "../../hooks/atomsX";
import { activePointAtom, hoverPointAtom, svgAtom, updateRowTypeAtom, updateRowValuesAtom } from "../../store/store";
import { SvgItem } from "../../svg/svg";
import { getTooltip } from "../../svg/svg-utils";
import { IconMenu } from "../UI/icons/Icons";

function PointName({ command, abs, onClick }: { command: string; abs: boolean; onClick: () => void; }) {
    return (
        <label
            className={`flex-0 w-5 h-5 leading-3 text-xs flex items-center justify-center rounded-l-[0.2rem] text-center text-slate-900 ${abs ? 'bg-slate-500' : 'bg-slate-400'} cursor-pointer select-none`}
            onClick={onClick}
        >
            {/* <input className="px-1 w-full text-xs text-center text-slate-900 bg-slate-500 focus:outline-none" defaultValue={"M"} /> */}
            <div className="">{command}</div>
        </label>
    );
}

function PointValue({ atom, tooltip, first, isActivePt, isHoverPt }: { atom: PrimitiveAtom<number>; tooltip: string; first: boolean; isActivePt: boolean; isHoverPt: boolean; }) {
    const [value, setValue] = useAtom(atom);
    const [local, setLocal] = React.useState('' + value);
    React.useEffect(() => setLocal('' + value), [value]);

    function convertToNumber(s: string) {
        s = s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, ''); //replace unicode-arabic-decimal-separator and remove non-float chars.
        setLocal(s);
        const v = +s;
        s && !isNaN(v) && setValue(v);
    }

    function resetInvalid() {
        (!local || isNaN(+local)) && setLocal('' + value);
    }

    const rowContainerRef = React.useRef(null);
    const isHovering = useHoverDirty(rowContainerRef);

    return (
        <label
            className={`relative flex-1 w-[2.4rem] h-5 rounded-tl-sm bg-slate-200 text-slate-900 focus-within:text-blue-500 flex ${isActivePt ? 'bg-blue-300' : ''}`}
            ref={rowContainerRef}
        >
            {/* value */}
            <input
                className={
                    `px-px pt-0.5 w-full h-full text-[10px] text-center tracking-tighter focus:outline-none
                    ${isActivePt ? 'text-blue-900 bg-[#fff5] border-blue-300' : ''} 
                    border-b-2 focus:border-blue-500 bg-slate-200
                    cursor-default focus:cursor-text
                    `
                }
                value={local}
                onChange={(event) => convertToNumber(event.target.value)}
                onBlur={resetInvalid}
            />

            {/* tooltip */}
            {isHovering &&
                <div className={`mini-tooltip ${first ? 'tooltip-up' : 'tooltip-down'} absolute min-w-[1.75rem] py-0.5 left-1/2 -translate-x-1/2
                ${first ? 'top-[calc(100%+4px)]' : '-top-[calc(100%+4px)]'} text-xs text-center text-slate-100 bg-slate-400 rounded z-10
                `
                }>{tooltip}</div>
            }
        </label>
    );
}

const createRowAtoms = (values: number[], monitor: OnValueChange<number>) => values.map((value) => atomWithCallback(value, monitor));

function CommandRow({ svgItem, svgItemIdx }: { svgItem: SvgItem; svgItemIdx: number; }) {

    const rowAtomRef = React.useRef(atom<WritableAtom<number, SetStateAction<number>>[]>([]));
    const [rowAtoms, setRowAtoms] = useAtom(rowAtomRef.current);

    const updateRowValues = useUpdateAtom(updateRowValuesAtom);
    const onAtomChange = React.useCallback<OnValueChange<number>>(({ get }) => {
        updateRowValues({ item: svgItem, values: get(rowAtomRef.current).map(atomValue => get(atomValue)) });
    }, []);

    useEffect(() => setRowAtoms(createRowAtoms(svgItem.values, onAtomChange)), [svgItem]);

    const updateRowType = useUpdateAtom(updateRowTypeAtom);
    const onCommandNameClick = () => updateRowType({ item: svgItem, isRelative: !svgItem.relative });

    const [activePoint, setActivePoint] = useAtom(activePointAtom);
    const isActivePt = activePoint === svgItemIdx;

    const rowContainerRef = React.useRef(null);
    const isHovering = useHoverDirty(rowContainerRef);

    const [hoverPoint, setHoverPoint] = useAtom(hoverPointAtom);
    const isHoverPt = hoverPoint === svgItemIdx;
    React.useEffect(() => { setHoverPoint(isHovering ? svgItemIdx : -1); }, [isHovering]);

    return (<>
        <div
            ref={rowContainerRef}
            className={`px-1 flex items-center justify-between ${isActivePt ? 'bg-blue-300' : isHoverPt ? 'bg-blue-400/20' : ''}`}
            onClick={() => setActivePoint(svgItemIdx)}
        >
            {/* Values */}
            <div className="flex items-center justify-items-start font-mono space-x-0.5">
                <PointName command={svgItem.getType()} abs={!svgItem.relative} onClick={onCommandNameClick} />

                {rowAtoms.map((atom, idx) => (
                    <PointValue atom={atom} tooltip={getTooltip(svgItem.getType(), idx)} first={svgItemIdx === 0} isActivePt={isActivePt} isHoverPt={isHoverPt} key={idx} />
                ))}
            </div>

            {/* Menu */}
            <button className="flex-0 mt-0.5 active:scale-[.97]">
                <IconMenu className="w-4 h-4" />
            </button>
        </div>
    </>);
}

//M61.27.5c45.13.16 68.384 25.592 96.354 57.072 27.98 31.47 41.564 54.925 75.536 54.478 33.972-.447 50.78-22.13 50.78-50.78 0-28.65-14.587-51.595-50.78-50.77-36.193.825-60.4 17.052-88.2 47.072-27.8 30.01-40.15 64.308-83.68 64.478C17.74 122.21.5 89.93.5 61.28.5 32.63 16.14.34 61.27.5z
//M61.27.5 C17.74 122.21.5 89.93.5 61.28.5 32.63 16.14.34 61.27.5

export function PathCommandEditor() {
    const [svg] = useAtom(svgAtom);
    return (
        <div className="my-1 space-y-0.5">
            {svg.path.map((svgItem, idx) => (
                <CommandRow svgItem={svgItem} svgItemIdx={idx} key={idx} />
            ))}
        </div >
    );
}

//TODO: switch to grid (first row width problem)
//TODO: check scale when only one 'm' command
//TODO: minify output
//TODO: path operations: make the path abs/rel
//TODO: path operations: translate, scale, round
//TODO: grid: preview
//TODO: unde/redo
//TODO: zoom buttons: -/+/fit
