import React, { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { Accordion } from './components/UI/Accordion';
import { PathCommandEditor } from './components/Panels/PathCommandEditor';
import { PathCanvas } from './components/Canvas/Canvas';
import './App.css';
import { SectionPane } from './components/UI/SectionPane';
import { PanelOperations } from './components/Panels/PanelOperations';
import { PanelPath } from './components/Panels/PanelPath';
import { PanelCanvasControls } from './components/Panels/PanelCanvasControls';
import { openPanelCommandsAtom, openPanelOptionsAtom } from './store/store';

function PanelCommands() {
    const [open, setOpen] = useAtom(openPanelCommandsAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Path Commands
            </SectionPane>
            <Accordion toggle={open}>
                <div className="text-sm bg-slate-300 overflow-hidden">
                    <PathCommandEditor />
                </div>
            </Accordion>
        </div>
    );
}

function PanelOptions() {
    const [open, setOpen] = useAtom(openPanelOptionsAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Options
            </SectionPane>
            <Accordion toggle={open}>
                <div className="text-sm bg-slate-300 overflow-hidden">
                    <br />
                    Configuration. Ground zero
                    <br />
                    <br />
                </div>
            </Accordion>
        </div>
    );
}

function PanelAllEditors() {
    return (
        <div className="py-1 w-[300px] max-w-[300px] flex flex-col space-y-1 bg-slate-600 border border-slate-900">
            {/* <p className='text-red-700 font-black'>Ground zero</p> */}
            <div className="flex-1">
                <PanelPath />
                <PanelCommands />
                <PanelOperations />
                <PanelOptions />
            </div>
            <div className="relative h-24">
                <PanelCanvasControls />
            </div>
        </div>
    );
}

function PanelSvgCanvas() {
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
            <PanelSvgCanvas />
        </div>
    );
}

export default App;

//M61.27.5c45.13.16 68.384 25.592 96.354 57.072 27.98 31.47 41.564 54.925 75.536 54.478 33.972-.447 50.78-22.13 50.78-50.78 0-28.65-14.587-51.595-50.78-50.77-36.193.825-60.4 17.052-88.2 47.072-27.8 30.01-40.15 64.308-83.68 64.478C17.74 122.21.5 89.93.5 61.28.5 32.63 16.14.34 61.27.5z
//M 61.27 0.5 C 17.74 122.21 0.5 89.93 0.5 61.28 C 0.5 32.63 16.14 0.34 50 -10
//M 61.27 0.5 c -43.53 121.71 -60.77 89.43 -60.77 60.78 c 0 -28.65 15.64 -60.94 60.77 -60.78 c 0 -28.65 15.64 -60.94 60.77 -60.78 c 0 -28.65 15.64 -60.94 60.77 -60.78
//M 5 0 C 8.6104 0.0128 10.4707 2.0474 11 10 C 14 7 14 10 18 10 C 22 10 22.8008 6.8296 22.8008 4.5376 C 22.8008 2.2456 21 0 19 0 c -2 0 -5 -1 -8 5 C 9 8 9 10 5 10 C 1 10 0 6 0 3 C 0 -2 1 -4 5 -11 Z
//M 5 0 C 8.6 0 10 2 11 10 C 14 7 14 10 18 10 C 22 10 22 6 22 4 C 22 2.3 21 0 19 0 c -2 0 -5 -1 -8 5 C 9 8 9 10 1 15 C 1 10 0 6 0 3 C 0 -2 1 -4 5 -11 Z
//M 50 2 C 20 20 20 60 10 20 C 12 10 16.14 0.34 -10 -10
//M 1 2 c 24 0 25 10 25 51 C 10 20 13 -9 38 -14
//M 1 2 c 24 0 24 23 25 51 C 10 20 25 -10 38 -14 M 5 -5 c 25 0 25 6 25 11 C 10 20 10 -15 25 -20
//M 1 2 L 10 12
//m 2 1 L 5 1 C 5 6 10 2 10 8
//M 4 -6 C 26 -7 25 14 25 41 C 10 20 15 19 28 9 M 5 12 C 14 15 10 -10 24 -10
//m 2 1 L 5 1 C 3 6 9 2 9 5 C 9 8 4 10 7 12

// drag not working
// lost last target point render
// zoom to fit not working

//TODO: switch to grid (first row width problem)
//TODO: check scale when only one 'm' command
//TODO: minify output
//TODO: path operations: make the path abs/rel
//TODO: path operations: translate, scale, round
//TODO: grid: preview
//TODO: history: unde/redo
//TODO: zoom buttons: -/+/fit
