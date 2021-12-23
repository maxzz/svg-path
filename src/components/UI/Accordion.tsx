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
