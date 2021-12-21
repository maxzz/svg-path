import React from 'react';
import './App.css';
import { IconChevronDown } from './components/UI/icons/Icons';

function SectionPane({ children }: { children?: React.ReactNode; }) {
    return (
        <div className="px-2 py-1 bg-slate-500 text-stone-100 uppercase flex items-center justify-between" style={{fontFamily: "Yanone"}}>
            <div className="pt-1">{children}</div>
            <div className="pr-1">
                <IconChevronDown className="w-6 h-6" />
            </div>
        </div>
    );
}

function PanelPath() {
    return (
        <div className="">
            <SectionPane>Path</SectionPane>
            path edit
        </div>
    );
}

function PanelOptions() {
    return (
        <div className="">
            <SectionPane>options</SectionPane>
            configuration
        </div>
    );
}

function PanelOperations() {
    return (
        <div className="">
            <SectionPane>Operations</SectionPane>
            scale, translate, round ...
        </div>
    );
}

function PanelCommands() {
    return (
        <div className="">
            <SectionPane>Path commands</SectionPane>
            Commands
        </div>
    );
}

function PathPane() {
    return (
        <div className="w-[300px] max-w-[300px] bg-slate-100 border">
            <p className='text-red-700 font-black'>Ground zero</p>
            <PanelPath />
            <PanelOptions />
            <PanelOperations />
            <PanelCommands />
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
