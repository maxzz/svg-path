import { ViewBox } from "../svg/svg-utils-viewport";

export function _ViewBox(viewBox: ViewBox): string {
    return JSON.stringify(viewBox.map(_=>_.toFixed(2)));
}

export function _fViewBox(viewBox: ViewBox): string {
    return viewBox.map(pt => pt.toFixed(0).padStart(4, ' ')).join(" ");
}
