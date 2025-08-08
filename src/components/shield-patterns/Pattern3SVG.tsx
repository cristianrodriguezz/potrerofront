import React from "react";

interface PatternProps {
  rotation?: number;
  scale?: number;
  density?: number;
  primaryColor?: string;
  secondaryColor?: string;
  elementSize?: number;
}

const Pattern4SVG: React.FC<PatternProps> = ({
  rotation = 0,
  scale = 1,
  density = 5,
  elementSize = 1,
  primaryColor = "#38a169",
  secondaryColor = "#ffffff"
}) => {
  // Tamaño base de la celda (ajustado por densidad)
  const baseSize = 200 / density;
  // Tamaño final escalado
  const size = baseSize * scale;
  // Grosor de línea relativo al tamaño base
  const strokeWidth = baseSize * 0.1 * elementSize;

  // Construir el path de la cuadrícula
  const pathData = `
    M0,0 L${size},0
    M0,${size} L${size},${size}
    M0,0 L0,${size}
    M${size},0 L${size},${size}
  `;

  return (
    <pattern
      id="pattern3"
      patternUnits="userSpaceOnUse"
      width={size}
      height={size}
      patternTransform={`rotate(${rotation})`}
    >
      <rect width={size} height={size} fill={secondaryColor} />
      <path 
        d={pathData} 
        stroke={primaryColor} 
        strokeWidth={strokeWidth}
      />
    </pattern>
  );
};

export default Pattern4SVG;