import { type SVGProps, type HTMLAttributes } from "react";
import { classNames } from "../../../../utils/classnames";

export function IconSave(props: SVGProps<SVGSVGElement> & HTMLAttributes<SVGSVGElement>) {
    const { title, className, ...rest } = props;
    return (
        <svg className={classNames("fill-current", className)} viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M5.2 1.5h13.08l4.22 4.22V18.8a3.7 3.7 0 0 1-3.7 3.7H5.2a3.7 3.7 0 0 1-3.7-3.7V5.2a3.7 3.7 0 0 1 3.7-3.7ZM5.43 3A2.39 2.39 0 0 0 3 5.43v13.14A2.39 2.39 0 0 0 5.43 21h13.14A2.39 2.39 0 0 0 21 18.57v-12L17.48 3h-1.3v6H5.43Zm1.4 0v4.45h7.87V3ZM12 10.81a3.71 3.71 0 0 1 3.71 3.71A3.71 3.71 0 0 1 12 18.23a3.71 3.71 0 0 1-3.71-3.71A3.71 3.71 0 0 1 12 10.81Zm0 1.46a2.25 2.25 0 0 0-2.25 2.25A2.25 2.25 0 0 0 12 16.77a2.25 2.25 0 0 0 2.25-2.25A2.25 2.25 0 0 0 12 12.27Z" />
        </svg>
    );
}
