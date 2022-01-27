import { atom, Getter, PrimitiveAtom, SetStateAction, Setter, WritableAtom } from "jotai";
import atomWithCallback from "../hooks/atomsX";
import { Svg, SvgControlPoint, SvgItem, SvgPoint } from "../svg/svg";
import { getCanvasStroke, getFitViewPort, scaleViewBox, updateViewPort, ViewBox, ViewBoxManual, ViewPoint } from "../svg/svg-utils-viewport";
import debounce from "../utils/debounce";
import { unexpected, _fViewBox, _ViewBox } from "../utils/debugging";
import uuid from "../utils/uuid";

namespace Storage {
    const KEY = 'react-svg-expo-01';

    type Store = {
        path: string;
        showGrid: boolean;
        showTicks: boolean;
        ticks: number;          // tick every n lines. don't show ticks if zero or less then zero.
        precision: number;      // drag operations precision for new points
        snapToGrid: boolean;    // drag operations shap to grid
        showCPs: boolean;       // show control points
        fillPath: boolean;
        minifyOutput: boolean;
        openPanelPath: boolean;
        openPanelCmds: boolean;
        openPanelOper: boolean;
        openPanelOpts: boolean;
    };

    export let initialData: Store = {
        path: 'M 0 0 L 25 103 Q 52 128 63 93 C -2 26 29 0 100 0 C 83 15 85 52 61 27',
        showGrid: true,
        showTicks: true,
        ticks: 5,
        precision: 3,
        snapToGrid: false,
        showCPs: false,
        fillPath: true,
        minifyOutput: false,
        openPanelPath: true,
        openPanelCmds: true,
        openPanelOper: false,
        openPanelOpts: true,
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
            showCPs: get(showCPsAtom),
            fillPath: get(fillPathAtom),
            minifyOutput: get(minifyOutputAtom),
            openPanelPath: get(openPanelPathAtom),
            openPanelCmds: get(openPanelCmdsAtom),
            openPanelOper: get(openPanelOperAtom),
            openPanelOpts: get(openPanelOptsAtom),
        };
        localStorage.setItem(KEY, JSON.stringify(newStore));
    }, 1000);
}

//#region Unsafe SVG Atom

function getParsedSvg(path: string): Svg | undefined {
    try {
        return new Svg(path);
    } catch (error) {
    }
}

// Input comes from the user and is unsafe vs. Input comes from the command editor and is safe (the editor must check the row numbers validity and quantity of required numbers)

const needInitialZoomAtom = atom(true);

const _pathUnsafeAtom = atomWithCallback(Storage.initialData.path, ({ get }) => Storage.save(get));
export const pathUnsafeAtom = atom(
    (get) => {
        return get(_pathUnsafeAtom);
    },
    (get, set, path: string) => {
        set(_pathUnsafeAtom, path);

        const newSvg = getParsedSvg(path);
        if (newSvg) {
            set(svgEditRootAtom, createSvgEditRoot(newSvg));
            set(doAutoZoomAtom); // auto zoom only for changes from row input text.
        }
    }
);

//#endregion Unsafe SVG Atom

//#region SvgItemEdit state

// new data container active and hover state

//TODO: hover row and hover ed should be separate

export type SvgItemEditState = {
    activeRow: boolean;
    hoverRow: boolean;
    activeEd: number;    // active input control index in editor
    hoverEd: number;     // hover input control index in editor
};

// const globalEditState: GlobalEditState = {
//     active: undefined,
//     hover: undefined,
//     activeEd: undefined,
//     hoverEd: undefined,
// };

const globalEditState: Record<keyof SvgItemEditState, PrimitiveAtom<SvgItemEditState> | undefined> = {
    activeRow: undefined,
    hoverRow: undefined,
    activeEd: undefined,
    hoverEd: undefined,
};

export const doSetStateAtom = atom(null, (get, set, { atom, states }: { atom: PrimitiveAtom<SvgItemEditState>; states: Partial<SvgItemEditState>; }) => {
    const newState: Partial<SvgItemEditState> = {};

    for (const [name, val] of Object.entries(states)) {
        const key = name as keyof SvgItemEditState;
        const globalStateAtom = globalEditState[key];
        if (globalStateAtom && globalStateAtom !== atom) {
            set(globalStateAtom, (prev) => ({ ...prev, [key]: false }));
        }
        globalEditState[key] = val && val !== -1 ? atom : undefined; // there can be only one
        (newState[key] as boolean | number) = val;
    }

    const before = get(atom);
    const areDiff = Object.entries(newState).some(([key, val]) => before[key as keyof SvgItemEditState] !== val);

    areDiff && set(atom, (prev) => ({ ...prev, ...newState }));
});

