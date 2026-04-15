import { type SVGProps, type HTMLAttributes } from "react";
import { classNames } from "../../../../utils/classnames";

export function IconLock(props: SVGProps<SVGSVGElement> & HTMLAttributes<SVGSVGElement>) {
    const { title, className, ...rest } = props;
    return (
        <svg className={classNames("fill-current", className)} viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M13.694 23H10.306a3.813 3.813 0 0 1-3.806-3.806V15.806a3.8 3.8 0 0 1 3.384-3.765v2.573a1.271 1.271 0 0 0-.846 1.191v3.387a1.273 1.273 0 0 0 1.269 1.269h3.387a1.273 1.273 0 0 0 1.269-1.269V15.806a1.271 1.271 0 0 0-.846-1.191V12.043a3.8 3.8 0 0 1 3.384 3.765v3.387A3.813 3.813 0 0 1 13.694 23Zm-.424-14.806v7.613a1.269 1.269 0 1 1-2.538 0V8.194a1.269 1.269 0 1 1 2.538 0Zm.846 3.765V9.384a1.271 1.271 0 0 0 .846-1.191V4.806a1.273 1.273 0 0 0-1.269-1.269H10.306a1.273 1.273 0 0 0-1.269 1.269v3.387a1.271 1.271 0 0 0 .846 1.191v2.573a3.8 3.8 0 0 1-3.384-3.765V4.806A3.813 3.813 0 0 1 10.306 1h3.387a3.813 3.813 0 0 1 3.806 3.806v3.387a3.8 3.8 0 0 1-3.384 3.765Z" />
        </svg>
    );
}
