"use client"

import React from "react"
import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Palette,
  Shield,
  Layers,
  Sparkles,
  RotateCw,
  Move,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  Download,
  Upload,
  Save,
} from "lucide-react"

interface ShieldElement {
  id: string
  type: string
  category: string
  x: number
  y: number
  scale: number
  rotation: number
  opacity: number
  color: string
  visible: boolean
  zIndex: number
}

interface Colors {
  primary: string
  secondary: string
  accent: string
}

interface DragState {
  isDragging: boolean
  elementId: string | null
  offset: { x: number; y: number }
  currentPos: { x: number; y: number }
}

const SHIELD_SHAPES = [
  {
    id: "classic",
    name: "Clásico",
    svg: <path d="M12 2C8 2 4 4 4 8v6c0 4 4 8 8 8s8-4 8-8V8c0-4-4-6-8-6z" fill="currentColor" />,
  },
  { id: "modern", name: "Moderno", svg: <path d="M12 2l8 3v6c0 4-4 8-8 8s-8-4-8-8V5l8-3z" fill="currentColor" /> },
  {
    id: "medieval",
    name: "Medieval",
    svg: <path d="M12 2c-2 0-8 1-8 6v8l8 6 8-6v-8c0-5-6-6-8-6z" fill="currentColor" />,
  },
  { id: "round", name: "Redondo", svg: <circle cx="12" cy="12" r="9" fill="currentColor" /> },
  { id: "hexagon", name: "Hexágono", svg: <path d="M12 3l6 3.5v7L12 17l-6-3.5v-7L12 3z" fill="currentColor" /> },
  { id: "diamond", name: "Diamante", svg: <path d="M12 2l8 8-8 10-8-10 8-8z" fill="currentColor" /> },
  {
    id: "heart",
    name: "Corazón",
    svg: <path d="M12 6c0-2 1.5-4 4-4s4 2 4 4c0 2-4 6-8 12-4-6-8-10-8-12 0-2 1.5-4 4-4s4 2 4 4z" fill="currentColor" />,
  },
  {
    id: "star",
    name: "Estrella",
    svg: <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6L12 2z" fill="currentColor" />,
  },
]

const SHIELD_PATTERNS = [
  { id: "solid", name: "Sólido", type: "solid" as const },
  { id: "gradient", name: "Degradado", type: "gradient" as const },
  { id: "stripes", name: "Rayas", type: "pattern" as const },
  { id: "dots", name: "Puntos", type: "pattern" as const },
  { id: "diagonal", name: "Diagonal", type: "pattern" as const },
  { id: "cross", name: "Cruz", type: "pattern" as const },
]

