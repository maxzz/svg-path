import { ViewBox, ViewPoint } from "../svg/svg-utils-viewport";

export function _ViewPoint(pt: ViewPoint, diggits = 0) {
    const p = {
        x: pt.x.toFixed(diggits),
        y: pt.y.toFixed(diggits)
    }
    return `${p.x}, ${p.y}`;
}

export function _ViewBox(viewBox: ViewBox, diggits = 2): string {
    return viewBox.map(_ => _.toFixed(diggits)).join(' ');
}

export function _fViewBox(viewBox: ViewBox, diggits = 0): string {
    return viewBox.map(pt => pt.toFixed(diggits).padStart(4, ' ')).join(" ");
}

export function unexpected(...rest: any[]) {
    //debugger
    console.log(`%cneed check`, 'color: red', ...rest);
}

export const doTrace = false;