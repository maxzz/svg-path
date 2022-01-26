import { atom, useAtom } from "jotai";
import React, { useState } from "react";
import { openPanelOperAtom } from "../../store/store";
import { Accordion } from "../UI/Accordion";
import { SectionPane } from "../UI/SectionPane";

function OperationInput({ label, className = "" }: { label: string; className?: string; }) {
    return (
        <label className={`relative w-1/3 rounded-tl-sm overflow-hidden focus-within:text-blue-500 ${className}`}>
            <div className="px-1 -mt-1 absolute text-[.6rem]">{label}</div>
            <input className="px-1 pt-3 h-8 w-full border-b-2 text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none" defaultValue={"11"} />
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
                <div className="px-1 text-sm bg-slate-300 overflow-hidden">
                    <div className="my-1 flex space-x-1">
                        <OperationInput label="Scale X" />
                        <OperationInput label="Scale Y" />
                        <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]">Scale</button>
                    </div>
                    <div className="my-1 flex space-x-1">
                        <OperationInput label="Translate X" />
                        <OperationInput label="Translate Y" />
                        <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]">Translate</button>
                    </div>
                    <div className="my-1 flex space-x-1">
                        <OperationInput label="Number of decimals" className="" />
                        <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]" title="Round all path numbers">Round</button>
                        <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]" title="Convert to relative">To rel</button>
                        <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]" title="Convert to absolute">To abs</button>
                    </div>
                </div>
            </Accordion>
        </div>
    );
}
