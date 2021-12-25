import { useEffect, useState } from 'react';
import { off, on } from 'react-use/esm/misc/util';

export default function useMouseWheelX(target?: EventTarget | null) {
    const [mouseWheelScrolled, setMouseWheelScrolled] = useState<{
        delta: number,
        event: WheelEvent | null,
    }>({
        delta: 0,
        event: null,
    });

    useEffect(() => {
        const tt = target;

        console.log('target on', target);
        //debugger

        function updateScroll(e: WheelEvent) {
            console.log('callback wheel', target, tt, mouseWheelScrolled.delta, e.deltaY);

            setMouseWheelScrolled({
                delta: mouseWheelScrolled.delta + e.deltaY,
                event: e,
            });
        };

        on(target || window, 'wheel', updateScroll, true);
        // return () => off(target || window, 'wheel', updateScroll);
        return () => {
            console.log('target off', target);
            off(target || window, 'wheel', updateScroll)
        };
    }, [target]);

    console.log('target from hook', target);

    return mouseWheelScrolled;
}
