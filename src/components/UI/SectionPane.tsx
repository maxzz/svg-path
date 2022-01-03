import { motion, useAnimation, Variants } from 'framer-motion';
import React, { HTMLAttributes, ReactNode } from 'react';

const variants: Variants = {
    open: { d: ["M 20,65 50,35 80,65", "M 20,35 50,65 80,35"], },
    closed: { d: ["M 20,35 50,65 80,35", "M 20,65 50,35 80,65"], },
};

export function SectionPane({ children, open = true, onClick, ...rest }: { children?: ReactNode; open?: boolean; } & HTMLAttributes<HTMLDivElement>) {
    const api = useAnimation();
    const click = (event: React.MouseEvent<HTMLDivElement>) => onClick && (api.start(open ? "closed" : "open"), onClick(event));
    return (
        <div
            className="px-2 py-1 bg-slate-500 text-stone-100 uppercase flex items-center justify-between select-none cursor-pointer font-ui"
            onClick={click}
            {...rest}
        >
            <div className="pr-1 pt-1">{children}</div>
            <div className="">
                <svg className="w-6 h-6 p-1 stroke-current stroke-[.6rem] fill-none" viewBox="0 0 100 100">
                    <motion.path
                        d="M 20,35 50,65 80,35"
                        animate={api}
                        variants={variants}
                        transition={{ ease: "easeInOut", duration: .2, }}
                    />
                </svg>
            </div>
        </div>
    );
}
