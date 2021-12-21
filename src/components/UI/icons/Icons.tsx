import React, { SVGProps } from "react";

export function MdiChevronDown(props: SVGProps<SVGSVGElement> & { title?: string; }) {
    const {title, ...rest} = props;
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42z" fill="currentColor">
            </path>
        </svg>
    );
}
