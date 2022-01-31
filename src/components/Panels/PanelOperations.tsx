import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { doRoundAtom, doScaleAtom, doSetRelAbsAtom, doTransAtom, openPanelOperAtom, operRoundAtom, operScaleUniAtom, operScaleXAtom, operScaleYAtom, operTransXAtom, operTransYAtom } from "../../store/store";
import { Accordion } from "../UI/Accordion";
import { SectionPane } from "../UI/SectionPane";
import { cleanupValueFloat, cleanupValueUInt, useNumberInput } from "../../hooks/useNumberInput";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { IconLock } from "../UI/icons/Icons";
import { classNames } from "../../utils/classnames";
import { useKey } from "react-use";

function OperationInput({ label, overlay, className, atom, cleanup = cleanupValueFloat, onEnter }: {
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

function Button({ label, ...rest }: { label: string; onClick: () => void; } & React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="px-1 flex-1 py-0.5 mx-auto text-slate-900 bg-slate-400 border-slate-500 shadow-sm shadow-slate-800/40 border rounded-sm active:scale-[.97] select-none"
            {...rest}
        >
            {label}
        </button>
    );
}

function ScaleContols() {
    const uniScale = useAtomValue(operScaleUniAtom);
    const doScale = useUpdateAtom(doScaleAtom);
    return (
        <div className="my-1 flex space-x-1">
            <OperationInput atom={operScaleXAtom} label={uniScale ? "Uniform scale" : "Scale X"} overlay={<LockControl />} className="flex-none" onEnter={doScale} />
            {!uniScale && <OperationInput atom={operScaleYAtom} label="Scale Y" className={uniScale ? 'opacity-50' : ''} onEnter={doScale} />}
            <Button onClick={doScale} label="Scale" style={{ transition: 'all .2s', flexBasis: !uniScale ? '50%' : '100%' }} />
            {/* <Button onClick={doScale} label="Scale" style={{ transition: 'all .2s', flexGrow: !uniScale ? 0.001 : 1, flexBasis: !uniScale ? '50%' : '100%' }} /> */}
            {/* <Button onClick={doScale} label="Scale" style={{ transition: 'all .2s', flexGrow: !uniScale ? 0.001 : 1 }} /> */}
        </div>
    );
}

function TranslateContols() {
    const doTrans = useUpdateAtom(doTransAtom); //TODO: allow only positive numbers
    return (
        <div className="my-1 flex space-x-1">
            <OperationInput atom={operTransXAtom} label="Translate X" onEnter={doTrans} />
            <OperationInput atom={operTransYAtom} label="Translate Y" onEnter={doTrans} />
            <Button onClick={doTrans} label="Translate" />
        </div>
    );
}

function RoundConvertContols() {
    const doRound = useUpdateAtom(doRoundAtom); //TODO: allow only positive numbers
    const doSetRelAbs = useUpdateAtom(doSetRelAbsAtom);
    return (
        <div className="my-1 flex space-x-1">
            <OperationInput atom={operRoundAtom} label="Number of decimals" cleanup={cleanupValueUInt} className="" />
            <Button title="Round all path numbers" onClick={doRound} label="Round" />
            <Button title="Convert to relative" onClick={() => doSetRelAbs(true)} label="To rel" />
            <Button title="Convert to absolute" onClick={() => doSetRelAbs(false)} label="To abs" />
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

//TODO: add scale in % insted of abstract numbers as it is now.

//TODO: undo/redo