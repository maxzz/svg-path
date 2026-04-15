import { atom } from "jotai";
import { pathUnsafeAtom } from "./store";

//#region History

// history

const historyAtom = atom<string[]>([]);
const historyPtrAtom = atom(0);
const historyDisabledAtom = atom(true);
const HISTORY_MAX = 40;

export const historyAddAtom = atom(
    null,
    (get, set, v: string) => {
        let history = get(historyAtom);
        let historyPtr = get(historyPtrAtom);

        if (history.length >= HISTORY_MAX) {
            history.shift();
            historyPtr--;
        }

        set(historyAtom, [...history, v]);
        set(historyPtrAtom, historyPtr++);
    }
);

function canUndo(hist: string[], histPtr: number): boolean {
    return !!hist.length && histPtr > 0;
}

function canRedo(hist: string[], histPtr: number): boolean {
    return !!hist.length && histPtr < hist.length - 1;
}

export const historyUndoAtom = atom(
    null,
    (get, set, v: string) => {
        let hist = get(historyAtom);
        let histPtr = get(historyPtrAtom);

        if (canUndo(hist, histPtr)) {
            histPtr--;
            set(historyPtrAtom, histPtr);
            set(pathUnsafeAtom, hist[histPtr]);
        }
    }
);

//TODO: redo has no params
//TODO: add command: add to history
//TODO: add command should use histPtr (not always at the end)

export const historyRedoAtom = atom(
    null,
    (get, set, v: string) => {
        let hist = get(historyAtom);
        let histPtr = get(historyPtrAtom);

        if (canRedo(hist, histPtr)) {
            histPtr++;
            set(historyPtrAtom, histPtr);
            set(pathUnsafeAtom, hist[histPtr]);
        }
    }
);

export const disableHistoryAtom = atom( // During point drag operation on canvas.
    null,
    (get, set, disabled: boolean) => {
        set(historyDisabledAtom, disabled);
    }
);

//TODO: can undo
//TODO: can redo
//TODO: setHistoryDisabled <- for point drag operation on canvas

// export const historyDeleteAtom = atom(
//     null,
//     (get, set, v: string) => {
//         let history = get(historyAtom);
//         let historyPtr = get(historyPtrAtom);

//         if (history.length) {
//             history.pop();
//             set(historyAtom, [...history, v]);
//             set(historyPtrAtom, historyPtr--);
//         }
//     }
// );
//

//#endregion History
