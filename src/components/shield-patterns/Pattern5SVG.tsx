import React from "react";

interface PatternProps {
  rotation?: number;
  scale?: number;
  density?: number;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  elementSize?: number;
}

const Pattern6SVG: React.FC<PatternProps> = ({
  rotation = 0,
  scale = 1,
  density = 4,
  elementSize = 1,
  primaryColor = "#3182CE",
  secondaryColor = "#63B3ED",
  tertiaryColor = "#EBF8FF"
}) => {
  // Tamaño base de la celda
  const baseSize = 200 / density;
  // Tamaño final escalado
  const size = baseSize * scale;
  // Factor de tamaño para los triángulos
  const triangleSize = size * 0.9 * elementSize;
  // Margen para centrar los triángulos
  const margin = (size - triangleSize) / 2;
  
  // Puntos para los triángulos
  const trianglePoints1 = `
    ${margin},${margin + triangleSize} 
    ${margin + triangleSize},${margin + triangleSize} 
    ${margin + triangleSize / 2},${margin}
  `;
  
  const trianglePoints2 = `
    ${margin},${margin} 
    ${margin + triangleSize / 2},${margin + triangleSize} 
    ${margin + triangleSize},${margin}
  `;

  return (
    <pattern
      id="pattern6"
      patternUnits="userSpaceOnUse"
      width={size}
      height={size}
      patternTransform={`rotate(${rotation} ${size / 2} ${size / 2})`}
    >
      <rect width={size} height={size} fill={tertiaryColor} />
      
      {/* Primer triángulo (superior) */}
      <polygon 
        points={trianglePoints1} 
        fill={primaryColor} 
        stroke={tertiaryColor}
        strokeWidth={size * 0.03}
      />
      
      {/* Segundo triángulo (inferior) */}
      <polygon 
        points={trianglePoints2} 
        fill={secondaryColor} 
        stroke={tertiaryColor}
        strokeWidth={size * 0.03}
      />
    </pattern>
  );
};

export default Pattern6SVG;