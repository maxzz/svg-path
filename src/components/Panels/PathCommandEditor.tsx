import { atom, PrimitiveAtom, useAtom } from "jotai";
import React, { useEffect } from "react";
import { activePointAtom, svgAtom } from "../../store/store";
import { SvgItem } from "../../svg/svg";
import { IconMenu } from "../UI/icons/Icons";

function PointName({ command, abs }: { command: string; abs: boolean; }) {
    return (
        <label className={`flex-0 px-1 w-6 leading-3 text-xs rounded-l-[0.2rem] text-center text-slate-900 bg-slate-500 focus-within:text-blue-500 overflow-hidden`}>
            {/* <input className="px-1 w-full text-xs text-center text-slate-900 bg-slate-500 focus:outline-none" defaultValue={"M"} /> */}
            <button className="py-1">{command}</button>
        </label>
    );
}

function PointValue({ atom }: { atom: PrimitiveAtom<number>; }) {
    const [value, setValue] = useAtom(atom);
    return (
        <label className={`flex-1 max-w-[2rem] rounded-tl-sm overflow-hidden bg-slate-200 focus-within:text-blue-500`}>
            <input
                className="px-1 pb-[4px] w-full h-full text-xs text-center text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none"
                value={value}
                onChange={(event) => setValue(+event.target.value)}
            />
        </label>
    );
}

function CommandRow({ path, idx }: { path: SvgItem; idx: number; }) {
    const createAtoms = () => path.values.map((value) => atom(value));

    const [valuesAtoms, setValuesAtoms] = React.useState(createAtoms());
    useEffect(() => {
        setValuesAtoms(createAtoms());
    }, [path]);

    const [activePoint] = useAtom(activePointAtom);
    const active = activePoint === idx;

    return (<>
        <div className={`flex items-center justify-between ${active ? 'bg-blue-300' : ''}`}>
            
            {/* Values */}
            <div className="flex items-center justify-items-start font-mono space-x-0.5">
                <PointName command={path.getType()} abs={false} />
                {valuesAtoms.map((atom, idx) => (
                    <PointValue atom={atom} key={idx} />
                ))}
            </div>

            {/* Menu */}
            <button className="flex-0 px-1 mt-0.5 active:scale-[.97]">
                <IconMenu className="w-4 h-4" />
            </button>
        </div>
    </>);
}

export function PathCommandEditor() {
    const [svg] = useAtom(svgAtom);
    return (
        <div className="my-1 space-y-0.5">
            {svg.path.map((path, idx) => (
                <CommandRow path={path} idx={idx} key={idx} />
            ))}
        </div >
    );
}
