import { atom, PrimitiveAtom, SetStateAction, useAtom, WritableAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import React, { useEffect } from "react";
import { useDebounce, useHoverDirty } from "react-use";
import atomWithCallback, { OnValueChange } from "../../hooks/atomsX";
import { activePointAtom, editorActivePointAtom, editorHoverPointAtom, hoverPointAtom, svgAtom, updateRowTypeAtom, updateRowValuesAtom } from "../../store/store";
import { SvgItem } from "../../svg/svg";
import { getTooltip, getvalueToPoint } from "../../svg/svg-utils";
import { IconMenu } from "../UI/icons/Icons";

function PointName({ command, abs, onClick }: { command: string; abs: boolean; onClick: () => void; }) {
    return (
        <label
            className={`flex-0 w-5 h-5 leading-3 text-xs flex items-center justify-center rounded-l-[0.2rem] text-center text-slate-900 ${abs ? 'bg-slate-500' : 'bg-slate-400'} cursor-pointer select-none`}
            onClick={onClick}
        >
            <div className="">{command}</div>
        </label>
    );
}

function PointValue({ atom, tooltip, firstRow, isActivePt, isHoverPt, editorIdx }: { atom: PrimitiveAtom<number>; tooltip: string; firstRow: boolean; isActivePt: boolean; isHoverPt: boolean; editorIdx: [number, number]; }) {
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

    const setEditorActivePt = useUpdateAtom(editorActivePointAtom);
    const setEditorHoverPt = useUpdateAtom(editorHoverPointAtom);

    const rowContainerRef = React.useRef(null);
    const isHovering = useHoverDirty(rowContainerRef);

    React.useEffect(() => {
        setEditorHoverPt(isHovering ? editorIdx : null);
    }, [isHovering]);

    function onBlur() {
        resetInvalid();
        setEditorActivePt(null);
    }

    return (
        <label
            className={`relative flex-1 w-[2.4rem] h-5 rounded-tl-sm bg-slate-200 text-slate-900 focus-within:text-blue-500 flex ${isActivePt ? 'bg-blue-300' : isHoverPt ? 'bg-slate-400/40' : ''}`}
            ref={rowContainerRef}
        >
            {/* value */}
            <input
                className={`px-px pt-0.5 w-full h-full text-[10px] text-center tracking-tighter focus:outline-none ${isActivePt ? 'text-blue-900 bg-[#fff5] border-blue-300' : isHoverPt ? 'bg-slate-200 border-slate-400/40' : ''} border-b-2 focus:border-blue-500  cursor-default focus:cursor-text`}
                value={local}
                onChange={(event) => convertToNumber(event.target.value)}
                onFocus={() => setEditorActivePt(editorIdx)}
                onBlur={onBlur}
            />

            {/* tooltip */}
            {isActivePt && isHovering &&
                <div className={`mini-tooltip ${firstRow ? 'tooltip-up' : 'tooltip-down'} absolute min-w-[1.75rem] py-0.5 left-1/2 -translate-x-1/2 ${firstRow ? 'top-[calc(100%+4px)]' : '-top-[calc(100%+4px)]'} text-xs text-center text-slate-100 bg-slate-400 rounded z-10`}>
                    {tooltip}
                </div>
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

    useEffect(() => {
        setRowAtoms(createRowAtoms(svgItem.values, onAtomChange));
    }, [...svgItem.values]);

    const updateRowType = useUpdateAtom(updateRowTypeAtom);
    const onCommandNameClick = () => updateRowType({ item: svgItem, isRelative: !svgItem.relative });

    const [activePoint, setActivePoint] = useAtom(activePointAtom);
    const isActivePt = activePoint === svgItemIdx;

    const rowContainerRef = React.useRef(null);
    const isHovering = useHoverDirty(rowContainerRef);
    const [isHoveringDebounced, setIsHoveringDebounced] = React.useState(false);
    useDebounce(() => {
        setIsHoveringDebounced(isHovering);
    }, 60, [isHovering]);

    const [hoverPoint, setHoverPoint] = useAtom(hoverPointAtom);
    const isHoverPt = hoverPoint === svgItemIdx;
    React.useEffect(() => {
        setHoverPoint(isHovering ? svgItemIdx : -1);
    }, [isHoveringDebounced]);

    return (<>
        <div
            ref={rowContainerRef}
            className={`px-1 flex items-center justify-between ${isActivePt ? 'bg-blue-300' : isHoverPt ? 'bg-slate-400/40' : ''}`}
            onClick={() => setActivePoint(svgItemIdx)}
            onFocus={() => setActivePoint(svgItemIdx)}
        >
            {/* Values */}
            <div className="flex items-center justify-items-start font-mono space-x-0.5">
                <PointName
                    command={svgItem.getType()}
                    abs={!svgItem.relative}
                    onClick={onCommandNameClick}
                />

                {rowAtoms.map((atom, idx) => (
                    <PointValue
                        atom={atom}
                        tooltip={getTooltip(svgItem.getType(), idx)}
                        firstRow={svgItemIdx === 0}
                        isActivePt={isActivePt}
                        isHoverPt={isHoverPt}
                        editorIdx={[svgItemIdx, getvalueToPoint(svgItem.getType(), idx)]}
                        key={idx}
                    />
                ))}
            </div>

            {/* Menu */}
            <button className="flex-0 mt-0.5 active:scale-[.97]" tabIndex={-1}>
                <IconMenu className="w-4 h-4" />
            </button>
        </div>
    </>);
}

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
