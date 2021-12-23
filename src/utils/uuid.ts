function now(): number {
    const timeNow = Date.now();
    const last = (now as any).last || timeNow;
    return (now as any).last = timeNow > last ? timeNow : last + 1;
}

export default function time(): string {
    return now().toString(36);
}
