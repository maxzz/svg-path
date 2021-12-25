import { useEffect, useState } from 'react';
import { off, on } from 'react-use/esm/misc/util';

export default function useMouseWheelX(target?: HTMLElement | SVGElement) {
    const [mouseWheelScrolled, setMouseWheelScrolled] = useState<{
        delta: number,
        event: WheelEvent | null,
    }>({
        delta: 0,
        event: null,
    });

    useEffect(() => {
        const updateScroll = (e: WheelEvent) => {
            setMouseWheelScrolled({
                delta: mouseWheelScrolled.delta + e.deltaY,
                event: e,
            });
        };
        console.log('target', target);

        on(target || window, 'wheel', updateScroll, false);
        return () => off(target || window, 'wheel', updateScroll);
    });

    return mouseWheelScrolled;
}
