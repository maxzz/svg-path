import { atom, useAtom } from 'jotai';
import React, { HTMLAttributes, ReactNode, useState } from 'react';
import './App.css';
import { IconChevronDown } from './components/UI/icons/Icons';

function SectionPane({ children, open = true, ...rest }: { children?: ReactNode; open?: boolean; } & HTMLAttributes<HTMLDivElement>) {
    return (
        <div className="px-2 py-1 bg-slate-500 text-stone-100 uppercase flex items-center justify-between select-none font-ui" {...rest}>
            <div className="pr-1 pt-1">{children}</div>
            <div className={`${open ? '' : 'rotate-180'}`}>
                <IconChevronDown className="w-6 h-6" />
            </div>
        </div>
    );
}

function PanelPath() {
    const [openAtom] = useState(atom(true));
    const [open, setOpen] = useAtom(openAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Path
            </SectionPane>
            {open &&
                <div className="px-1 text-sm bg-slate-300 overflow-hidden">
                    <div className="flex justify-between">
                        <div className="text-xs tracking-tighter self-end">path</div>
                        <div className="py-1 flex space-x-1">
                            <button className="px-1.5 pb-0.5 border rounded border-slate-400 active:scale-[.97]">Open</button>
                            <button className="px-1.5 pb-0.5 border rounded border-slate-400 active:scale-[.97]">Save</button>
                            <button className="px-1.5 pb-0.5 border rounded border-slate-400 active:scale-[.97]">Clear</button>
                        </div>
                    </div>

                    <label>
                        <textarea className="w-full bg-slate-200" rows={5}></textarea>
                    </label>
                </div>
            }
        </div>
    );
}

// function PanelOptions() {
//     return (
//         <div className="">
//             <SectionPane>options</SectionPane>
//             configuration
//         </div>
//     );
// }

function OperationInput({ label, className = "" }: { label: string; className?: string; }) {
    return (
        <label className={`relative w-1/3 rounded-tl-sm overflow-hidden focus-within:text-blue-500 ${className}`}>
            <div className="px-1 -mt-1 absolute text-[.6rem]">{label}</div>
            <input className="px-1 pt-3 h-8 w-full border-b-2 text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none" defaultValue={"11"} />
        </label>
    );
}

function PanelOperations() {
    const [openAtom] = useState(atom(true));
    const [open, setOpen] = useAtom(openAtom);
    return (
        <div className="">
            <SectionPane onClick={() => setOpen(v => !v)}>Path Operations</SectionPane>
            {open &&
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
                        <OperationInput label="Round" className="w-[68%]" />
                        <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400 active:scale-[.97]">Round</button>
                    </div>
                    scale, translate, round ...
                </div>
            }
        </div>
    );
}

// function PanelCommands() {
//     return (
//         <div className="">
//             <SectionPane>Path commands</SectionPane>
//             Commands
//         </div>
//     );
// }

function PathPane() {
    return (
        <div className="w-[300px] max-w-[300px] bg-slate-100 border">
            <p className='text-red-700 font-black'>Ground zero</p>
            <PanelPath />
            {/* <PanelOptions /> */}
            <PanelOperations />
            {/* <PanelCommands /> */}
        </div>
    );
}

function PathViewer() {
    return (
        <div className="flex-1">view</div>
    );
}

function App() {
    return (
        <div className="h-screen flex">
            <PathPane />
            <PathViewer />
        </div>
    );
}

export default App;
