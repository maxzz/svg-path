import * as React from "react";

export const BgGrid = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <pattern id="a" width={10} height={10} patternUnits="userSpaceOnUse">
                <path
                    d="M10 0H0v10"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={0.3}
                    strokeOpacity={0.5}
                />
            </pattern>
            <pattern id="b" width={100} height={100} patternUnits="userSpaceOnUse">
                <path fill="url(#a)" d="M0 0h100v100H0z" />
                <path
                    d="M100 0H0v100"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeOpacity={0.2}
                />
            </pattern>
            <pattern id="c" width={200} height={200} patternUnits="userSpaceOnUse">
                <path fill="url(#b)" d="M0 0h200v200H0z" />
                <path
                    d="M200 0H0v200"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeOpacity={0.2}
                />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#040d1c" /> {/* #002846 */}
        <rect width="100%" height="100%" fill="url(#c)" />
    </svg>
);
