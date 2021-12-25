import React,{ useEffect, useState } from 'react';
//import { off, on } from 'react-use/esm/misc/util';


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

export default function useMouseWheelX(target?: EventTarget | null) {
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
            off(target || window, 'wheel', updateScroll)
        };
    }, [target]);

    console.log('target from hook', target);

    return mouseWheelScrolled;
}
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

export type Element = ((state: boolean) => React.ReactElement<any>) | React.ReactElement<any>;

const useHover = (element: Element): [React.ReactElement<any>, boolean] => {
  const [state, setState] = useState(false);

  const onMouseEnter = (originalOnMouseEnter?: any) => (event: any) => {
    (originalOnMouseEnter || noop)(event);
    setState(true);
  };
  const onMouseLeave = (originalOnMouseLeave?: any) => (event: any) => {
    (originalOnMouseLeave || noop)(event);
    setState(false);
  };

  if (typeof element === 'function') {
    element = element(state);
  }

  const el = React.cloneElement(element, {
    onMouseEnter: onMouseEnter(element.props.onMouseEnter),
    onMouseLeave: onMouseLeave(element.props.onMouseLeave),
  });

  return [el, state];
};
