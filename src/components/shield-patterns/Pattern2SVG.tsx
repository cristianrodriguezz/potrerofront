// Pattern2SVG.tsx (Puntos)
import React from "react";

interface PatternProps {
  rotation?: number;
  scale?: number;
  density?: number;
  elementSize?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

const Pattern2SVG: React.FC<PatternProps> = ({
  rotation = 0,
  scale = 1,
  density = 5,
  elementSize = 1,
  primaryColor = "#3182ce",
  secondaryColor = "#ffffff"
}) => {
  const size = 100 / density * scale;
  const dotSize = size * 0.4 * elementSize;
  
  return (
    <pattern
      id="pattern2"
      patternUnits="userSpaceOnUse"
      width={size}
      height={size}
      patternTransform={`rotate(${rotation})`}
    >
      <rect width={size} height={size} fill={secondaryColor} />
      <circle 
        cx={size / 2} 
        cy={size / 2} 
        r={dotSize} 
        fill={primaryColor} 
      />
    </pattern>
  );
};

export default Pattern2SVG;