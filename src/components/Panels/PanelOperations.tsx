import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { openPanelOperAtom, operRound, operScaleX, operScaleY, operTransX, operTransY } from "../../store/store";
import { Accordion } from "../UI/Accordion";
import { SectionPane } from "../UI/SectionPane";
import { useNumberInput } from "../../hooks/useNumberInput";

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

export function PanelOperations() {
    const [open, setOpen] = useAtom(openPanelOperAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Path Operations
            </SectionPane>
            <Accordion toggle={open}>
                <div className="px-1.5 py-0.5 text-sm bg-slate-300 overflow-hidden">
                    {/* Scale */}
                    <div className="my-1 flex space-x-1">
                        <OperationInput atom={operScaleX} label="Scale X" />
                        <OperationInput atom={operScaleY} label="Scale Y" />
                        <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]">Scale</button>
                    </div>
                    {/* Translate */}
                    <div className="my-1 flex space-x-1">
                        <OperationInput atom={operTransX} label="Translate X" />
                        <OperationInput atom={operTransY} label="Translate Y" />
                        <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]">Translate</button>
                    </div>
                    {/* Round, to rel, to abs */}
                    <div className="my-1 flex space-x-1">
                        <OperationInput atom={operRound} label="Number of decimals" className="" />
                        <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]" title="Round all path numbers">Round</button>
                        <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]" title="Convert to relative">To rel</button>
                        <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]" title="Convert to absolute">To abs</button>
                    </div>
                </div>
            </Accordion>
        </div>
    );
}
