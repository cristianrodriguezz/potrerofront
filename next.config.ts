import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    // Puedes ponerlo en false para ocultarlo completamente
    // O cambiar la posición si te molesta en la esquina inferior izquierda
    position: 'top-right', // O 'top-left', 'top-right', false
  },
};

export default nextConfig;
