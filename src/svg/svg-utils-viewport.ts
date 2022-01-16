import { unexpected } from "../utils/debugging";
import { SvgPoint } from "./svg";

export type ViewPoint = { x: number; y: number; };
export type ViewSize = { w: number; h: number; };
export type ViewBox = [x: number, y: number, w: number, h: number];

export type CanvasSize = {
    size: ViewSize; // canvas size
    port: ViewBox;  // SVG viewBox
    stroke: number; // SVG stroke scaled width
};

export function getPointsBoundingBox(targetPoints: SvgPoint[]): { xmin: number; ymin: number; xmax: number; ymax: number; } {
    let xmin = 0;
    let ymin = 0;
    let xmax = 10;
    let ymax = 10;
    if (targetPoints.length) {
        xmin = Math.min(...targetPoints.map(pt => pt.x));
        ymin = Math.min(...targetPoints.map(pt => pt.y));
        xmax = Math.max(...targetPoints.map(pt => pt.x));
        ymax = Math.max(...targetPoints.map(pt => pt.y));
    }
    return { xmin, ymin, xmax, ymax, };
}

export function scaleViewBox(viewBox: ViewBox, scale: number, pt?: ViewPoint): ViewBox {
    const [viewPortX, viewPortY, viewPortWidth, viewPortHeight] = viewBox;

    pt = pt || {
        x: viewPortX + 0.5 * viewPortWidth,
        y: viewPortY + 0.5 * viewPortHeight
    };

    const x = viewPortX + ((pt.x - viewPortX) - scale * (pt.x - viewPortX));
    const y = viewPortY + ((pt.y - viewPortY) - scale * (pt.y - viewPortY));
    const w = scale * viewPortWidth;
    const h = scale * viewPortHeight;

    return [x, y, w, h];
}

//export const nullCanvesSize: CanvasSize = { size: { w: 0, h: 0 }, port: [0, 0, 0, 0], stroke: 0.001 };

type ViewBoxUpdate = {
    viewBox: ViewBox;
    stroke: number;
};

export function updateViewPort(canvas: ViewSize, x: number, y: number, w: number | null, h: number | null, force = false, viewPortLocked = false): ViewBoxUpdate | undefined {
    if (!force && viewPortLocked) {
        return;
    }

    if (!canvas.w || !canvas.h) {
        unexpected('updateViewPort');
        return;
    }

    if (w === null && h !== null) { w = canvas.w * h / canvas.h; }
    if (h === null && w !== null) { h = canvas.h * w / canvas.w; }
    if (!w || !h) {
        return;
    }

    const viewBox: ViewBox = [
        parseFloat((1 * x).toPrecision(6)),
        parseFloat((1 * y).toPrecision(6)),
        parseFloat((1 * w).toPrecision(4)),
        parseFloat((1 * h).toPrecision(4)),
    ];

    return {
        viewBox,
        stroke: viewBox[2] / canvas.w
    };
}

export function zoomAuto(canvas: ViewSize, targetPoints: SvgPoint[], viewPortLocked = false): ViewBoxUpdate | undefined {
    if (viewPortLocked) {
        return;
    }

    if (!canvas.w || !canvas.h) {
        unexpected('zoomAuto');
        return;
    }

    const box = getPointsBoundingBox(targetPoints);

    let x = box.xmin - 1;
    let y = box.ymin - 1;
    let w = box.xmax - box.xmin + 2;
    let h = box.ymax - box.ymin + 2;

    const ratio = canvas.h / canvas.w;
    if (ratio < h / w) {
        w = h / ratio;
    } else {
        h = ratio * w;
    }

    return updateViewPort(canvas, x, y, w, h, false, viewPortLocked);
}

export function getFitViewPort(canvas: ViewSize, targetPoints: SvgPoint[]): CanvasSize | undefined {

    if (!canvas.w || !canvas.h) {
        unexpected('getFitViewPort');
        return;
    }

    const box = getPointsBoundingBox(targetPoints);

    let x = box.xmin - 1;
    let y = box.ymin - 1;
    let viewPortWidth = box.xmax - box.xmin + 2;
    let viewPortHeight = box.ymax - box.ymin + 2;

    const ratio = canvas.h / canvas.w;
    if (ratio < viewPortHeight / viewPortWidth) {
        viewPortWidth = viewPortHeight / ratio;
    } else {
        viewPortHeight = ratio * viewPortWidth;
    }

    const port: ViewBox = [
        parseFloat((1 * x).toPrecision(6)),
        parseFloat((1 * y).toPrecision(6)),
        parseFloat((1 * viewPortWidth).toPrecision(4)),
        parseFloat((1 * viewPortHeight).toPrecision(4)),
    ];

    let strokeWidth = 1.1 * port[2] / canvas.w;

    return {
        size: { w: canvas.w, h: canvas.h },
        port: port,
        stroke: strokeWidth,
    };
}

// export function eventToLocation(canvasSize: CanvasSize, canvasContainer: HTMLElement, event: MouseEvent | TouchEvent, idx = 0): { x: number, y: number; } {
//     const rect = canvasContainer.getBoundingClientRect();
//     const touch = event instanceof MouseEvent ? event : event.touches[idx];
//     let [x, y] = canvasSize.port;
//     x += (touch.clientX - rect.left) * canvasSize.stroke;
//     y += (touch.clientY - rect.top) * canvasSize.stroke;
//     return { x, y };
// }

function eventClientPoint(event: MouseEvent | TouchEvent, idx = 0): ViewPoint {
    const touch = event instanceof MouseEvent ? event : event.touches[idx];
    return {
        x: touch.clientX,
        y: touch.clientY,
    };
}
/*
function eventToClient(canvasSize: CanvasSize, canvasContainer: HTMLElement, event: MouseEvent | TouchEvent, idx = 0): { x: number, y: number; } {
    const rect = canvasContainer.getBoundingClientRect();
    const touch = event instanceof MouseEvent ? event : event.touches[idx];
    let [x, y] = canvasSize.port;
    x += (touch.clientX - rect.left) * canvasSize.stroke;
    y += (touch.clientY - rect.top) * canvasSize.stroke;
    return { x, y };
}

function mousewheel(canvasSize: CanvasSize, canvasContainer: HTMLElement, accDeltaY: number, event: WheelEvent): ViewBox {
    const scale = Math.pow(1.005, accDeltaY);
    const pt = eventToLocation(canvasSize, canvasContainer, event);
    console.log('scale', scale, 'pt', pt);

    return zoomViewPort(canvasSize.port, scale, pt);
}
*/
