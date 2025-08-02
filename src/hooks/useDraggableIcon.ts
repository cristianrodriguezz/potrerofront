import { useRef, useCallback, useEffect } from 'react';
import { UseFormSetValue, UseFormGetValues, FieldValues, Path, PathValue } from 'react-hook-form';

interface UseDraggableProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;
  getValues: UseFormGetValues<T>;
  xFieldName: Path<T>;
  yFieldName: Path<T>;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
}

/**
 * Hook de alto rendimiento para arrastrar un elemento, actualizando
 * un formulario de React Hook Form solo al final del arrastre.
 * @returns Una ref para el elemento y los manejadores de eventos.
 */
export function useDraggableIcon<T extends FieldValues>({
  setValue,
  getValues,
  xFieldName,
  yFieldName,
  xMin = -Infinity,
  xMax = Infinity,
  yMin = -Infinity,
  yMax = Infinity,
}: UseDraggableProps<T>) {
  const elementRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragRef.current || !elementRef.current) return;
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;

    const newX = dragRef.current.initialX + dx;
    const newY = dragRef.current.initialY + dy;

    const clampedX = Math.max(xMin, Math.min(newX, xMax));
    const clampedY = Math.max(yMin, Math.min(newY, yMax));

    // Actualización visual directa (muy rápido, no causa re-renders)
    elementRef.current.style.transform = `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px))`;
  }, [xMin, xMax, yMin, yMax]);

  const handleDragEnd = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragRef.current || !elementRef.current) return;
    
    // Calculamos la posición final
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;
    const finalX = Math.max(xMin, Math.min(dragRef.current.initialX + dx, xMax));
    const finalY = Math.max(yMin, Math.min(dragRef.current.initialY + dy, yMax));

    // Actualizamos el estado de React Hook Form UNA SOLA VEZ
    setValue(xFieldName, finalX as PathValue<T, Path<T>>, { shouldValidate: true, shouldDirty: true });
    setValue(yFieldName, finalY as PathValue<T, Path<T>>, { shouldValidate: true, shouldDirty: true });

    dragRef.current = null;
    document.body.style.overflow = '';
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('touchmove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('touchend', handleDragEnd);
  }, [handleDragMove, setValue, xFieldName, yFieldName, xMin, xMax, yMin, yMax]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    document.body.style.overflow = 'hidden';
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: getValues(xFieldName) || 0,
      initialY: getValues(yFieldName) || 0,
    };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('touchmove', handleDragMove, { passive: false });
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);
  }, [handleDragMove, handleDragEnd, getValues, xFieldName, yFieldName]);

  // Sincroniza la posición inicial del elemento si los valores del formulario cambian
  useEffect(() => {
    if (elementRef.current && !dragRef.current) {
      const x = getValues(xFieldName) || 0;
      const y = getValues(yFieldName) || 0;
      elementRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }
  }, [getValues, xFieldName, yFieldName]);

  return {
    ref: elementRef,
    onMouseDown: handleDragStart,
    onTouchStart: handleDragStart,
  };
}
