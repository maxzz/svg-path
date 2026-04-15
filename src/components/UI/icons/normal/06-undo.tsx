import { type SVGProps, type HTMLAttributes } from "react";
import { classNames } from "../../../../utils/classnames";

export function IconUndo(props: SVGProps<SVGSVGElement> & HTMLAttributes<SVGSVGElement>) {
    const { title, className, ...rest } = props;
    return (
        <svg className={classNames("fill-none stroke-current stroke-[1.5px]", className)} viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M2.8 2.3V15" />
            <path d="M6.58 8.67h9.34c7.33 0 7.33 11.33 0 11.33h-13.34" />
            <path d="m11.25 13.33-4.67-4.66L11.25 4" />
        </svg>
    );
}