const ELEMENT_CATEGORIES = {
  royalty: {
    name: "Realeza",
    icon: (
      <path d="M5 16L8 6h2l1 6h2l1-6h2l3 10H5zm7-12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" fill="currentColor" />
    ),
    elements: [
      {
        id: "crown",
        name: "Corona",
        svg: (
          <g>
            <path d="M5 16L8 6h2l1 6h2l1-6h2l3 10H5z" fill="currentColor" />
            <circle cx="9" cy="6" r="1.5" fill="#fbbf24" />
            <circle cx="12" cy="6" r="1.5" fill="#fbbf24" />
            <circle cx="15" cy="6" r="1.5" fill="#fbbf24" />
          </g>
        ),
      },
      {
        id: "crown2",
        name: "Corona Real",
        svg: (
          <g>
            <path d="M6 16l2-8h1l1 4h4l1-4h1l2 8H6z" fill="currentColor" />
            <circle cx="8" cy="8" r="1" fill="#7c3aed" />
            <circle cx="12" cy="6" r="2" fill="#dc2626" />
            <circle cx="16" cy="8" r="1" fill="#7c3aed" />
          </g>
        ),
      },
      {
        id: "scepter",
        name: "Cetro",
        svg: (
          <g>
            <rect x="11" y="8" width="2" height="12" fill="#8b4513" />
            <circle cx="12" cy="6" r="3" fill="currentColor" />
            <circle cx="12" cy="6" r="1.5" fill="#fbbf24" />
            <rect x="10" y="20" width="4" height="2" fill="#8b4513" />
          </g>
        ),
      },
      {
        id: "throne",
        name: "Trono",
        svg: (
          <g>
            <rect x="6" y="8" width="12" height="10" fill="currentColor" />
            <rect x="5" y="6" width="2" height="8" fill="currentColor" />
            <rect x="17" y="6" width="2" height="8" fill="currentColor" />
            <rect x="8" y="10" width="8" height="6" fill="#8b4513" />
          </g>
        ),
      },
      {
        id: "jewel",
        name: "Joya",
        svg: (
          <g>
            <path d="M12 4l4 4-2 8h-4l-2-8 4-4z" fill="currentColor" />
            <path d="M12 4l2 4-2 4-2-4 2-4z" fill="#fbbf24" />
            <circle cx="12" cy="8" r="1" fill="#dc2626" />
          </g>
        ),
      },
    ],
  },
  weapons: {
    name: "Armas",
    icon: (
      <path
        d="M6.2 2.44L18.1 14.34l-1.41 1.41L4.79 3.85l1.41-1.41zM17.5 10c1.38 0 2.5-1.12 2.5-2.5 0-1.38-1.12-2.5-2.5-2.5S15 6.12 15 7.5c0 1.38 1.12 2.5 2.5 2.5z"
        fill="currentColor"
      />
    ),
    elements: [
      {
        id: "sword",
        name: "Espada",
        svg: (
          <g>
            <rect x="11" y="2" width="2" height="14" fill="currentColor" />
            <rect x="8" y="1" width="8" height="3" fill="#8b5cf6" />
            <rect x="9" y="16" width="6" height="2" fill="#8b5cf6" />
            <rect x="10" y="18" width="4" height="1" fill="#8b5cf6" />
          </g>
        ),
      },
      {
        id: "axe",
        name: "Hacha",
        svg: (
          <g>
            <rect x="11" y="8" width="2" height="12" fill="#8b4513" />
            <path d="M6 6h12l-2 4H8l-2-4z" fill="currentColor" />
            <path d="M6 6l6-2 6 2-2 2H8l-2-2z" fill="#e5e7eb" />
          </g>
        ),
      },
      {
        id: "bow",
        name: "Arco",
        svg: (
          <g>
            <path d="M4 4Q12 2 20 4Q12 12 4 4" fill="currentColor" />
            <line x1="4" y1="4" x2="20" y2="4" stroke="#8b4513" strokeWidth="1" />
            <path d="M8 6l4-2 4 2" fill="none" stroke="#8b4513" strokeWidth="2" />
          </g>
        ),
      },
      {
        id: "spear",
        name: "Lanza",
        svg: (
          <g>
            <rect x="11" y="8" width="2" height="12" fill="#8b4513" />
            <path d="M12 2l3 4-3 2-3-2 3-4z" fill="currentColor" />
            <path d="M12 2l1 2-1 2-1-2 1-2z" fill="#e5e7eb" />
          </g>
        ),
      },
      {
        id: "shield",
        name: "Escudo",
        svg: (
          <g>
            <path d="M12 2c-4 0-6 2-6 6v8c0 2 2 4 6 4s6-2 6-4V8c0-4-2-6-6-6z" fill="currentColor" />
            <path d="M12 4l3 4-3 6-3-6 3-4z" fill="#e5e7eb" />
          </g>
        ),
      },
      {
        id: "dagger",
        name: "Daga",
        svg: (
          <g>
            <rect x="11" y="4" width="2" height="12" fill="currentColor" />
            <rect x="9" y="3" width="6" height="2" fill="#8b5cf6" />
            <rect x="10" y="16" width="4" height="1.5" fill="#8b5cf6" />
          </g>
        ),
      },
    ],
  },
  animals: {
    name: "Animales",
    icon: (
      <path
        d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-2.39 2.5-4.82 2.5s-4.23-1.28-4.82-2.5C12.83 8.13 16.21 6 20 6c-1.68 0-3.17.83-4 2.15C15.17 6.83 13.68 6 12 6z"
        fill="currentColor"
      />
    ),
    elements: [
      {
        id: "lion",
        name: "León",
        svg: (
          <g>
            <ellipse cx="12" cy="12" rx="6" ry="7" fill="currentColor" />
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <circle cx="10" cy="7" r="1" fill="#000" />
            <circle cx="14" cy="7" r="1" fill="#000" />
            <path d="M8 7Q6 5 5 7" fill="currentColor" />
            <path d="M16 7Q18 5 19 7" fill="currentColor" />
            <path d="M12 9l-1 2h2l-1-2z" fill="#000" />
          </g>
        ),
      },
      {
        id: "eagle",
        name: "Águila",
        svg: (
          <g>
            <ellipse cx="12" cy="11" rx="7" ry="5" fill="currentColor" />
            <ellipse cx="12" cy="8" rx="3" ry="4" fill="currentColor" />
            <path d="M5 11Q2 8 1 11Q2 14 5 11" fill="currentColor" />
            <path d="M19 11Q22 8 23 11Q22 14 19 11" fill="currentColor" />
            <circle cx="11" cy="7" r="1" fill="#000" />
            <circle cx="13" cy="7" r="1" fill="#000" />
            <path d="M12 8.5l-1 1.5h2l-1-1.5z" fill="#fbbf24" />
          </g>
        ),
      },
      {
        id: "wolf",
        name: "Lobo",
        svg: (
          <g>
            <ellipse cx="12" cy="12" rx="5" ry="6" fill="currentColor" />
            <ellipse cx="12" cy="8" rx="3.5" ry="4" fill="currentColor" />
            <path d="M9 5l1-2h-1l-1 2z" fill="currentColor" />
            <path d="M15 5l-1-2h1l1 2z" fill="currentColor" />
            <circle cx="11" cy="7" r="0.8" fill="#000" />
            <circle cx="13" cy="7" r="0.8" fill="#000" />
            <path d="M12 8l-0.5 1h1l-0.5-1z" fill="#000" />
          </g>
        ),
      },
      {
        id: "dragon",
        name: "Dragón",
        svg: (
          <g>
            <ellipse cx="12" cy="12" rx="7" ry="6" fill="currentColor" />
            <ellipse cx="12" cy="8" rx="4" ry="5" fill="currentColor" />
            <path d="M5 12Q2 10 1 12Q2 15 5 12" fill="currentColor" />
            <path d="M19 12Q22 10 23 12Q22 15 19 12" fill="currentColor" />
            <circle cx="11" cy="7" r="1" fill="#dc2626" />
            <circle cx="13" cy="7" r="1" fill="#dc2626" />
            <path d="M12 9l-2 2h4l-2-2z" fill="#000" />
            <path d="M9 3l1-1h-2l1 3z" fill="currentColor" />
            <path d="M15 3l-1-1h2l-1 3z" fill="currentColor" />
          </g>
        ),
      },
      {
        id: "horse",
        name: "Caballo",
        svg: (
          <g>
            <ellipse cx="12" cy="14" rx="4" ry="7" fill="currentColor" />
            <ellipse cx="12" cy="8" rx="3" ry="5" fill="currentColor" />
            <path d="M9 5l1-2h-1l-1 3z" fill="currentColor" />
            <path d="M15 5l-1-2h1l1 3z" fill="currentColor" />
            <circle cx="11" cy="7" r="0.8" fill="#000" />
            <circle cx="13" cy="7" r="0.8" fill="#000" />
            <ellipse cx="12" cy="9" rx="1" ry="1.5" fill="#000" />
            <path d="M8 3Q10 1 12 3Q14 1 16 3" fill="#8b4513" />
          </g>
        ),
      },
      {
        id: "bear",
        name: "Oso",
        svg: (
          <g>
            <ellipse cx="12" cy="13" rx="6" ry="7" fill="currentColor" />
            <circle cx="12" cy="8" r="4.5" fill="currentColor" />
            <circle cx="8" cy="6" r="1.5" fill="currentColor" />
            <circle cx="16" cy="6" r="1.5" fill="currentColor" />
            <circle cx="11" cy="7.5" r="1" fill="#000" />
            <circle cx="13" cy="7.5" r="1" fill="#000" />
            <ellipse cx="12" cy="9" rx="1.5" ry="1" fill="#000" />
          </g>
        ),
      },
      {
        id: "snake",
        name: "Serpiente",
        svg: (
          <g>
            <path
              d="M4 16Q6 12 8 14Q10 16 12 12Q14 8 16 10Q17 6 15 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="15" cy="4" r="2" fill="currentColor" />
            <circle cx="14" cy="3" r="0.5" fill="#dc2626" />
            <circle cx="16" cy="3" r="0.5" fill="#dc2626" />
            <path d="M15 5l-1 1h2l-1-1z" fill="#000" />
          </g>
        ),
      },
      {
        id: "owl",
        name: "Búho",
        svg: (
          <g>
            <ellipse cx="12" cy="12" rx="5" ry="7" fill="currentColor" />
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <circle cx="10" cy="7" r="1.5" fill="#fbbf24" />
            <circle cx="14" cy="7" r="1.5" fill="#fbbf24" />
            <circle cx="10" cy="7" r="0.8" fill="#000" />
            <circle cx="14" cy="7" r="0.8" fill="#000" />
            <path d="M12 8.5l-1 1h2l-1-1z" fill="#fbbf24" />
            <path d="M8 5l1-2h-2l1 3z" fill="currentColor" />
            <path d="M16 5l-1-2h2l-1 3z" fill="currentColor" />
          </g>
        ),
      },
    ],
  },
  symbols: {
    name: "Símbolos",
    icon: <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6L12 2z" fill="currentColor" />,
    elements: [
      {
        id: "star",
        name: "Estrella",
        svg: (
          <g>
            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6L12 2z" fill="currentColor" />
            <path d="M12 2l1.2 3.6h3.8l-3 2.4 1.2 3.6-3-2.4-3 2.4 1.2-3.6-3-2.4h3.8L12 2z" fill="#fbbf24" />
          </g>
        ),
      },
      {
        id: "cross",
        name: "Cruz",
        svg: (
          <g>
            <rect x="10" y="2" width="4" height="20" fill="currentColor" />
            <rect x="4" y="8" width="16" height="4" fill="currentColor" />
            <rect x="11" y="3" width="2" height="18" fill="#e5e7eb" />
            <rect x="5" y="9" width="14" height="2" fill="#e5e7eb" />
          </g>
        ),
      },
      {
        id: "moon",
        name: "Luna",
        svg: (
          <g>
            <path d="M8 4Q6 8 6 12Q6 16 8 20Q12 16 14 12Q12 8 8 4" fill="currentColor" />
            <path d="M9 7Q8 10 8 12Q8 14 9 17Q12 14 13 12Q12 10 9 7" fill="#fbbf24" />
            <circle cx="10" cy="9" r="0.5" fill="#e5e7eb" />
            <circle cx="11" cy="12" r="0.8" fill="#e5e7eb" />
            <circle cx="9.5" cy="15" r="0.5" fill="#e5e7eb" />
          </g>
        ),
      },
      {
        id: "sun",
        name: "Sol",
        svg: (
          <g>
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <circle cx="12" cy="12" r="2.5" fill="#fbbf24" />
            <path d="M12 2l1 3h-2l1-3z" fill="currentColor" />
            <path d="M12 22l1-3h-2l1 3z" fill="currentColor" />
            <path d="M2 12l3 1v-2l-3 1z" fill="currentColor" />
            <path d="M22 12l-3 1v-2l3 1z" fill="currentColor" />
            <path d="M5 5l2 2-1 1-2-2 1-1z" fill="currentColor" />
            <path d="M19 19l-2-2 1-1 2 2-1 1z" fill="currentColor" />
            <path d="M19 5l-2 2 1 1 2-2-1-1z" fill="currentColor" />
            <path d="M5 19l2-2-1-1-2 2 1 1z" fill="currentColor" />
          </g>
        ),
      },
      {
        id: "lightning",
        name: "Rayo",
        svg: (
          <g>
            <path d="M8 2l6 8h-3l4 12-6-8h3L8 2z" fill="currentColor" />
            <path d="M9 3l4 6h-2l3 9-4-6h2L9 3z" fill="#fbbf24" />
          </g>
        ),
      },
      {
        id: "flame",
        name: "Llama",
        svg: (
          <g>
            <path
              d="M12 22Q10 20 9 16Q8 12 10 9Q9 6 11 4Q10 2 12 2Q14 2 13 4Q15 6 14 9Q16 12 15 16Q14 20 12 22"
              fill="currentColor"
            />
            <path
              d="M12 20Q11 18 10.5 15Q10 12 11.5 10Q11 8 12 6Q13 8 12.5 10Q14 12 13.5 15Q13 18 12 20"
              fill="#fbbf24"
            />
            <path d="M12 18Q11.5 16 11.5 14Q11.5 12.5 12 11Q12.5 12.5 12.5 14Q12.5 16 12 18" fill="#dc2626" />
          </g>
        ),
      },
      {
        id: "heart",
        name: "Corazón",
        svg: (
          <g>
            <path
              d="M12 8c0-2 1.5-4 4-4s4 2 4 4c0 2-4 6-8 12-4-6-8-10-8-12 0-2 1.5-4 4-4s4 2 4 4z"
              fill="currentColor"
            />
            <path
              d="M12 9c0-1.5 1-3 3-3s3 1.5 3 3c0 1.5-3 4.5-6 9-3-4.5-6-7.5-6-9 0-1.5 1-3 3-3s3 1.5 3 3z"
              fill="#fbbf24"
            />
          </g>
        ),
      },
      {
        id: "diamond",
        name: "Diamante",
        svg: (
          <g>
            <path d="M12 2l8 8-8 12-8-8 8-8z" fill="currentColor" />
            <path d="M12 2l6 7-6 11-6-11 6-7z" fill="#fbbf24" />
            <path d="M12 2l3 6-3 8-3-8 3-6z" fill="#e5e7eb" />
            <circle cx="12" cy="8" r="1" fill="#dc2626" />
          </g>
        ),
      },
    ],
  },
  nature: {
    name: "Naturaleza",
    icon: (
      <path
        d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.67-2h11.24l.67 2 1.89-.66C18.1 16.17 16 10 7 8l5-6 5 6z"
        fill="currentColor"
      />
    ),
    elements: [
      {
        id: "tree",
        name: "Árbol",
        svg: (
          <g>
            <rect x="11" y="16" width="2" height="6" fill="#8b4513" />
            <circle cx="12" cy="14" r="4" fill="currentColor" />
            <circle cx="9" cy="11" r="3" fill="currentColor" />
            <circle cx="15" cy="11" r="3" fill="currentColor" />
            <circle cx="12" cy="9" r="3.5" fill="currentColor" />
            <circle cx="10" cy="15" r="1" fill="#dc2626" />
            <circle cx="14" cy="13" r="1" fill="#dc2626" />
          </g>
        ),
      },
      {
        id: "flower",
        name: "Flor",
        svg: (
          <g>
            <circle cx="12" cy="12" r="2" fill="#fbbf24" />
            <ellipse cx="12" cy="7" rx="1.5" ry="3" fill="currentColor" />
            <ellipse cx="7" cy="12" rx="3" ry="1.5" fill="currentColor" />
            <ellipse cx="17" cy="12" rx="3" ry="1.5" fill="currentColor" />
            <ellipse cx="12" cy="17" rx="1.5" ry="3" fill="currentColor" />
            <ellipse cx="8.5" cy="8.5" rx="2" ry="1" fill="currentColor" transform="rotate(-45 8.5 8.5)" />
            <ellipse cx="15.5" cy="8.5" rx="2" ry="1" fill="currentColor" transform="rotate(45 15.5 8.5)" />
            <ellipse cx="15.5" cy="15.5" rx="2" ry="1" fill="currentColor" transform="rotate(-45 15.5 15.5)" />
            <ellipse cx="8.5" cy="15.5" rx="2" ry="1" fill="currentColor" transform="rotate(45 8.5 15.5)" />
            <rect x="11" y="18" width="2" height="4" fill="#059669" />
          </g>
        ),
      },
      {
        id: "leaf",
        name: "Hoja",
        svg: (
          <g>
            <path d="M12 2Q18 8 15 16Q12 18 9 16Q6 8 12 2" fill="currentColor" />
            <path d="M12 2Q15 6 14 13Q12 16 10 13Q9 6 12 2" fill="#fbbf24" />
            <path d="M12 4Q12 8 12 13" stroke="#059669" strokeWidth="1" />
            <path d="M12 6Q14 8 13 11" stroke="#059669" strokeWidth="0.5" />
            <path d="M12 8Q10 9 11 12" stroke="#059669" strokeWidth="0.5" />
          </g>
        ),
      },
      {
        id: "mountain",
        name: "Montaña",
        svg: (
          <g>
            <path d="M2 20l8-15 5 5 7-8 2 18H2z" fill="currentColor" />
            <path d="M2 20l6-12 4 4 6-7 2 15H2z" fill="#e5e7eb" />
            <path d="M16 7l2-3 2 2-1 2z" fill="#ffffff" />
            <path d="M7 11l3-6 2 3-1 2z" fill="#ffffff" />
          </g>
        ),
      },
      {
        id: "wave",
        name: "Ola",
        svg: (
          <g>
            <path
              d="M2 14Q6 10 10 14Q14 18 18 14Q22 10 22 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M2 12Q6 8 10 12Q14 16 18 12Q22 8 22 12"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M2 16Q6 12 10 16Q14 20 18 16Q22 12 22 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="6" cy="11" r="1" fill="#ffffff" opacity="0.7" />
            <circle cx="12" cy="15" r="0.8" fill="#ffffff" opacity="0.7" />
            <circle cx="18" cy="13" r="1" fill="#ffffff" opacity="0.7" />
          </g>
        ),
      },
      {
        id: "rose",
        name: "Rosa",
        svg: (
          <g>
            <circle cx="12" cy="9" r="4" fill="currentColor" />
            <circle cx="12" cy="9" r="2.5" fill="#fbbf24" />
            <circle cx="12" cy="9" r="1.5" fill="#dc2626" />
            <path d="M9 6Q7 4 8.5 3.5Q10.5 5.5 9 6" fill="currentColor" />
            <path d="M15 6Q17 4 15.5 3.5Q13.5 5.5 15 6" fill="currentColor" />
            <path d="M9 12Q7 14 8.5 14.5Q10.5 12.5 9 12" fill="currentColor" />
            <path d="M15 12Q17 14 15.5 14.5Q13.5 12.5 15 12" fill="currentColor" />
            <rect x="11" y="13" width="2" height="8" fill="#059669" />
            <path d="M10 16Q9 15 10 14" fill="#059669" />
            <path d="M14 18Q15 17 14 16" fill="#059669" />
          </g>
        ),
      },
    ],
  },
  text: {
    name: "Texto",
    icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="currentColor" />,
    elements: [
      {
        id: "text",
        name: "Texto",
        svg: (
          <g>
            <rect x="2" y="8" width="20" height="8" fill="currentColor" rx="1.5" />
            <text x="12" y="13.5" textAnchor="middle" fill="#000" fontSize="4" fontWeight="bold">
              ABC
            </text>
          </g>
        ),
      },
      {
        id: "banner",
        name: "Banner",
        svg: (
          <g>
            <path d="M2 8h18l2 4-2 4H2V8z" fill="currentColor" />
            <text x="11" y="13" textAnchor="middle" fill="#000" fontSize="3.5" fontWeight="bold">
              BANNER
            </text>
            <circle cx="4" cy="9" r="0.5" fill="#fbbf24" />
            <circle cx="4" cy="15" r="0.5" fill="#fbbf24" />
          </g>
        ),
      },
      {
        id: "scroll",
        name: "Pergamino",
        svg: (
          <g>
            <rect x="4" y="6" width="16" height="12" fill="currentColor" rx="1" />
            <circle cx="4" cy="12" r="1.5" fill="#8b4513" />
            <circle cx="20" cy="12" r="1.5" fill="#8b4513" />
            <text x="12" y="11" textAnchor="middle" fill="#000" fontSize="2.5" fontWeight="bold">
              SCROLL
            </text>
            <text x="12" y="14" textAnchor="middle" fill="#000" fontSize="2.5" fontWeight="bold">
              TEXT
            </text>
            <path d="M6 8h12" stroke="#8b4513" strokeWidth="0.3" />
            <path d="M6 16h12" stroke="#8b4513" strokeWidth="0.3" />
          </g>
        ),
      },
    ],
  },
}

