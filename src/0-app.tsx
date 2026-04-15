import { UIToaster } from './components/ui/UiToaster';
import { UIScrollbar } from './components/ui/UIScrollbar';
import { PathCanvas } from './components/Canvas/0-canvas';
import { PanelPath } from './components/Panels/1-panel-path';
import { PanelCommands } from './components/Panels/2-1-panel-commands';
import { PanelOperations } from './components/Panels/3-panel-operations';
import { PanelOptions } from './components/Panels/4-panel-options';
//import { PanelCanvasControls } from './components/Panels/8-nun-panel-canvas-controls';

export function App() {
    return (<>
        <UIToaster />
        <div className="h-screen flex overflow-hidden">
            <PanelAllEditors />
            <PanelSvgCanvas />
        </div>
    </>);
}

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
