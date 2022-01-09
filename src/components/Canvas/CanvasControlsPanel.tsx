import React from 'react';
import { SetStateAction, useAtom, WritableAtom } from 'jotai';
import { showGridAtom, showTicksAtom } from '../../store/store';
//import { AccordionHorizontal } from '../UI/Accordion';

function Button({ label, atom }: { label: string; atom: WritableAtom<boolean, SetStateAction<boolean>, void>; }) {
    const [showGrid, setShowGrid] = useAtom(atom);
    return (
        <button
            className={`px-1 h-6 text-sm text-slate-400 border-slate-500 border rounded active:scale-[.97] ${showGrid ? 'bg-slate-800 shadow-sm shadow-slate-800' : 'bg-slate-600'}`}
            onClick={() => setShowGrid((prev) => !prev)}
        >
            {label}
        </button>
    );
}

function ButtonWoLeft({ label, atom }: { label: string; atom: WritableAtom<boolean, SetStateAction<boolean>, void>; }) {
    const [showGrid, setShowGrid] = useAtom(atom);
    return (
        <button
            className={`px-1 h-6 text-sm text-slate-400 border-slate-500 border rounded-r active:scale-[.97] ${showGrid ? 'bg-slate-800 shadow-sm shadow-slate-800' : 'bg-slate-600'}`}
            onClick={() => setShowGrid((prev) => !prev)}
        >
            {label}
        </button>
    );
}

export function CanvasControlsPanel() {
    const [showGrid] = useAtom(showGridAtom);
    return (
        <div className="absolute bottom-4 right-4 px-2 py-2 bg-slate-400/40 rounded flex items-center space-x-2">
            {/* <AccordionHorizontal toggle={showGrid}>
                <div className=""> */}
            {showGrid && <Button label="Ticks" atom={showTicksAtom} />}
            <Button label="Grid" atom={showGridAtom} />
            {/* </div>
            </AccordionHorizontal> */}
        </div>
    );
}

export function AppCommands() {
    const [showGrid] = useAtom(showGridAtom);
    return (
        <div className="absolute bottom-4 right-4 px-2 py-2 bg-slate-400/40 rounded flex items-center space-x-2">

            {showGrid &&
                <div className="flex items-center ">
                    <input className="px-1 w-5 h-6 text-xs rounded-l border border-slate-500  text-slate-400 bg-slate-700 shadow-sm shadow-slate-800" />

                    <ButtonWoLeft label="Ticks" atom={showTicksAtom} />
                </div>
            }
            <Button label="Grid" atom={showGridAtom} />
        </div>
    );
}
