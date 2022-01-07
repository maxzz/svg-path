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
    a: ['rx', 'ry', 'x-axis-rotation', 'large-arc-flag', 'sweep-flag', 'dx', 'dy']
};

export function getTooltip(command: string, idx: number): string {
    return commandAttrs[command]?.[idx] || '';
}