const COLOR_PRESETS = [
  { primary: "#1e40af", secondary: "#fbbf24", accent: "#ffffff" },
  { primary: "#dc2626", secondary: "#ffffff", accent: "#fbbf24" },
  { primary: "#059669", secondary: "#fbbf24", accent: "#ffffff" },
  { primary: "#7c3aed", secondary: "#e5e7eb", accent: "#fbbf24" },
  { primary: "#ea580c", secondary: "#1f2937", accent: "#ffffff" },
  { primary: "#0891b2", secondary: "#fef3c7", accent: "#1f2937" },
  { primary: "#be185d", secondary: "#fce7f3", accent: "#1f2937" },
  { primary: "#166534", secondary: "#dcfce7", accent: "#1f2937" },
]

export default function ShieldCustomizer() {
  const [selectedShield, setSelectedShield] = useState("classic")
  const [selectedPattern, setSelectedPattern] = useState("solid")
  const [colors, setColors] = useState<Colors>({ primary: "#1e40af", secondary: "#fbbf24", accent: "#ffffff" })
  const [elements, setElements] = useState<ShieldElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"shield" | "colors" | "elements" | "layers" | "effects">("shield")
  const [expandedCategory, setExpandedCategory] = useState<string | null>("royalty")
  const [customText, setCustomText] = useState("TEXTO")
  const [shieldBorder, setShieldBorder] = useState(true)
  const [shieldShadow, setShieldShadow] = useState(true)

  const [savedDesigns, setSavedDesigns] = useState<any[]>([])
  const [designName, setDesignName] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  // Estado optimizado para drag
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementId: null,
    offset: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
  })

  const svgRef = useRef<SVGSVGElement>(null)
  const animationFrameRef = useRef<number>()
  const lastUpdateRef = useRef<number>(0)
  const throttleTimeoutRef = useRef<NodeJS.Timeout>()

  // Throttle mejorado para optimizar el rendimiento
  const throttle = useCallback((func: Function, limit: number) => {
    return (...args: any[]) => {
      const now = Date.now()
      if (!lastUpdateRef.current) {
        func(...args)
        lastUpdateRef.current = now
      } else {
        clearTimeout(throttleTimeoutRef.current)
        throttleTimeoutRef.current = setTimeout(() => {
          if (now - lastUpdateRef.current >= limit) {
            func(...args)
            lastUpdateRef.current = now
          }
        }, limit - (now - lastUpdateRef.current))
      }
    }
  }, [])

  // Limpieza de recursos al desmontar
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }
    }
  }, [])

  const addElement = useCallback(
    (elementType: string, category: string) => {
      const newElement: ShieldElement = {
        id: `${elementType}-${Date.now()}`,
        type: elementType,
        category,
        x: 200,
        y: 200,
        scale: 1,
        rotation: 0,
        opacity: 1,
        color: colors.accent,
        visible: true,
        zIndex: elements.length,
      }
      setElements((prev) => [...prev, newElement])
      setSelectedElement(newElement.id)
    },
    [colors.accent, elements.length],
  )

  const deleteElement = useCallback(
    (elementId: string) => {
      setElements((prev) => prev.filter((el) => el.id !== elementId))
      setSelectedElement(null)
    },
    []
  )

  const updateElement = useCallback(
    (elementId: string, updates: Partial<ShieldElement>) => {
      setElements((prev) => prev.map((el) => (el.id === elementId ? { ...el, ...updates } : el)))
    },
    []
  )

  const toggleElementVisibility = useCallback(
    (elementId: string) => {
      setElements((prev) => prev.map((el) => (el.id === elementId ? { ...el, visible: !el.visible } : el)))
    },
    []
  )

  const moveElementLayer = useCallback(
    (elementId: string, direction: "up" | "down") => {
      setElements((prev) => {
        const newElements = [...prev]
        const elementIndex = newElements.findIndex((el) => el.id === elementId)
        if (elementIndex === -1) return prev

        if (direction === "up" && elementIndex < newElements.length - 1) {
          ;[newElements[elementIndex], newElements[elementIndex + 1]] = [
            newElements[elementIndex + 1],
            newElements[elementIndex],
          ]
        } else if (direction === "down" && elementIndex > 0) {
          ;[newElements[elementIndex], newElements[elementIndex - 1]] = [
            newElements[elementIndex - 1],
            newElements[elementIndex],
          ]
        }

        return newElements.map((el, index) => ({ ...el, zIndex: index }))
      })
    },
    []
  )

  // Función para obtener coordenadas optimizada
  const getCoordinates = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if ("touches" in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }, [])

  // Función optimizada para calcular posición relativa al SVG
  const getSVGCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    const rect = svgRef.current.getBoundingClientRect()
    const scaleX = 400 / rect.width
    const scaleY = 500 / rect.height
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }, [])

  // Inicio del drag optimizado
  const handleElementStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent, elementId: string) => {
      e.preventDefault()
      e.stopPropagation()

      const element = elements.find((el) => el.id === elementId)
      if (!element) return

      const { x: clientX, y: clientY } = getCoordinates(e)
      const { x: svgX, y: svgY } = getSVGCoordinates(clientX, clientY)

      setSelectedElement(elementId)
      setDragState({
        isDragging: true,
        elementId,
        offset: {
          x: svgX - element.x,
          y: svgY - element.y,
        },
        currentPos: { x: element.x, y: element.y },
      })
    },
    [elements, getCoordinates, getSVGCoordinates],
  )

  // Movimiento optimizado con throttling
  const handleMove = useCallback(
    throttle((e: React.TouchEvent | React.MouseEvent) => {
      if (!dragState.isDragging || !dragState.elementId) return

      e.preventDefault()

      const { x: clientX, y: clientY } = getCoordinates(e)
      const { x: svgX, y: svgY } = getSVGCoordinates(clientX, clientY)

      const newX = Math.max(30, Math.min(370, svgX - dragState.offset.x))
      const newY = Math.max(30, Math.min(470, svgY - dragState.offset.y))

      // Actualizar posición temporal para renderizado inmediato
      setDragState((prev) => ({
        ...prev,
        currentPos: { x: newX, y: newY },
      }))

      // Cancelar frame anterior si existe
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      // Usar requestAnimationFrame para suavizar la actualización
      animationFrameRef.current = requestAnimationFrame(() => {
        setElements((prev) => prev.map((el) => (el.id === dragState.elementId ? { ...el, x: newX, y: newY } : el)))
      })
    }, 16), // ~60fps
    [dragState, getCoordinates, getSVGCoordinates]
  )

  // Fin del drag optimizado
  const handleEnd = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // Sincronizar posición final
    if (dragState.isDragging && dragState.elementId) {
      setElements((prev) =>
        prev.map((el) =>
          el.id === dragState.elementId ? { ...el, x: dragState.currentPos.x, y: dragState.currentPos.y } : el,
        ),
      )
    }

    setDragState({
      isDragging: false,
      elementId: null,
      offset: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
    })
    lastUpdateRef.current = 0
  }, [dragState])

  const handleSvgClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (e.target === svgRef.current) {
        setSelectedElement(null)
      }
    },
    [svgRef],
  )

  // Función para generar JSON del diseño actual
  const generateDesignJSON = useCallback(() => {
    return {
      id: Date.now().toString(),
      name: designName || `Escudo ${new Date().toLocaleDateString()}`,
      timestamp: new Date().toISOString(),
      shield: {
        shape: selectedShield,
        pattern: selectedPattern,
        border: shieldBorder,
        shadow: shieldShadow,
      },
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
      },
      elements: elements.map((element) => ({
        id: element.id,
        type: element.type,
        category: element.category,
        x: element.x,
        y: element.y,
        scale: element.scale,
        rotation: element.rotation,
        opacity: element.opacity,
        color: element.color,
        visible: element.visible,
        zIndex: element.zIndex,
      })),
      customText,
      version: "1.0",
    }
  }, [selectedShield, selectedPattern, shieldBorder, shieldShadow, colors, elements, customText, designName])

  // Función para guardar diseño
  const saveDesign = useCallback(() => {
    const design = generateDesignJSON()
    const savedDesigns = JSON.parse(localStorage.getItem("shieldDesigns") || "[]")
    savedDesigns.push(design)
    localStorage.setItem("shieldDesigns", JSON.stringify(savedDesigns))
    setSavedDesigns(savedDesigns)
    setShowSaveDialog(false)
    setDesignName("")

    // También descargar como archivo JSON
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${design.name.replace(/[^a-z0-9]/gi, "_")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [generateDesignJSON])

  // Función para cargar diseño desde JSON
  const loadDesign = useCallback(
    (design: any) => {
      setSelectedShield(design.shield.shape)
      setSelectedPattern(design.shield.pattern)
      setShieldBorder(design.shield.border)
      setShieldShadow(design.shield.shadow)
      setColors(design.colors)
      setElements(design.elements)
      setCustomText(design.customText || "TEXTO")
      setSelectedElement(null)
    },
    []
  )

  // Función para cargar desde archivo
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file && file.type === "application/json") {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const design = JSON.parse(e.target?.result as string)
            loadDesign(design)
          } catch (error) {
            alert("Error al cargar el archivo JSON")
          }
        }
        reader.readAsText(file)
      }
    },
    [loadDesign],
  )

  // Función para exportar solo JSON (sin guardar)
  const exportJSON = useCallback(() => {
    const design = generateDesignJSON()
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `escudo_${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [generateDesignJSON])

  // Cargar diseños guardados al iniciar
  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shieldDesigns") || "[]")
    setSavedDesigns(saved)
  }, [])

  // Memoizar elementos ordenados para evitar re-cálculos
  const sortedElements = useMemo(() => {
    return [...elements].sort((a, b) => a.zIndex - b.zIndex).filter((el) => el.visible)
  }, [elements])

  // Memoizar elemento seleccionado
  const selectedElementData = useMemo(() => {
    return selectedElement ? elements.find((el) => el.id === selectedElement) : null
  }, [selectedElement, elements])

  // Función para obtener posición de elemento (drag o posición real)
  const getElementPosition = useCallback(
    (element: ShieldElement) => {
      if (dragState.isDragging && dragState.elementId === element.id) {
        return dragState.currentPos
      }
      return { x: element.x, y: element.y }
    },
    [dragState],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">🛡️ Personalizador Avanzado</h1>

        {/* Controles de Guardar/Cargar */}
        <div className="flex gap-2 mb-4">
          <Button onClick={() => setShowSaveDialog(true)} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>

          <Button onClick={exportJSON} variant="outline" className="flex-1 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Exportar JSON
          </Button>

          <label className="flex-1">
            <Button variant="outline" className="w-full cursor-pointer bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              Cargar JSON
            </Button>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Diálogo de Guardar */}
        {showSaveDialog && (
          <Card className="mb-4 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-green-800">💾 Guardar Diseño</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Nombre del diseño (opcional)"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  className="border-green-300"
                />
                <div className="flex gap-2">
                  <Button onClick={saveDesign} className="flex-1 bg-green-500 hover:bg-green-600">
                    💾 Guardar y Descargar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSaveDialog(false)
                      setDesignName("")
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diseños Guardados */}
        {savedDesigns.length > 0 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">📁 Diseños Guardados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {savedDesigns
                  .slice(-3)
                  .reverse()
                  .map((design) => (
                    <div key={design.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{design.name}</p>
                        <p className="text-xs text-gray-500">{new Date(design.timestamp).toLocaleDateString()}</p>
                      </div>
                      <Button size="sm" onClick={() => loadDesign(design)} className="ml-2">
                        Cargar
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Canvas del Escudo */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative bg-white rounded-lg shadow-inner overflow-hidden">
              <svg
                ref={svgRef}
                width="100%"
                height="300"
                viewBox="0 0 400 500"
                className="w-full touch-none select-none"
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchMove={(e) => {
                  e.preventDefault()
                  handleMove(e)
                }}
                onTouchEnd={(e) => {
                  e.preventDefault()
                  handleEnd()
                }}
                onClick={handleSvgClick}
                onTouchStart={(e) => {
                  e.preventDefault()
                  handleSvgClick(e)
                }}
                style={{ cursor: dragState.isDragging ? "grabbing" : "default" }}
              >
                {/* Definiciones optimizadas */}
                <defs>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="3" dy="3" stdDeviation="3" floodOpacity="0.3" />
                  </filter>
                  <pattern id="stripes" patternUnits="userSpaceOnUse" width="10" height="10">
                    <rect width="10" height="10" fill={colors.primary} />
                    <rect width="5" height="10" fill={colors.secondary} />
                  </pattern>
                  <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
                    <rect width="20" height="20" fill={colors.primary} />
                    <circle cx="10" cy="10" r="3" fill={colors.secondary} />
                  </pattern>
                </defs>

                {/* Escudo Base */}
                <ShieldShape
                  type={selectedShield}
                  pattern={selectedPattern}
                  primaryColor={colors.primary}
                  secondaryColor={colors.secondary}
                  border={shieldBorder}
                  shadow={shieldShadow}
                />

                {/* Elementos optimizados */}
                {sortedElements.map((element) => {
                  const position = getElementPosition(element)
                  return (
                    <ElementComponent
                      key={element.id}
                      element={element}
                      position={position}
                      isSelected={selectedElement === element.id}
                      isDragging={dragState.isDragging && dragState.elementId === element.id}
                      customText={customText}
                      onStart={handleElementStart}
                      onDelete={deleteElement}
                    />
                  )
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de navegación */}
        <div className="flex mb-4 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
          {[
            { id: "shield", icon: Shield, label: "Escudo" },
            { id: "colors", icon: Palette, label: "Colores" },
            { id: "elements", icon: Plus, label: "Elementos" },
            { id: "layers", icon: Layers, label: "Capas" },
            { id: "effects", icon: Sparkles, label: "Efectos" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors min-w-0 ${
                activeTab === id ? "bg-blue-500 text-white" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" />
              {label}
            </button>
          ))}
        </div>

        {/* Contenido de las tabs */}
        {activeTab === "shield" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Forma y Patrón</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Forma del Escudo</label>
                <div className="grid grid-cols-2 gap-2">
                  {SHIELD_SHAPES.map((shape) => (
                    <Button
                      key={shape.id}
                      variant={selectedShield === shape.id ? "default" : "outline"}
                      onClick={() => setSelectedShield(shape.id)}
                      className="h-12 text-xs flex flex-col gap-1"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        {shape.svg}
                      </svg>
                      {shape.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Patrón</label>
                <div className="grid grid-cols-2 gap-2">
                  {SHIELD_PATTERNS.map((pattern) => (
                    <Button
                      key={pattern.id}
                      variant={selectedPattern === pattern.id ? "default" : "outline"}
                      onClick={() => setSelectedPattern(pattern.id)}
                      className="h-10 text-xs"
                    >
                      {pattern.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Borde</label>
                  <Button
                    variant={shieldBorder ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShieldBorder(!shieldBorder)}
                  >
                    {shieldBorder ? "Sí" : "No"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Sombra</label>
                  <Button
                    variant={shieldShadow ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShieldShadow(!shieldShadow)}
                  >
                    {shieldShadow ? "Sí" : "No"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "colors" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Colores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Color Primario</label>
                  <input
                    type="color"
                    value={colors.primary}
                    onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                    className="w-full h-12 rounded-lg border-2 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color Secundario</label>
                  <input
                    type="color"
                    value={colors.secondary}
                    onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                    className="w-full h-12 rounded-lg border-2 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color de Acento</label>
                  <input
                    type="color"
                    value={colors.accent}
                    onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                    className="w-full h-12 rounded-lg border-2 border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Combinaciones predefinidas</label>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setColors(preset)}
                      className="h-12 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-colors"
                      style={{
                        background: `linear-gradient(45deg, ${preset.primary} 33%, ${preset.secondary} 33%, ${preset.secondary} 66%, ${preset.accent} 66%)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "elements" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agregar Elementos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedElement && selectedElementData?.type === "text" && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium mb-2">Texto personalizado</label>
                  <Input
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Escribe tu texto"
                    className="text-center"
                  />
                </div>
              )}

              {Object.entries(ELEMENT_CATEGORIES).map(([categoryId, category]) => (
                <div key={categoryId} className="border rounded-lg">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === categoryId ? null : categoryId)}
                    className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        {category.icon}
                      </svg>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCategory === categoryId ? "rotate-180" : ""}`}
                    />
                  </button>

                  {expandedCategory === categoryId && (
                    <div className="p-3 pt-0 grid grid-cols-3 gap-2">
                      {category.elements.map((element) => (
                        <Button
                          key={element.id}
                          variant="outline"
                          onClick={() => addElement(element.id, categoryId)}
                          className="h-16 flex flex-col items-center gap-1 text-xs"
                        >
                          <svg className="w-6 h-6" viewBox="0 0 24 24">
                            {element.svg}
                          </svg>
                          {element.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === "layers" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gestión de Capas</CardTitle>
            </CardHeader>
            <CardContent>
              {elements.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay elementos agregados</p>
              ) : (
                <div className="space-y-2">
                  {elements
                    .sort((a, b) => b.zIndex - a.zIndex)
                    .map((element) => (
                      <div
                        key={element.id}
                        className={`p-3 border rounded-lg flex items-center justify-between transition-colors ${
                          selectedElement === element.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleElementVisibility(element.id)} className="p-1">
                            {element.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <span className="text-sm">
                            {ELEMENT_CATEGORIES[element.category as keyof typeof ELEMENT_CATEGORIES]?.elements.find(
                              (e) => e.id === element.type,
                            )?.name || element.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveElementLayer(element.id, "up")}
                            className="h-8 w-8 p-0"
                          >
                            ↑
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveElementLayer(element.id, "down")}
                            className="h-8 w-8 p-0"
                          >
                            ↓
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedElement(element.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Move className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteElement(element.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "effects" && selectedElementData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Efectos del Elemento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Color del Elemento</label>
                <input
                  type="color"
                  value={selectedElementData.color}
                  onChange={(e) => updateElement(selectedElement!, { color: e.target.value })}
                  className="w-full h-12 rounded-lg border-2 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tamaño: {Math.round(selectedElementData.scale * 100)}%
                </label>
                <Slider
                  value={[selectedElementData.scale]}
                  onValueChange={([value]) => updateElement(selectedElement!, { scale: value })}
                  min={0.3}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rotación: {selectedElementData.rotation}°</label>
                <Slider
                  value={[selectedElementData.rotation]}
                  onValueChange={([value]) => updateElement(selectedElement!, { rotation: value })}
                  min={0}
                  max={360}
                  step={15}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Opacidad: {Math.round(selectedElementData.opacity * 100)}%
                </label>
                <Slider
                  value={[selectedElementData.opacity]}
                  onValueChange={([value]) => updateElement(selectedElement!, { opacity: value })}
                  min={0.1}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => updateElement(selectedElement!, { rotation: selectedElementData.rotation + 90 })}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotar 90°
                </Button>
                <Button
                  onClick={() =>
                    updateElement(selectedElement!, {
                      scale: 1,
                      rotation: 0,
                      opacity: 1,
                      x: 200,
                      y: 200,
                    })
                  }
                  variant="outline"
                  className="flex-1"
                >
                  Resetear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "effects" && !selectedElementData && (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Selecciona un elemento para ver sus efectos</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Componente optimizado para elementos individuales
const ElementComponent = React.memo(
  ({
    element,
    position,
    isSelected,
    isDragging,
    customText,
    onStart,
    onDelete,
  }: {
    element: ShieldElement
    position: { x: number; y: number }
    isSelected: boolean
    isDragging: boolean
    customText: string
    onStart: (e: React.TouchEvent | React.MouseEvent, elementId: string) => void
    onDelete: (elementId: string) => void
  }) => {
    return (
      <g>
        {/* Contorno de selección */}
        {isSelected && (
          <>
            <rect
              x={position.x - 35}
              y={position.y - 35}
              width="70"
              height="70"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
              rx="8"
            />
            {/* Botón de eliminar */}
            <circle
              cx={position.x + 35}
              cy={position.y - 35}
              r="15"
              fill="#ef4444"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(element.id)
              }}
            />
            <text
              x={position.x + 35}
              y={position.y - 30}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              className="pointer-events-none select-none"
            >
              🗑️
            </text>
          </>
        )}

        {/* Elemento SVG */}
        <g
          transform={`translate(${position.x}, ${position.y}) scale(${element.scale}) rotate(${element.rotation})`}
          opacity={element.opacity}
          onMouseDown={(e) => onStart(e, element.id)}
          onTouchStart={(e) => onStart(e, element.id)}
          className={`touch-none select-none ${isDragging ? "cursor-grabbing scale-105" : "cursor-grab"} transition-transform duration-100`}
          style={{ willChange: isDragging ? "transform" : "auto" }}
        >
          <ElementSVG
            type={element.type}
            color={element.color}
            customText={element.type === "text" ? customText : undefined}
          />
        </g>
      </g>
    )
  },
)

