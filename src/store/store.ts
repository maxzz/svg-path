import { atom, Getter } from "jotai";
import atomWithCallback from "../hooks/atomsX";
import { Svg, SvgItem } from "../svg/svg";
import debounce from "../utils/debounce";

namespace Storage {
    const KEY = 'react-svg-expo-01';

    type Store = {
        path: string;
        showGrid: boolean;
        showTicks: boolean;
    };

    export let initialData: Store = {
        path: 'M 0 0 L 25 103 Q 52 128 63 93 C -2 26 29 0 100 0 C 83 15 85 52 61 27',
        showGrid: true,
        showTicks: true,
    };

    function load() {
        const s = localStorage.getItem(KEY);
        if (s) {
            try {
                let obj = JSON.parse(s) as Store;
                initialData = { ...initialData, ...obj };
            } catch (error) {
            }
        }
    }
    load();

    export const save = debounce(function _save(get: Getter) {
        let newStore: Store = {
            path: get(_pathUnsafeAtom),
            showGrid: get(showGridAtom),
            showTicks: get(showTicksAtom),
        };
        localStorage.setItem(KEY, JSON.stringify(newStore));
    }, 1000);
}

//export const pathAtom = atom('M 0 100 L 25 100 C 34 20 40 0 100 0');
//export const pathSafeAtom = atom('M 0 100 L 25 100 C 34 20 40 0 100 0');

function getParsedSvg(path: string): Svg | undefined {
    try {
        return new Svg(path);
    } catch (error) {
    }
}

// Input comes from the user and is unsafe

const _pathUnsafeAtom = atomWithCallback(Storage.initialData.path, ({ get }) => Storage.save(get));

export const pathUnsafeAtom = atom(
    (get) => {
        return get(_pathUnsafeAtom);
    },
    (get, set, path: string) => {
        const current = get(_pathUnsafeAtom);

        set(_pathUnsafeAtom, path);

        const newSvg = getParsedSvg(path);
        newSvg && set(_svgAtom, newSvg);
    }
);

// Input comes from the command editor and is safe (the editor must check the row numbers and quantity of required numbers)

const _svgAtom = atom(getParsedSvg(Storage.initialData.path) || new Svg(''));

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

// Upates from command editor

export const updateRowValuesAtom = atom(null, (get, set, { item, values }: { item: SvgItem, values: number[]; }) => {
    const svg = get(_svgAtom);
    item.values = values;
    svg.refreshAbsolutePositions();

    const newSvg = new Svg();
    newSvg.path = svg.path;
    set(svgAtom, newSvg);
});

export const updateRowTypeAtom = atom(null, (get, set, { item, isRelative }: { item: SvgItem, isRelative: boolean; }) => {
    const svg = get(_svgAtom);
    item.setRelative(isRelative);

    const newSvg = new Svg();
    newSvg.path = svg.path;
    set(svgAtom, newSvg);
});

// canvas zoom

export const zoomAtom = atom(1);
export const viewBoxAtom = atom<[number, number, number, number,]>([0, 0, 0, 0]);
export const pathPointsBoxAtom = atom<[number, number, number, number,]>([0, 0, 0, 0]);
export const viewBoxStrokeAtom = atom(0);

// canvas the active and hover point indices on the path (TODO: it must be atom). -1 if no index effective

export const activePointAtom = atom(-1);
export const hoverPointAtom = atom(-1);

// canvas controls

export const showGridAtom = atomWithCallback(Storage.initialData.showGrid, ({ get }) => Storage.save(get));
export const showTicksAtom = atomWithCallback(Storage.initialData.showTicks, ({ get }) => Storage.save(get));

// history

const HISTORY_MAX = 40;
export const historyAtom = atom<string[]>([]);
export const historyPtrAtom = atom(0);

export const historyAddAtom = atom(null, (get, set, v: string) => {
    let history = get(historyAtom);
    let historyPtr = get(historyPtrAtom);

    if (history.length >= HISTORY_MAX) {
        history.shift();
        historyPtr--;
    }

    set(historyAtom, [...history, v]);
    set(historyPtrAtom, historyPtr++);
});

const canUndo = (histoty: string[], historyPtr: number): boolean => historyPtr > 0 && !!history.length;
const canRedo = (histoty: string[], historyPtr: number): boolean => historyPtr < history.length - 1 && !!history.length;

export const historyUndoAtom = atom(null, (get, set, v: string) => {
    let history = get(historyAtom);
    let historyPtr = get(historyPtrAtom);

    if (historyPtr > 0 && history.length) {
        historyPtr--;
        set(historyPtrAtom, historyPtr);

        let newCurrent = history[historyPtr];
        set(pathUnsafeAtom, newCurrent);
    }
});

export const historyRedoAtom = atom(null, (get, set, v: string) => {
    let history = get(historyAtom);
    let historyPtr = get(historyPtrAtom);

    if (historyPtr < history.length - 1 && history.length) {
        historyPtr++;
        set(historyPtrAtom, historyPtr);

        let newCurrent = history[historyPtr];
        set(pathUnsafeAtom, newCurrent);
    }
});


//TODO: can undo
//TODO: can redo
//TODO: setHistoryDisabled <- for point drag operation on canvas

// export const historyDeleteAtom = atom(null, (get, set, v: string) => {
//     let history = get(historyAtom);
//     let historyPtr = get(historyPtrAtom);

//     if (history.length) {
//         history.pop();
//         set(historyAtom, [...history, v]);
//         set(historyPtrAtom, historyPtr--);
//     }
// });

//
