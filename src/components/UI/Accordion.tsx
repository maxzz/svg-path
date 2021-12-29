import React from 'react';
import { useMeasure } from 'react-use';
import { a, config, useSpring } from '@react-spring/web';

export function Accordion({ toggle, children }: { toggle: boolean, children: React.ReactNode; }) {
    const [ref, { height, top }] = useMeasure<HTMLDivElement>();
    const [firstRun, setFirstRun] = React.useState(true);
    const animation = useSpring({
        overflow: "hidden",
        height: toggle ? height + top : 0,
        config: firstRun ? { duration: 0 } : { mass: 0.2, tension: 392, clamp: true },
        onRest: () => firstRun && setFirstRun(false),
    });
    return (
        <div>
            <a.div style={animation}>
                <div ref={ref}>
                    {children}
                </div>
            </a.div>
        </div>
    );
}

// export function AccordionHorizontal({ toggle, children }: { toggle: boolean, children: React.ReactNode; }) {
//     const [ref, { width, left }] = useMeasure<HTMLDivElement>();
//     const [firstRun, setFirstRun] = React.useState(true);
//     const animation = useSpring({
//         overflow: "hidden",
//         width: toggle ? width + left : '300px',
//         config: firstRun ? { duration: 0 } : { mass: 0.2, tension: 392, clamp: true, duration: 3000 },
//         onRest: () => firstRun && setFirstRun(false),
//     });
//     return (
//         <div>
//             <a.div style={animation}>
//                 <div ref={ref}>
//                     {children}
//                 </div>
//             </a.div>
//         </div>
//     );
// }