export const doClearActiveAtom = atom(null, (get, set,) => {
    if (globalEditState.activeRow) {
        set(globalEditState.activeRow, (prev) => ({ ...prev, activeRow: false }));
        globalEditState.activeRow = undefined;
    }
});

//#endregion SvgItemEdit state

//#region SvgRoot

// new data container

export type SvgItemEditIsRelAtom = PrimitiveAtom<boolean>; // is relative or absolute
export type SvgItemEditValueAtom = PrimitiveAtom<number>;

export type SvgItemEdit = {
    id: string;
    svgItemIdx: number;
    svgItem: SvgItem; // back reference to item from svg.path array.
    typeAtom: PrimitiveAtom<string>;
    isRelAtom: SvgItemEditIsRelAtom;
    valueAtoms: SvgItemEditValueAtom[];
    standaloneStringAtom: PrimitiveAtom<string>;
    stateAtom: PrimitiveAtom<SvgItemEditState>;
};

export type SvgEditPoints = {
    asString: string;
};

export type SvgEditRoot = {
    svg: Svg;
    edits: SvgItemEdit[];
    completePathAtom: PrimitiveAtom<string>;
    doUpdatePointAtom: WritableAtom<null, { pt: SvgPoint | SvgControlPoint, newXY: ViewPoint, svgItemIdx: number; }>;
    allowUpdatesAtom: PrimitiveAtom<boolean>; // do nothing in atoms callback
    doReloadAllValuesAtom: PrimitiveAtom<boolean>; // do nothing in atoms callback
    doReloadSvgItemIdxAtom: PrimitiveAtom<number>; // if -1 then do nothing
};

function createSvgEditRoot(svg: Svg): SvgEditRoot {
    const root: SvgEditRoot = {
        svg,
        edits: [],
        completePathAtom: atom(svg.asString()),
        allowUpdatesAtom: atom<boolean>(true),
        doReloadAllValuesAtom: atomWithCallback<boolean>(true, doReloadAllValues),
        doReloadSvgItemIdxAtom: atomWithCallback<number>(-1, doReloadSvgItemIdx),
        doUpdatePointAtom: atom(null, doUpdatePoint),
    };
    updateSubIndecies();
    svg.path.forEach((svgItem, svgItemIdx) => {
        const newSvgEdit: SvgItemEdit = {
            id: uuid(),
            svgItemIdx,
            svgItem,
            typeAtom: atom(svgItem.getType()),
            isRelAtom: atomWithCallback(svgItem.relative, ({ get, set, nextValue }) => {
                svgItem.setRelative(nextValue);
                root.svg.refreshAbsolutePositions();
                triggerUpdate(set, svgItemIdx);
            }),
            valueAtoms: svgItem.values.map((value, idx) => atomWithCallback(value, ((idx) => ({ get, set, nextValue }) => {
                if (get(root.allowUpdatesAtom)) {
                    svgItem.values[idx] = nextValue;
                    root.svg.refreshAbsolutePositions();
                    triggerUpdate(set, svgItemIdx);
                }
            })(idx))),
            standaloneStringAtom: atom(svgItem.asStandaloneString()),
            stateAtom: atom<SvgItemEditState>({ activeRow: false, hoverRow: false, activeEd: -1, hoverEd: -1, }),
        };
        root.edits.push(newSvgEdit);
    });
    return root;

    function updateSubIndecies() {
        root.svg.path.forEach((svgItem) => {
            const controls = svgItem.controlLocations();
            controls.forEach((cpt, idx) => cpt.subIndex = idx);
        });
    }

    function triggerUpdate(set: Setter, svgItemIdx: number) {
        updateSubIndecies();

        set(root.doReloadAllValuesAtom, true);
        set(root.doReloadAllValuesAtom, false);

        set(root.doReloadSvgItemIdxAtom, svgItemIdx);
        set(root.doReloadSvgItemIdxAtom, -1);
    }

    function reloadValues(get: Getter, set: Setter) {
        set(root.allowUpdatesAtom, false);
        root.svg.path.forEach((svgItem, svgItemIdx) => {
            // svgItem.values.forEach((value, idx) => set(root.edits[svgItemIdx].valueAtoms[idx], value));
            const thisRowAtoms = root.edits[svgItemIdx].valueAtoms;
            svgItem.values.forEach((value, idx) => {
                if (get(thisRowAtoms[idx]) != value) {
                    set(thisRowAtoms[idx], value);
                }
            });
        });
        set(root.allowUpdatesAtom, true);
    }

    // action actoms

    function doReloadAllValues({ get, set, nextValue: doUpdate }: { get: Getter, set: Setter, nextValue: boolean; }) {
        doUpdate && reloadValues(get, set);
    }
    function doReloadSvgItemIdx({ get, set, nextValue: svgItemIdx }: { get: Getter; set: Setter, nextValue: number; }) {
        if (svgItemIdx >= 0) {
            const svgEdit = root.edits[svgItemIdx];
            const svgItem = root.svg.path[svgItemIdx];

            const minify = get(minifyOutputAtom);
            const precision = get(precisionAtom);

            set(svgEdit.typeAtom, svgItem.getType());
            set(svgEdit.standaloneStringAtom, svgItem.asStandaloneString());

            set(root.completePathAtom, root.svg.asString());
            set(_pathUnsafeAtom, svg.asString(precision, minify));

            if (svgItemIdx - 1 >= 0) {
                const svgEdit = root.edits[svgItemIdx - 1];
                const svgItem = root.svg.path[svgItemIdx - 1];
                set(svgEdit.standaloneStringAtom, svgItem.asStandaloneString());
            }
            if (svgItemIdx + 1 < root.edits.length) {
                const svgEdit = root.edits[svgItemIdx + 1];
                const svgItem = root.svg.path[svgItemIdx + 1];
                set(svgEdit.standaloneStringAtom, svgItem.asStandaloneString());
            }
        }
    }
    function doUpdatePoint(get: Getter, set: Setter, { pt, newXY, svgItemIdx }: { pt: SvgPoint | SvgControlPoint, newXY: ViewPoint, svgItemIdx: number; }) {
        svg.setLocation(pt, newXY);
        triggerUpdate(set, svgItemIdx);
    }
}

