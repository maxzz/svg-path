import { atom, useAtom } from 'jotai';
import React, { HTMLAttributes, ReactNode, useState } from 'react';
import { Accordion } from './components/UI/Accordion';
import { motion, useAnimation, Variants } from 'framer-motion';
import { pathUnsafeAtom } from './store/store';
import { PathCommandEditor } from './components/Panels/PathCommandEditor';
import { PathCanvas } from './components/Canvas/Canvas';
import './App.css';

const variants: Variants = {
    open: { d: ["M 20,65 50,35 80,65", "M 20,35 50,65 80,35"], },
    closed: { d: ["M 20,35 50,65 80,35", "M 20,65 50,35 80,65"], },
};

function SectionPane({ children, open = true, onClick, ...rest }: { children?: ReactNode; open?: boolean; } & HTMLAttributes<HTMLDivElement>) {
    const api = useAnimation();
    const click = (event: React.MouseEvent<HTMLDivElement>) => onClick && (api.start(open ? "closed" : "open"), onClick(event));
    return (
        <div
            className="px-2 py-1 bg-slate-500 text-stone-100 uppercase flex items-center justify-between select-none cursor-pointer font-ui"
            onClick={click}
            {...rest}
        >
            <div className="pr-1 pt-1">{children}</div>
            <div className="">
                <svg className="w-6 h-6 p-1 stroke-current stroke-[.6rem] fill-none" viewBox="0 0 100 100">
                    <motion.path
                        d="M 20,35 50,65 80,35"
                        animate={api}
                        variants={variants}
                        transition={{ ease: "easeInOut", duration: .2, }}
                    />
                </svg>
            </div>
        </div>
    );
}

function PathEditor() {
    const [path, setPath] = useAtom(pathUnsafeAtom);
    return (
        <textarea
            className="w-full bg-slate-200 font-mono text-xs"
            rows={5}
            spellCheck={false}
            value={path}
            onChange={(event) => setPath(event.target.value)}
        />
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
                        <PathEditor />
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
                    <PathCommandEditor />
                </div>
            </Accordion>
        </div>
    );
}

function Dropdown({ text, variants }: { text: string, variants: Variants; }) {
    const [open, setOpen] = useState(false);
    const api = useAnimation();

    return (
        <button onClick={() => { api.start(open ? "open" : "closed"); setOpen(!open); }}>
            <div className="Dropdown-text">{text}</div>

            <svg className="fill-none stroke-slate-400 stroke-[.8rem] w-4 h-4" viewBox="0 0 100 100">
                <motion.path
                    d="M 20,35 50,65 80,35"
                    animate={api}
                    variants={variants}
                    transition={{ ease: "easeInOut", duration: .2, }}
                />
            </svg>

        </button>
    );
}

function PathPane() {
    return (
        <div className="w-[300px] max-w-[300px] flex flex-col space-y-1 bg-slate-100 border">
            <p className='text-red-700 font-black'>Ground zero</p>

            <Dropdown
                text="Invert"
                variants={{
                    open: { d: ["M 20,65 50,35 80,65", "M 20,35 50,65 80,35"], },
                    closed: { d: ["M 20,35 50,65 80,35", "M 20,65 50,35 80,65"], },
                }}
            />

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
            <PathCanvas />
            {/* <div className="absolute text-red-500/50 font-black p-2">Ground zero</div> */}
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
