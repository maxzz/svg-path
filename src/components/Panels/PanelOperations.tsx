import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { doRoundAtom, doScaleAtom, doSetRelAbsAtom, doTransAtom, openPanelOperAtom, operRoundAtom, operScaleUniAtom, operScaleXAtom, operScaleYAtom, operTransXAtom, operTransYAtom } from "../../store/store";
import { Accordion } from "../UI/Accordion";
import { SectionPane } from "../UI/SectionPane";
import { cleanupValueUFloat, cleanupValueUInt, useNumberInput } from "../../hooks/useNumberInput";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { IconLock } from "../UI/icons/Icons";
import { classNames } from "../../utils/classnames";
import { useKey } from "react-use";

function OperationInput({ label, overlay, className, atom, cleanup = cleanupValueUFloat, onEnter }: {
    label: string;
    overlay?: React.ReactNode;
    className?: string;
    atom: PrimitiveAtom<number>;
    cleanup?: (s: string) => string;
    onEnter?: () => void;
}) {
    const [value, setValue] = useAtom(atom);
    const bind = useNumberInput(value, (v) => setValue(v), cleanup);
    const inputRef = React.useRef(null);
    useKey('Enter', () => onEnter && onEnter(), { target: inputRef.current }, [inputRef.current]);
    return (
        <label className={classNames("relative w-1/3 rounded-tl-sm overflow-hidden focus-within:text-blue-500", className)}>
            <div className="px-1 -mt-1 absolute text-[.6rem]">{label}</div>
            {overlay}
            <input
                className="px-1 pt-3 h-8 w-full border-b-2 text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none"
                ref={inputRef}
                {...bind}
            />
        </label>
    );
}

function LockControl() {
    const [uniScale, setUniScale] = useAtom(operScaleUniAtom);
    return (
        <IconLock
            className={classNames("absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5", `${uniScale ? 'fill-slate-700' : 'fill-slate-400 stroke-slate-400'}`)}
            strokeWidth={2}
            onClick={() => setUniScale((v) => !v)}
            title="lock x and y scales"
        />
    );
}

function ScaleContols() {
    const doScale = useUpdateAtom(doScaleAtom); //TODO: allow only positive numbers
    const uniScale = useAtomValue(operScaleUniAtom);
    //function setScale() {}
    return (
        <div className="my-1 flex space-x-1">
            <OperationInput atom={operScaleXAtom} label={uniScale ? "Uniform scale" : "Scale X"} overlay={<LockControl />} onEnter={doScale} />
            {!uniScale && <OperationInput atom={operScaleYAtom} label="Scale Y" className={uniScale ? 'opacity-50' : ''} onEnter={doScale} />}
            <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]" onClick={doScale}>Scale</button>
        </div>
    );
}

function TranslateContols() {
    const doTrans = useUpdateAtom(doTransAtom); //TODO: allow only positive numbers
    return (
        <div className="my-1 flex space-x-1">
            <OperationInput atom={operTransXAtom} label="Translate X" />
            <OperationInput atom={operTransYAtom} label="Translate Y" />
            <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]" onClick={doTrans}>Translate</button>
        </div>
    );
}

function RoundConvertContols() {
    const doRound = useUpdateAtom(doRoundAtom); //TODO: allow only positive numbers
    const doSetRelAbs = useUpdateAtom(doSetRelAbsAtom);
    return (
        <div className="my-1 flex space-x-1">
            <OperationInput atom={operRoundAtom} label="Number of decimals" cleanup={cleanupValueUInt} className="" />
            <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]" title="Round all path numbers" onClick={doRound}>Round</button>
            <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]" title="Convert to relative" onClick={() => doSetRelAbs(true)}>To rel</button>
            <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]" title="Convert to absolute" onClick={() => doSetRelAbs(false)}>To abs</button>
        </div>
    );
}

export function PanelOperations() {
    const [open, setOpen] = useAtom(openPanelOperAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Path Operations
            </SectionPane>
            <Accordion toggle={open}>
                <div className="px-1.5 py-0.5 text-sm bg-slate-300 overflow-hidden">
                    <ScaleContols />
                    <TranslateContols />
                    <RoundConvertContols />
                </div>
            </Accordion>
        </div>
    );
}

//TODO: handle enter key (on first control or both)
//TODO: scale 0:0 produces NaN

//TBD: do scale as slider(s) or replace second scalce Y with slider!!
//TBD: do we need to reset after scale to 1:1 <- NO
//TBD: do we need to disable scale button when scale is 1:1
//TBD: do we need to disable translate button when translate is 0:0

//TODO: undo/redo