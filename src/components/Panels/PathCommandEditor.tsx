import { atom, PrimitiveAtom, SetStateAction, useAtom, WritableAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import React, { useEffect } from "react";
import { useDebounce, useHoverDirty } from "react-use";
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
            className={`relative flex-1 w-[2.4rem] h-5 rounded-tl-sm bg-slate-200 text-slate-900 focus-within:text-blue-500 flex 
                ${isActivePt ? 'bg-blue-300' : isHoverPt ? 'bg-slate-400/40' : ''}`
            }
            ref={rowContainerRef}
        >
            {/* value */}
            <input
                className={
                    `px-px pt-0.5 w-full h-full text-[10px] text-center tracking-tighter focus:outline-none
                    ${isActivePt ? 'text-blue-900 bg-[#fff5] border-blue-300' : isHoverPt ? 'bg-slate-200 border-slate-400/40' : ''} 
                    border-b-2 focus:border-blue-500 
                    cursor-default focus:cursor-text
                    `
                }
                value={local}
                onChange={(event) => convertToNumber(event.target.value)}
                onBlur={resetInvalid}
            />

            {/* tooltip */}
            {isActivePt && isHovering &&
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
    const [isHoveringDebounced, setIsHoveringDebounced] = React.useState(false);
    useDebounce(() => { setIsHoveringDebounced(isHovering); }, 60, [isHovering]);

    const [hoverPoint, setHoverPoint] = useAtom(hoverPointAtom);
    const isHoverPt = hoverPoint === svgItemIdx;
    React.useEffect(() => { setHoverPoint(isHovering ? svgItemIdx : -1); }, [isHoveringDebounced]);

    return (<>
        <div
            ref={rowContainerRef}
            className={`px-1 flex items-center justify-between ${isActivePt ? 'bg-blue-300' : isHoverPt ? 'bg-slate-400/40' : ''}`}
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
//M 61.27 0.5 c -43.53 121.71 -60.77 89.43 -60.77 60.78 c 0 -28.65 15.64 -60.94 60.77 -60.78 c 0 -28.65 15.64 -60.94 60.77 -60.78 c 0 -28.65 15.64 -60.94 60.77 -60.78
//M 5 0 C 8.6104 0.0128 10.4707 2.0474 11 10 C 14 7 14 10 18 10 C 22 10 22.8008 6.8296 22.8008 4.5376 C 22.8008 2.2456 21 0 19 0 c -2 0 -5 -1 -8 5 C 9 8 9 10 5 10 C 1 10 0 6 0 3 C 0 -2 1 -4 5 -11 Z
//M 5 0 C 8.6 0 10 2 11 10 C 14 7 14 10 18 10 C 22 10 22 6 22 4 C 22 2.3 21 0 19 0 c -2 0 -5 -1 -8 5 C 9 8 9 10 1 15 C 1 10 0 6 0 3 C 0 -2 1 -4 5 -11 Z

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
//TODO: history: unde/redo
//TODO: zoom buttons: -/+/fit
