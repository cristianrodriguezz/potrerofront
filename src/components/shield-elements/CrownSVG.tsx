import React from 'react';

const CrownSVG: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Contenido de la corona en formato SVG */}
    {/* Este ejemplo es ilustrativo, usa el código de tu SVG */}
    <path d="M50 10 L80 40 L60 40 L60 90 L40 90 L40 40 L20 40 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="5"/>
  </svg>
);

export default CrownSVG;