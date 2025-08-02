import React from 'react';

interface ShapeProps {
  backgroundColor: string;
  patternColor: string;
  patternType: string;
}
export const shapeLabel = "Escudito";

export const EscudoBorrar = ({ backgroundColor, patternColor, patternType }: ShapeProps) => {

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect x="0" y="0" width="100" height="100" fill={backgroundColor} />
      <circle cx="50" cy="50" r="30" fill={patternColor} opacity={patternType === 'none' ? 0 : 0.5} />
    </svg>
  );
};
