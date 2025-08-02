import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera el estilo de fondo CSS para el escudo, incluyendo patrones.
 * @param bgColor - El color de fondo principal.
 * @param patternType - El tipo de patrón ('stripes', 'sash', 'half', 'gradient', 'checkered', 'none').
 * @param patternColor - El color del patrón.
 * @returns Una cadena de texto para la propiedad 'background' de CSS.
 */
export const generateCrestBackground = (
  bgColor: string,
  patternType: string,
  patternColor: string
): string => {
  switch (patternType) {
    case 'stripes':
      return `repeating-linear-gradient(90deg, ${bgColor}, ${bgColor} 20px, ${patternColor} 20px, ${patternColor} 40px)`;
    case 'sash':
      return `linear-gradient(135deg, ${patternColor} 0%, ${patternColor} 45%, ${bgColor} 45%, ${bgColor} 55%, ${patternColor} 55%, ${patternColor} 100%)`;
    case 'half':
      return `linear-gradient(90deg, ${bgColor} 50%, ${patternColor} 50%)`;
    case 'gradient':
      return `linear-gradient(180deg, ${bgColor} 0%, ${patternColor} 100%)`;
    case 'checkered':
      return `repeating-conic-gradient(${bgColor} 0% 25%, ${patternColor} 0% 50%) top left / 30px 30px`;
    case 'none':
    default:
      return bgColor;
  }
};

/**
 * Devuelve el valor de la propiedad 'clip-path' de CSS para dar forma al escudo.
 * @param shape - La forma deseada.
 * @returns Una cadena de texto para la propiedad 'clip-path' de CSS.
 */
export const getClipPath = (shape: string): string => {
  switch (shape) {
    case 'shield':
      return 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)';
    case 'hexagon':
      return 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
    case 'diamond':
      return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    case 'pentagon':
      return 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
    case 'star':
      return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
    default:
      return 'none';
  }
};

/**
 * Devuelve el valor de la propiedad 'border-radius' de CSS para la forma del escudo.
 * @param shape - La forma deseada.
 * @returns Una cadena de texto para la propiedad 'border-radius' de CSS.
 */
export const getBorderRadius = (shape: string): string => {
  if (shape === 'circle') {
    return '50%';
  }
  // Aplicamos un radio consistente a todas las demás formas para suavizar las esquinas.
  return '12px';
};