ElementComponent.displayName = "ElementComponent"

// Componente para las formas de escudo
function ShieldShape({
  type,
  pattern,
  primaryColor,
  secondaryColor,
  border,
  shadow,
}: {
  type: string
  pattern: string
  primaryColor: string
  secondaryColor: string
  border: boolean
  shadow: boolean
}) {
  const gradientId = `gradient-${type}`

  let fillValue = primaryColor
  if (pattern === "gradient") {
    fillValue = `url(#${gradientId})`
  } else if (pattern === "stripes") {
    fillValue = "url(#stripes)"
  } else if (pattern === "dots") {
    fillValue = "url(#dots)"
  }

  const shapes = {
    classic: (
      <path
        d="M200 50 C120 50, 50 80, 50 150 L50 300 C50 380, 120 450, 200 450 C280 450, 350 380, 350 300 L350 150 C350 80, 280 50, 200 50 Z"
        fill={fillValue}
        stroke={border ? secondaryColor : "none"}
        strokeWidth={border ? "4" : "0"}
        filter={shadow ? "url(#shadow)" : "none"}
      />
    ),
    modern: (
      <path
        d="M200 50 L350 100 L350 300 C350 380, 280 450, 200 450 C120 450, 50 380, 50 300 L50 100 Z"
        fill={fillValue}
        stroke={border ? secondaryColor : "none"}
        strokeWidth={border ? "4" : "0"}
        filter={shadow ? "url(#shadow)" : "none"}
      />
    ),
    medieval: (
      <path
        d="M200 50 C150 50, 50 70, 50 150 L50 320 L200 450 L350 320 L350 150 C350 70, 250 50, 200 50 Z"
        fill={fillValue}
        stroke={border ? secondaryColor : "none"}
        strokeWidth={border ? "4" : "0"}
        filter={shadow ? "url(#shadow)" : "none"}
      />
    ),
    round: (
      <circle
        cx="200"
        cy="250"
        r="180"
        fill={fillValue}
        stroke={border ? secondaryColor : "none"}
        strokeWidth={border ? "4" : "0"}
        filter={shadow ? "url(#shadow)" : "none"}
      />
    ),
    hexagon: (
      <path
        d="M200 70 L320 140 L320 280 L200 350 L80 280 L80 140 Z"
        fill={fillValue}
        stroke={border ? secondaryColor : "none"}
        strokeWidth={border ? "4" : "0"}
        filter={shadow ? "url(#shadow)" : "none"}
      />
    ),
    diamond: (
      <path
        d="M200 50 L350 200 L200 450 L50 200 Z"
        fill={fillValue}
        stroke={border ? secondaryColor : "none"}
        strokeWidth={border ? "4" : "0"}
        filter={shadow ? "url(#shadow)" : "none"}
      />
    ),
    heart: (
      <path
        d="M200 100 C200 80, 170 50, 140 50 C110 50, 80 80, 80 120 C80 160, 200 280, 200 450 C200 280, 320 160, 320 120 C320 80, 290 50, 260 50 C230 50, 200 80, 200 100 Z"
        fill={fillValue}
        stroke={border ? secondaryColor : "none"}
        strokeWidth={border ? "4" : "0"}
        filter={shadow ? "url(#shadow)" : "none"}
      />
    ),
    star: (
      <path
        d="M200 50 L220 130 L300 130 L240 180 L260 260 L200 220 L140 260 L160 180 L100 130 L180 130 Z"
        fill={fillValue}
        stroke={border ? secondaryColor : "none"}
        strokeWidth={border ? "4" : "0"}
        filter={shadow ? "url(#shadow)" : "none"}
      />
    ),
  }

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="50%" stopColor={primaryColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {shapes[type as keyof typeof shapes]}
    </>
  )
}

