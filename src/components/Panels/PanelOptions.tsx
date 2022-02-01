import React from 'react';
import { PrimitiveAtom, useAtom, WritableAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { autoZoomAtom, doSetViewBoxAtom, doSetZoomAtom, fillPathAtom, minifyOutputAtom, openPanelOptsAtom, precisionAtom, showCPsAtom, showGridAtom, showTicksAtom, snapToGridAtom, tickIntevalAtom } from '../../store/store';
import { useNumberInput } from '../../hooks/useNumberInput';
import { classNames } from '../../utils/classnames';
import { ViewBox, ViewBoxManual } from '../../svg/svg-utils-viewport';
import { SectionPane } from '../UI/SectionPane';
import { Accordion } from '../UI/Accordion';
import { useKey } from 'react-use';
import { UILockIcon } from '../UI/UILockIcon';

function Button({ scale = true, children, className, ...rest }: { scale?: boolean; onClick: () => void; } & React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={classNames(
                "px-1 flex-1 py-0.5 mx-auto text-slate-900 bg-slate-400 border-slate-500 shadow-sm shadow-slate-800/40 border rounded-sm select-none",
                `${scale ? 'active:scale-[.97]' : ''}`,
                className
            )}
            {...rest}
        >
            {children}
        </button>
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
    const [autoZoom, setAutoZoom] = useAtom(autoZoomAtom);
    return (
        <div className="flex space-x-1.5">
            <ViewboxInput label="x" tooltip="view box x" idx={0} />
            <ViewboxInput label="y" tooltip="view box y" idx={1} />
            <ViewboxInput label="width" tooltip="view box width" idx={2} />
            <ViewboxInput label="height" tooltip="view box height" idx={3} />

            <Button onClick={() => { setAutoZoom((v) => !v); }} scale={false} title={!autoZoom ? 'viewBox is locked' : 'viewBox is unlocked'}>
                <UILockIcon className={`w-5 h-5 mx-0.5 ${autoZoom ? 'text-slate-700 fill-current' : 'text-slate-700 fill-current'}`} locked={!autoZoom} />
            </Button>
        </div>
    );
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

function ZoomControls({ className }: { className?: string; }) {
    const doAction = useUpdateAtom(doSetZoomAtom);
    useKey(
        (event) => event.altKey && (event.key === '1' || event.key === '2' || event.key === '3'),
        (event) => { event.preventDefault(); doAction(event.key === '1' ? 10 : event.key === '3' ? -10 : 0); }
    );
    return (
        <div className={classNames("flex items-center", className)}>
            <ZoomButton label="-" title="Zoom Out (Alt+1)" atom={doSetZoomAtom} value={10} className="rounded-l border w-8" />
            <ZoomButton label="Zoom to Fit" title="Zoom to Fit (Alt+2)" atom={doSetZoomAtom} value={0} className="border-t border-b px-2" />
            <ZoomButton label="+" title="Zoom In (Alt+3)" atom={doSetZoomAtom} value={-10} className="rounded-r border w-8" />
        </div>
    );
}

function Checkbox({ label, tooltip, atom, className, ...rest }: { label: string; tooltip: string; atom: PrimitiveAtom<boolean>; } & React.HTMLAttributes<HTMLLabelElement>) {
    const [value, setValue] = useAtom(atom);
    return (
        <label className={classNames("w-min h-6 whitespace-nowrap flex items-center text-xs space-x-1.5 select-none", className)} title={tooltip} {...rest}>
            <input
                type="checkbox" className="rounded text-slate-500 bg-slate-300 focus:ring-slate-500 focus:ring-offset-1"
                checked={value}
                onChange={() => setValue(v => !v)}
            />
            <div className="">{label}</div>
        </label>
    );
}

function PrecisionInput({ className, ...rest }: React.HTMLAttributes<HTMLLabelElement>) {
    const snapToGrid = useAtomValue(snapToGridAtom);
    const [precision, setPrecision] = useAtom(precisionAtom);
    const bind = useNumberInput(precision, (v: number) => setPrecision(v));
    return (
        <label className={classNames("flex items-center text-xs space-x-1 select-none", className)} {...rest}>
            {!snapToGrid && <>
                <div className="">Precision</div>
                <input
                    className={`w-8 h-[1.375rem] text-xs text-center text-slate-900 bg-slate-200 border-slate-300 rounded border focus:outline-none shadow-sm shadow-slate-800/30`}
                    title="Point precision"
                    {...bind}
                />
            </>}
        </label>
    );
}

function TicksControl({ className, ...rest }: React.HTMLAttributes<HTMLElement>) {
    const showGrid = useAtomValue(showGridAtom);
    const showTicks = useAtomValue(showTicksAtom);
    const [tickInteval, setTickInteval] = useAtom(tickIntevalAtom);
    const bind = useNumberInput(tickInteval, (v: number) => setTickInteval(v));
    return (<>
        <div className={classNames("flex justify-between", className)} {...rest}>
            {showGrid && <>
                <Checkbox label="Ticks" tooltip="Show ticks" atom={showTicksAtom} />
                <div className="flex items-center ">
                    {showTicks &&
                        <input
                            className={`w-8 h-[1.375rem] text-xs text-center text-slate-900 bg-slate-200 border-slate-300 shadow-slate-800/30 rounded border focus:outline-none shadow-sm focus:ring-0`}
                            title="Ticks interval"
                            {...bind}
                        />
                    }
                </div>
            </>
            }
        </div>
    </>);
}

function PanelBody() {
    return (
        <div className="px-1.5 pt-1 pb-3 bg-slate-400/40 rounded flex items-center space-x-2">
            <div className="flex flex-col">
                {/* ViewBox */}
                <div className="text-xs">viewbox</div>
                <ViewBoxControls />
                <ZoomControls className="mt-3" />

                <div className="mt-2 grid grid-cols-[1fr,minmax(6rem,min-content)]">
                    {/* Snap controls */}
                    <Checkbox label="Snap to grid" tooltip="Snap dragged points to grid" atom={snapToGridAtom} />
                    <PrecisionInput className="justify-end" />

                    {/* Show grid and tick controls */}
                    <Checkbox label="Show grid" tooltip="Show grid" atom={showGridAtom} />
                    <TicksControl className="justify-end" />

                    {/* All other */}
                    <Checkbox label="Show point contols" tooltip="Show SVG point contols" atom={showCPsAtom} />
                    <Checkbox label="Fill path" tooltip="Fill path" className="" atom={fillPathAtom} />

                    <Checkbox label="Minify output" tooltip="Minify output path" className="col-span-full" atom={minifyOutputAtom} />
                </div>
            </div>
        </div>
    );
}

export function PanelOptions() {
    const [open, setOpen] = useAtom(openPanelOptsAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Options
            </SectionPane>
            <Accordion toggle={open}>
                <div className="text-sm bg-slate-300 overflow-hidden">
                    <PanelBody />
                </div>
            </Accordion>
        </div>
    );
}
