import { atom, PrimitiveAtom, useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import React, { useEffect } from "react";
import { activePointAtom, svgAtom } from "../../store/store";
import { SvgItem } from "../../svg/svg";
import { IconMenu } from "../UI/icons/Icons";

function PointName({ pathIdx, command, abs }: { pathIdx: number; command: string; abs: boolean; }) {
    const setActivePoint = useUpdateAtom(activePointAtom);
    return (
        <label
            className={`flex-0 px-1 w-6 leading-3 text-xs rounded-l-[0.2rem] text-center text-slate-900 bg-slate-400 focus-within:text-blue-500 overflow-hidden`}
        // onFocus={() => setActivePoint(pathIdx)}
        >
            {/* <input className="px-1 w-full text-xs text-center text-slate-900 bg-slate-500 focus:outline-none" defaultValue={"M"} /> */}
            <button className="py-1">{command}</button>
        </label>
    );
}

function PointValue({ pathIdx, atom }: { pathIdx: number; atom: PrimitiveAtom<number>; }) {
    const [value, setValue] = useAtom(atom);

    const [local, setLocal] = React.useState(''+value);
    React.useEffect(() => {
        setLocal(''+value);
    }, [value]);

    function convertToNumber(s: string) {
        s = s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, ''); //disable type illegal chars. \u066B unicode-arabic-decimal-separator
        const v = +s;
        setLocal(s);
        s && !isNaN(v) && setValue(v);
    }
    function resetInvalid() {
        (!local || isNaN(+local)) && setLocal(''+value);
    }

    console.log('value', value);
    

    //const setActivePoint = useUpdateAtom(activePointAtom);
    return (
        <label
            className={`flex-1 max-w-[3rem] rounded-tl-sm overflow-hidden bg-slate-200 focus-within:text-blue-500`}
        // onFocus={() => setActivePoint(pathIdx)}
        >
            <input
                className="px-px pb-[4px] w-full h-full text-[10px] text-center tracking-tighter text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none"
                value={local}
                onChange={(event) => convertToNumber(event.target.value)}
                onBlur={resetInvalid}
            />
        </label>
    );
}

// function PointValue({ pathIdx, atom }: { pathIdx: number; atom: PrimitiveAtom<number>; }) {
//     const [value, setValue] = useAtom(atom);
//     const setActivePoint = useUpdateAtom(activePointAtom);
//     function convertToNumber(s: string) {
//         const v = +s;
//         if (!isNaN(v)) {
//             setValue(+s);
//         }
//     }
//     return (
//         <label
//             className={`flex-1 max-w-[3rem] rounded-tl-sm overflow-hidden bg-slate-200 focus-within:text-blue-500`}
//             // onFocus={() => setActivePoint(pathIdx)}
//         >
//             <input
//                 className="px-px pb-[4px] w-full h-full text-[10px] text-center tracking-tighter text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none"
//                 value={value}
//                 onChange={(event) => convertToNumber(event.target.value)}
//             />
//         </label>
//     );
// }

//TODO: switch to grid (first row problem)

function CommandRow({ path, pathIdx }: { path: SvgItem; pathIdx: number; }) {
    const createAtoms = () => path.values.map((value) => atom(value));

    const [valuesAtoms, setValuesAtoms] = React.useState(createAtoms());
    useEffect(() => {
        setValuesAtoms(createAtoms());
    }, [path]);

    const [activePoint, setActivePoint] = useAtom(activePointAtom);
    const active = activePoint === pathIdx;

    return (<>
        <div
            className={`flex items-center justify-between ${active ? 'bg-blue-300' : ''}`}
            onClick={() => setActivePoint(pathIdx)}
            // onFocus={() => console.log('child')}
        >
            {/* Values */}
            <div className="flex items-center justify-items-start font-mono space-x-0.5">
                <PointName pathIdx={pathIdx} command={path.getType()} abs={false} />

                {valuesAtoms.map((atom, idx) => (
                    <PointValue pathIdx={pathIdx} atom={atom} key={idx} />
                ))}
            </div>

            {/* Menu */}
            <button className="flex-0 mt-0.5 pl-4 active:scale-[.97]">
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
                <CommandRow path={path} pathIdx={idx} key={idx} />
            ))}
        </div >
    );
}
