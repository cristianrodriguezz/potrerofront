import { ShieldProps } from "@/types/props";
import React from "react";



const Shield1SVG: React.FC<ShieldProps> = ({
    className,
    children,
    patternId,
    strokeColor = "#000000",
    strokeWidth = 1,
}) => {
    return (
        <svg
            id="e90adofyKY61"
            viewBox="0 0 145 145"
            className={className}
        >
          <defs>{children}</defs>
            <path
                d="M20.039682,35.557427L70.776716,16.267188l50.702473,19.290239c1.210173,36.928865-20.227567,76.365222-50.702473,95.031096C49.775925,117.57838,20.057134,82.615407,20.039682,35.557427Z"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill={patternId ? `url(#${patternId})` : "#CCCCCC"}
            />
        </svg>
    );
};

export default Shield1SVG;

