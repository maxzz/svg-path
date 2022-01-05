import React, { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { Accordion } from './components/UI/Accordion';
import { pathUnsafeAtom } from './store/store';
import { PathCommandEditor } from './components/Panels/PathCommandEditor';
import { PathCanvas } from './components/Canvas/Canvas';
import './App.css';
import { SectionPane } from './components/UI/SectionPane';
import { PanelOperations } from './components/Panels/PanelOperations';

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

function PanelOptions() {
    const [openAtom] = useState(atom(true));
    const [open, setOpen] = useAtom(openAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Options
            </SectionPane>
            <Accordion toggle={open}>
                <div className="text-sm bg-slate-300 overflow-hidden">
                    <br/>
                    Configuration. Ground zero
                    <br/>
                    <br/>
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

function PanelAllEditors() {
    return (
        <div className="py-1 w-[300px] max-w-[300px] flex flex-col space-y-1 bg-slate-600 border border-slate-900">
            {/* <p className='text-red-700 font-black'>Ground zero</p> */}
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
            <PanelAllEditors />
            <PathViewer />
        </div>
    );
}

export default App;
