import { atom } from "jotai";
import { Svg } from "../svg/svg";

export const pathAtom = atom('M 0 100 L 25 100 C 34 20 40 0 100 0');

export const svgAtom = atom(
    (get) => {
        const path = get(pathAtom);
        try {
            return new Svg(path);
        } catch (error) {
            return new Svg('');
        }
    }
);
