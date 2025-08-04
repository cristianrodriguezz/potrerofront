'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, PanInfo, animate } from 'motion/react'
import { Trash2, RotateCcw } from 'lucide-react'

interface DraggableElementProps {
  id: string
  children: React.ReactNode
  onDragEnd: (x: number, y: number) => void
  initialPosition: { x: number; y: number }
  constraintsRef?: React.RefObject<HTMLDivElement | null>
  isSelected: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

const DraggableElement: React.FC<DraggableElementProps> = ({
  id,
  children,
  onDragEnd,
  initialPosition,
  constraintsRef,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState(0)
  const rotating = useRef(false)
  const [isRotating, setIsRotating] = useState(false)

  const pointers = useRef<Map<number, PointerEvent>>(new Map())
  const baseDistance = useRef<number | null>(null)
  const currentScale = useRef(1)

  const MIN_SCALE = 0.8
  const MAX_SCALE = 2

const onRotateStart = (e: React.PointerEvent) => {
  e.stopPropagation()
  setIsRotating(true)
  rotating.current = true
  document.addEventListener('pointermove', onRotateMove)
  document.addEventListener('pointerup', onRotateEnd)
}

const onRotateMove = (e: PointerEvent) => {
  if (!divRef.current) return

  const rect = divRef.current.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
  const deg = (angle * 180) / Math.PI
  const newRotation = deg + 90 // Ajuste para que empiece bien la rotación

  setRotation(newRotation)
}

const onRotateEnd = () => {
  rotating.current = false
  setIsRotating(false)
  document.removeEventListener('pointermove', onRotateMove)
  document.removeEventListener('pointerup', onRotateEnd)
}


  // 🔍 ZOOM con dos dedos (igual que antes)
  useEffect(() => {
    const el = divRef.current
    if (!el) return

    const getDistance = () => {
      const [a, b] = Array.from(pointers.current.values())
      const dx = a.clientX - b.clientX
      const dy = a.clientY - b.clientY
      return Math.hypot(dx, dy)
    }

    const onPointerDown = (e: PointerEvent) => {
      onSelect(id)
      pointers.current.set(e.pointerId, e)
      if (pointers.current.size === 2) {
        baseDistance.current = getDistance()
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.current.has(e.pointerId)) return
      pointers.current.set(e.pointerId, e)

      if (pointers.current.size === 2 && baseDistance.current != null) {
        const newDistance = getDistance()
        const scaleRaw = (newDistance / baseDistance.current) * currentScale.current
        const scale = Math.min(Math.max(scaleRaw, MIN_SCALE), MAX_SCALE)
        animate(divRef.current!, { scale }, { duration: 0.1 })
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      pointers.current.delete(e.pointerId)
      if (pointers.current.size < 2) {
        const style = getComputedStyle(divRef.current!)
        const match = style.transform.match(/matrix\(([^)]+)\)/)
        if (match) {
          const values = match[1].split(', ')
          currentScale.current = parseFloat(values[0]) || 1
        }
        baseDistance.current = null
      }
    }

    const elListeners = divRef.current
    if (elListeners) {
      elListeners.addEventListener('pointerdown', onPointerDown)
      elListeners.addEventListener('pointermove', onPointerMove)
      elListeners.addEventListener('pointerup', onPointerUp)
      elListeners.addEventListener('pointercancel', onPointerUp)
    }

    return () => {
      if (elListeners) {
        elListeners.removeEventListener('pointerdown', onPointerDown)
        elListeners.removeEventListener('pointermove', onPointerMove)
        elListeners.removeEventListener('pointerup', onPointerUp)
        elListeners.removeEventListener('pointercancel', onPointerUp)
      }
    }
  }, [id, onSelect])

  return (
    <motion.div
      ref={divRef}
      drag={!isRotating} 
      dragConstraints={constraintsRef}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={() => onSelect(id)}
      onDragEnd={(event, info: PanInfo) => {
        onDragEnd(info.point.x, info.point.y)
      }}
      style={{
        top: '50%',
        left: '50%',
        translateX: '-50%',
        translateY: '-50%',
        x: initialPosition.x,
        y: initialPosition.y,
        rotate: rotation,
        touchAction: 'none',
        border: isSelected ? '2px solid red' : 'none',
        borderRadius: 8,
      }}
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      whileDrag={{ scale: 0.95 }}
      className="cursor-grab active:cursor-grabbing absolute z-10"
    >
      {/* 🗑️ Basurero (si está seleccionado) */}
      {isSelected && (
        <>
          <div
            onClick={(e) => {
              e.stopPropagation()
              onDelete(id)
            }}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </div>

          {/* 🔄 Ícono de rotación */}
          <div
            onPointerDown={onRotateStart}
            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 shadow cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-blue-500" />
          </div>
        </>
      )}

      {children}
    </motion.div>
  )
}

export default DraggableElement
