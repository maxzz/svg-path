import { atom, type Getter, type PrimitiveAtom, type Setter, type WritableAtom } from "jotai";
import atomWithCallback from "../utils/hooks/atomsX";
import uuid from "../utils/uuid";
import { toast } from "../components/ui/UiToaster";
import { Svg, type SvgCtrlPoint, type SvgItem, type SvgPathPoint } from "../svg-core/svg";
import { getSvgItemAbsType } from "../svg-core/svg-utils";
import { type ViewPoint } from "../svg-core/svg-utils-viewport";
import {
    _pathUnsafeAtom,
    minifyOutputAtom,
    operRoundAtom,
    operScaleXAtom,
    operScaleYAtom,
    operTransXAtom,
    operTransYAtom,
    pathUnsafeAtom,
    precisionAtom,
} from "./store";
import type { SvgItemEdit, SvgItemEditState } from "./store";

export type SvgEditRoot = {
    svg: Svg;
    edits: SvgItemEdit[];
    completePathAtom: PrimitiveAtom<string>;
    doUpdatePointAtom: WritableAtom<null, { pt: SvgPathPoint | SvgCtrlPoint, newXY: ViewPoint, svgItemIdx: number; }>;
    allowUpdatesAtom: PrimitiveAtom<boolean>;      // do nothing in atoms callback
    doReloadAllValuesAtom: PrimitiveAtom<boolean>; // do nothing in atoms callback
    doReloadSvgItemIdxAtom: PrimitiveAtom<number>; // if -1 then do nothing

    doScaleAtom: WritableAtom<null, undefined>,
    doTransAtom: WritableAtom<null, undefined>,
    doRoundAtom: WritableAtom<null, undefined>,
    doSetRelAbsAtom: WritableAtom<null, boolean>,
};

const AllwaysNotIgnoreSectionAtom = atom(false);

