import React from 'react';
import { SetStateAction, useAtom, WritableAtom } from 'jotai';
import { showGridAtom, showTicksAtom } from '../../store/store';
import { AccordionHorizontal } from '../UI/Accordion';

function Button({ label, atom }: { label: string; atom: WritableAtom<boolean, SetStateAction<boolean>, void>; }) {
    const [showGrid, setShowGrid] = useAtom(atom);
    return (
        <button
            className={`px-1 py-0.5 text-sm text-slate-400 border-slate-500 border rounded active:scale-[.97] ${showGrid ? 'bg-slate-800 shadow-sm shadow-slate-800' : 'bg-slate-600'}`}
            onClick={() => setShowGrid((prev) => !prev)}
        >
            {label}
        </button>
    );
}

function CanvasControlsPanel() {
    const [showGrid] = useAtom(showGridAtom);
    return (
        <div className="absolute bottom-4 right-4 px-2 py-2 bg-slate-400/40 rounded flex items-center space-x-2">
            <AccordionHorizontal toggle={showGrid}>
                <div className="">
                    {showGrid && <Button label="Ticks" atom={showTicksAtom} />}
                    <Button label="Grid" atom={showGridAtom} />
                </div>
            </AccordionHorizontal>
        </div>
    );
}

export default CanvasControlsPanel;
