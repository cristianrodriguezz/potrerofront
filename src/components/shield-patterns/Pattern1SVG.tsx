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
  elementSize = 1,
  primaryColor = "#ff0000",
  secondaryColor = "#ffffff"
}) => {
  // Tamaño base de la celda del patrón
  const baseSize = 200 / density;
  // Tamaño final escalado
  const size = baseSize * scale;
  // Grosor calculado como porcentaje del tamaño base (no del escalado)
  const strokeWidth = baseSize * 1.1 * elementSize;
  
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
        strokeWidth={strokeWidth}
      />
    </pattern>
  );
};

export default Pattern1SVG;