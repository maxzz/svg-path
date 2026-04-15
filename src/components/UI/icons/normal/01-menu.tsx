import { type SVGProps, type HTMLAttributes } from "react";
import { classNames } from "../../../../utils/classnames";

export function IconMenu(props: SVGProps<SVGSVGElement> & HTMLAttributes<SVGSVGElement>) {
    const { title, className, ...rest } = props;
    return (
        <svg className={classNames("fill-current", className)} viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z" />
        </svg>
    );
}
