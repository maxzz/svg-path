import { type SVGProps, type HTMLAttributes } from "react";
import { classNames } from "../../../../utils/classnames";

export function IconRedo(props: SVGProps<SVGSVGElement> & HTMLAttributes<SVGSVGElement>) {
    const { title, className, ...rest } = props;
    return (
        <svg className={classNames("fill-none stroke-current stroke-[1.5px]", className)} viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M21.4 2.3V15" />
            <path d="M17.42 8.67H8.08C.75 8.67.75 20 8.08 20h13.34" />
            <path d="m12.75 13.33 4.67-4.66L12.75 4" />
        </svg>
    );
}
