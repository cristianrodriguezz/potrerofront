// Pattern3SVG.tsx (Cuadrícula)
import React from "react";

const Pattern3SVG = () => (
  <pattern
    id="pattern3"
    patternUnits="userSpaceOnUse"
    width="20"
    height="20"
  >
    <rect width="20" height="20" fill="#ffffff" />
    <path d="M0,0 L20,0 M0,20 L20,20 M0,0 L0,20 M20,0 L20,20" 
          stroke="#38a169" strokeWidth="2" />
  </pattern>
);

export default Pattern3SVG;