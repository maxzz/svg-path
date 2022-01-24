import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { doSetStateAtom, svgEditRootAtom, SvgItemEdit, SvgItemEditState } from "../../store/store";
import { useDebounce, useHoverDirty } from "react-use";
import { IconMenu } from "../UI/icons/Icons";
import { getTooltip, getvalueToPoint } from "../../svg/svg-utils";

function RowCommandName({ svgItemEdit }: { svgItemEdit: SvgItemEdit; }) {
    const [isRel, setIsRel] = useAtom(svgItemEdit.isRelAtom);
    const [itemType] = useAtom(svgItemEdit.typeAtom);
    return (
        <label
            className={`flex-0 w-5 h-5 leading-3 text-xs flex items-center justify-center rounded-l-[0.2rem] text-center text-slate-900 ${!isRel ? 'bg-slate-500' : 'bg-slate-400'} cursor-pointer select-none`}
            onClick={() => setIsRel(v => !v)}
        >
            <div className="">{itemType}</div>
        </label>
    );
}

function ValueInput({ atom, tooltip, firstRow, isActivePt, isHoverPt, editorIdx, stateAtom, debugIdx }: {
    atom: PrimitiveAtom<number>;
    tooltip: string;
    firstRow: boolean;
    isActivePt: boolean;
    isHoverPt: boolean;
    editorIdx: [number, number];
    stateAtom: PrimitiveAtom<SvgItemEditState>;
    debugIdx: number;
}) {
    console.log(`%c ------ render single edit [${editorIdx}].[${debugIdx}] enter`, 'color: #bbf5');

    const [value, setValue] = useAtom(atom);
    const [local, setLocal] = React.useState('' + value);
    React.useEffect(() => setLocal('' + value), [value]);

    const setState = useUpdateAtom(doSetStateAtom);

    const editContainerRef = React.useRef(null);
    const isHovering = useHoverDirty(editContainerRef);

    React.useEffect(() => {
        //if (editContainerRef.current) {
        console.log(`%cValueInput useEffect[isHovering] [${editorIdx}].[${debugIdx}]  single edit hovering=${isHovering} labelRef=${editContainerRef.current ? 'exist' : 'null'}`, 'color: #bbf5');

        setState({ atom: stateAtom, states: { hoverEd: isHovering ? editorIdx[1] : -1 } });
        //}
    }, [isHovering]);

    function onBlur() {
        resetInvalid();
        setState({ atom: stateAtom, states: { activeEd: -1 } });
    }

    console.log(`%c ------ render single edit [${editorIdx}].[${debugIdx}] done: hovering=${isHovering} labelRef=${editContainerRef.current ? 'exist' : 'null'} value=${value}`, 'color: #bbf5');

    return (
        <label
            className={`relative flex-1 w-[2.4rem] h-5 rounded-tl-sm bg-slate-200 text-slate-900 focus-within:text-blue-500 flex ${isActivePt ? 'bg-blue-300' : isHoverPt ? 'bg-slate-400/40' : ''}`}
            ref={editContainerRef}
        >
            {console.log(`%c ------ render single edit [${editorIdx}].[${debugIdx}] %c..... from render tree`, 'color: #bbf1', 'color: #bbf1')}
            {/* value */}
            <input
                className={`px-px pt-0.5 w-full h-full text-[10px] text-center tracking-tighter focus:outline-none ${isActivePt ? 'text-blue-900 bg-[#fff5] border-blue-300' : isHoverPt ? 'bg-slate-200 border-slate-400/40' : ''} border-b-2 focus:border-blue-500  cursor-default focus:cursor-text`}
                value={local}
                onChange={(event) => convertToNumber(event.target.value)}
                onFocus={() => setState({ atom: stateAtom, states: { activeEd: editorIdx[1] } })}
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

    function convertToNumber(s: string) {
        s = s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, ''); //replace unicode-arabic-decimal-separator and remove non-float chars.
        setLocal(s);
        const v = +s;
        s && !isNaN(v) && setValue(v);
    }
    function resetInvalid() {
        (!local || isNaN(+local)) && setLocal('' + value);
    }
}

function CommandRow({ svgItemEdit, svgItemIdx }: { svgItemEdit: SvgItemEdit; svgItemIdx: number; }) {
    const [itemType] = useAtom(svgItemEdit.typeAtom);

    const setState = useUpdateAtom(doSetStateAtom);
    const state = useAtomValue(svgItemEdit.stateAtom);
    const isActivePt = state.activeRow;
    const isHoverPt = state.hoverRow;

    const rowContainerRef = React.useRef(null);
    const isHovering = useHoverDirty(rowContainerRef);
    const [isHoveringDebounced, setIsHoveringDebounced] = React.useState(false);
    useDebounce(() => setIsHoveringDebounced(isHovering), 100, [isHovering]);

    React.useEffect(() => {
        console.log(`%cRow useEffect[isHovering] [${svgItemIdx}  ] row hover debounced value = ${isHoveringDebounced} ref=${rowContainerRef.current ? 'exist' : 'null'}`, 'color: #bbf8');

        setState({ atom: svgItemEdit.stateAtom, states: { hoverRow: isHovering } });
    }, [isHoveringDebounced]);

    console.log(`%c ====== render Row [${svgItemIdx}  ] hovering=${isHovering} ref=${rowContainerRef.current ? 'exist' : 'null'}`, 'color: #bbf5');

    return (<>
        <div
            ref={rowContainerRef}
            className={`px-1 flex items-center justify-between ${isActivePt ? 'bg-blue-300' : isHoverPt ? 'bg-slate-400/40' : ''}`}
            onClick={() => {
                console.log('%c[${svgItemIdx}  ] state on click', 'color: #528');
                setState({ atom: svgItemEdit.stateAtom, states: { activeRow: true } });
            }}
            onFocus={() => {
                console.log('%c[${svgItemIdx}  ] state on focus', 'color: #528');
                setState({ atom: svgItemEdit.stateAtom, states: { activeRow: true } });
            }}
        >
            {/* Values */}
            <div className="flex items-center justify-items-start font-mono space-x-0.5">
                <RowCommandName svgItemEdit={svgItemEdit} />

                {svgItemEdit.valueAtoms.map((atom, idx) => (
                    <ValueInput
                        atom={atom}
                        tooltip={getTooltip(itemType, idx)}
                        firstRow={svgItemIdx === 0}
                        isActivePt={isActivePt}
                        isHoverPt={isHoverPt}
                        editorIdx={[svgItemIdx, getvalueToPoint(itemType, idx)]}
                        stateAtom={svgItemEdit.stateAtom}
                        debugIdx={idx}
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
    const [SvgEditRoot] = useAtom(svgEditRootAtom);
    console.log('======================= PathCommandEditor render rows (only on SvgEditRoot change) ================================');

    return (
        <div className="my-1 space-y-0.5">
            {SvgEditRoot.edits.map((svgItemEdit, idx) => (
                <CommandRow svgItemEdit={svgItemEdit} svgItemIdx={idx} key={idx} />
            ))}
        </div >
    );
}
