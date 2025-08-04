'use client'

import { useRef, useState } from 'react'
import DraggableElement from './DraggableElement'


export default function Canvas() {
  const constraintsRef = useRef<HTMLDivElement>(null)

  const [elements, setElements] = useState(() => [
    { id: 123123123, x: 0, y: 0 },
    { id: 12312343123, x: 100, y: 100 },
  ])

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const updatePosition = (id: string, x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    )
  }

  return (
    <div ref={constraintsRef} className="relative w-full h-screen bg-gray-100 overflow-hidden">
      {elements.map((el) => (
        <DraggableElement
          key={el.id}
          id={el.id}
          initialPosition={{ x: el.x, y: el.y }}
          constraintsRef={constraintsRef}
          onDragEnd={(x, y) => updatePosition(el.id, x, y)}
          isSelected={selectedId === el.id}
          onSelect={(id) => setSelectedId(id)}
          onDelete={handleDelete}
        >
          <div className="w-32 h-32 bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold">
            Elemento
          </div>
        </DraggableElement>
      ))}
    </div>
  )
}
