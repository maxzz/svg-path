import React from 'react';
import { SetStateAction, useAtom, WritableAtom } from 'jotai';
import { showGridAtom } from '../../store/store';

function Button({ label, atom }: { label: string; atom: WritableAtom<boolean, SetStateAction<boolean>, void>; }) {
    const [showGrid, setShowGrid] = useAtom(atom);
    return (
        <button
            className={`px-1 py-0.5 text-sm text-slate-400 border-slate-500 border rounded ${showGrid ? 'bg-slate-600' : 'bg-slate-800'}`}
            onClick={() => setShowGrid((prev) => !prev)}
        >
            {label}
        </button>
    );
}

function CanvasControlsPanel() {
    return (
        <div className="absolute bottom-4 right-4 px-2 py-2 bg-slate-400/40 rounded flex items-center space-x-2">
            <Button label="Grid" atom={showGridAtom} />
        </div>
    );
}

export default CanvasControlsPanel;