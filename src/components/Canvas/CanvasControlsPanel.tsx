import { useAtom } from 'jotai';
import React from 'react';
import { showGridAtom } from '../../store/store';

function CanvasControlsPanel() {
    const [showGrid, setShowGrid] = useAtom(showGridAtom);
    return (
        <div className="absolute bottom-4 right-4 w-1/2 h-12 px-2 py-1 bg-slate-400/40 rounded flex items-center">
            <button className="px-1 py-0.5 text-sm text-slate-400 bg-slate-800 border-slate-500 border rounded ">Grid</button>
        </div>
    );
}

export default CanvasControlsPanel;
