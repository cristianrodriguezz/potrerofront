"use client";

import React, {
    useRef,
    useEffect,
    useState,
    MouseEvent,
    PointerEvent as ReactPointerEvent,
} from "react";
import {
    motion,
    useDragControls,
    useMotionValue,
    useTransform,
} from "framer-motion";
import { Trash2, RotateCcw, Move, Copy, FlipHorizontal } from "lucide-react";

interface DraggableElementProps {
    id: string;
    children: React.ReactNode;
    transform: {
        xPercent: number;
        yPercent: number;
        scaleRel: number;
        rotation: number;
        flipX?: number;
    };
    onTransformEnd: (
        id: string,
        transform: {
            xPercent: number;
            yPercent: number;
            scaleRel: number;
            rotation: number;
            zIndex: number;
            flipX: number;
        }
    ) => void;
    initialTransform: {
        xPercent: number;
        yPercent: number;
        scaleRel: number;
        rotation: number;
        flipX?: number;
    };
    containerWidth: number;
    containerHeight: number;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onFlipHorizontal?: (id: string) => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({
    id,
    children,
    transform,
    onTransformEnd,
    initialTransform,
    containerWidth,
    containerHeight,
    isSelected,
    onSelect,
    onDelete,
    onDuplicate,
    onFlipHorizontal,
}) => {
    const divRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isInteracting, setIsInteracting] = useState(false);
    const [isMeasured, setIsMeasured] = useState(false);
    const baseDimensions = useRef({ width: 0, height: 0 });
    const rotationStartRef = useRef({ angle: 0, rotation: 0 });

    const dragControls = useDragControls();

    // Convertir porcentajes a píxeles para la animación
    const x = useMotionValue(
        (initialTransform.xPercent * containerWidth) / 100
    );
    const y = useMotionValue(
        (initialTransform.yPercent * containerHeight) / 100
    );

    // Escala relativa al contenedor
    const scaleRel = useMotionValue(initialTransform.scaleRel);

    // Calcular escala absoluta en píxeles basada en el tamaño del contenedor
    const scalePixels = useTransform(
        scaleRel,
        (latestScaleRel) =>
            (latestScaleRel * Math.min(containerWidth, containerHeight)) / 100
    );

    const rotate = useMotionValue(initialTransform.rotation);
    
    // Usar ref y estado para flipX con sincronización
    const flipRef = useRef(initialTransform.flipX ?? 1);
    const [flipState, setFlipState] = useState(initialTransform.flipX ?? 1);

    // Sincronizar con cambios externos (desde el padre)
    useEffect(() => {
        flipRef.current = transform.flipX ?? 1;
        setFlipState(transform.flipX ?? 1);
    }, [transform.flipX]);

    const dynamicWidth = useTransform(
        scalePixels,
        (latestScalePixels) =>
            (baseDimensions.current.width || 0) * latestScalePixels
    );

    const dynamicHeight = useTransform(
        scalePixels,
        (latestScalePixels) =>
            (baseDimensions.current.height || 0) * latestScalePixels
    );

    useEffect(() => {
        if (contentRef.current) {
            baseDimensions.current = {
                width: contentRef.current.offsetWidth,
                height: contentRef.current.offsetHeight,
            };
            setIsMeasured(true);
        }
    }, []);

    // Actualizar posiciones y escalas cuando cambia el tamaño del contenedor
    useEffect(() => {
        if (!isInteracting) {
            x.set((initialTransform.xPercent * containerWidth) / 100);
            y.set((initialTransform.yPercent * containerHeight) / 100);
            scaleRel.set(initialTransform.scaleRel);
        }
    }, [
        containerWidth,
        containerHeight,
        initialTransform,
        isInteracting,
        x,
        y,
        scaleRel,
    ]);

    const interactionStart = useRef({
        pointer: { x: 0, y: 0 },
        element: {
            width: 0,
            height: 0,
            scale: 1,
            rotation: 0,
            position: { x: 0, y: 0 },
        },
        anchorPosition: { x: 0, y: 0 },
        anchorCorner: "",
    });

