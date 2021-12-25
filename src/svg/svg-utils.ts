import { SvgPoint } from "./svg";

function getPointsBoundingBox(targetPoints: SvgPoint[]): { xmin: number; ymin: number; xmax: number; ymax: number; } {
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

type ViewBox = [x: number, y: number, w: number, h: number];

type CanvasSize = {
    box: ViewBox;
    strokeWidth: number;
};

export function getViewPort(canvasWidth: number, canvasHeight: number, targetPoints: SvgPoint[]): CanvasSize {

    if (!canvasWidth || !canvasHeight) {
        return { box: [0, 0, 0, 0], strokeWidth: 0.001 };
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
        box: port,
        strokeWidth,
    };
}

export function eventToLocation(canvasSize: CanvasSize, canvasContainer: HTMLElement, event: MouseEvent | TouchEvent, idx = 0): { x: number, y: number; } {
    const rect = canvasContainer.getBoundingClientRect();
    const touch = event instanceof MouseEvent ? event : event.touches[idx];
    const x = canvasSize.box[0] + (touch.clientX - rect.left) * canvasSize.strokeWidth;
    const y = canvasSize.box[1] + (touch.clientY - rect.top) * canvasSize.strokeWidth;
    return { x, y };
}
