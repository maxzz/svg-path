import { atom, useAtom } from 'jotai';
import React, { HTMLAttributes, ReactNode, useState } from 'react';
import './App.css';
import { IconChevronDown, IconMenu } from './components/UI/icons/Icons';
import background from './assets/background-grid.svg';
import { BgGrid } from './components/UI/icons/BgGrid';
import { Accordion } from './components/UI/Accordion';

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

const pathAtom = atom('M 0 100 L 25 100 C 34 20 40 0 100 0');

function PanelPath() {
    const [openAtom] = useState(atom(true));
    const [open, setOpen] = useAtom(openAtom);

    const [path, setPath] = useAtom(pathAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Path
            </SectionPane>
            <Accordion toggle={open}>
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
                        <textarea className="w-full bg-slate-200" rows={5} value={path} onChange={(event) => setPath(event.target.value)}></textarea>
                    </label>
                </div>
            </Accordion>
        </div>
    );
}

function PanelOptions() {
    const [openAtom] = useState(atom(true));
    const [open, setOpen] = useAtom(openAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Options
            </SectionPane>
            <Accordion toggle={open}>
                configuration
            </Accordion>
        </div>
    );
}

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

function CommandName({ command, abs }: { command: string; abs: boolean; }) {
    return (
        <label className={`flex-0 overflow-hidden focus-within:text-blue-500`}>
            {/* <input className="px-1 w-full text-xs text-center text-slate-900 bg-slate-500 focus:outline-none" defaultValue={"M"} /> */}
            <button className="px-1 pb-[1px] rounded-l-sm text-xs text-center text-slate-900 bg-slate-500 ">{command}</button>
        </label>
    );
}

function CommandInput() {
    return (
        <label className={`flex-1 max-w-[2rem] rounded-tl-sm overflow-hidden focus-within:text-blue-500`}>
            <input className="px-1 pb-[1px] w-full h-full text-xs text-center text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none" defaultValue={"11"} />
        </label>
    );
}

function PathCommand() {
    return (
        <div className="my-1">
            {/* Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-items-start space-x-0.5">
                    <CommandName command="m" abs={true} />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                </div>
                <button className="flex-0 px-1 mt-0.5 active:scale-[.97]">
                    <IconMenu className="w-4 h-4" />
                </button>
            </div>
            {/* Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-items-start space-x-0.5">
                    <CommandName command="m" abs={true} />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                </div>
                <button className="flex-0 px-1 mt-0.5 active:scale-[.97]">
                    <IconMenu className="w-4 h-4" />
                </button>
            </div>
            {/* Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-items-start space-x-0.5">
                    <CommandName command="m" abs={true} />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                    <CommandInput />
                </div>
                <button className="flex-0 px-1 mt-0.5 active:scale-[.97]">
                    <IconMenu className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function PanelCommands() {
    const [openAtom] = useState(atom(true));
    const [open, setOpen] = useAtom(openAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Path Commands
            </SectionPane>
            <Accordion toggle={open}>
                <div className="px-1 text-sm bg-slate-300 overflow-hidden">
                    <PathCommand />
                </div>
            </Accordion>
        </div>
    );
}

function PathPane() {
    return (
        <div className="w-[300px] max-w-[300px] flex flex-col space-y-1 bg-slate-100 border">
            <p className='text-red-700 font-black'>Ground zero</p>
            <PanelPath />
            <PanelCommands />
            <PanelOperations />
            <PanelOptions />
        </div>
    );
}

function PathViewer() {
    return (
        <div className="flex-1 relative">
            <BgGrid className="absolute w-full h-full -z-10" />
            <div className="text-red-500/50 font-black p-2">Ground zero</div>
        </div>
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
