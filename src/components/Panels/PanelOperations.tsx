import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { doRoundAtom, doScaleAtom, doSetRelAbsAtom, doTransAtom, openPanelOperAtom, operRoundAtom, operScaleUniAtom, operScaleXAtom, operScaleYAtom, operTransXAtom, operTransYAtom } from "../../store/store";
import { Accordion } from "../UI/Accordion";
import { SectionPane } from "../UI/SectionPane";
import { cleanupValueUFloat, cleanupValueUInt, useNumberInput } from "../../hooks/useNumberInput";
import { useUpdateAtom } from "jotai/utils";
import { IconLock } from "../UI/icons/Icons";
import { classNames } from "../../utils/classnames";

function OperationInput({ label, overlay, className, atom, cleanup = cleanupValueUFloat }: { label: string; overlay?: React.ReactNode; className?: string; atom: PrimitiveAtom<number>; cleanup?: (s: string) => string; }) {
    const [value, setValue] = useAtom(atom);
    const bind = useNumberInput(value, (v) => setValue(v), cleanup);
    return (
        <label className={classNames("relative w-1/3 rounded-tl-sm overflow-hidden focus-within:text-blue-500", className)}>
            <div className="px-1 -mt-1 absolute text-[.6rem]">{label}</div>
            {overlay}
            <input
                className="px-1 pt-3 h-8 w-full border-b-2 text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none"
                {...bind}
            />
        </label>
    );
}

function ScaleContols() {
    const doScale = useUpdateAtom(doScaleAtom); //TODO: allow only positive numbers
    const [uniScale, setUniScale] = useAtom(operScaleUniAtom);
    const overlay = <IconLock
        className={classNames("absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5", `${uniScale ? 'fill-slate-700' : 'fill-slate-400 stroke-slate-400'}`)}
        strokeWidth={2}
        onClick={() => setUniScale((v) => !v)}
        title="lock x and y scales"
    />;
    return (
        <div className="my-1 flex space-x-1">
            <OperationInput atom={operScaleXAtom} label="Scale X" overlay={overlay} />
            <OperationInput atom={operScaleYAtom} label="Scale Y" />
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
