import React from 'react';
import { SetStateAction, useAtom, WritableAtom } from 'jotai';
import { showGridAtom } from '../../store/store';

function Button({ label, atom }: { label: string; atom: WritableAtom<boolean, SetStateAction<boolean>, void>; }) {
    const [showGrid, setShowGrid] = useAtom(atom);
    return (
        <button className="px-1 py-0.5 text-sm text-slate-400 bg-slate-800 border-slate-500 border rounded ">
            {label}
        </button>
    );
}

function CanvasControlsPanel() {
    return (
        <div className="absolute bottom-4 right-4 w-1/2 h-12 px-2 py-1 bg-slate-400/40 rounded flex items-center">
            <Button label="Grid" atom={showGridAtom} />
        </div>
    );
}

export default CanvasControlsPanel;
