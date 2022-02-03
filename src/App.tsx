import React from 'react';
import { PathCanvas } from './components/Canvas/Canvas';
import './App.css';
import { UIScrollbar } from './components/UI/UIScrollbar';
import { PanelPath } from './components/Panels/PanelPath';
//import { PanelCanvasControls } from './components/Panels/PanelCanvasControls';
import { PanelCommands } from './components/Panels/PanelCommands';
import { PanelOperations } from './components/Panels/PanelOperations';
import { PanelOptions } from './components/Panels/PanelOptions';
import { UIToaster } from './components/UI/UiToaster';

function PanelAllEditors() {
    return (
        <div className="py-1 w-[300px] max-w-[300px] flex flex-col space-y-1 bg-slate-600 border border-slate-900">
            <div className="flex-1 min-w-0 min-h-0">
                <UIScrollbar className="overflow-auto w-full h-full">
                    <PanelPath />
                    <PanelCommands />
                    <PanelOperations />
                    <PanelOptions />
                </UIScrollbar>
            </div>
            {/* <div className="relative h-24">
                <PanelCanvasControls />
            </div> */}
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
    return (<>
        <UIToaster />
        <div className="h-screen flex overflow-hidden">
            <PanelAllEditors />
            <PanelSvgCanvas />
        </div>
    </>);
}

export default App;

//link:
//M32.37 99H17.13A17.16 17.16 0 010 81.87V66.63a17.1 17.1 0 0115.23-16.94v11.58a5.72 5.72 0 00-3.81 5.36v15.24a5.73 5.73 0 005.71 5.71h15.24a5.73 5.73 0 005.71-5.71V66.63a5.72 5.72 0 00-3.81-5.36V49.69A17.1 17.1 0 0149.5 66.63v15.24A17.16 17.16 0 0132.37 99Zm-1.91-66.63v34.26a5.71 5.71 0 11-11.42 0V32.37a5.71 5.71 0 1111.42 0Zm3.81 16.94V37.73a5.72 5.72 0 003.81-5.36V17.13a5.73 5.73 0 00-5.71-5.71H17.13a5.73 5.73 0 00-5.71 5.71v15.24a5.72 5.72 0 003.81 5.36v11.58A17.1 17.1 0 010 32.37V17.13A17.16 17.16 0 0117.13 0h15.24A17.16 17.16 0 0149.5 17.13v15.24a17.1 17.1 0 01-15.23 16.94Z

//TODO: no type change on rel/abs change
//infiniy:
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

//Two z commands
//M 10 4 C 14 -3 16.6 6.2 20 10.1 c 3.5 3.9 5.2 6.9 9.4 6.8 c 4.3 -0.1 6.3 -2.8 6.3 -6.3 c 0 -3.6 -1.8 -6.5 -6.3 -6.3 c -4.5 0.1 -7.5 2.1 -11 5.9 c -3.5 3.8 -5.1 8.7 -11.1 8.7 C 2 16 0.1 11.2 0.1 7.7 C 0.1 4.1 2 0 6 0 z M 6 7 m 8 2 v 10 h 10 z

//Two z commands and absolute/relative commands
//m 6 10 C 14 -3 16.6 6.2 20 10.1 c 3.5 3.9 5.2 6.9 9.4 6.8 c 4.3 -0.1 6.3 -2.8 6.3 -6.3 c 0 -3.6 -1.8 -6.5 -6.3 -6.3 c -4.5 0.1 -7.5 2.1 -11 5.9 c -3.5 3.8 -5.1 8.7 -11.1 8.7 C 2 16 0.1 11.2 0.1 7.7 C 0.1 4.1 2 0 6 0 Z M 7 20 m 3 0 v 10 H 26 Z

//Redo icon, broken third sub-path (m after h):
/*
M 21.4 2.3 V 15 M 17.42 8.67 H 8.08 C 0.75 8.67 0.75 20 8.08 20 h 13.34 
m 12.75 13.33 l 4.67 -4.66 L 12.75 4
m 12.75 13.33 l 4.67 -4.66 L 12.75 4
*/

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

//TODO: reverse sub-path points order