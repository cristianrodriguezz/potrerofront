import React from "react";

interface PatternProps {
  rotation?: number;
  scale?: number;
  density?: number;
  primaryColor?: string;
  secondaryColor?: string;
  elementSize?: number;
  diamondRatio?: number;
}

const Pattern4SVG: React.FC<PatternProps> = ({
  rotation = 0,
  scale = 1,
  density = 5,
  elementSize = 1,
  primaryColor = "#d53f8c",
  secondaryColor = "#ffffff",
  diamondRatio = 0.5 // Relación tamaño diamante/celda (0-1)
}) => {
  // Tamaño base de la celda
  const baseSize = 200 / density;
  // Tamaño final escalado
  const size = baseSize * scale;
  // Tamaño del diamante relativo al tamaño de la celda
  const diamondSize = size * diamondRatio * elementSize;
  
  // Calcular posición para centrar el diamante
  const diamondPosition = (size - diamondSize) / 2;

  return (
    <pattern
      id="pattern4"
      patternUnits="userSpaceOnUse"
      width={size}
      height={size}
      // Aplicamos la rotación base (45°) más la rotación personalizada
      patternTransform={`rotate(${45 + rotation} ${size / 2} ${size / 2})`}
    >
      <rect width={size} height={size} fill={secondaryColor} />
      <rect 
        x={diamondPosition} 
        y={diamondPosition} 
        width={diamondSize} 
        height={diamondSize} 
        fill={primaryColor} 
      />
    </pattern>
  );
};

export default Pattern4SVG;