import React from 'react';
import { PathCanvas } from './components/Canvas/Canvas';
import './App.scss';
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

M 22 -20 V 15 M 17.4 8.7 H 8.1 C 0.8 8.7 0.8 20 8.1 20 h 12.9 
m 12.4 13 l 4.6 -5.3 L 13 4 
m 12 13 l 5 -4 L 1 3
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
//TODO: move sub-path down/up
//TODO: hide/show sub-path
//TODO: collapse/expand sub-path

//TODO: move path when hover over path line; set cursor move



//TODO: (05.07.22) collapse sub-pathes
//TODO: (05.07.22) parse multiple paths from text edit panel
//TODO: (05.07.22) make the same bkg for (abs and relative) control points background and add title for them
//TODO: (05.07.22)
//multilines (don't show handlers on inactive sub-paths)
/*
M66,81.77c-7,0-13.92-2.36-20.77-7.06A56.3,56.3,0,0,1,30.69,60.12c-.44-.69-.94-1.54-1.51-2.51C24.59,49.8,16,35.27.12,39.17l-.24-1C16.53,34.13,25.32,49.07,30,57.1c.56,1,1.06,1.8,1.5,2.48a54.92,54.92,0,0,0,14.21,14.3C54.61,80,63.64,82,72.59,80c17-3.79,44.12-23.53,62.08-36.6,4.52-3.29,8.42-6.13,11.7-8.39C163.23,23.39,191.69,22,192,22l0,1c-.28,0-28.46,1.38-45.08,12.86-3.27,2.26-7.17,5.1-11.68,8.38C116.15,58.14,90,77.17,72.81,81A31.35,31.35,0,0,1,66,81.77Z

M68.59,84.65c-5.56,0-11.39-1.14-18.79-2.9-13-3.09-21.31-12.86-28.64-21.48C14.23,52.11,8.25,45.08,0,45.66l-.08-1c8.7-.62,14.86,6.6,22,15C29.15,68.13,37.34,77.76,50,80.78c25.43,6,31.74,4.93,72.05-25.06,40.52-30.14,69.67-28.51,70-28.49l-.06,1c-.29,0-29.1-1.61-69.29,28.29C94,77.84,82.15,84.65,68.59,84.65Z

M97.89,77.34c-9.85,0-29-11.42-42.57-22.64C43.12,44.63,19.19,41,.26,52.31l-.52-.86C19.06,39.9,43.5,43.64,56,53.93c14,11.53,33.75,23.29,43,22.36,6.79-.69,15.37-4.66,24.45-8.87,9.4-4.35,19.13-8.86,29-11,19.58-4.21,39.6,1.88,39.8,1.94l-.3.95c-.2-.06-20-6.07-39.29-1.91-9.74,2.1-19.41,6.58-28.77,10.91-9.16,4.24-17.81,8.25-24.77,9A10.28,10.28,0,0,1,97.89,77.34Z

M115.75,86C103.63,86,91.5,80.94,77.19,70.6,50.43,51.27,32.32,57.07,19.53,64.27,5.82,72,.12,70.76-.12,70.71l.24-1c.05,0,5.64,1.16,18.92-6.33,8.63-4.86,16.45-7.07,24.62-6.9,10.85.2,22,4.55,34.11,13.29,25.59,18.48,44.09,19.92,68.25,5.32,22.12-13.36,46-.14,46.23,0l-.5.87c-.23-.14-23.6-13.07-45.21,0C135.5,82.64,125.63,86,115.75,86Z

M102.16,84h-.45c-13.53-.09-23.63-7.36-33.4-14.39C60.05,63.62,52.25,58,43.16,57.49c-11.77-.66-22.66,4.25-30.61,7.83C7,67.83,2.61,69.8-.13,69.05l.26-1c2.39.65,6.64-1.26,12-3.68,8.05-3.63,19.06-8.6,31.08-7.91,9.37.53,17.29,6.22,25.67,12.25,9.64,6.94,19.62,14.11,32.82,14.2,13,.07,22.37-3.57,31.44-7.1,8.19-3.19,15.91-6.23,25.59-6.13,20.14.15,33.48,13.24,33.61,13.38l-.7.7c-.13-.13-13.2-12.93-32.92-13.08-9.51-.09-17.12,2.91-25.22,6.06C124.46,80.31,115.11,84,102.16,84Z
*/
