import { atom, Getter } from "jotai";
import atomWithCallback from "../hooks/atomsX";
import { Svg } from "../svg/svg";
import debounce from "../utils/debounce";


namespace Storage {
    const KEY = 'react-svg-expo-01';

    type Store = {
        path: string;
    };

    export let initialData: Store = {
        path: 'M 0 100 L 25 100 C 34 20 40 0 100 0',
    };

    function load() {
        const s = localStorage.getItem(KEY);
        if (s) {
            try {
                let obj = JSON.parse(s) as Store;
                initialData = obj;
            } catch (error) {
            }
        }
    }
    load();

    export const save = debounce(function _save(get: Getter) {
        let newStore: Store = {
            path: get(_pathUnsafeAtom),
        };
        localStorage.setItem(KEY, JSON.stringify(newStore));
    }, 1000);
}

//export const pathAtom = atom('M 0 100 L 25 100 C 34 20 40 0 100 0');
//export const pathSafeAtom = atom('M 0 100 L 25 100 C 34 20 40 0 100 0');

// Input comes from the user and is unsafe

const _pathUnsafeAtom = atomWithCallback(Storage.initialData.path, ({get}) => Storage.save(get));

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
