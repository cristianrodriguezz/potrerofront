// components/patterns/Pattern1SVG.tsx
import React from "react";

const Pattern1SVG = () => (
  <pattern
    id="pattern1"
    patternUnits="userSpaceOnUse"
    width="10"
    height="10"
    patternTransform="rotate(40)"
  >
    <rect width="40" height="40" fill="transparent" />
    <line x1="0" y1="0" x2="0" y2="40" stroke="#ff0000" strokeWidth="8" />
  </pattern>
);

export default Pattern1SVG;