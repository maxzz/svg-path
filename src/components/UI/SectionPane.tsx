import React, { HTMLAttributes } from 'react';
import { a, useSpring } from '@react-spring/web';

export function SectionPane({ children, open = true, ...rest }: { open?: boolean; } & HTMLAttributes<HTMLDivElement>) {
    const styles = useSpring({ open: open ? 1 : 0 });
    return (
        <div
            className="px-2 py-1 bg-slate-500 text-stone-100 uppercase flex items-center justify-between select-none cursor-pointer font-ui"
            {...rest}
        >
            {/* Section name */}
            <div className="pr-1 pt-1">
                {children}
            </div>
            {/* Open/Close icon */}
            <svg className="w-6 h-6 p-1 stroke-current stroke-[.6rem] fill-none" viewBox="0 0 100 100">
                <a.path d={styles.open.to({ range: [0, .3, 1], output: ["M 50 13 L 80 43 L 50 72", "M 50 13 L 50 42 L 50 72", "M 80 35 L 50 65 L 20 35"] })} />
                {/* <a.path d={styles.open.to({ range: [0, 1], output: ["M 50 72 L 80 43 L 50 13", "M 80 35 L 50 65 L 20 35"] })} /> */}
                {/* <a.path d={styles.open.to({ range: [0, 1], output: ["M 20 12 L 50 42 L 20 72", "M 80 35 L 50 65 L 20 35"] })} /> */}
                {/* <a.path d={styles.open.to({ range: [0, 1], output: ["M 50 35 L 80 65 L 50 95", "M 20,65 50,35 80,65"] })} /> */}
                {/* <a.path d={styles.open.to({ range: [0, 1], output: ["M 20,65 50,35 80,65", "M 20,35 50,65 80,35"] })} /> */}
            </svg>
        </div>
    );
}

// The code below adds gzip 100K, but useSpring above does the same. (unzipped 849KB -> 545KB)
// import { motion, useAnimation, Variants } from 'framer-motion';
// const variants: Variants = {
//     open: { d: ["M 20,65 50,35 80,65", "M 20,35 50,65 80,35"], },
//     closed: { d: ["M 20,35 50,65 80,35", "M 20,65 50,35 80,65"], },
// };
// export function SectionPane({ children, open = true, onClick, ...rest }: { children?: ReactNode; open?: boolean; } & HTMLAttributes<HTMLDivElement>) {
//     const api = useAnimation();
//     const click = (event: React.MouseEvent<HTMLDivElement>) => onClick && (api.start(open ? "closed" : "open"), onClick(event));
//     return (
//         <div
//             className="px-2 py-1 bg-slate-500 text-stone-100 uppercase flex items-center justify-between select-none cursor-pointer font-ui"
//             onClick={click}
//             {...rest}
//         >
//             <div className="pr-1 pt-1">{children}</div>
//             <div className="">
//                 <svg className="w-6 h-6 p-1 stroke-current stroke-[.6rem] fill-none" viewBox="0 0 100 100">
//                     <motion.path
//                         d="M 20,35 50,65 80,35"
//                         animate={api}
//                         variants={variants}
//                         transition={{ ease: "easeInOut", duration: .2, }}
//                     />
//                 </svg>
//             </div>
//         </div>
//     );
// }
