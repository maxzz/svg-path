import React, { SVGProps } from "react";

export function IconChevronDown(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
    const { title, ...rest } = props;
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42z" />
        </svg>
    );
}

export function IconMenu(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
    const { title, ...rest } = props;
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z" />
        </svg>
    );
}

export function IconLock(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
    const { title, ...rest } = props;
    return (
        <svg fill="currentColor" viewBox="0 0 100 100" {...rest}>
            {title && <title>{title}</title>}
            <path d="M57.62 99.5H42.38a17.16 17.16 0 0 1-17.13-17.13V67.13a17.1 17.1 0 0 1 15.23-16.94v11.58a5.72 5.72 0 0 0-3.81 5.36v15.24a5.73 5.73 0 0 0 5.71 5.71h15.24a5.73 5.73 0 0 0 5.71-5.71V67.13a5.72 5.72 0 0 0-3.81-5.36V50.19a17.1 17.1 0 0 1 15.23 16.94v15.24A17.16 17.16 0 0 1 57.62 99.5Zm-1.91-66.63v34.26a5.71 5.71 0 1 1-11.42 0V32.87a5.71 5.71 0 1 1 11.42 0Zm3.81 16.94V38.23a5.72 5.72 0 0 0 3.81-5.36V17.63a5.73 5.73 0 0 0-5.71-5.71H42.38a5.73 5.73 0 0 0-5.71 5.71v15.24a5.72 5.72 0 0 0 3.81 5.36v11.58a17.1 17.1 0 0 1-15.23-16.94V17.63A17.16 17.16 0 0 1 42.38.5h15.24a17.16 17.16 0 0 1 17.13 17.13v15.24a17.1 17.1 0 0 1-15.23 16.94Z" />
        </svg>
    );
}

export function IconSave(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
    const { title, ...rest } = props;
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M5.2 1.5h13.08l4.22 4.22V18.8a3.7 3.7 0 0 1-3.7 3.7H5.2a3.7 3.7 0 0 1-3.7-3.7V5.2a3.7 3.7 0 0 1 3.7-3.7ZM5.43 3A2.39 2.39 0 0 0 3 5.43v13.14A2.39 2.39 0 0 0 5.43 21h13.14A2.39 2.39 0 0 0 21 18.57v-12L17.48 3h-1.3v6H5.43Zm1.4 0v4.45h7.87V3ZM12 10.81a3.71 3.71 0 0 1 3.71 3.71A3.71 3.71 0 0 1 12 18.23a3.71 3.71 0 0 1-3.71-3.71A3.71 3.71 0 0 1 12 10.81Zm0 1.46a2.25 2.25 0 0 0-2.25 2.25A2.25 2.25 0 0 0 12 16.77a2.25 2.25 0 0 0 2.25-2.25A2.25 2.25 0 0 0 12 12.27Z" />
        </svg>
    );
}
{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M5.2 1.5h13.08l4.22 4.22V18.8a3.7 3.7 0 0 1-3.7 3.7H5.2a3.7 3.7 0 0 1-3.7-3.7V5.2a3.7 3.7 0 0 1 3.7-3.7ZM5.43 3A2.39 2.39 0 0 0 3 5.43v13.14A2.39 2.39 0 0 0 5.43 21h13.14A2.39 2.39 0 0 0 21 18.57v-12L17.48 3h-1.3v6H5.43Zm1.4 0v4.45h7.87V3ZM12 10.81a3.71 3.71 0 0 1 3.71 3.71A3.71 3.71 0 0 1 12 18.23a3.71 3.71 0 0 1-3.71-3.71A3.71 3.71 0 0 1 12 10.81Zm0 1.46a2.25 2.25 0 0 0-2.25 2.25A2.25 2.25 0 0 0 12 16.77a2.25 2.25 0 0 0 2.25-2.25A2.25 2.25 0 0 0 12 12.27Z" data-name="Layer 1"/>
  <path opacity=".09" d="M0 0h24v24H0z" data-name="Layer 3"/>
</svg> */}

