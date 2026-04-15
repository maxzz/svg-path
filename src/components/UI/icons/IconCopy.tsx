import { type SVGProps, type HTMLAttributes } from "react";

export function IconCopy(props: SVGProps<SVGSVGElement> & HTMLAttributes<SVGSVGElement>) {
    const { title, className, ...rest } = props;
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M 5.086 6.237 V 17.601 a 4.429 4.429 90 0 0 4.138 4.42 L 9.515 22.03 h 7.82 A 2.657 2.657 90 0 1 14.83 23.802 H 8.629 a 5.315 5.315 90 0 1 -5.315 -5.315 V 8.744 a 2.657 2.657 90 0 1 1.772 -2.507 z M 18.373 2.543 A 2.657 2.657 90 0 1 21.03 5.2 v 12.401 a 2.657 2.657 90 0 1 -2.657 2.657 h -8.858 A 2.657 2.657 90 0 1 6.858 17.601 v -12.401 A 2.657 2.657 90 0 1 9.515 2.543 h 8.858 z m 0 1.772 h -8.858 a 0.886 0.886 90 0 0 -0.886 0.886 v 12.401 a 0.886 0.886 90 0 0 0.886 0.886 h 8.858 a 0.886 0.886 90 0 0 0.886 -0.886 v -12.401 a 0.886 0.886 90 0 0 -0.886 -0.886 z" />
        </svg>
    );
}

