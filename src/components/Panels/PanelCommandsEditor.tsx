import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { doSetStateAtom, svgEditRootAtom, SvgItemEdit, SvgItemEditState } from "../../store/store";
import { useDebounce, useHoverDirty } from "react-use";
import { IconMenu } from "../UI/icons/Icons";
import { getTooltip, getValueToPoint } from "../../svg/svg-utils";
import { useNumberInput } from "../../hooks/useNumberInput";
import { doTrace } from "../../utils/debugging";
import "../UI/pathcommands-tooltip.scss";
import { classNames } from "../../utils/classnames";

function RowCommandName({ svgItemEdit }: { svgItemEdit: SvgItemEdit; }) {
    const itemType = useAtomValue(svgItemEdit.typeAtom);
    const [isRel, setIsRel] = useAtom(svgItemEdit.isRelAtom);
    return (
        <label
            className={`flex-0 w-5 h-5 leading-3 text-xs flex items-center justify-center rounded-l-[0.2rem] text-center text-slate-900 ${!isRel ? 'bg-slate-500' : 'bg-slate-400'} cursor-pointer select-none`}
            onClick={() => setIsRel(v => !v)}
        >
            <div className="">{itemType}</div>
        </label>
    );
}

function MiniTooltip({ tooltip, isFirstRow }: { tooltip: string, isFirstRow: boolean; }) {
    return (
        <div className={`mini-tooltip ${isFirstRow ? 'tooltip-down' : 'tooltip-up'} text-xs text-slate-100 bg-slate-400 rounded z-10`}>
            {tooltip}
        </div>
    );
}

function ValueArcOption({ atom, isFirstRow, isActiveRow, isHoverRow, svgItemIdx, debugIdx, stateAtom }: {
    atom: PrimitiveAtom<number>;

    isFirstRow: boolean;
    isActiveRow: boolean;
    isHoverRow: boolean;

    svgItemIdx: number;
    stateAtom: PrimitiveAtom<SvgItemEditState>;
    debugIdx: number;
}) {
    const [value, setValue] = useAtom(atom);

    const editorIdx = [svgItemIdx, getValueToPoint('a', debugIdx)];

    const setState = useUpdateAtom(doSetStateAtom);
    const editContainerRef = React.useRef(null);
    const isHovering = useHoverDirty(editContainerRef);
    React.useEffect(() => setState({ atom: stateAtom, states: { hoverEd: isHovering ? editorIdx[1] : -1 } }), [isHovering]);

    return (
        <div className="relative pb-1">
            <input
                type="checkbox"
                className={`w-3 h-3 rounded text-slate-500 bg-slate-300 focus:ring-slate-500 focus:ring-offset-1 focus:ring-1 focus:outline-none`}
                ref={editContainerRef}
                checked={!!value}
                onChange={() => setValue(value ? 0 : 1)}
            />
            {/* tooltip */}
            {isActiveRow && isHovering && <MiniTooltip tooltip={getTooltip('a', debugIdx)} isFirstRow={isFirstRow} />}
        </div>
    );
}

function ValueArcOptions(props: {
    atomA: PrimitiveAtom<number>;
    atomB: PrimitiveAtom<number>;

    isFirstRow: boolean;
    isActiveRow: boolean;
    isHoverRow: boolean;

    svgItemIdx: number;
    stateAtom: PrimitiveAtom<SvgItemEditState>;
}) {
    const { atomA, atomB, ...rest } = props;
    return (
        <label className="px-0.5 flex items-center space-x-0.5">
            <ValueArcOption atom={atomA} {...rest} debugIdx={3} />
            <ValueArcOption atom={atomB} {...rest} debugIdx={4} />
        </label>
    );
}

