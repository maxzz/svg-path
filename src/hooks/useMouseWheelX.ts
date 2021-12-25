import { useEffect, useState } from 'react';
import { off, on } from 'react-use/esm/misc/util';

export default () => {
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

        on(window, 'wheel', updateScroll, false);
        return () => off(window, 'wheel', updateScroll);
    });

    return mouseWheelScrolled;
};