// Componente para los elementos SVG
function ElementSVG({ type, color, customText }: { type: string; color: string; customText?: string }) {
  const elements = {
    // Realeza
    crown: (
      <g transform="translate(-25, -25)">
        <path d="M5 30 L12 10 L18 25 L25 10 L32 25 L39 10 L45 30 Z" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="12" cy="10" r="4" fill="#fbbf24" />
        <circle cx="25" cy="10" r="4" fill="#fbbf24" />
        <circle cx="39" cy="10" r="4" fill="#fbbf24" />
        <rect x="5" y="30" width="40" height="6" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="25" cy="33" r="3" fill="#dc2626" />
      </g>
    ),
    crown2: (
      <g transform="translate(-25, -25)">
        <path d="M10 35 L15 5 L20 20 L25 5 L30 20 L35 5 L40 35 Z" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="15" cy="5" r="3" fill="#7c3aed" />
        <circle cx="25" cy="5" r="4" fill="#dc2626" />
        <circle cx="35" cy="5" r="3" fill="#7c3aed" />
        <rect x="10" y="35" width="30" height="5" fill={color} stroke="#000" strokeWidth="2" />
      </g>
    ),
    scepter: (
      <g transform="translate(-25, -25)">
        <rect x="23" y="10" width="4" height="30" fill="#8b4513" stroke="#000" strokeWidth="1" />
        <circle cx="25" cy="8" r="6" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="25" cy="8" r="3" fill="#fbbf24" />
        <rect x="20" y="40" width="10" height="4" fill="#8b4513" stroke="#000" strokeWidth="1" />
      </g>
    ),
    throne: (
      <g transform="translate(-25, -25)">
        <rect x="10" y="15" width="30" height="25" fill={color} stroke="#000" strokeWidth="2" />
        <rect x="8" y="10" width="4" height="20" fill={color} stroke="#000" strokeWidth="2" />
        <rect x="38" y="10" width="4" height="20" fill={color} stroke="#000" strokeWidth="2" />
        <rect x="15" y="20" width="20" height="15" fill="#8b4513" />
      </g>
    ),
    jewel: (
      <g transform="translate(-25, -25)">
        <path d="M25 5 L35 15 L30 35 L20 35 L15 15 Z" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M25 5 L30 15 L25 25 L20 15 Z" fill="#fbbf24" />
        <circle cx="25" cy="15" r="2" fill="#dc2626" />
      </g>
    ),

    // Armas
    sword: (
      <g transform="translate(-25, -25)">
        <rect x="23" y="5" width="4" height="35" fill={color} stroke="#000" strokeWidth="2" />
        <rect x="18" y="2" width="14" height="6" fill="#8b5cf6" stroke="#000" strokeWidth="2" />
        <rect x="21" y="40" width="8" height="4" fill="#8b5cf6" stroke="#000" strokeWidth="2" />
        <rect x="22" y="44" width="6" height="2" fill="#8b5cf6" stroke="#000" strokeWidth="2" />
        <path d="M25 5 L27 2 L23 2 Z" fill="#e5e7eb" />
      </g>
    ),
    axe: (
      <g transform="translate(-25, -25)">
        <rect x="24" y="15" width="2" height="30" fill="#8b4513" stroke="#000" strokeWidth="1" />
        <path d="M15 10 L35 10 L30 20 L20 20 Z" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M15 10 L25 5 L35 10 L30 15 L20 15 Z" fill="#e5e7eb" stroke="#000" strokeWidth="1" />
      </g>
    ),
    bow: (
      <g transform="translate(-25, -25)">
        <path d="M10 10 Q25 5, 40 10 Q25 25, 10 10" fill={color} stroke="#000" strokeWidth="2" />
        <line x1="10" y1="10" x2="40" y2="10" stroke="#8b4513" strokeWidth="1" />
        <path d="M20 15 L25 5 L30 15" fill="none" stroke="#8b4513" strokeWidth="2" />
      </g>
    ),
    spear: (
      <g transform="translate(-25, -25)">
        <rect x="24" y="15" width="2" height="30" fill="#8b4513" stroke="#000" strokeWidth="1" />
        <path d="M25 5 L30 15 L25 20 L20 15 Z" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M25 5 L27 10 L25 15 L23 10 Z" fill="#e5e7eb" />
      </g>
    ),
    shield: (
      <g transform="translate(-25, -25)">
        <path
          d="M25 5 C15 5, 10 10, 10 20 L10 35 C10 40, 15 45, 25 45 C35 45, 40 40, 40 35 L40 20 C40 10, 35 5, 25 5 Z"
          fill={color}
          stroke="#000"
          strokeWidth="2"
        />
        <path d="M25 10 L30 20 L25 35 L20 20 Z" fill="#e5e7eb" />
      </g>
    ),
    dagger: (
      <g transform="translate(-25, -25)">
        <rect x="24" y="10" width="2" height="25" fill={color} stroke="#000" strokeWidth="2" />
        <rect x="22" y="8" width="6" height="4" fill="#8b5cf6" stroke="#000" strokeWidth="2" />
        <rect x="23" y="35" width="4" height="3" fill="#8b5cf6" stroke="#000" strokeWidth="2" />
        <path d="M25 10 L26 8 L24 8 Z" fill="#e5e7eb" />
      </g>
    ),

    // Animales
    lion: (
      <g transform="translate(-25, -25)">
        <ellipse cx="25" cy="25" rx="12" ry="15" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="25" cy="15" r="8" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="21" cy="12" r="2" fill="#000" />
        <circle cx="29" cy="12" r="2" fill="#000" />
        <path d="M15 12 Q10 8, 8 12" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M35 12 Q40 8, 42 12" fill={color} stroke="#000" strokeWidth="2" />
        <rect x="23" y="40" width="4" height="8" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M25 18 L22 22 L28 22 Z" fill="#000" />
        <path d="M20 10 Q15 5, 12 8" fill="#fbbf24" stroke="#000" strokeWidth="1" />
        <path d="M30 10 Q35 5, 38 8" fill="#fbbf24" stroke="#000" strokeWidth="1" />
      </g>
    ),
    eagle: (
      <g transform="translate(-25, -25)">
        <ellipse cx="25" cy="22" rx="15" ry="10" fill={color} stroke="#000" strokeWidth="2" />
        <ellipse cx="25" cy="15" rx="6" ry="8" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M10 22 Q5 15, 2 22 Q5 28, 10 22" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M40 22 Q45 15, 48 22 Q45 28, 40 22" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="22" cy="12" r="2" fill="#000" />
        <circle cx="28" cy="12" r="2" fill="#000" />
        <path d="M25 17 L22 20 L28 20 Z" fill="#fbbf24" />
        <path d="M20 30 L25 35 L30 30" fill={color} stroke="#000" strokeWidth="2" />
      </g>
    ),
    wolf: (
      <g transform="translate(-25, -25)">
        <ellipse cx="25" cy="25" rx="10" ry="12" fill={color} stroke="#000" strokeWidth="2" />
        <ellipse cx="25" cy="15" rx="7" ry="8" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M20 8 L22 5 L18 5 Z" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M30 8 L32 5 L28 5 Z" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="22" cy="12" r="1.5" fill="#000" />
        <circle cx="28" cy="12" r="1.5" fill="#000" />
        <path d="M25 16 L23 18 L27 18 Z" fill="#000" />
        <path d="M20 37 L25 42 L30 37" fill={color} stroke="#000" strokeWidth="2" />
      </g>
    ),
    dragon: (
      <g transform="translate(-25, -25)">
        <ellipse cx="25" cy="25" rx="15" ry="12" fill={color} stroke="#000" strokeWidth="2" />
        <ellipse cx="25" cy="15" rx="8" ry="10" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M10 25 Q5 20, 2 25 Q5 30, 10 25" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M40 25 Q45 20, 48 25 Q45 30, 40 25" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="22" cy="12" r="2" fill="#dc2626" />
        <circle cx="28" cy="12" r="2" fill="#dc2626" />
        <path d="M25 18 L20 22 L30 22 Z" fill="#000" />
        <path d="M20 5 L22 2 L18 8 Z" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M30 5 L32 2 L28 8 Z" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M15 35 Q25 40, 35 35" fill="none" stroke="#dc2626" strokeWidth="2" />
      </g>
    ),
    horse: (
      <g transform="translate(-25, -25)">
        <ellipse cx="25" cy="30" rx="8" ry="15" fill={color} stroke="#000" strokeWidth="2" />
        <ellipse cx="25" cy="15" rx="6" ry="10" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M20 8 L22 5 L18 10 Z" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M30 8 L32 5 L28 10 Z" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="22" cy="12" r="1.5" fill="#000" />
        <circle cx="28" cy="12" r="1.5" fill="#000" />
        <ellipse cx="25" cy="18" rx="2" ry="3" fill="#000" />
        <path d="M15 5 Q20 2, 25 5 Q30 2, 35 5" fill="#8b4513" stroke="#000" strokeWidth="1" />
        <rect x="22" y="45" width="2" height="5" fill={color} stroke="#000" strokeWidth="1" />
        <rect x="26" y="45" width="2" height="5" fill={color} stroke="#000" strokeWidth="1" />
      </g>
    ),
    bear: (
      <g transform="translate(-25, -25)">
        <ellipse cx="25" cy="28" rx="12" ry="15" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="25" cy="15" r="9" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="18" cy="10" r="3" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="32" cy="10" r="3" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="22" cy="13" r="2" fill="#000" />
        <circle cx="28" cy="13" r="2" fill="#000" />
        <ellipse cx="25" cy="18" rx="3" ry="2" fill="#000" />
        <rect x="20" y="43" width="3" height="7" fill={color} stroke="#000" strokeWidth="1" />
        <rect x="27" y="43" width="3" height="7" fill={color} stroke="#000" strokeWidth="1" />
      </g>
    ),
    snake: (
      <g transform="translate(-25, -25)">
        <path
          d="M10 40 Q15 30, 20 35 Q25 40, 30 30 Q35 20, 40 25 Q42 15, 38 10"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="38" cy="10" r="4" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="36" cy="8" r="1" fill="#dc2626" />
        <circle cx="40" cy="8" r="1" fill="#dc2626" />
        <path d="M38 12 L35 14 L41 14 Z" fill="#000" />
        <path d="M15 35 Q20 32, 25 35" fill="none" stroke="#000" strokeWidth="2" />
        <path d="M30 32 Q35 28, 40 30" fill="none" stroke="#000" strokeWidth="2" />
      </g>
    ),
    owl: (
      <g transform="translate(-25, -25)">
        <ellipse cx="25" cy="25" rx="10" ry="15" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="25" cy="15" r="8" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="21" cy="12" r="3" fill="#fbbf24" stroke="#000" strokeWidth="2" />
        <circle cx="29" cy="12" r="3" fill="#fbbf24" stroke="#000" strokeWidth="2" />
        <circle cx="21" cy="12" r="1.5" fill="#000" />
        <circle cx="29" cy="12" r="1.5" fill="#000" />
        <path d="M25 16 L23 18 L27 18 Z" fill="#fbbf24" />
        <path d="M18 8 L20 5 L16 10 Z" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M32 8 L34 5 L30 10 Z" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M20 40 L25 45 L30 40" fill={color} stroke="#000" strokeWidth="2" />
      </g>
    ),

    // Símbolos
    star: (
      <g transform="translate(-25, -25)">
        <path
          d="M25 5 L28 18 L42 18 L32 26 L35 39 L25 31 L15 39 L18 26 L8 18 L22 18 Z"
          fill={color}
          stroke="#000"
          strokeWidth="2"
        />
        <path d="M25 5 L27 15 L35 15 L29 20 L31 30 L25 25 L19 30 L21 20 L15 15 L23 15 Z" fill="#fbbf24" />
      </g>
    ),
    cross: (
      <g transform="translate(-25, -25)">
        <rect x="21" y="5" width="8" height="40" fill={color} stroke="#000" strokeWidth="2" />
        <rect x="10" y="16" width="30" height="8" fill={color} stroke="#000" strokeWidth="2" />
        <rect x="23" y="7" width="4" height="36" fill="#e5e7eb" />
        <rect x="12" y="18" width="26" height="4" fill="#e5e7eb" />
      </g>
    ),
    moon: (
      <g transform="translate(-25, -25)">
        <path
          d="M15 10 Q10 15, 10 25 Q10 35, 15 40 Q25 35, 30 25 Q25 15, 15 10"
          fill={color}
          stroke="#000"
          strokeWidth="2"
        />
        <path d="M18 15 Q15 20, 15 25 Q15 30, 18 35 Q25 30, 27 25 Q25 20, 18 15" fill="#fbbf24" />
        <circle cx="20" cy="20" r="1" fill="#e5e7eb" />
        <circle cx="22" cy="25" r="1.5" fill="#e5e7eb" />
        <circle cx="19" cy="30" r="1" fill="#e5e7eb" />
      </g>
    ),
    sun: (
      <g transform="translate(-25, -25)">
        <circle cx="25" cy="25" r="8" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="25" cy="25" r="5" fill="#fbbf24" />
        <path d="M25 5 L27 12 L23 12 Z" fill={color} />
        <path d="M25 45 L27 38 L23 38 Z" fill={color} />
        <path d="M5 25 L12 27 L12 23 Z" fill={color} />
        <path d="M45 25 L38 27 L38 23 Z" fill={color} />
        <path d="M11 11 L16 16 L14 18 L9 13 Z" fill={color} />
        <path d="M39 39 L34 34 L36 32 L41 37 Z" fill={color} />
        <path d="M39 11 L34 16 L32 14 L37 9 Z" fill={color} />
        <path d="M11 39 L16 34 L18 36 L13 41 Z" fill={color} />
      </g>
    ),
    lightning: (
      <g transform="translate(-25, -25)">
        <path d="M20 5 L30 20 L25 20 L35 45 L25 30 L30 30 Z" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M22 7 L28 18 L26 18 L32 40 L27 28 L29 28 Z" fill="#fbbf24" />
      </g>
    ),
    flame: (
      <g transform="translate(-25, -25)">
        <path
          d="M25 45 Q20 40, 18 30 Q16 20, 20 15 Q18 10, 22 8 Q20 5, 25 5 Q30 5, 28 8 Q32 10, 30 15 Q34 20, 32 30 Q30 40, 25 45"
          fill={color}
          stroke="#000"
          strokeWidth="2"
        />
        <path
          d="M25 40 Q22 35, 21 28 Q20 22, 23 18 Q22 15, 25 10 Q28 15, 27 18 Q30 22, 29 28 Q28 35, 25 40"
          fill="#fbbf24"
        />
        <path d="M25 35 Q24 32, 24 28 Q24 25, 25 22 Q26 25, 26 28 Q26 32, 25 35" fill="#dc2626" />
      </g>
    ),
    heart: (
      <g transform="translate(-25, -25)">
        <path
          d="M25 15 C25 10, 20 5, 15 5 C10 5, 5 10, 5 15 C5 20, 25 35, 25 45 C25 35, 45 20, 45 15 C45 10, 40 5, 35 5 C30 5, 25 10, 25 15 Z"
          fill={color}
          stroke="#000"
          strokeWidth="2"
        />
        <path
          d="M25 18 C25 14, 22 10, 18 10 C14 10, 10 14, 10 18 C10 22, 25 32, 25 40 C25 32, 40 22, 40 18 C40 14, 36 10, 32 10 C28 10, 25 14, 25 18 Z"
          fill="#fbbf24"
        />
      </g>
    ),
    diamond: (
      <g transform="translate(-25, -25)">
        <path d="M25 5 L40 20 L25 45 L10 20 Z" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M25 5 L35 18 L25 35 L15 18 Z" fill="#fbbf24" />
        <path d="M25 5 L30 15 L25 25 L20 15 Z" fill="#e5e7eb" />
        <circle cx="25" cy="15" r="2" fill="#dc2626" />
      </g>
    ),

    // Naturaleza
    tree: (
      <g transform="translate(-25, -25)">
        <rect x="23" y="35" width="4" height="10" fill="#8b4513" stroke="#000" strokeWidth="1" />
        <circle cx="25" cy="30" r="8" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="20" cy="25" r="6" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="30" cy="25" r="6" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="25" cy="20" r="7" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="22" cy="32" r="2" fill="#dc2626" />
        <circle cx="28" cy="28" r="2" fill="#dc2626" />
      </g>
    ),
    flower: (
      <g transform="translate(-25, -25)">
        <circle cx="25" cy="25" r="4" fill="#fbbf24" stroke="#000" strokeWidth="1" />
        <ellipse cx="25" cy="15" rx="3" ry="6" fill={color} stroke="#000" strokeWidth="2" />
        <ellipse cx="15" cy="25" rx="6" ry="3" fill={color} stroke="#000" strokeWidth="2" />
        <ellipse cx="35" cy="25" rx="6" ry="3" fill={color} stroke="#000" strokeWidth="2" />
        <ellipse cx="25" cy="35" rx="3" ry="6" fill={color} stroke="#000" strokeWidth="2" />
        <ellipse
          cx="18"
          cy="18"
          rx="4"
          ry="2"
          fill={color}
          stroke="#000"
          strokeWidth="2"
          transform="rotate(-45 18 18)"
        />
        <ellipse
          cx="32"
          cy="18"
          rx="4"
          ry="2"
          fill={color}
          stroke="#000"
          strokeWidth="2"
          transform="rotate(45 32 18)"
        />
        <ellipse
          cx="32"
          cy="32"
          rx="4"
          ry="2"
          fill={color}
          stroke="#000"
          strokeWidth="2"
          transform="rotate(-45 32 32)"
        />
        <ellipse
          cx="18"
          cy="32"
          rx="4"
          ry="2"
          fill={color}
          stroke="#000"
          strokeWidth="2"
          transform="rotate(45 18 32)"
        />
        <rect x="24" y="40" width="2" height="8" fill="#059669" stroke="#000" strokeWidth="1" />
      </g>
    ),
    leaf: (
      <g transform="translate(-25, -25)">
        <path d="M25 5 Q35 15, 30 30 Q25 35, 20 30 Q15 15, 25 5" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M25 5 Q30 12, 28 25 Q25 30, 22 25 Q20 12, 25 5" fill="#fbbf24" />
        <path d="M25 8 Q25 15, 25 25" stroke="#059669" strokeWidth="2" />
        <path d="M25 12 Q28 15, 26 20" stroke="#059669" strokeWidth="1" />
        <path d="M25 16 Q22 18, 24 22" stroke="#059669" strokeWidth="1" />
      </g>
    ),
    mountain: (
      <g transform="translate(-25, -25)">
        <path d="M5 40 L20 10 L30 20 L45 5 L50 40 Z" fill={color} stroke="#000" strokeWidth="2" />
        <path d="M5 40 L18 15 L25 25 L40 8 L50 40 Z" fill="#e5e7eb" />
        <path d="M35 12 L40 8 L45 12 L42 15 Z" fill="#ffffff" />
        <path d="M15 18 L20 10 L25 18 L22 22 Z" fill="#ffffff" />
      </g>
    ),
    wave: (
      <g transform="translate(-25, -25)">
        <path d="M5 30 Q15 20, 25 30 Q35 40, 45 30" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <path
          d="M5 25 Q15 15, 25 25 Q35 35, 45 25"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M5 35 Q15 25, 25 35 Q35 45, 45 35" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <circle cx="12" cy="22" r="2" fill="#ffffff" opacity="0.7" />
        <circle cx="25" cy="32" r="1.5" fill="#ffffff" opacity="0.7" />
        <circle cx="38" cy="27" r="2" fill="#ffffff" opacity="0.7" />
      </g>
    ),
    rose: (
      <g transform="translate(-25, -25)">
        <circle cx="25" cy="20" r="8" fill={color} stroke="#000" strokeWidth="2" />
        <circle cx="25" cy="20" r="5" fill="#fbbf24" />
        <circle cx="25" cy="20" r="3" fill="#dc2626" />
        <path d="M20 15 Q15 10, 18 8 Q22 12, 20 15" fill={color} />
        <path d="M30 15 Q35 10, 32 8 Q28 12, 30 15" fill={color} />
        <path d="M20 25 Q15 30, 18 32 Q22 28, 20 25" fill={color} />
        <path d="M30 25 Q35 30, 32 32 Q28 28, 30 25" fill={color} />
        <rect x="24" y="28" width="2" height="15" fill="#059669" stroke="#000" strokeWidth="1" />
        <path d="M22 35 Q20 33, 22 31" fill="#059669" />
        <path d="M28 38 Q30 36, 28 34" fill="#059669" />
      </g>
    ),

    // Texto
    text: (
      <g transform="translate(-25, -25)">
        <rect x="5" y="15" width="40" height="20" fill={color} stroke="#000" strokeWidth="2" rx="3" />
        <text x="25" y="28" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">
          {customText || "TEXTO"}
        </text>
      </g>
    ),
    banner: (
      <g transform="translate(-25, -25)">
        <path d="M5 15 L40 15 L45 25 L40 35 L5 35 Z" fill={color} stroke="#000" strokeWidth="2" />
        <text x="22" y="28" textAnchor="middle" fill="#000" fontSize="7" fontWeight="bold">
          {customText || "BANNER"}
        </text>
        <circle cx="8" cy="18" r="1" fill="#fbbf24" />
        <circle cx="8" cy="32" r="1" fill="#fbbf24" />
      </g>
    ),
    scroll: (
      <g transform="translate(-25, -25)">
        <rect x="8" y="10" width="34" height="30" fill={color} stroke="#000" strokeWidth="2" rx="2" />
        <circle cx="8" cy="25" r="3" fill="#8b4513" stroke="#000" strokeWidth="1" />
        <circle cx="42" cy="25" r="3" fill="#8b4513" stroke="#000" strokeWidth="1" />
        <text x="25" y="22" textAnchor="middle" fill="#000" fontSize="6" fontWeight="bold">
          {customText || "SCROLL"}
        </text>
        <text x="25" y="30" textAnchor="middle" fill="#000" fontSize="6" fontWeight="bold">
          TEXT
        </text>
        <path d="M12 15 L38 15" stroke="#8b4513" strokeWidth="0.5" />
        <path d="M12 35 L38 35" stroke="#8b4513" strokeWidth="0.5" />
      </g>
    ),
  }

  return (
    elements[type as keyof typeof elements] || (
      <g transform="translate(-25, -25)">
        <circle cx="25" cy="25" r="15" fill={color} stroke="#000" strokeWidth="2" />
        <text x="25" y="30" textAnchor="middle" fill="#000" fontSize="8">
          ?
        </text>
      </g>
    )
  )
}