import { useState, useEffect } from 'react';

/**
 * Un hook genérico para "retrasar" el valor de una variable.
 * Solo actualizará su valor de retorno después de que el valor de entrada
 * no haya cambiado durante el 'delay' especificado.
 * @param value El valor a "debouncear".
 * @param delay El tiempo de espera en milisegundos.
 * @returns El valor "debounceado".
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura un temporizador para actualizar el valor debounceado
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpia el temporizador si el valor cambia antes de que se cumpla el delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se vuelve a ejecutar si el valor o el delay cambian

  return debouncedValue;
}