function ValueInput({ atom, isFirstRow, isActiveRow, isHoverRow, editorIdx, debugIdx, stateAtom, tooltip }: {
    atom: PrimitiveAtom<number>;
    isFirstRow: boolean;
    isActiveRow: boolean;
    isHoverRow: boolean;
    editorIdx: [number, number];
    debugIdx: number;
    stateAtom: PrimitiveAtom<SvgItemEditState>;
    tooltip: string;
}) {
    doTrace && console.log(`%c ------ render single edit [${editorIdx}].[${debugIdx}] enter`, 'color: #bbf5');

    const [value, setValue] = useAtom(atom);
    const { onBlur: onBlurInput, ...bindRest } = useNumberInput(value, (v) => setValue(v));

    const setState = useUpdateAtom(doSetStateAtom);

    const editContainerRef = React.useRef(null);
    const isHovering = useHoverDirty(editContainerRef);

    React.useEffect(() => {
        //if (editContainerRef.current) {
        doTrace && console.log(`%cValueInput useEffect[isHovering] [${editorIdx}].[${debugIdx}]  single edit hovering=${isHovering} labelRef=${editContainerRef.current ? 'exist' : 'null'}`, 'color: #bbf5');

        setState({ atom: stateAtom, states: { hoverEd: isHovering ? editorIdx[1] : -1 } });
        //}
    }, [isHovering]);

    doTrace && console.log(`%c ------ render single edit [${editorIdx}].[${debugIdx}] done: hovering=${isHovering} labelRef=${editContainerRef.current ? 'exist' : 'null'} value=${value}`, 'color: #bbf5');

    return (
        <label
            className={classNames(
                `relative flex-1 w-[2.4rem] h-5 rounded-tl-sm bg-slate-200 text-slate-900 focus-within:text-blue-500 flex`,
                `${isActiveRow ? 'bg-blue-300' : isHoverRow ? 'bg-slate-400/40' : ''}`,
            )}
            ref={editContainerRef}
        >
            {doTrace && console.log(`%c ------ render single edit [${editorIdx}].[${debugIdx}] %c..... from render tree`, 'color: 1#bbf1', 'color: #bbf1')}
            {/* value */}
            <input
                className={`px-px pt-0.5 w-full h-full text-[10px] text-center tracking-tighter focus:outline-none ${isActiveRow ? 'text-blue-900 bg-[#fff5] border-blue-300' : isHoverRow ? 'bg-slate-200 border-slate-400/40' : ''} border-b-2 focus:border-blue-500  cursor-default focus:cursor-text`}
                {...bindRest}
                onFocus={() => setState({ atom: stateAtom, states: { activeEd: editorIdx[1] } })}
                onBlur={() => (onBlurInput(), setState({ atom: stateAtom, states: { activeEd: -1 } }))}
            />
            {/* tooltip */}
            {isActiveRow && isHovering && <MiniTooltip tooltip={tooltip} isFirstRow={isFirstRow} />}
        </label>
    );
}

// function ValueInput({ atom, isFirstRow, isActivePt, isHoverPt, editorIdx, debugIdx, stateAtom, tooltip }: {
//     atom: PrimitiveAtom<number>;
//     isFirstRow: boolean;
//     isActivePt: boolean;
//     isHoverPt: boolean;
//     editorIdx: [number, number];
//     debugIdx: number;
//     stateAtom: PrimitiveAtom<SvgItemEditState>;
//     tooltip: string;
// }) {
//     doTrace && console.log(`%c ------ render single edit [${editorIdx}].[${debugIdx}] enter`, 'color: #bbf5');

//     const [value, setValue] = useAtom(atom);
//     const [local, setLocal] = React.useState('' + value);
//     React.useEffect(() => setLocal('' + value), [value]);

//     const setState = useUpdateAtom(doSetStateAtom);

//     const editContainerRef = React.useRef(null);
//     const isHovering = useHoverDirty(editContainerRef);

//     React.useEffect(() => {
//         //if (editContainerRef.current) {
//         doTrace && console.log(`%cValueInput useEffect[isHovering] [${editorIdx}].[${debugIdx}]  single edit hovering=${isHovering} labelRef=${editContainerRef.current ? 'exist' : 'null'}`, 'color: #bbf5');

//         setState({ atom: stateAtom, states: { hoverEd: isHovering ? editorIdx[1] : -1 } });
//         //}
//     }, [isHovering]);

//     function onBlur() {
//         resetInvalid();
//         setState({ atom: stateAtom, states: { activeEd: -1 } });
//     }

//     doTrace && console.log(`%c ------ render single edit [${editorIdx}].[${debugIdx}] done: hovering=${isHovering} labelRef=${editContainerRef.current ? 'exist' : 'null'} value=${value}`, 'color: #bbf5');

//     return (
//         <label
//             className={`relative flex-1 w-[2.4rem] h-5 rounded-tl-sm bg-slate-200 text-slate-900 focus-within:text-blue-500 flex ${isActivePt ? 'bg-blue-300' : isHoverPt ? 'bg-slate-400/40' : ''}`}
//             ref={editContainerRef}
//         >
//             {doTrace && console.log(`%c ------ render single edit [${editorIdx}].[${debugIdx}] %c..... from render tree`, 'color: #bbf1', 'color: #bbf1')}
//             {/* value */}
//             <input
//                 className={`px-px pt-0.5 w-full h-full text-[10px] text-center tracking-tighter focus:outline-none ${isActivePt ? 'text-blue-900 bg-[#fff5] border-blue-300' : isHoverPt ? 'bg-slate-200 border-slate-400/40' : ''} border-b-2 focus:border-blue-500  cursor-default focus:cursor-text`}
//                 value={local}
//                 onChange={(event) => convertToNumber(event.target.value)}
//                 onFocus={() => setState({ atom: stateAtom, states: { activeEd: editorIdx[1] } })}
//                 onBlur={onBlur}
//             />
//             {/* tooltip */}
//             {isActivePt && isHovering &&
//                 <div className={`mini-tooltip ${isFirstRow ? 'tooltip-up' : 'tooltip-down'} absolute min-w-[1.75rem] py-0.5 left-1/2 -translate-x-1/2 ${isFirstRow ? 'top-[calc(100%+4px)]' : '-top-[calc(100%+4px)]'} text-xs text-center text-slate-100 bg-slate-400 rounded z-10`}>
//                     {tooltip}
//                 </div>
//             }
//         </label>
//     );

