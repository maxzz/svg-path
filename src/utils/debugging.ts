import { ViewBox } from "../svg/svg-utils-viewport";

export function formatViewBox(box: ViewBox) {
    return box.map(pt => pt.toFixed(0).padStart(4, ' ')).join(" ");
}
