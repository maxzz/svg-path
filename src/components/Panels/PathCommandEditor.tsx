import { atom, PrimitiveAtom, SetStateAction, useAtom, WritableAtom } from "jotai";
import React, { useEffect } from "react";
import atomWithCallback, { OnValueChange } from "../../hooks/atomsX";
import { activePointAtom, svgAtom } from "../../store/store";
import { SvgItem } from "../../svg/svg";
import { IconMenu } from "../UI/icons/Icons";

function PointName({ pathIdx, command, abs }: { pathIdx: number; command: string; abs: boolean; }) {
    return (
        <label
            className={`flex-0 px-1 w-6 leading-3 text-xs rounded-l-[0.2rem] text-center text-slate-900 bg-slate-400 focus-within:text-blue-500 overflow-hidden`}
        >
            {/* <input className="px-1 w-full text-xs text-center text-slate-900 bg-slate-500 focus:outline-none" defaultValue={"M"} /> */}
            <button className="py-1">{command}</button>
        </label>
    );
}

function PointValue({ pathIdx, atom }: { pathIdx: number; atom: PrimitiveAtom<number>; }) {
    const [value, setValue] = useAtom(atom);
    const [local, setLocal] = React.useState('' + value);
    React.useEffect(() => setLocal('' + value), [value]);

    function convertToNumber(s: string) {
        s = s.replace(/[\u066B,]/g, '.').replace(/[^\-0-9.eE]/g, ''); //disable type illegal chars. \u066B unicode-arabic-decimal-separator
        const v = +s;
        setLocal(s);
        s && !isNaN(v) && setValue(v);
    }

    function resetInvalid() {
        (!local || isNaN(+local)) && setLocal('' + value);
    }

    return (
        <label className={`flex-1 max-w-[3rem] rounded-tl-sm overflow-hidden bg-slate-200 focus-within:text-blue-500`}>
            <input
                className="px-px pb-[4px] w-full h-full text-[10px] text-center tracking-tighter text-slate-900 focus:border-blue-500 bg-slate-200 focus:outline-none"
                value={local}
                onChange={(event) => convertToNumber(event.target.value)}
                onBlur={resetInvalid}
            />
        </label>
    );
}

//TODO: switch to grid (first row problem)

const createRowAtoms = (values: number[], monitor: OnValueChange<number>) => {
    return values.map((value) => atomWithCallback(value, monitor));
};

function CommandRow({ svgItem, svgItemIdx }: { svgItem: SvgItem; svgItemIdx: number; }) {

    const [masterAtom, setMasterAtom] = React.useState(atom([]));
    const [master, setmaster] = useAtom(masterAtom);

    console.log('render', svgItem.asString());
    

    useEffect(() => {
        console.log('effect', svgItem.asString());
    }, [svgItem]);

/*
    // const onAtomChange = React.useCallback<OnValueChange<number>>(({ get, set }) => {
    //     console.log('valueAtoms', valueAtoms.map(a => a.toString()));

    //     const res = valueAtoms.map((valueAtom) => get(valueAtom)).join(',');
    //     console.log('changed', res);
    // }, []);

    const onAtomChange = React.useCallback<OnValueChange<number>>(({ get, set }) => {
        const aa = getAtoms();
        console.log('valueAtoms', aa.map(a => a.toString()));

        const res = aa.map((valueAtom) => get(valueAtom)).join(',');
        console.log('changed', res);
    }, []);

    function getAtoms() {
        return valueAtoms;
    }

    // const onAtomChange: OnValueChange<number> = ({ get, set }) => {
    //     console.log('valueAtoms', valueAtoms.map(a => a.toString()));

    //     const res = valueAtoms.map((valueAtom) => get(valueAtom)).join(',');
    //     console.log('changed', res);
    // };

    // const [valueAtoms, setValuesAtoms] = React.useState(createRowAtoms(svgItem.values, onAtomChange));
    const [valueAtoms, setValuesAtoms] = React.useState<WritableAtom<number, SetStateAction<number>>[]>([]);
    useEffect(() => {
        const a = createRowAtoms(svgItem.values, onAtomChange);
        console.log('update atoms', a.map(a => a.toString()));

        setValuesAtoms(a);
    }, [svgItem]);

    console.log('main valueAtoms', valueAtoms.map(a => a.toString()), svgItem.asString());
*/
    const [activePoint, setActivePoint] = useAtom(activePointAtom);
    const active = activePoint === svgItemIdx;

    return (<>
        <div
            className={`flex items-center justify-between ${active ? 'bg-blue-300' : ''}`}
            onClick={() => setActivePoint(svgItemIdx)}
        >
            {/* Values */}
            <div className="flex items-center justify-items-start font-mono space-x-0.5">
                <PointName pathIdx={svgItemIdx} command={svgItem.getType()} abs={false} />

                {/* {valueAtoms.map((atom, idx) => (
                    <PointValue pathIdx={svgItemIdx} atom={atom} key={idx} />
                ))} */}
            </div>

            {/* Menu */}
            <button className="flex-0 mt-0.5 pl-4 active:scale-[.97]">
                <IconMenu className="w-4 h-4" />
            </button>
        </div>
    </>);
}

//M61.27.5c45.13.16 68.384 25.592 96.354 57.072 27.98 31.47 41.564 54.925 75.536 54.478 33.972-.447 50.78-22.13 50.78-50.78 0-28.65-14.587-51.595-50.78-50.77-36.193.825-60.4 17.052-88.2 47.072-27.8 30.01-40.15 64.308-83.68 64.478C17.74 122.21.5 89.93.5 61.28.5 32.63 16.14.34 61.27.5z

export function PathCommandEditor() {
    const [svg] = useAtom(svgAtom);
    return (
        <div className="my-1 space-y-0.5">
            {/* {
                <CommandRow svgItem={svg.path[0]} svgItemIdx={0} key={0} />
            } */}
            {svg.path.map((svgItem, idx) => (
                <CommandRow svgItem={svgItem} svgItemIdx={idx} key={idx} />
            ))}
        </div >
    );
}
