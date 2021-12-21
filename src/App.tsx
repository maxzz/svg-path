import React from 'react';
import './App.css';

function SectionPane({ children }: { children?: React.ReactNode; }) {
    return (
        <div className="bg-slate-500">
            {children}
        </div>
    );
}

function PathOptions() {
    return (
        <div className="">
            <SectionPane>options</SectionPane>
            options
        </div>
    );
}

function PathOperations() {
    return (
        <div className="">operations</div>
    );
}

function PathCommands() {
    return (
        <div className="">commands</div>
    );
}

function PathPane() {
    return (
        <div className="w-[300px] max-w-[300px] bg-slate-100 border">
            <p className='text-red-700 font-black'>Ground zero</p>
            pane
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