export function createSvgEditRoot(svg: Svg): SvgEditRoot {
    const root: SvgEditRoot = {
        svg,
        edits: [],
        completePathAtom: atom(svg.asString()),
        allowUpdatesAtom: atom<boolean>(true),
        doReloadAllValuesAtom: atomWithCallback<boolean>(true, doReloadAllValues),
        doReloadSvgItemIdxAtom: atomWithCallback<number>(-1, doReloadSvgItemIdx),
        doUpdatePointAtom: atom(null, doUpdatePoint),

        doScaleAtom: atom(null, doScale),
        doTransAtom: atom(null, doTrans),
        doRoundAtom: atom(null, doRound),
        doSetRelAbsAtom: atom(null, doSetRelAbs),
    };

    updateSubIndecies();
    svg.path.forEach(
        (svgItem, svgItemIdx) => {
            const newSvgEdit: SvgItemEdit = {
                id: uuid(),
                section: -1,
                svgItemIdx,
                svgItem,
                typeAtom: atom(svgItem.getType()),
                isRelAtom: atomWithCallback(svgItem.relative, ({ get, set, nextValue }) => {
                    svgItem.setRelative(nextValue);
                    root.svg.refreshAbsolutePositions();
                    triggerUpdate(set, svgItemIdx);
                }),
                valueAtoms: svgItem.values.map(
                    (value, idx) => atomWithCallback(value, ((idx) => ({ get, set, nextValue }) => {
                        if (get(root.allowUpdatesAtom)) {
                            svgItem.values[idx] = nextValue;
                            root.svg.refreshAbsolutePositions();
                            triggerUpdate(set, svgItemIdx);
                        }
                    })(idx))
                ),
                standaloneStringAtom: atom(svgItem.asStandaloneString()),
                stateAtom: atom<SvgItemEditState>({ activeRow: false, hoverRow: false, activeEd: -1, hoverEd: -1, }),
                sectionIgnRefAtom: AllwaysNotIgnoreSectionAtom,
                sectionEnabledAtom: atom<boolean>((get) => !newSvgEdit.sectionIgnRefAtom || !get(newSvgEdit.sectionIgnRefAtom)),
            };
            root.edits.push(newSvgEdit);
        }
    );
    initPathSections(root.edits);
    return root;

    function updateSubIndecies() {
        root.svg.path.forEach(
            (svgItem) => {
                const controls = svgItem.controlLocations();
                controls.forEach((cpt, idx) => cpt.subIndex = idx);
            }
        );
    }

    function initPathSections(edits: SvgItemEdit[]): void {
        // detect sections
        let idx = 0;
        edits.forEach(
            (edit) => getSvgItemAbsType(edit.svgItem) === 'M' && (edit.section = idx++)
        );
        if (idx === 1) { // if there is only one section then don't show as a compound path
            edits[0].section = -1;
        }

        // create section atoms
        edits.forEach(
            (edit) => edit.section !== -1 && (edit.sectionIgonoreAtom = atom<boolean>(false))
        );

        // propagate section start item to each item inside group
        let prevAtom: PrimitiveAtom<boolean> | undefined;
        edits.forEach(
            (edit) => {
                if (edit.sectionIgonoreAtom) {
                    prevAtom = edit.sectionIgonoreAtom;
                }
                if (prevAtom) {
                    edit.sectionIgnRefAtom = prevAtom;
                }
            }
        );
    }

    function triggerUpdate(set: Setter, svgItemIdx: number = -2) {
        updateSubIndecies();

        set(root.doReloadAllValuesAtom, true);
        set(root.doReloadAllValuesAtom, false);

        set(root.doReloadSvgItemIdxAtom, svgItemIdx);
        set(root.doReloadSvgItemIdxAtom, -1);
    }

    function reloadAllItemValues(get: Getter, set: Setter) {
        set(root.allowUpdatesAtom, false);
        root.svg.path.forEach(
            (svgItem, svgItemIdx) => {
                const thisRowAtoms = root.edits[svgItemIdx].valueAtoms;
                svgItem.values.forEach(
                    (value, idx) => {
                        if (get(thisRowAtoms[idx]) != value) {
                            set(thisRowAtoms[idx], value);
                        }
                    }
                );
            }
        );
        set(root.allowUpdatesAtom, true);
    }

    function getEnabledSvgItems(get: Getter, edits: SvgItemEdit[]): SvgItemEdit[] {
        return edits.filter(
            (edit) => get(edit.sectionEnabledAtom)
        );
    }

    function roundNumberToPrecision(value: number, precision: number): number {
        return parseFloat(value.toFixed(precision));
    }

    function roundNumbersOfSvgItems(get: Getter, edits: SvgItemEdit[]) {
        const precision = get(precisionAtom);
        edits.forEach(
            (edit) => edit.svgItem.values.forEach(
                (value, idx) => edit.svgItem.values[idx] = roundNumberToPrecision(value, precision)
            )
        );
    }

    // action atoms

    function doReloadAllValues({ get, set, nextValue: doUpdate }: { get: Getter, set: Setter, nextValue: boolean; }) {
        doUpdate && reloadAllItemValues(get, set);
    }

    function doReloadSvgItemIdx({ get, set, nextValue: svgItemIdx }: { get: Getter; set: Setter, nextValue: number; }) {
        if (svgItemIdx >= 0) {
            //Fix for problem w/ absolute/relative commands: M 5 25 m 13 2 v 10 h 10 Z
            //updateItem(svgItemIdx, true);
            // (svgItemIdx - 1 >= 0) && updateItem(svgItemIdx - 1);
            // (svgItemIdx + 1 < root.edits.length) && updateItem(svgItemIdx + 1);
            root.edits.forEach((edit, idx) => updateItem(idx, true));
            updateCompletePath();
        } else if (svgItemIdx === -2) {
            root.edits.forEach((edit, idx) => updateItem(idx, true));
            updateCompletePath();
        }

        function updateItem(svgItemIdx: number, updateType: boolean = false) {
            const svgEdit = root.edits[svgItemIdx];
            const svgItem = root.svg.path[svgItemIdx];

            updateType && set(svgEdit.typeAtom, svgItem.getType());
            set(svgEdit.standaloneStringAtom, svgItem.asStandaloneString());
        }

        function updateCompletePath() {
            const minify = get(minifyOutputAtom);
            const precision = get(precisionAtom);
            set(root.completePathAtom, root.svg.asString());
            set(_pathUnsafeAtom, svg.asString(precision, minify));
        }
    }

    function doUpdatePoint(get: Getter, set: Setter, { pt, newXY, svgItemIdx }: { pt: SvgPathPoint | SvgCtrlPoint, newXY: ViewPoint, svgItemIdx: number; }) {
        svg.setLocation(pt, newXY);
        triggerUpdate(set, svgItemIdx);
    }

    function doScale(get: Getter, set: Setter,) {
        const x = get(operScaleXAtom);
        const y = get(operScaleYAtom);
        if (x === 1 && y === 1) {
            return;
        }
        if (x === 0 || y === 0) {
            toast(`Can't scale to zero`);
            return;
        }
        const enabledEdits = getEnabledSvgItems(get, root.edits);
        if (enabledEdits.length) {
            enabledEdits.forEach(
                (edit) => edit.svgItem.scale(x, y)
            );
            roundNumbersOfSvgItems(get, enabledEdits);
            root.svg.refreshAbsolutePositions();
        }
        triggerUpdate(set, -2);
    }

    function doTrans(get: Getter, set: Setter,) {
        const x = get(operTransXAtom);
        const y = get(operTransYAtom);
        const enabledEdits = getEnabledSvgItems(get, root.edits);
        if (enabledEdits.length) {
            enabledEdits.forEach(
                (edit) => edit.svgItem.translate(x, y, !!edit.sectionIgonoreAtom || edit.svgItemIdx === 0)
            ); // force if section begins
            roundNumbersOfSvgItems(get, enabledEdits);
            root.svg.refreshAbsolutePositions();
        }
        triggerUpdate(set, -2);
        set(operTransXAtom, 0);
        set(operTransYAtom, 0);
    }

    function doRound(get: Getter, set: Setter,) {
        const round = get(operRoundAtom);
        set(pathUnsafeAtom, root.svg.asString(round));
    }

    function doSetRelAbs(get: Getter, set: Setter, relOrAbs: boolean) {

        //root.svg.setRelative(relOrAbs);
        const enabledEdits = getEnabledSvgItems(get, root.edits);
        if (enabledEdits.length) {
            enabledEdits.forEach(
                (edit) => edit.svgItem.setRelative(relOrAbs)
            );
            root.svg.refreshAbsolutePositions();
        }

        triggerUpdate(set, -2);
    }
}
