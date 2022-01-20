import { Atom, atom, Getter, PrimitiveAtom } from "jotai";
import atomWithCallback from "../hooks/atomsX";
import { Svg, SvgItem } from "../svg/svg";
import { getFitViewPort, scaleViewBox, updateViewPort, ViewBox, ViewBoxManual, ViewPoint } from "../svg/svg-utils-viewport";
import debounce from "../utils/debounce";
import { unexpected, _fViewBox, _ViewBox } from "../utils/debugging";

namespace Storage {
    const KEY = 'react-svg-expo-01';

    type Store = {
        path: string;
        showGrid: boolean;
        showTicks: boolean;
        ticks: number;          // tick every n lines. don't show ticks if zero or less then zero.
        precision: number;      // drag operations precision for new points
        snapToGrid: boolean;    // drag operations shap to grid
        fillPath: boolean;
        preview: boolean;
        minifyOutput: boolean;
    };

    export let initialData: Store = {
        path: 'M 0 0 L 25 103 Q 52 128 63 93 C -2 26 29 0 100 0 C 83 15 85 52 61 27',
        showGrid: true,
        showTicks: true,
        ticks: 5,
        precision: 3,
        snapToGrid: false,
        fillPath: true,
        preview: false,
        minifyOutput: false,
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
            ticks: get(tickIntevalAtom),
            precision: get(precisionAtom),
            snapToGrid: get(snapToGridAtom),
            fillPath: get(fillPathAtom),
            preview: get(previewAtom),
            minifyOutput: get(minifyOutputAtom),
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

const needInitialZoomAtom = atom(true);

const _pathUnsafeAtom = atomWithCallback(Storage.initialData.path, ({ get }) => Storage.save(get));
export const pathUnsafeAtom = atom(
    (get) => {
        return get(_pathUnsafeAtom);
    },
    (get, set, path: string) => {
        const current = get(_pathUnsafeAtom);

        set(_pathUnsafeAtom, path);

        const newSvg = getParsedSvg(path);
        if (newSvg) {
            set(_svgAtom, newSvg);
            set(SvgEditRootAtom, createSvgEditRoot(newSvg));
            set(doAutoZoomAtom); // auto zoom only for changes from row input text.
        }
    }
);

// Input comes from the command editor and is safe (the editor must check the row numbers and quantity of required numbers)

const _svgAtom = atom(getParsedSvg(Storage.initialData.path) || new Svg(''));
export const svgAtom = atom(
    (get) => {
        return get(_svgAtom);
    },
    (get, set, newSvg: Svg) => {
        set(_svgAtom, newSvg);
        set(SvgEditRootAtom, createSvgEditRoot(newSvg));

        const path = newSvg.asString();
        set(_pathUnsafeAtom, path);

        console.log('>>>>>>>> set _svgAtom, svg:', newSvg.asString());
    }
);

// new data container

type SvgItemEditTypeAtom = PrimitiveAtom<string>;
type SvgItemEditValueAtom = PrimitiveAtom<number>;

type SvgItemEdit = {
    svgItem: SvgItem; // back reference to item from svg.path array.
    typeAtom: SvgItemEditTypeAtom;
    valueAtoms: SvgItemEditValueAtom[];
    //TODO: isActiveAtom, isHoverAtom
};

type SvgEditRoot = {
    svg: Svg;
    atoms: SvgItemEdit[];
};

function createSvgEditRoot(svg: Svg): SvgEditRoot {
    const root: SvgEditRoot = {
        svg,
        atoms: [],
    };
    function updateRowValues() {

    }
    svg.path.forEach((svgItem, svgItemIdx) => {
        const newSvgEdit: SvgItemEdit = {
            svgItem,
            typeAtom: atom(svgItem.getType()),
            valueAtoms: svgItem.values.map((value) => atomWithCallback(value, ({ get, set }) => {
                svgItem.values = root.atoms[svgItemIdx].valueAtoms.map((valueAtom) => get(valueAtom));
                set(_pathUnsafeAtom, svg.asString());
            }))
        };
        root.atoms.push(newSvgEdit);
    });
    return root;
}

export const SvgEditRootAtom = atom<SvgEditRoot>(createSvgEditRoot(new Svg('')));

// Upates from command editor

export const doUpdateRowValuesAtom = atom(null, (get, set, { item, values }: { item: SvgItem, values: number[]; }) => {
    const svg = get(_svgAtom);
    //debugger
    const cur = item.values;
    item.values = values;
    svg.refreshAbsolutePositions();

    console.log('---------------------- doUpdateRowValuesAtom',
        'cur', JSON.stringify(cur),
        'new values', JSON.stringify(values), 'svg', svg.asString(),
        'svgItem.id', item.id,
        'svg.IDs', svg.path.map((svgItem) => svgItem.id.trim()).join(', '),
    );

    const newSvg = new Svg(svg.asString());
    // const newSvg = new Svg();
    // newSvg.path = svg.path;
    set(svgAtom, newSvg);
});

export const doUpdateRowTypeAtom = atom(null, (get, set, { item, isRelative }: { item: SvgItem, isRelative: boolean; }) => {
    const svg = get(_svgAtom);
    item.setRelative(isRelative);

    const newSvg = new Svg();
    newSvg.path = svg.path;
    set(svgAtom, newSvg);
});

// canvas size

export const viewBoxAtom = atom<ViewBox>([0, 0, 10, 10]);
export const canvasStrokeAtom = atom(1);

export const doSetViewBoxAtom = atom((get) => get(viewBoxAtom), (get, set, box: ViewBoxManual) => {
    const canvasSize = get(canvasSizeAtom);
    const newBox = updateViewPort(canvasSize, ...box, true);
    if (newBox) {
        set(viewBoxAtom, newBox.viewBox);
        set(canvasStrokeAtom, newBox.stroke);
    }
});

// canvas zoom

//const zoomAtom = atom(0);

export type UpdateZoomEvent = {
    deltaY: number;
    pt?: ViewPoint;
};

export const doUpdateZoomAtom = atom(null, (get, set, { deltaY, pt }: UpdateZoomEvent) => {

    // let zoom = Math.min(1000, Math.max(-450, get(zoomAtom) + deltaY));
    let zoom = Math.min(1000, Math.max(-450, deltaY));
    //set(zoomAtom, zoom);

    // let stroke = get(viewBoxStrokeAtom);
    // let [x, y] = get(viewBoxAtom);
    // x += pt.x;
    // y += pt.y;
    // console.log('update', { x, y });

    /*
    const unscaledPathBoundingBox = get(unscaledPathBoundingBoxAtom);

    const scale = Math.pow(1.005, zoom);
    const newPort = zoomViewPort(unscaledPathBoundingBox, scale);
    // const newPort = zoomViewPort(unscaledPathBoundingBox, scale, pt);
    // const newPort = zoomViewPort(unscaledPathBoundingBox, scale, { x, y });
    set(viewBoxAtom, newPort);
    */

    const viewBox = get(viewBoxAtom);

    const scale = Math.pow(1.005, zoom);
    const newViewBox = scaleViewBox(viewBox, scale);

    const canvasSize = get(canvasSizeAtom);
    const newStroke = newViewBox[2] / canvasSize.w;

    //console.log('new zoom', (''+zoom).padStart(5, ' '), '-----old viewBox-----', _fViewBox(viewBox), '-----new viewBox-----', _fViewBox(newViewBox));

    set(viewBoxAtom, newViewBox);
    set(canvasStrokeAtom, newStroke);
});

export const doAutoZoomAtom = atom(null, (get, set,) => {
    const canvasSize = get(canvasSizeAtom);
    const svg = get(svgAtom);
    const box = getFitViewPort(canvasSize, svg.targetLocations());
    if (box) {
        set(viewBoxAtom, box.port);
        set(canvasStrokeAtom, box.stroke);
    }
});

export const doSetZoomAtom = atom(null, (get, set, delta: number) => {
    if (!delta) {
        set(doAutoZoomAtom);
    } else {
        set(doUpdateZoomAtom, { deltaY: delta });
    }
});

export const doUpdateViewBoxAtom = atom(null, (get, set,) => {
    const canvasSize = get(canvasSizeAtom);

    // if (!(canvasSize.w && canvasSize.h)) {
    //     unexpected('updateViewBoxAtom');
    // }

    if (canvasSize.w && canvasSize.h) {
        const needInitialZoom = get(needInitialZoomAtom);
        if (needInitialZoom) {
            set(doAutoZoomAtom);
            set(needInitialZoomAtom, false);
        } else {
            const viewBox = get(viewBoxAtom);
            const box = updateViewPort(canvasSize, viewBox[0], viewBox[1], viewBox[2], null, true);
            if (box) {
                set(viewBoxAtom, box.viewBox);
                set(canvasStrokeAtom, box.stroke);
            }
        }
    }
});

// new canvas

export const tickIntevalAtom = atomWithCallback(Storage.initialData.ticks, ({ get }) => Storage.save(get));
export const precisionAtom = atomWithCallback(Storage.initialData.precision, ({ get }) => Storage.save(get));
export const snapToGridAtom = atomWithCallback(Storage.initialData.snapToGrid, ({ get }) => Storage.save(get));
export const fillPathAtom = atomWithCallback(Storage.initialData.fillPath, ({ get }) => Storage.save(get));
export const previewAtom = atomWithCallback(Storage.initialData.preview, ({ get }) => Storage.save(get));
export const minifyOutputAtom = atomWithCallback(Storage.initialData.minifyOutput, ({ get }) => Storage.save(get));

const _canvasSizeAtom = atom({ w: 0, h: 0 });
export const canvasSizeAtom = atom(
    (get) => get(_canvasSizeAtom),
    (get, set, size: { w: number; h: number; }) => {
        const current = get(_canvasSizeAtom);
        if (size.w !== current.w || size.h !== current.h) {
            set(_canvasSizeAtom, size);
        }
    }
);

export const containerRefAtom = atom<HTMLElement | null | undefined>(undefined);

// canvas the active and hover point indices on the path (TODO: it must be atom). -1 if no index effective

export const activePointAtom = atom(-1);
export const hoverPointAtom = atom(-1);
export const editorActivePointAtom = atom<[number, number] | null>(null); // current point in path commands panel: pt index and cpt index (or -1)
export const editorHoverPointAtom = atom<[number, number] | null>(null); // current hobering point in path commands panel: pt index and cpt index (or -1)

// canvas controls

export const showGridAtom = atomWithCallback(Storage.initialData.showGrid, ({ get }) => Storage.save(get));
export const showTicksAtom = atomWithCallback(Storage.initialData.showTicks, ({ get }) => Storage.save(get));

//#region History

// history

const HISTORY_MAX = 40;
const historyDisabledAtom = atom(true);
const historyAtom = atom<string[]>([]);
const historyPtrAtom = atom(0);

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

const canUndo = (hist: string[], histPtr: number): boolean => !!hist.length && histPtr > 0;
const canRedo = (hist: string[], histPtr: number): boolean => !!hist.length && histPtr < hist.length - 1;

export const historyUndoAtom = atom(null, (get, set, v: string) => {
    let hist = get(historyAtom);
    let histPtr = get(historyPtrAtom);

    if (canUndo(hist, histPtr)) {
        histPtr--;
        set(historyPtrAtom, histPtr);
        set(pathUnsafeAtom, hist[histPtr]);
    }
});

//TODO: redo has no params
//TODO: add command: add to history
//TODO: add command should use histPtr (not always at the end)

export const historyRedoAtom = atom(null, (get, set, v: string) => {
    let hist = get(historyAtom);
    let histPtr = get(historyPtrAtom);

    if (canRedo(hist, histPtr)) {
        histPtr++;
        set(historyPtrAtom, histPtr);
        set(pathUnsafeAtom, hist[histPtr]);
    }
});

export const disableHistoryAtom = atom(null, // During point drag operation on canvas.
    (get, set, disabled: boolean) => {
        set(historyDisabledAtom, disabled);
    }
);;

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

//#endregion History
