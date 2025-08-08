import { ShieldProps } from "@/types/props";
import React from "react";


const Shield3SVG: React.FC<ShieldProps> = ({
    className,
    children,
    patternId,
    strokeColor = "#000000",
    strokeWidth = 1,
}) => {
    return (
        <svg
            id="e90JNrGnBD41"
            viewBox="0 0 145 145"
            className={className}
        >
            <defs>{children}</defs>
            <path
                d="M35.679024,15.68862h73.90212c1.163925,6.459066,8.430863,12.439689,13.258033,16.043942c1.010762,52.349935-18.417629,84.759209-50.216512,97.578822C42.894381,118.581966,19.33534,79.999295,22.168946,31.732562C27.315049,28.556959,34.658101,21.18383,35.679024,15.68862Z"
                transform="translate(-.004061 0.000001)"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill={patternId ? `url(#${patternId})` : "#CCCCCC"}
            />
        </svg>
    );
};

export default Shield3SVG;
