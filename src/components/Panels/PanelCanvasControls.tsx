import React from 'react';
import { PrimitiveAtom, SetStateAction, useAtom, WritableAtom } from 'jotai';
import { doAutoZoomAtom, doSetZoomAtom, fillPathAtom, minifyOutputAtom, precisionAtom, previewAtom, showGridAtom, showTicksAtom, snapToGridAtom, tickIntevalAtom, viewBoxAtom } from '../../store/store';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { useNumberInput } from '../../hooks/useNumberInput';
import { ViewBox } from '../../svg/svg-utils-viewport';
import { classNames } from '../../utils/classnames';
//import { AccordionHorizontal } from '../UI/Accordion';

function Button({ label, atom, leftBorder = true }: { label: string; atom: PrimitiveAtom<boolean>; leftBorder?: boolean; }) {
    const [isDown, setIsDown] = useAtom(atom);
    return (
        <button
            className={`px-1 h-6 text-xs text-slate-400 border-slate-500 border 
                ${isDown ? 'bg-slate-800 shadow-sm shadow-slate-800' : 'bg-slate-600'}
                ${leftBorder ? 'rounded' : 'rounded-r'} active:scale-[.97]`
            }
            onClick={() => setIsDown((prev) => !prev)}
        >
            {label}
        </button>
    );
}

// export function CanvasControlsPanel() {
//     const [showGrid] = useAtom(showGridAtom);
//     return (
//         <div className="absolute bottom-4 right-4 px-2 py-2 bg-slate-400/40 rounded flex items-center space-x-2">
//             {/* <AccordionHorizontal toggle={showGrid}>
//                 <div className=""> */}
//             {showGrid && <Button label="Ticks" atom={showTicksAtom} />}
//             <Button label="Grid" atom={showGridAtom} />
//             {/* </div>
//             </AccordionHorizontal> */}
//         </div>
//     );
// }

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

function ViewboxInput({ label, tooltip, idx }: { label: string; tooltip: string; idx: number; }) {
    let [value, setValue] = useAtom(viewBoxAtom);
    value = value.map(v => parseFloat(v.toFixed(3))) as ViewBox;
    const bind = useNumberInput(value[idx], (v: number) => setValue(prev => ((prev[idx] = v), [...prev])));
    return (
        <label className="relative text-xs select-none text-slate-400" title={tooltip}>
            <div className="absolute left-1.5 text-[.6rem] text-slate-400/50">{label}</div>
            <input
                className={`px-1 pt-3 w-14 h-8 text-xs rounded border border-slate-500 bg-slate-700 focus:outline-none shadow-sm shadow-slate-800`}
                {...bind}
            />
        </label>
    );
}

function PrecisionInput() {
    const [precision, setPrecision] = useAtom(precisionAtom); //TODO: validate input
    return (
        <label className="flex items-center text-xs space-x-1 select-none">
            <div className="">Precision</div>
            <input
                className={`w-6 h-6 text-xs text-center rounded border border-slate-500 text-slate-400 bg-slate-700 focus:outline-none shadow-sm shadow-slate-800`}
                value={precision}
                onChange={(event) => setPrecision(+event.target.value)}
            />
        </label>
    );
}

function TicksControl() {
    const showGrid = useAtomValue(showGridAtom);
    const showTicks = useAtomValue(showTicksAtom);
    const [tickInteval, setTickInteval] = useAtom(tickIntevalAtom); //TODO: validate input
    return (<>
        {showGrid &&
            <div className="flex items-center ">
                {showTicks &&
                    <input
                        className={`w-6 h-6 text-xs text-center rounded-l border border-slate-500 text-slate-400 bg-slate-700 focus:outline-none shadow-sm shadow-slate-800`}
                        value={tickInteval}
                        onChange={(event) => setTickInteval(+event.target.value)}
                    />}
                <Button label="Ticks" atom={showTicksAtom} leftBorder={!showTicks} />
            </div>
        }

    </>);
}

function ButtonZoom({ label, atom, value, className = '' }: { label: string; atom: WritableAtom<null, number>; value: number; className?: string; }) {
    const setIsDown = useUpdateAtom(atom);
    return (
        <button
            className={classNames(
                `px-1 pb-0.5 h-6 text-xs text-slate-400 border-slate-500 bg-slate-800 shadow-sm shadow-slate-800 active:scale-[.97] select-none`,
                className
            )}
            onClick={() => setIsDown(value)}
        >
            {label}
        </button>
    );
}

function ZoomControls() {
    return (
        <div className="flex items-center">
            <ButtonZoom label="-" atom={doSetZoomAtom} value={10} className="rounded-l border w-5"/>
            <ButtonZoom label="Fit Zoom" atom={doSetZoomAtom} value={0} className="border-t border-b"/>
            <ButtonZoom label="+" atom={doSetZoomAtom} value={-10} className="rounded-r border w-5"/>
        </div>
    );
}

export function PanelCanvasControls() {
    return (
        <div className="absolute bottom-4 right-4 px-3 py-4 bg-slate-400/40 rounded flex items-center space-x-2">
            <div className="flex flex-col">
                {/* ViewBox */}
                <div className="flex space-x-1.5">
                    <ViewboxInput label="x" tooltip="view box" idx={0} />
                    <ViewboxInput label="y" tooltip="view box" idx={1} />
                    <ViewboxInput label="width" tooltip="view box" idx={2} />
                    <ViewboxInput label="height" tooltip="view box" idx={3} />
                </div>

                <div className="flex flex-col">
                    {/* Checkboxes */}
                    <div className="mt-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <Checkbox label="Snap to Grid" tooltip="Snap dragged points to grid" atom={snapToGridAtom} />
                            </div>
                            <PrecisionInput />
                        </div>
                        <Checkbox label="Fill" tooltip="Fill path" atom={fillPathAtom} />
                        <Checkbox label="Preview" tooltip="Preview mode" atom={previewAtom} />
                        <Checkbox label="Minify" tooltip="Minify output" atom={minifyOutputAtom} />
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex items-center justify-between">
                        <ZoomControls />

                        <div className="flex">
                            <TicksControl />
                            <Button label="Grid" atom={showGridAtom} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
