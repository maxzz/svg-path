import { type SVGProps, type HTMLAttributes } from "react";

export function IconUndo(props: SVGProps<SVGSVGElement> & HTMLAttributes<SVGSVGElement>) {
    const { title, className, ...rest } = props;
    return (
        <svg
            className={className}
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            {...rest}>
            {title && <title>{title}</title>}
            <path d="M2.8 2.3V15" />
            <path d="M6.58 8.67h9.34c7.33 0 7.33 11.33 0 11.33h-13.34" />
            <path d="m11.25 13.33-4.67-4.66L11.25 4" />
        </svg>
    );
}