export function IconSaveCneterRight(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
    const { title, ...rest } = props;
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M5.2 1.5h13.08l4.22 4.22V18.8a3.7 3.7 0 0 1-3.7 3.7H5.2a3.7 3.7 0 0 1-3.7-3.7V5.2a3.7 3.7 0 0 1 3.7-3.7Zm.23 1.54A2.39 2.39 0 0 0 3 5.43v13.14A2.39 2.39 0 0 0 5.43 21h13.14A2.39 2.39 0 0 0 21 18.57v-12L17.48 3h-1.3v6H5.43Zm1.4 0v4.41h7.87V3Zm5.79 8.34a3.71 3.71 0 0 1 3.7 3.71 3.71 3.71 0 0 1-3.7 3.71 3.71 3.71 0 0 1-3.71-3.71 3.71 3.71 0 0 1 3.71-3.71Zm0 1.46a2.25 2.25 0 0 0-2.25 2.25 2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25 2.25 2.25 0 0 0-2.25-2.25Z" />
        </svg>
    );
}
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//   <path d="M5.2 1.5h13.08l4.22 4.22V18.8a3.7 3.7 0 0 1-3.7 3.7H5.2a3.7 3.7 0 0 1-3.7-3.7V5.2a3.7 3.7 0 0 1 3.7-3.7Zm.23 1.54A2.39 2.39 0 0 0 3 5.43v13.14A2.39 2.39 0 0 0 5.43 21h13.14A2.39 2.39 0 0 0 21 18.57v-12L17.48 3h-1.3v6H5.43Zm1.4 0v4.41h7.87V3Zm5.79 8.34a3.71 3.71 0 0 1 3.7 3.71 3.71 3.71 0 0 1-3.7 3.71 3.71 3.71 0 0 1-3.71-3.71 3.71 3.71 0 0 1 3.71-3.71Zm0 1.46a2.25 2.25 0 0 0-2.25 2.25 2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25 2.25 2.25 0 0 0-2.25-2.25Z" data-name="Layer 1"/>
//   <path opacity=".09" d="M0 0h24v24H0z" data-name="Layer 3"/>
// </svg>

// export function IconSaveThin(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
//     const { title, ...rest } = props;
//     return (
//         <svg fill="currentColor" viewBox="0 0 24 24" {...rest}>
//             {title && <title>{title}</title>}
//             <path d="M6 4h10.586L20 7.414V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm0 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7.914L16.086 5H15v5H6V5zm1 0v4h7V5H7zm5 7a3 3 0 1 1 0 6a3 3 0 0 1 0-6zm0 1a2 2 0 1 0 0 4a2 2 0 0 0 0-4z" />
//         </svg>
//     );
// }

export function IconCopy(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
    const { title, ...rest } = props;
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M 5.086 6.237 V 17.601 a 4.429 4.429 90 0 0 4.138 4.42 L 9.515 22.03 h 7.82 A 2.657 2.657 90 0 1 14.83 23.802 H 8.629 a 5.315 5.315 90 0 1 -5.315 -5.315 V 8.744 a 2.657 2.657 90 0 1 1.772 -2.507 z M 18.373 2.543 A 2.657 2.657 90 0 1 21.03 5.2 v 12.401 a 2.657 2.657 90 0 1 -2.657 2.657 h -8.858 A 2.657 2.657 90 0 1 6.858 17.601 v -12.401 A 2.657 2.657 90 0 1 9.515 2.543 h 8.858 z m 0 1.772 h -8.858 a 0.886 0.886 90 0 0 -0.886 0.886 v 12.401 a 0.886 0.886 90 0 0 0.886 0.886 h 8.858 a 0.886 0.886 90 0 0 0.886 -0.886 v -12.401 a 0.886 0.886 90 0 0 -0.886 -0.886 z" />
        </svg>
    );
}

// export function IconCopy16(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
//     const { title, ...rest } = props;
//     return (
//         <svg fill="currentColor" viewBox="0 0 16 16" {...rest}>
//             {title && <title>{title}</title>}
//             <path d="M4 4.085V10.5a2.5 2.5 0 0 0 2.336 2.495L6.5 13h4.414A1.5 1.5 0 0 1 9.5 14H6a3 3 0 0 1-3-3V5.5a1.5 1.5 0 0 1 1-1.415zM11.5 2A1.5 1.5 0 0 1 13 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 5 10.5v-7A1.5 1.5 0 0 1 6.5 2h5zm0 1h-5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5z" />
//         </svg>
//     );
// }

