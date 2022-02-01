import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { doRoundAtom, doScaleAtom, doSetRelAbsAtom, doTransAtom, openPanelOperAtom, operRoundAtom, operScaleUniAtom, operScaleXAtom, operScaleYAtom, operTransXAtom, operTransYAtom } from "../../store/store";
import { Accordion } from "../UI/Accordion";
import { SectionPane } from "../UI/SectionPane";
import { cleanupValueFloat, cleanupValueUInt, useNumberInput } from "../../hooks/useNumberInput";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { IconLock } from "../UI/icons/Icons";
import { classNames } from "../../utils/classnames";
import { useKey } from "react-use";

function OperationInput({ label, overlay, className, atom, cleanup = cleanupValueFloat, onEnter, style }: React.HTMLAttributes<HTMLLabelElement> & {
    label: string;
    overlay?: React.ReactNode;
    atom: PrimitiveAtom<number>;
    cleanup?: (s: string) => string;
    onEnter?: () => void;
}) {
    const [value, setValue] = useAtom(atom);
    const bind = useNumberInput(value, (v) => setValue(v), cleanup);
    const inputRef = React.useRef(null);
    useKey('Enter', () => onEnter && onEnter(), { target: inputRef.current }, [inputRef.current]);
    return (
        <label className={classNames("relative w-1/3 rounded-tl-sm overflow-hidden focus-within:text-blue-500", className)} style={style}>
            <div className="px-1 -mt-1 absolute text-[.6rem] select-none pointer-events-none">
                {label}
            </div>
            {overlay}
            <input
                className="px-1 pt-3 h-8 w-full border-b-2 text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none"
                ref={inputRef}
                {...bind}
            />
        </label>
    );
}

function UniformScaleControl() {
    const [uniScale, setUniScale] = useAtom(operScaleUniAtom);
    return (
        <IconLock
            className={classNames(
                "absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer",
                `${uniScale ? 'fill-slate-700' : 'fill-slate-400 stroke-slate-400'}`
            )}
            strokeWidth={2}
            onClick={() => setUniScale((v) => !v)}
            title="lock/unlock x and y scales"
            onMouseDown={((event) => event.preventDefault())}
        />
    );
}

function Button({ scale = true, children, className, ...rest }: { scale?: boolean; onClick: () => void; } & React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={classNames(
                "px-1 flex-1 py-0.5 mx-auto text-slate-900 bg-slate-400 border-slate-500 shadow-sm shadow-slate-800/40 border rounded-sm select-none",
                `${scale ? 'active:scale-[.97]':''}`,
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
}

function ScaleContols() {
    const uniScale = useAtomValue(operScaleUniAtom);
    const doScale = useUpdateAtom(doScaleAtom);
    return (
        <div className="my-1 flex space-x-1">
            <OperationInput atom={operScaleXAtom} label={uniScale ? "Uniform scale" : "Scale X"} overlay={<UniformScaleControl />} className="flex-none" onEnter={doScale} />
            {!uniScale && <OperationInput atom={operScaleYAtom} label="Scale Y" className="flex-none" onEnter={doScale} />}
            <Button onClick={doScale} style={{ transition: 'flex-basis .2s', flexBasis: !uniScale ? '30%' : '100%' }}
            // onTransitionEnd={(...args) => { console.log('end', ...args); }} 
            >Scale</Button>
        </div>
    );
}

function TranslateContols() {
    const doTrans = useUpdateAtom(doTransAtom);
    return (
        <div className="my-1 flex space-x-1">
            <OperationInput atom={operTransXAtom} label="Translate X" onEnter={doTrans} />
            <OperationInput atom={operTransYAtom} label="Translate Y" onEnter={doTrans} />
            <Button onClick={doTrans}>Translate</Button>
        </div>
    );
}

function RoundConvertContols() {
    const doRound = useUpdateAtom(doRoundAtom);
    const doSetRelAbs = useUpdateAtom(doSetRelAbsAtom);
    return (
        <div className="my-1 flex space-x-1">
            <OperationInput atom={operRoundAtom} label="Number of decimals" cleanup={cleanupValueUInt} />
            <Button title="Round all path numbers" onClick={doRound}>Round</Button>
            <Button title="Convert all commands to relative" onClick={() => doSetRelAbs(true)}>To rel</Button>
            <Button title="Convert all commands to absolute" onClick={() => doSetRelAbs(false)}>To abs</Button>
        </div>
    );
}

export function PanelOperations() {
    const [open, setOpen] = useAtom(openPanelOperAtom);
    return (
        <div className="">
            <SectionPane open={open} onClick={() => setOpen(v => !v)}>
                Path Operations
            </SectionPane>
            <Accordion toggle={open}>
                <div className="px-1.5 py-0.5 text-sm bg-slate-300 overflow-hidden">
                    <ScaleContols />
                    <TranslateContols />
                    <RoundConvertContols />
                </div>
            </Accordion>
        </div>
    );
}

//TODO: add scale in % insted of abstract numbers as it is now.
//TBD: do scale as slider(s) or replace second scalce Y with slider!!
//TODO: undo/redo on cnavs path operation
//TODO: auto zoom verticaly center

//TODO: reset translate to 0:0 after translate      <- done
//TODO: handle enter key (on first control or both) <- done
//TODO: scale 0:0 produces NaN                      <- done

//TBD: do we need to reset scale to 1:1 after scale                 <- NO
//TBD: do we need to disable scale button when scale is 0|0         <- fixed in store atom
//TBD: do we need to disable translate button when translate is 0:0 <- fixed in store atom
//TBD: do we need to disable scale button when scale is 1:1         <- fixed in store atom
