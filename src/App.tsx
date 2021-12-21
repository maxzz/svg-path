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
                    <label>
                        <div className="flex justify-between">
                            <div className="text-xs tracking-tighter self-end">path</div>
                            <div className="py-1 flex space-x-1">
                                <button className="px-1 py-0.5 border rounded border-slate-400">Open</button>
                                <button className="px-1 py-0.5 border rounded border-slate-400">Save</button>
                                <button className="px-1 py-0.5 border rounded border-slate-400">Clear</button>
                            </div>
                        </div>

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

function PanelOperations() {
    const [openAtom] = useState(atom(true));
    const [open, setOpen] = useAtom(openAtom);
    return (
        <div className="">
            <SectionPane onClick={() => setOpen(v => !v)}>Path Operations</SectionPane>
            {open &&
                <div className="px-1 text-sm bg-slate-300 overflow-hidden">
                    <div className="my-1 flex space-x-1">
                        <label className="relative w-[40%]">
                            <div className="absolute text-[.65rem]">Scale X</div>
                            <input className="pt-3 h-8 w-full" defaultValue={"11"} />
                        </label>
                        <label className="relative w-[40%]">
                            <div className="absolute text-[.65rem]">Scale Y</div>
                            <input className="pt-3 h-8 w-full" />
                        </label>
                        <button className="px-1 flex-1 py-0.5 mx-auto border rounded border-slate-400">Scale</button>
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