//     function convertToNumber(s: string) {
//         s = cleanupValueFloat(s);
//         setLocal(s);
//         const v = +s;
//         s && !isNaN(v) && setValue(v);
//     }
//     function resetInvalid() {
//         (!local || isNaN(+local)) && setLocal('' + value);
//     }
// }

function CommandRow({ svgItemEdit }: { svgItemEdit: SvgItemEdit; }) {

    const svgItemIdx = svgItemEdit.svgItemIdx;
    const stateAtom = svgItemEdit.stateAtom;

    const itemType = useAtomValue(svgItemEdit.typeAtom);

    const setState = useUpdateAtom(doSetStateAtom);
    const state = useAtomValue(stateAtom);

    const isActiveRow = state.activeRow;
    const isHoverRow = state.hoverRow;

    const rowContainerRef = React.useRef(null);
    const isHovering = useHoverDirty(rowContainerRef);
    const [isHoveringDebounced, setIsHoveringDebounced] = React.useState(false);
    useDebounce(() => setIsHoveringDebounced(isHovering), 100, [isHovering]);

    React.useEffect(() => {
        doTrace && console.log(`%cRow useEffect[isHovering] [${svgItemIdx}  ] row hover debounced value = ${isHoveringDebounced} ref=${rowContainerRef.current ? 'exist' : 'null'}`, 'color: #bbf8');

        setState({ atom: stateAtom, states: { hoverRow: isHovering } });
    }, [isHoveringDebounced]);

    doTrace && console.log(`%c ====== render Row [${svgItemIdx}  ] hovering=${isHovering} ref=${rowContainerRef.current ? 'exist' : 'null'}`, 'color: #bbf5');

    return (<>
        <div
            ref={rowContainerRef}
            className={`px-1.5 flex items-center justify-between ${isActiveRow ? 'bg-blue-300' : isHoverRow ? 'bg-slate-400/40' : ''}`}
            onClick={() => {
                doTrace && console.log('%c[${svgItemIdx}  ] state on click', 'color: #528');
                setState({ atom: stateAtom, states: { activeRow: true } });
            }}
            onFocus={() => {
                doTrace && console.log('%c[${svgItemIdx}  ] state on focus', 'color: #528');
                setState({ atom: stateAtom, states: { activeRow: true } });
            }}
        >
            {/* Values */}
            <div className="flex items-center justify-items-start font-mono space-x-0.5">
                <RowCommandName svgItemEdit={svgItemEdit} />

                {svgItemEdit.valueAtoms.map((atom, idx) => {
                    return idx === 3
                        ? null
                        : idx === 4
                            ? <ValueArcOptions
                                atomA={svgItemEdit.valueAtoms[3]}
                                atomB={atom}
                                isFirstRow={svgItemIdx === 0}
                                isActiveRow={isActiveRow}
                                isHoverRow={isHoverRow}
                                svgItemIdx={svgItemIdx}
                                stateAtom={stateAtom}
                                key={idx}
                            />
                            : <ValueInput
                                atom={atom}
                                isFirstRow={svgItemIdx === 0}
                                isActiveRow={isActiveRow}
                                isHoverRow={isHoverRow}
                                editorIdx={[svgItemIdx, getValueToPoint(itemType, idx)]}
                                debugIdx={idx}
                                stateAtom={stateAtom}
                                tooltip={getTooltip(itemType, idx)}
                                key={idx}
                            />;
                }
                )}
            </div>

            {/* Menu */}
            <button className="flex-0 mt-0.5 active:scale-[.97]" tabIndex={-1} aria-label="sub-menu">
                <IconMenu className="w-4 h-4" />
            </button>
        </div>
    </>);
}

export function PathCommandEditor() {
    const SvgEditRoot = useAtomValue(svgEditRootAtom);
    const edits = SvgEditRoot.edits;
    doTrace && console.log('=============== PathCommandEditor render rows (only on SvgEditRoot change) ===============');
    return (
        <div className="my-1 py-0.5 space-y-0.5">
            {edits.map((svgItemEdit, idx) => (
                <CommandRow svgItemEdit={svgItemEdit} key={idx} />
            ))}
        </div >
    );
}

//TODO: arc
//TODO: z point overlaps prev point and makes prev point unselectable
