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

export const nullCanvesSize: CanvasSize = { size: { w: 0, h: 0 }, port: [0, 0, 0, 0], stroke: 0.001 };

type ViewBoxUpdate = {
    viewBox: ViewBox;
    stroke: number;
} | undefined;

export function updateViewPort(canvasWidth: number, canvasHeight: number, x: number, y: number, w: number | null, h: number | null, force = false, viewPortLocked = false): ViewBoxUpdate | undefined {
    if (!force && viewPortLocked) {
        return;
    }

    if (w === null && h !== null) { w = canvasWidth * h / canvasHeight; }
    if (h === null && w !== null) { h = canvasHeight * w / canvasWidth; }
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
        stroke: viewBox[2] / canvasWidth
    };
}

export function zoomAuto(canvasWidth: number, canvasHeight: number, targetPoints: SvgPoint[], viewPortLocked = false): ViewBoxUpdate | undefined {
    if (viewPortLocked) {
        return;
    }

    const box = getPointsBoundingBox(targetPoints);

    const k = canvasHeight / canvasWidth;
    let w = box.xmax - box.xmin + 2;
    let h = box.ymax - box.ymin + 2;
    if (k < h / w) {
        w = h / k;
    } else {
        h = k * w;
    }

    return updateViewPort(canvasWidth, canvasHeight, box.xmin - 1, box.ymin - 1, w, h, false, viewPortLocked);
}

export function getFitViewPort(canvasWidth: number, canvasHeight: number, targetPoints: SvgPoint[]): CanvasSize {

    if (!canvasWidth || !canvasHeight) {
        return nullCanvesSize;
    }

    const box = getPointsBoundingBox(targetPoints);

    const x = box.xmin - 1;
    const y = box.ymin - 1;
    let viewPortWidth = box.xmax - box.xmin + 2;
    let viewPortHeight = box.ymax - box.ymin + 2;

    const ratio = canvasHeight / canvasWidth;
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

    let strokeWidth = 1.1 * port[2] / canvasWidth;

    return {
        size: { w: canvasWidth, h: canvasHeight },
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
