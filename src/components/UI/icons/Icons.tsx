import React, { SVGProps } from "react";

export function IconChevronDown(props: SVGProps<SVGSVGElement> & { title?: string; }) {
    const { title, ...rest } = props;
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...rest}>
            {title && <title>{title}</title>}
            <path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42z" />
        </svg>
    );
}


export function IconMenu(props: SVGProps<SVGSVGElement> & { title?: string; }) {
    const { title, ...rest } = props;
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z" />
        </svg>
    );
}

export function IconLock(props: SVGProps<SVGSVGElement> & { title?: string; }) {
    const { title, ...rest } = props;
    return (
        <svg fill="currentColor" viewBox="0 0 100 100" {...rest}>
            {title && <title>{title}</title>}
            <path d="M57.62 99.5H42.38a17.16 17.16 0 0 1-17.13-17.13V67.13a17.1 17.1 0 0 1 15.23-16.94v11.58a5.72 5.72 0 0 0-3.81 5.36v15.24a5.73 5.73 0 0 0 5.71 5.71h15.24a5.73 5.73 0 0 0 5.71-5.71V67.13a5.72 5.72 0 0 0-3.81-5.36V50.19a17.1 17.1 0 0 1 15.23 16.94v15.24A17.16 17.16 0 0 1 57.62 99.5Zm-1.91-66.63v34.26a5.71 5.71 0 1 1-11.42 0V32.87a5.71 5.71 0 1 1 11.42 0Zm3.81 16.94V38.23a5.72 5.72 0 0 0 3.81-5.36V17.63a5.73 5.73 0 0 0-5.71-5.71H42.38a5.73 5.73 0 0 0-5.71 5.71v15.24a5.72 5.72 0 0 0 3.81 5.36v11.58a17.1 17.1 0 0 1-15.23-16.94V17.63A17.16 17.16 0 0 1 42.38.5h15.24a17.16 17.16 0 0 1 17.13 17.13v15.24a17.1 17.1 0 0 1-15.23 16.94Z" />
        </svg>
    );
}


export function IconUndo(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
    const { title, ...rest } = props;
    return (
        <svg strokeWidth="1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M5 7v5" />
            <path d="M7.875 9.5h7c5.5 0 5.5 8.5 0 8.5h-10" />
            <path d="M11.375 13l-3.5-3.5l3.5-3.5" />
        </svg>
    );
}

export function IconRedo(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
    const { title, ...rest } = props;
    return (
        <svg strokeWidth="1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...rest }>
            {title && <title>{title}</title>}
            <path d="M19 7v5" />
            <path d="M16 9.5H9C3.5 9.5 3.5 18 9 18h10" />
            <path d="M12.5 13L16 9.5L12.5 6" />
        </svg>
    );
}
