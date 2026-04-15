import { type SVGProps, type HTMLAttributes } from "react";
import { classNames } from "../../../../utils/classnames";

export function IconTrash(props: SVGProps<SVGSVGElement> & HTMLAttributes<SVGSVGElement>) {
    const { title, className, ...rest } = props;
    return (
        <svg className={classNames("fill-current", className)} viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 4.79h4.81V6.4h-1.6v14.41l-1.61 1.6H6.4l-1.61-1.6V6.4h-1.6V4.79H8v-1.6a1.6 1.6 0 0 1 1.6-1.6h4.8a1.6 1.6 0 0 1 1.6 1.6Zm-1.6-1.6H9.6v1.6h4.8Zm-8 17.62h11.2V6.4H6.4ZM9.6 8H8v11.21h1.6Zm1.6 0h1.6v11.21h-1.6Zm3.2 0H16v11.21h-1.6Z"
            />
        </svg>
    );
}
