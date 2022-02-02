import React from 'react';
import { useAtom } from 'jotai';
import { openPanelPathAtom, pathUnsafeAtom } from '../../store/store';
import { Accordion } from '../UI/Accordion';
import { SectionPane } from '../UI/SectionPane';
import { classNames } from '../../utils/classnames';
import { IconRedo, IconUndo } from '../UI/icons/Icons';

function PathEditor() {
    const [path, setPath] = useAtom(pathUnsafeAtom);
    return (
        <textarea
            className="p-0.5 w-full bg-slate-200 text-xs font-mono"
            rows={5}
            spellCheck={false}
            value={path}
            onChange={(event) => setPath(event.target.value)}
        />
    );
}

function Button({ scale = true, enabled = true, children, className, ...rest }: { scale?: boolean; enabled?: boolean; onClick: () => void; } & React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={classNames(
                "px-1 flex-1 py-0.5 mx-auto text-slate-900 bg-slate-400 border-slate-500 shadow-sm shadow-slate-800/40 border rounded-sm select-none",
                scale ? 'active:scale-[.97]' : '',
                enabled ? '' : 'opacity-50',
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
}

// function Button({ label, ...rest }: { label: string; onClick: () => void; } & React.HTMLAttributes<HTMLButtonElement>) {
//     return (
//         <button
//             className="px-1 flex-1 py-0.5 mx-auto text-slate-900 bg-slate-400 border-slate-500 shadow-sm shadow-slate-800/40 border rounded-sm active:scale-[.97] select-none"
//             {...rest}
//         >
//             {label}
//         </button>
//     );
// }

export function PanelPath() {
    const [open, setOpen] = useAtom(openPanelPathAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Path
            </SectionPane>
            <Accordion toggle={open}>
                <div className="px-1.5 pt-1.5 pb-0.5 text-sm bg-slate-300 overflow-hidden">
                    <div className="flex justify-between">
                        <div className="pb-0.5 text-xs tracking-tighter self-end">path</div>
                        <div className="pb-2 flex space-x-1">
                            {/* <Button label="Open" onClick={() => {}} /> */}

                            <Button onClick={() => { }}>Save</Button>
                            <Button onClick={() => { }}>Copy</Button>
                            <Button onClick={() => { }} enabled={false}><IconUndo className="w-5 h-5" title="Undo" /></Button>
                            <Button onClick={() => { }} enabled={false}><IconRedo className="w-5 h-5" title="Redo" /></Button>
                            <Button onClick={() => { }}>Clear</Button>

                            {/* <Button label="Save" onClick={() => {}} />
                            <Button label="Copy" onClick={() => {}} />
                            <Button label="Undo" onClick={() => {}} />
                            <Button label="Redo" onClick={() => {}} />
                            <Button label="Clear" onClick={() => {}} /> */}
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

//TODO: scrollbar
//TODO: undo/redo, save. copy, clear
//TODO: add info sub-panel in header to show number of characters (bytes, KB)
