import React from 'react';
import { PrimitiveAtom, SetStateAction, useAtom, WritableAtom } from 'jotai';
import { fillPathAtom, minifyOutputAtom, precisionAtom, previewAtom, showGridAtom, showTicksAtom, snapToGridAtom, tickIntevalAtom } from '../../store/store';
import { useAtomValue } from 'jotai/utils';
//import { AccordionHorizontal } from '../UI/Accordion';

function Button({ label, atom, leftBorder = true }: { label: string; atom: WritableAtom<boolean, SetStateAction<boolean>, void>; leftBorder?: boolean; }) {
    const [showGrid, setShowGrid] = useAtom(atom);
    return (
        <button
            className={`px-1 h-6 text-sm text-slate-400 border-slate-500 border ${leftBorder ? 'rounded' : 'rounded-r'} active:scale-[.97] ${showGrid ? 'bg-slate-800 shadow-sm shadow-slate-800' : 'bg-slate-600'}`}
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

function Checkbox({ label, tooltip, atom }: { label: string; tooltip: string; atom: PrimitiveAtom<boolean>; }) {
    const [value, setValue] = useAtom(atom);
    return (
        <label className="flex items-center text-xs space-x-2 select-none" title={tooltip}>
            <input
                type="checkbox" className="rounded text-slate-700 bg-slate-400 focus:ring-slate-900"
                checked={value}
                onChange={() => setValue(v => !v)}
            />
            <div className="">{label}</div>
        </label>
    );
}

export function AppCommands() {
    const showGrid = useAtomValue(showGridAtom);
    const showTicks = useAtomValue(showTicksAtom);
    const [tickInteval, setTickInteval] = useAtom(tickIntevalAtom); //TODO: validate input
    const [precision, setPrecision] = useAtom(precisionAtom); //TODO: validate input

    return (
        <div className="absolute bottom-4 right-4 px-2 py-2 bg-slate-400/40 rounded flex items-center space-x-2">

            <div className="space-y-1">
                <Checkbox label="Snap to Grid" tooltip="Snap dragged points to grid" atom={snapToGridAtom} />
                <Checkbox label="Fill" tooltip="Fill path" atom={fillPathAtom} />
                <Checkbox label="Preview" tooltip="Preview mode" atom={previewAtom} />
                <Checkbox label="Minify" tooltip="Minify output" atom={minifyOutputAtom} />

                <label className="flex items-center text-xs space-x-2 select-none">
                    <div className="">Precision</div>
                    <input
                        className={`w-6 h-6 text-sm text-center rounded border border-slate-500 text-slate-400 bg-slate-700 focus:outline-none shadow-sm shadow-slate-800`}
                        value={precision}
                        onChange={(event) => setPrecision(+event.target.value)}
                    />
                </label>
            </div>

            <div className="self-end flex">
                {showGrid &&
                    <div className="flex items-center ">
                        {showTicks &&
                            <input
                                className={`w-6 h-6 text-sm text-center rounded-l border border-slate-500 text-slate-400 bg-slate-700 focus:outline-none shadow-sm shadow-slate-800`}
                                value={tickInteval}
                                onChange={(event) => setTickInteval(+event.target.value)}
                            />}
                        <Button label="Ticks" atom={showTicksAtom} leftBorder={!showTicks} />
                    </div>
                }
                <Button label="Grid" atom={showGridAtom} />
            </div>
        </div>
    );
}
