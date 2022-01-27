import React from 'react';
import { PrimitiveAtom, useAtom, WritableAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { doSetViewBoxAtom, doSetZoomAtom, fillPathAtom, minifyOutputAtom, openPanelOptsAtom, precisionAtom, previewAtom, showGridAtom, showTicksAtom, snapToGridAtom, tickIntevalAtom } from '../../store/store';
import { useNumberInput } from '../../hooks/useNumberInput';
import { classNames } from '../../utils/classnames';
import { ViewBox, ViewBoxManual } from '../../svg/svg-utils-viewport';
import { SectionPane } from '../UI/SectionPane';
import { Accordion } from '../UI/Accordion';

function Checkbox({ label, tooltip, atom }: { label: string; tooltip: string; atom: PrimitiveAtom<boolean>; }) {
    const [value, setValue] = useAtom(atom);
    return (
        <label className="w-min h-6 whitespace-nowrap flex items-center text-xs space-x-2 select-none" title={tooltip}>
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
    const [viewboxRow, setViewbox] = useAtom(doSetViewBoxAtom);
    const viewbox = viewboxRow.map(v => parseFloat(v.toFixed(3))) as ViewBox;
    const bind = useNumberInput(viewbox[idx], (v: number) => {
        let box: ViewBoxManual = [...viewbox];
        box[idx] = v;
        if (idx === 2) { box[3] = null; }
        if (idx === 3) { box[2] = null; }
        setViewbox(box);
    });
    return (
        <label className="relative text-xs select-none" title={tooltip}>
            <div className="absolute left-1.5 text-[.6rem] text-slate-900/60">{label}</div>
            <input
                className={`px-1 pt-3 w-14 h-8 text-xs text-slate-900 bg-slate-200 border-slate-300 rounded border focus:outline-none shadow-sm shadow-slate-800/30`}
                {...bind}
            />
        </label>
    );
}

function ViewBoxControls() {
    return (
        <div className="flex space-x-1.5">
            <ViewboxInput label="x" tooltip="view box" idx={0} />
            <ViewboxInput label="y" tooltip="view box" idx={1} />
            <ViewboxInput label="width" tooltip="view box" idx={2} />
            <ViewboxInput label="height" tooltip="view box" idx={3} />
        </div>
    );
}

function PrecisionInput() {
    const [precision, setPrecision] = useAtom(precisionAtom);
    const bind = useNumberInput(precision, (v: number) => setPrecision(v));
    return (
        <label className="flex items-center text-xs space-x-1 select-none">
            <div className="">Precision</div>
            <input
                className={`w-8 h-[1.375rem] text-xs text-center text-slate-900 bg-slate-200 border-slate-300 rounded border focus:outline-none shadow-sm shadow-slate-800/30`}
                {...bind}
            />
        </label>
    );
}

function TicksControl() {
    const showGrid = useAtomValue(showGridAtom);
    const showTicks = useAtomValue(showTicksAtom);
    const [tickInteval, setTickInteval] = useAtom(tickIntevalAtom);
    const bind = useNumberInput(tickInteval, (v: number) => setTickInteval(v));
    return (<>
        {showGrid && <>
            <Checkbox label="Ticks" tooltip="Show ticks" atom={showTicksAtom} />
            <div className="flex items-center ">
                {showTicks &&
                    <input
                        className={`w-8 h-[1.375rem] text-xs text-center text-slate-900 bg-slate-200 border-slate-300 shadow-slate-800/30 rounded border focus:outline-none shadow-sm focus:ring-0`}
                        {...bind}
                    />
                }
            </div>
        </>
        }
    </>);
}

function ZoomButton({ label, title, atom, value, className = '' }: { label: string; title: string; atom: WritableAtom<null, number>; value: number; className?: string; }) {
    const doAction = useUpdateAtom(atom);
    return (
        <button
            className={classNames(
                `px-1 pb-px h-8 text-xs text-slate-900 bg-slate-400 border-slate-500 shadow-sm shadow-slate-800/50 active:scale-[.97] select-none`,
                className
            )}
            onClick={() => doAction(value)}
            title={title}
        >
            {label}
        </button>
    );
}

function ZoomControls() {
    return (
        <div className="flex items-center">
            <ZoomButton label="-" title="Zoom Out" atom={doSetZoomAtom} value={10} className="rounded-l border w-8" />
            <ZoomButton label="Zoom to Fit" title="Zoom to Fit" atom={doSetZoomAtom} value={0} className="border-t border-b px-2" />
            <ZoomButton label="+" title="Zoom In" atom={doSetZoomAtom} value={-10} className="rounded-r border w-8" />
        </div>
    );
}

export function PanelCanvasControlsInternals() {
    return (
        <div className="px-1.5 pt-1 pb-3 bg-slate-400/40 rounded flex items-center space-x-2">
            <div className="flex flex-col">
                {/* ViewBox */}
                <div className="text-xs">viewbox</div>
                <ViewBoxControls />

                <div className="mt-3">
                    <ZoomControls />
                </div>

                <div className="flex flex-col">
                    {/* Checkboxes */}
                    <div className="mt-2">
                        {/* Snap controls */}
                        <div className="flex items-center space-x-2">
                            <Checkbox label="Snap to Grid" tooltip="Snap dragged points to grid" atom={snapToGridAtom} />
                            <PrecisionInput />
                        </div>
                        {/* Grid controls */}
                        <div className="h-6 flex items-center space-x-4">
                            <Checkbox label="Show Grid" tooltip="Show grid" atom={showGridAtom} />
                            <div className="flex space-x-2">
                                <TicksControl />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox label="Preview" tooltip="Preview mode" atom={previewAtom} />
                            <Checkbox label="Fill Path" tooltip="Fill path" atom={fillPathAtom} />
                        </div>
                        <Checkbox label="Minify output" tooltip="Minify output" atom={minifyOutputAtom} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PanelOptions() {
    const [open, setOpen] = useAtom(openPanelOptsAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Options
            </SectionPane>
            <Accordion toggle={open}>
                <div className="text-sm bg-slate-300 overflow-hidden">
                    <PanelCanvasControlsInternals />
                </div>
            </Accordion>
        </div>
    );
}