export const svgEditRootAtom = atom<SvgEditRoot>(createSvgEditRoot(getParsedSvg(Storage.initialData.path) || new Svg('')));

//#endregion SvgRoot

//#region canvas size

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

//#endregion canvas size

//#region canvas zoom

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
    const newStroke = getCanvasStroke(newViewBox[2], canvasSize.w);

    //console.log('new zoom', (''+zoom).padStart(5, ' '), '-----old viewBox-----', _fViewBox(viewBox), '-----new viewBox-----', _fViewBox(newViewBox));

    set(viewBoxAtom, newViewBox);
    set(canvasStrokeAtom, newStroke);
});

export const doAutoZoomAtom = atom(null, (get, set,) => {
    const canvasSize = get(canvasSizeAtom);
    const svgEditRoot = get(svgEditRootAtom);
    const targets = svgEditRoot.svg.targetLocations();
    const box = getFitViewPort(canvasSize, targets);
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

// canvas container and size

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

export const containerElmAtom = atom<HTMLElement | null | undefined>(undefined);

//#endregion canvas zoom

//#region canvas drag operations

// canvas drag operations

export type CanvasDragEvent = {
    mdownEvent: React.MouseEvent;           // mouse down event
    mdownPt?: SvgPoint | SvgControlPoint;   // SVG point
    mdownXY?: ViewPoint;                    // mouse down event point
    svgItemIdx: number;                     // SVG item index
    mmoved?: boolean;                       // mouse moved between mouse down and mouse up
};

//TODO: do we need to keep mdownPt? it's enough to have boolean
//TODO: do we need to keep event? it's enough to keep client pos

type ClientPoint = {
    clientX: number;
    clientY: number;
};

export function getEventPt(viewBox: ViewBox, canvasStroke: number, containerElm: HTMLElement, eventClientX: number, eventClientY: number) {
    const canvasRect = containerElm.getBoundingClientRect();
    let [viewBoxX, viewBoxY] = viewBox;
    const x = viewBoxX + (eventClientX - canvasRect.x) * canvasStroke;
    const y = viewBoxY + (eventClientY - canvasRect.y) * canvasStroke;
    return { x, y };
}

const _canvasDragStateAtom = atom<CanvasDragEvent | null>(null);

export const canvasDragStateAtom = atom(
    (get) => get(_canvasDragStateAtom)
);

export const doCanvasPointClkAtom = atom(null, (get, set, event: CanvasDragEvent) => {
    if (event.mdownEvent.button !== 0) {
        return;
    }
    const containerElm = get(containerElmAtom);
    if (containerElm) {
        event.mmoved = false;
        set(_canvasDragStateAtom, event);
    }
});

export const doCanvasMouseDownAtom = atom(null, (get, set, event: React.MouseEvent) => {
    const containerElm = get(containerElmAtom);
    if (containerElm) {
        const viewBox = get(viewBoxAtom);
        const stroke = get(canvasStrokeAtom);
        const xy = getEventPt(viewBox, stroke, containerElm, event.clientX, event.clientY);
        set(_canvasDragStateAtom, { mdownEvent: event, mdownXY: xy, svgItemIdx: -1, mmoved: false });
    }
});

export const doCanvasMouseMoveAtom = atom(null, (get, set, event: React.MouseEvent) => {
    const canvasDragState = get(_canvasDragStateAtom);
    if (!canvasDragState) {
        return;
    }

    const viewBox = get(viewBoxAtom);
    const stroke = get(canvasStrokeAtom);
    const containerElm = get(containerElmAtom);
    if (containerElm) {
        event.stopPropagation();
        canvasDragState.mmoved = true;

        const precision = get(precisionAtom);
        const snapToGrid = get(snapToGridAtom);

        if (canvasDragState.mdownPt) {
            const nowXY = getEventPt(viewBox, stroke, containerElm, event.clientX, event.clientY);

            const decimals = snapToGrid
                ? 0
                : event.ctrlKey
                    ? precision
                        ? 0
                        : 3
                    : precision;
            nowXY.x = parseFloat(nowXY.x.toFixed(decimals));
            nowXY.y = parseFloat(nowXY.y.toFixed(decimals));
            //console.log('move', nowXY.x, nowXY.y);

            const svgEditRoot = get(svgEditRootAtom);
            set(svgEditRoot.doUpdatePointAtom, { pt: canvasDragState.mdownPt, newXY: nowXY, svgItemIdx: canvasDragState.svgItemIdx });
        } else {
            //const startPt = getEventPt(containerRef, dragEventRef.current.event.clientX, dragEventRef.current.event.clientY);
            const startXY = canvasDragState.mdownXY!;
            const nowXY = getEventPt(viewBox, stroke, containerElm, event.clientX, event.clientY);
            //console.log('move startPt', _ViewPoint(startPt).padEnd(20, ' '), 'pt', _ViewPoint(pt).padEnd(20, ' '), '--------------------------------', _fViewBox(viewBox));

            set(viewBoxAtom, (prev) => ([
                prev[0] + startXY.x - nowXY.x,
                prev[1] + startXY.y - nowXY.y,
                prev[2],
                prev[3],
            ]));
        }
    }
});

export const doCanvasMouseUpAtom = atom(null, (get, set,) => {
    const canvasDragState = get(_canvasDragStateAtom);
    if (canvasDragState) {
        if (!canvasDragState.mdownPt && !canvasDragState.mmoved) {
            set(doClearActiveAtom);
        }
        set(_canvasDragStateAtom, null);
    }
});

//#endregion canvas drag operations

//#region Option atoms

// new canvas

export const tickIntevalAtom = atomWithCallback(Storage.initialData.ticks, ({ get }) => Storage.save(get));
export const precisionAtom = atomWithCallback(Storage.initialData.precision, ({ get }) => Storage.save(get));
export const snapToGridAtom = atomWithCallback(Storage.initialData.snapToGrid, ({ get }) => Storage.save(get));
export const showCPsAtom = atomWithCallback(Storage.initialData.showCPs, ({ get }) => Storage.save(get));
export const fillPathAtom = atomWithCallback(Storage.initialData.fillPath, ({ get }) => Storage.save(get));
export const _minifyOutputAtom = atomWithCallback(Storage.initialData.minifyOutput, ({ get }) => Storage.save(get));

export const doSetMinifyAtom = atom(null, (get, set, newMinify: boolean) => {
    let path = get(_pathUnsafeAtom);
    const newSvg = getParsedSvg(path);
    if (newSvg) {
        const precision = get(precisionAtom);
        path = newSvg.asString(precision, newMinify);
        set(_pathUnsafeAtom, path);
    }

    set(_minifyOutputAtom, newMinify);
});

export const minifyOutputAtom = atom(
    (get) => get(_minifyOutputAtom),
    (get, set, newValue: SetStateAction<boolean>) => {
        const nextValue = typeof newValue === 'function'
            ? (newValue as (prev: boolean) => boolean)(get(_minifyOutputAtom))
            : newValue;
        set(doSetMinifyAtom, nextValue);
    }
);

// canvas controls

export const showGridAtom = atomWithCallback(Storage.initialData.showGrid, ({ get }) => Storage.save(get));
export const showTicksAtom = atomWithCallback(Storage.initialData.showTicks, ({ get }) => Storage.save(get));

// panels

export const openPanelPathAtom = atomWithCallback(Storage.initialData.openPanelPath, ({ get }) => Storage.save(get));
export const openPanelCmdsAtom = atomWithCallback(Storage.initialData.openPanelCmds, ({ get }) => Storage.save(get));
export const openPanelOperAtom = atomWithCallback(Storage.initialData.openPanelOper, ({ get }) => Storage.save(get));
export const openPanelOptsAtom = atomWithCallback(Storage.initialData.openPanelOpts, ({ get }) => Storage.save(get));

//#endregion Option atoms

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
