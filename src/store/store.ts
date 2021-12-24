import { atom } from "jotai";
import { Svg } from "../svg/svg";

//export const pathAtom = atom('M 0 100 L 25 100 C 34 20 40 0 100 0');
//export const pathSafeAtom = atom('M 0 100 L 25 100 C 34 20 40 0 100 0');

// Input comes from the user and is unsafe

const _pathUnsafeAtom = atom('M 0 100 L 25 100 C 34 20 40 0 100 0');

export const pathUnsafeAtom = atom(
    (get) => {
        return get(_pathUnsafeAtom);
    },
    (get, set, path: string) => {
        set(_pathUnsafeAtom, path);

        try {
            const newSvg = new Svg(path);
            set(_svgAtom, newSvg);
        } catch (error) {
        }
    }
);

// Input comes from the command editor and is safe (the editor must check the row numbers and quantity of required numbers)

const _svgAtom = atom(new Svg(''));

export const svgAtom = atom(
    (get) => {
        return get(_svgAtom);
    },
    (get, set, svg: Svg) => {
        set(_svgAtom, svg);

        const path = svg.asString();
        set(_pathUnsafeAtom, path);
    }
);
