import React, { useEffect, useState } from 'react';
//import { off, on } from 'react-use/esm/misc/util';

/**/
export const noop = () => {};

export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>));
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['removeEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>));
  }
}
/**/
export function useMouseWheelX(target?: EventTarget | null) {
    const [mouseWheelScrolled, setMouseWheelScrolled] = useState(0);

    useEffect(() => {
        const tt = target;

        console.log('target on', target);
        //debugger

        function updateScroll(e: WheelEvent) {
            console.log('callback wheel', target, tt, mouseWheelScrolled, e.deltaY);

            setMouseWheelScrolled(mouseWheelScrolled + e.deltaY);
        };

        on(target || window, 'wheel', updateScroll, false);
        // return () => off(target || window, 'wheel', updateScroll);
        return () => {
            console.log('target off', target);
            off(target || window, 'wheel', updateScroll);
        };
    }, [target]);

    console.log('target from hook', target);

    return mouseWheelScrolled;
}


export function useMouseWheelY() {
    const [mouseWheelScrolled, setMouseWheelScrolled] = useState(0);
    useEffect(() => {
        const updateScroll = (e: WheelEvent) => {
            setMouseWheelScrolled(e.deltaY + mouseWheelScrolled);
        };
        console.log('---------hook Y', mouseWheelScrolled);
        
        on(window, 'wheel', updateScroll, false);
        return () => off(window, 'wheel', updateScroll);
    });
    return mouseWheelScrolled;
};

export function useMouseWheelZ() {
    const [mouseWheelScrolled, setMouseWheelScrolled] = useState(0);
    useEffect(() => {
        const updateScroll = (e: WheelEvent) => {
            setMouseWheelScrolled(e.deltaY + mouseWheelScrolled);
        };
        console.log('---------hook Z', mouseWheelScrolled);

        on(window, 'wheel', updateScroll, false);
        return () => off(window, 'wheel', updateScroll);
    });
    return mouseWheelScrolled;
};

// export default function useMouseWheelX(target?: EventTarget | null) {
//     const [mouseWheelScrolled, setMouseWheelScrolled] = useState<{
//         delta: number,
//         event: WheelEvent | null,
//     }>({
//         delta: 0,
//         event: null,
//     });

//     useEffect(() => {
//         const tt = target;

//         console.log('target on', target);
//         //debugger

//         function updateScroll(e: WheelEvent) {
//             console.log('callback wheel', target, tt, mouseWheelScrolled.delta, e.deltaY);

//             setMouseWheelScrolled({
//                 delta: mouseWheelScrolled.delta + e.deltaY,
//                 event: e,
//             });
//         };

//         on(target || window, 'wheel', updateScroll, false);
//         // return () => off(target || window, 'wheel', updateScroll);
//         return () => {
//             console.log('target off', target);
//             off(target || window, 'wheel', updateScroll)
//         };
//     }, [target]);

//     console.log('target from hook', target);

//     return mouseWheelScrolled;
// }
