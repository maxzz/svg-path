import { type ViewBox, type ViewPoint } from "../svg-core/svg-utils-viewport";

export function toString_ViewPoint(pt: ViewPoint, diggits = 0) {
    const p = {
        x: pt.x.toFixed(diggits),
        y: pt.y.toFixed(diggits)
    }
    return `${p.x}, ${p.y}`;
}

export function toString_ViewBox(viewBox: ViewBox, diggits = 2): string {
    return viewBox.map(_ => _.toFixed(diggits)).join(' ');
}

export function toString_fViewBox(viewBox: ViewBox, diggits = 0): string {
    return viewBox.map(pt => pt.toFixed(diggits).padStart(4, ' ')).join(" ");
}

export function print_unexpected(...rest: any[]) {
    //debugger
    console.log(`%cneed check`, 'color: red', ...rest);
}

export const doTrace = false;