    const onRotateMove = (e: PointerEvent) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const currentAngle = Math.atan2(
            e.clientY - centerY,
            e.clientX - centerX
        );
        const deltaAngle = currentAngle - rotationStartRef.current.angle;
        const newRotation =
            rotationStartRef.current.rotation + (deltaAngle * 180) / Math.PI;
        rotate.set(newRotation);
    };

    const onScaleMove = (e: PointerEvent) => {
        if (!divRef.current || !divRef.current.dataset.scalingCorner) return;
        const { pointer: startPointer, element: startElement } =
            interactionStart.current;
        const corner = divRef.current.dataset.scalingCorner;
        const delta = {
            x: e.clientX - startPointer.x,
            y: e.clientY - startPointer.y,
        };
        const rad = (startElement.rotation * Math.PI) / 180;
        const sin = Math.sin(-rad);
        const cos = Math.cos(-rad);
        const rotatedDelta = {
            x: delta.x * cos - delta.y * sin,
            y: delta.x * sin + delta.y * cos,
        };
        const factorX = corner.includes("l") ? -1 : 1;
        const factorY = corner.includes("t") ? -1 : 1;
        const deltaWidth = rotatedDelta.x * factorX;
        const deltaHeight = rotatedDelta.y * factorY;
        const deltaAverage = (deltaWidth + deltaHeight) / 2;
        const newWidth = startElement.width + deltaAverage;
        const newTotalScale = newWidth / baseDimensions.current.width;

        // Escala relativa al contenedor
        const containerScaleFactor =
            Math.min(containerWidth, containerHeight) / 100;
        let newScaleRel = newTotalScale / containerScaleFactor;

        // RESTRICCIONES DE ESCALA
        const MIN_SCALE_REL = 0.2;
        const MAX_SCALE_REL = 2;

        // Aplicar restricciones
        newScaleRel = Math.max(
            MIN_SCALE_REL,
            Math.min(newScaleRel, MAX_SCALE_REL)
        );

        // Calcular nuevo tamaño en píxeles
        const newScalePixels = newScaleRel * containerScaleFactor;
        const newContentWidth = baseDimensions.current.width * newScalePixels;
        const newContentHeight = baseDimensions.current.height * newScalePixels;

        // Calcular nueva posición basada en el ancla
        const { anchorPosition, anchorCorner } = interactionStart.current;
        let newX = x.get();
        let newY = y.get();

        // Mantener el vértice opuesto fijo
        if (anchorCorner === "br") {
            newX = anchorPosition.x - newContentWidth;
            newY = anchorPosition.y - newContentHeight;
        } else if (anchorCorner === "tr") {
            newX = anchorPosition.x - newContentWidth;
            newY = anchorPosition.y;
        } else if (anchorCorner === "bl") {
            newX = anchorPosition.x;
            newY = anchorPosition.y - newContentHeight;
        } else if (anchorCorner === "tl") {
            // No necesita ajuste
        }

        // Aplicar cambios
        x.set(newX);
        y.set(newY);
        scaleRel.set(newScaleRel);
    };

    const handleInteractionEnd = () => {
        setIsInteracting(false);

        // Convertir píxeles a porcentajes antes de guardar
        const xPercent = (x.get() / containerWidth) * 100;
        const yPercent = (y.get() / containerHeight) * 100;

        onTransformEnd(id, {
            xPercent,
            yPercent,
            scaleRel: scaleRel.get(),
            rotation: rotate.get(),
            zIndex: 1,
            flipX: flipRef.current,
        });

        document.removeEventListener("pointermove", onRotateMove);
        document.removeEventListener("pointerup", onRotateEnd);
        document.removeEventListener("pointermove", onScaleMove);
        document.removeEventListener("pointerup", onScaleEnd);
    };

    const onRotateStart = (e: ReactPointerEvent) => {
        e.stopPropagation();
        setIsInteracting(true);
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        rotationStartRef.current = {
            angle: startAngle,
            rotation: rotate.get(),
        };
        document.addEventListener("pointermove", onRotateMove);
        document.addEventListener("pointerup", onRotateEnd);
    };

    const onRotateEnd = () => handleInteractionEnd();

    const onScaleStart = (e: ReactPointerEvent, corner: string) => {
        e.stopPropagation();
        setIsInteracting(true);
        if (!divRef.current) return;
        divRef.current.dataset.scalingCorner = corner;
        const currentScaleRel = scaleRel.get();
        const containerScaleFactor =
            Math.min(containerWidth, containerHeight) / 100;
        const currentScalePixels = currentScaleRel * containerScaleFactor;

        // Determinar vértice opuesto (ancla)
        const anchorCornerMap = {
            tl: "br",
            tr: "bl",
            bl: "tr",
            br: "tl",
        };
        const anchorCorner = anchorCornerMap[corner as keyof typeof anchorCornerMap];

        // Calcular posición actual del ancla
        const currentX = x.get();
        const currentY = y.get();
        const currentWidth = baseDimensions.current.width * currentScalePixels;
        const currentHeight = baseDimensions.current.height * currentScalePixels;

        let anchorX = currentX;
        let anchorY = currentY;

        if (anchorCorner === "br") {
            anchorX = currentX + currentWidth;
            anchorY = currentY + currentHeight;
        } else if (anchorCorner === "tr") {
            anchorX = currentX + currentWidth;
            anchorY = currentY;
        } else if (anchorCorner === "bl") {
            anchorX = currentX;
            anchorY = currentY + currentHeight;
        } else if (anchorCorner === "tl") {
            // Ya está en la posición inicial
        }

        interactionStart.current = {
            pointer: { x: e.clientX, y: e.clientY },
            element: {
                width: currentWidth,
                height: currentHeight,
                scale: currentScalePixels,
                rotation: rotate.get(),
                position: { x: currentX, y: currentY },
            },
            anchorPosition: { x: anchorX, y: anchorY },
            anchorCorner,
        };
        document.addEventListener("pointermove", onScaleMove);
        document.addEventListener("pointerup", onScaleEnd);
    };

    const onScaleEnd = () => handleInteractionEnd();

    const handleFlipHorizontal = (e: MouseEvent) => {
        e.stopPropagation();
        const newFlipX = flipRef.current * -1;
        flipRef.current = newFlipX;
        setFlipState(newFlipX);
        
        if (onFlipHorizontal) {
            onFlipHorizontal(id);
        }
    };

    useEffect(() => {
        const handlePointerDown = (e: any) => {
            const isInsideDraggable = e.target.closest(".draggable-element");
            const isInsideExtra = e.target.closest(".extra-clickable");

            if (!isInsideDraggable && !isInsideExtra) {
                onSelect("");
            }
        };
        document.addEventListener("pointerdown", handlePointerDown);
        return () =>
            document.removeEventListener("pointerdown", handlePointerDown);
    }, [onSelect]);

    const renderScaleHandles = () => (
        <>
            {["tl", "tr", "bl", "br"].map((corner) => {
                const cursor =
                    corner === "tl" || corner === "br"
                        ? "cursor-nwse-resize"
                        : "cursor-nesw-resize";
                const positionClasses = {
                    tl: "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
                    tr: "top-0 right-0 translate-x-1/2 -translate-y-1/2",
                    bl: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
                    br: "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
                }[corner];
                return (
                    <div
                        key={corner}
                        onPointerDown={(e) => onScaleStart(e, corner)}
                        className={`absolute w-4 h-4 bg-blue-500 rounded-full z-20 transform ${positionClasses} ${cursor}`}
                    />
                );
            })}
        </>
    );

    return (
        <motion.div
            ref={divRef}
            drag={!isInteracting}
            dragControls={dragControls}
            dragElastic={0}
            dragMomentum={false}
            onPointerDown={() => onSelect(id)}
            onDragEnd={handleInteractionEnd}
            style={{
                x,
                y,
                rotate,
                width: isMeasured ? dynamicWidth : "auto",
                height: isMeasured ? dynamicHeight : "auto",
                top: 0,
                left: 0,
                border: isSelected
                    ? "2px dashed #3b82f6"
                    : "2px solid transparent",
                zIndex: isSelected ? 20 : 10,
            }}
            className="draggable-element cursor-grab active:cursor-grabbing absolute flex items-center justify-center"
        >
            {isSelected && (
                <div className="absolute top-full mt-5 left-1/2 transform -translate-x-1/2 flex gap-2 ">
                    <div
                        onPointerDown={onRotateStart}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-100 cursor-pointer bg-white/90 backdrop-blur-sm p-1 shadow-lg z-30"
                        title="Rotar"
                    >
                        <RotateCcw className="w-4 h-4 text-blue-500" />
                    </div>
                    <div
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            dragControls.start(e);
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-grab active:cursor-grabbing bg-white/90 backdrop-blur-sm p-1 shadow-lg z-30"
                        title="Mover"
                    >
                        <Move className="w-4 h-4 text-gray-700" />
                    </div>
                </div>
            )}

            <motion.div
                ref={contentRef}
                style={{
                    scale: scalePixels,
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                }}
                animate={{ scaleX: flipState }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </motion.div>
            {isSelected && renderScaleHandles()}
        </motion.div>
    );
};

export default DraggableElement;