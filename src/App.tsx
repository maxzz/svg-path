import React, { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { Accordion } from './components/UI/Accordion';
import { PathCommandEditor } from './components/Panels/PathCommandEditor';
import { PathCanvas } from './components/Canvas/Canvas';
import './App.css';
import { SectionPane } from './components/UI/SectionPane';
import { PanelOperations } from './components/Panels/PanelOperations';
import { PanelPath } from './components/Panels/PanelPath';

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
