import React from "react";

interface PatternProps {
  rotation?: number;
  scale?: number;
  density?: number;
  primaryColor?: string;
  secondaryColor?: string;
  elementSize?: number; 
}

const Pattern1SVG: React.FC<PatternProps> = ({
  rotation = 0,
  scale = 1,
  density = 5,
  elementSize = 1,  // Nuevo parámetro
  primaryColor = "#ff0000",
  secondaryColor = "#ffffff"
}) => {
  const size = 100 / density * scale;
  const strokeWidth = size * 0.2 * elementSize;  // Usamos elementSize para el grosor
  
  return (
    <pattern
      id="pattern1"
      patternUnits="userSpaceOnUse"
      width={size}
      height={size}
      patternTransform={`rotate(${rotation})`}
    >
      <rect width={size} height={size} fill={secondaryColor} />
      <line 
        x1="0" 
        y1="0" 
        x2="0" 
        y2={size} 
        stroke={primaryColor} 
        strokeWidth={strokeWidth}  // Aplicado aquí
      />
    </pattern>
  );
};

export default Pattern1SVG;