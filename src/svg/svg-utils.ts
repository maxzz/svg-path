import { SvgItem } from "./svg";

const commandAttrs: { [key: string]: string[]; } = {
    M: ['x', 'y'],
    m: ['dx', 'dy'],
    L: ['x', 'y'],
    l: ['dx', 'dy'],
    V: ['y'],
    v: ['dy'],
    H: ['x'],
    h: ['dx'],
    C: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
    c: ['dx1', 'dy1', 'dx2', 'dy2', 'dx', 'dy'],
    S: ['x2', 'y2', 'x', 'y'],
    s: ['dx2', 'dy2', 'dx', 'dy'],
    Q: ['x1', 'y1', 'x', 'y'],
    q: ['dx1', 'dy1', 'dx', 'dy'],
    T: ['x', 'y'],
    t: ['dx', 'dy'],
    A: ['rx', 'ry', 'x-axis-rotation', 'large-arc-flag', 'sweep-flag', 'x', 'y'],
    a: ['rx', 'ry', 'x-axis-rotation', 'large-arc-flag', 'sweep-flag', 'dx', 'dy'],
};

export function getTooltip(command: string, idx: number): string {
    return commandAttrs[command]?.[idx] || '';
}

const valueToPoint: { [key: string]: number[]; } = { // -1 point and >= 0 for control point
    M: [-1, -1],
    m: [-1, -1],
    L: [-1, -1],
    l: [-1, -1],
    V: [-1],
    v: [-1],
    H: [-1],
    h: [-1],
    C: [0, 0, 1, 1, -1, -1],
    c: [0, 0, 1, 1, -1, -1],
    S: [0, 0, -1, -1],
    s: [0, 0, -1, -1],
    Q: [0, 0, -1, -1],
    q: [0, 0, -1, -1],
    T: [-1, -1],
    t: [-1, -1],
    A: [0, 0, -1, -1, -1, -1, -1],
    a: [0, 0, -1, -1, -1, -1, -1],
};

export function getValueToPoint(command: string, idx: number): number {
    //console.log('getvalueToPoint', command, idx, valueToPoint[command]?.[idx] ?? -1);
    return valueToPoint[command]?.[idx] ?? -1;
}

export function getSvgItemAbsType(svgItem: SvgItem) {
    return (svgItem.constructor as any).key as string;
}
