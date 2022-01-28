import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { doRoundAtom, doScaleAtom, doSetRelAbsAtom, doTransAtom, openPanelOperAtom, operRoundAtom, operScaleXAtom, operScaleYAtom, operTransXAtom, operTransYAtom } from "../../store/store";
import { Accordion } from "../UI/Accordion";
import { SectionPane } from "../UI/SectionPane";
import { useNumberInput } from "../../hooks/useNumberInput";
import { useUpdateAtom } from "jotai/utils";

function OperationInput({ label, className = "", atom }: { label: string; className?: string; atom: PrimitiveAtom<number>; }) {
    const [value, setValue] = useAtom(atom);
    const bind = useNumberInput(value, (v) => setValue(v));
    return (
        <label className={`relative w-1/3 rounded-tl-sm overflow-hidden focus-within:text-blue-500 ${className}`}>
            <div className="px-1 -mt-1 absolute text-[.6rem]">{label}</div>
            <input
                className="px-1 pt-3 h-8 w-full border-b-2 text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none"
                {...bind}
            />
        </label>
    );
}

function ScaleContols() {
    const doScale = useUpdateAtom(doScaleAtom); //TODO: allow only positive numbers
    return (
        <div className="my-1 flex space-x-1">
            <OperationInput atom={operScaleXAtom} label="Scale X" />
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
            <OperationInput atom={operRoundAtom} label="Number of decimals" className="" />
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