export function IconTrash(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
    const { title, ...rest } = props;
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path fillRule="evenodd" clipRule="evenodd" d="M16 4.79h4.81V6.4h-1.6v14.41l-1.61 1.6H6.4l-1.61-1.6V6.4h-1.6V4.79H8v-1.6a1.6 1.6 0 0 1 1.6-1.6h4.8a1.6 1.6 0 0 1 1.6 1.6Zm-1.6-1.6H9.6v1.6h4.8Zm-8 17.62h11.2V6.4H6.4ZM9.6 8H8v11.21h1.6Zm1.6 0h1.6v11.21h-1.6Zm3.2 0H16v11.21h-1.6Z" />
        </svg>
    );
}
{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M16 4.79h4.81V6.4h-1.6v14.41l-1.61 1.6H6.4l-1.61-1.6V6.4h-1.6V4.79H8v-1.6a1.6 1.6 0 0 1 1.6-1.6h4.8a1.6 1.6 0 0 1 1.6 1.6Zm-1.6-1.6H9.6v1.6h4.8Zm-8 17.62h11.2V6.4H6.4ZM9.6 8H8v11.21h1.6Zm1.6 0h1.6v11.21h-1.6Zm3.2 0H16v11.21h-1.6Z" fill-rule="evenodd" data-name="Layer 1"/>
  <path opacity=".09" d="M0 0h24v24H0z" data-name="Layer 3"/>
</svg> */}

// export function IconTrashLeft(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
//     const { title, ...rest } = props;
//     return (
//         <svg fill="currentColor" viewBox="0 0 16 16" {...rest}>
//             {title && <title>{title}</title>}
//             <path fillRule="evenodd" clipRule="evenodd" d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zM9 2H6v1h3V2zM4 13h7V4H4v9zm2-8H5v7h1V5zm1 0h1v7H7V5zm2 0h1v7H9V5z"/>
//         </svg>
//     );
// }

export function IconUndo(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
    const { title, ...rest } = props;
    return (
        <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M2.8 2.3V15" />
            <path d="M6.58 8.67h9.34c7.33 0 7.33 11.33 0 11.33h-13.34" />
            <path d="m11.25 13.33-4.67-4.66L11.25 4" />
        </svg>
    );
}

{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <defs>
    <style>
      .cls-2{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px}
    </style>
  </defs>
  <g id="Layer_1" data-name="Layer 1">
    <path d="M2.75 2.33V15" stroke-width="2" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="cls-2" d="M-23.42 8.67h9.34c7.33 0 7.33 11.33 0 11.33h-13.34" transform="translate(30)"/>
    <path class="cls-2" d="m-18.75 13.33-4.67-4.66L-18.75 4" transform="translate(30)"/>
  </g>
  <path opacity=".09" d="M0 0h24v24H0z" id="Layer_3" data-name="Layer 3"/>
</svg> */}

// export function IconUndoSmall(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
//     const { title, ...rest } = props;
//     return (
//         <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
//             {title && <title>{title}</title>}
//             <path d="M5 7v5" />
//             <path d="M7.875 9.5h7c5.5 0 5.5 8.5 0 8.5h-10" />
//             <path d="M11.375 13l-3.5-3.5l3.5-3.5" />
//         </svg>
//     );
// }

export function IconRedo(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
    const { title, ...rest } = props;
    return (
        <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
            {title && <title>{title}</title>}
            <path d="M21.4 2.3V15" />
            <path d="M17.42 8.67H8.08C.75 8.67.75 20 8.08 20h13.34" />
            <path d="m12.75 13.33 4.67-4.66L12.75 4" />
        </svg>
    );
}

{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <defs>
    <style>
      .cls-2{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px}
    </style>
  </defs>
  <g id="Layer_1" data-name="Layer 1">
    <path d="M21.42 2.33V15" stroke-width="2" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="cls-2" d="M17.42 8.67H8.08C.75 8.67.75 20 8.08 20h13.34"/>
    <path class="cls-2" d="m12.75 13.33 4.67-4.66L12.75 4"/>
  </g>
  <path opacity=".09" d="M0 0h24v24H0z" id="Layer_3" data-name="Layer 3"/>
</svg> */}

// export function IconRedo(props: SVGProps<SVGSVGElement> & React.HTMLAttributes<SVGSVGElement>) {
//     const { title, ...rest } = props;
//     return (
//         <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
//             {title && <title>{title}</title>}
//             <path d="M19 7v5" />
//             <path d="M16 9.5H9C3.5 9.5 3.5 18 9 18h10" />
//             <path d="M12.5 13L16 9.5L12.5 6" />
//         </svg>
//     );
// }
