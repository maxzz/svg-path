import { atom, useAtom } from 'jotai';
import React, { useState } from 'react';
import { pathUnsafeAtom } from '../../store/store';
import { Accordion } from '../UI/Accordion';
import { SectionPane } from '../UI/SectionPane';

function PathEditor() {
    const [path, setPath] = useAtom(pathUnsafeAtom);
    return (
        <textarea
            className="p-0.5 w-full bg-slate-200 font-mono text-xs"
            rows={5}
            spellCheck={false}
            value={path}
            onChange={(event) => setPath(event.target.value)}
        />
    );
}

export function PanelPath() {
    const [openAtom] = useState(atom(true));
    const [open, setOpen] = useAtom(openAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Path
            </SectionPane>
            <Accordion toggle={open}>
                <div className="px-1 text-sm bg-slate-300 overflow-hidden">
                    <div className="flex justify-between">
                        <div className="pb-0.5 text-xs tracking-tighter self-end">path</div>
                        <div className="py-1 flex space-x-1">
                            <button className="px-1 pt-0.5 pb-1 bg-slate-400/40 border-slate-400 border rounded shadow-sm active:scale-[.97]">Open</button>
                            <button className="px-1 pt-0.5 pb-1 bg-slate-400/40 border-slate-400 border rounded shadow-sm active:scale-[.97]">Save</button>
                            <button className="px-1 pt-0.5 pb-1 bg-slate-400/40 border-slate-400 border rounded shadow-sm active:scale-[.97]">Clear</button>
                        </div>
                    </div>

                    <label>
                        <PathEditor />
                    </label>
                </div>
            </Accordion>
        </div>
    );
}
