import React from "react";

interface ShieldProps {
  className?: string;
  children?: React.ReactNode;
  patternId?: string;
}

const Shield1SVG: React.FC<ShieldProps> = ({ className, children, patternId }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {children}
      </defs>
      <path
        d="M50,5 L90,20 C90,60 65,85 50,95 C35,85 10,60 10,20 L50,5 Z"
        fill={patternId ? `url(#${patternId})` : "#CCCCCC"}
      />
    </svg>
  );
};

export default Shield1SVG;