import React from 'react';
import './App.css';

function SectionPane({ children }: { children?: JSX.Element; }) {
    return (
        <div className="">
            <div className="bg-slate-500 uppercase">header</div>
            {children}
        </div>
    );
}

function PathOptions() {
    return (
        <SectionPane>
            <div className="">options</div>
        </SectionPane>
    );
}

function PathOperations() {
    return (
        <SectionPane>
            <div className="">operations</div>
        </SectionPane>
    );
}

function PathCommands() {
    return (
        <SectionPane>
            <div className="">commands</div>
        </SectionPane>
    );
}

function PathPane() {
    return (
        <div className="w-[300px] max-w-[300px] bg-slate-100 border">
            <p className='text-red-700 font-black'>Ground zero</p>
            pane
            <PathOptions />
            <PathOptions />
            <PathOperations />
            <PathCommands />
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
