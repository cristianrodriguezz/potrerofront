# Ingeniería en Contexto – Proyecto: FUTMOL (Potrero)

## 1. Descripción general del proyecto

**FUTMOL** es una aplicación web diseñada para facilitar la organización de partidos de fútbol amateur en barrios y potreros. Permite a los jugadores, capitanes y administradores de canchas conectarse fácilmente, crear o sumarse a partidos, y mantener un registro de la actividad futbolística informal.

> ⚽ Los partidos se juegan en la **vida real**, en canchas físicas gestionadas por usuarios o centros deportivos registrados en la app.

## 2. Contexto del problema

Actualmente, organizar partidos entre equipos o jugadores amateurs suele ser desordenado y dependiente de grupos de WhatsApp, llamadas o redes sociales. Algunos problemas comunes:
- Dificultad para conseguir rivales en un día y horario específico.
- Cancelaciones por falta de jugadores o problemas de comunicación.
- Poco registro de asistencia, comportamiento o resultados.
- Administración informal de canchas.

FUTMOL busca resolver estos problemas centralizando la información y automatizando el emparejamiento entre jugadores, equipos y canchas disponibles.

## 3. Usuarios del sistema

- **Jugadores individuales**: se registran para unirse a partidos sueltos o reforzar equipos.
- **Capitanes de equipo**: crean y gestionan su equipo, desafían a otros y organizan partidos.
- **Administradores de canchas**: publican horarios, precios y disponibilidad.
- **Organizadores y comunidad**: modera la plataforma, propone rankings y torneos.

## 4. Objetivos de la solución

- Facilitar el “matcheo” entre equipos disponibles para jugar.
- Permitir que jugadores individuales se unan a partidos con cupo libre.
- Agilizar la gestión de canchas con horarios y pagos en línea.
- Registrar resultados, asistencia, comportamiento y rendimiento.
- Fomentar la comunidad futbolera amateur de forma digital.

## 5. Tecnologías propuestas

- **Frontend**: Next.js 15 + Tailwind CSS + shadcn/ui.
- **Backend**: Supabase (PostgreSQL) o API externa.
- **Autenticación**: Supabase Auth con UUID.
- **Gestión de datos**:
  - SWR para peticiones desde el cliente.
  - `async/await` para llamadas desde el servidor.
- **Despliegue**: Vercel (frontend) + Supabase Cloud.

## 6. Estructura de carpetas sugerida

```
/app
  /api
    /auth             # Rutas de login, register, etc.
    /match            # Lógica de partidos (crear, listar, aceptar)
    /team             # Gestión de equipos (crear, invitar, stats)
    /venue            # Gestión de canchas (crear, disponibilidad)
  /(routes)
    /home             # Landing o pantalla principal
    /auth             # Páginas públicas: login, register, forgot
    /dashboard        # Panel general post-login
    /match            # Lista de partidos, detalle y unirse
    /team             # Página de equipos
    /venue            # Página para ver canchas y reservar
    /profile          # Perfil del usuario
/components
  /ui                 # Componentes genéricos (Button, Card, Modal)
  /match              # Componentes propios de partidos
  /team               # Componentes propios de equipos
  /venue              # Componentes propios de canchas
  /layout             # Layouts reutilizables

/lib
  auth.ts             # Helpers de autenticación
  db.ts               # Conexión a base de datos o Supabase
  match.ts            # Funciones auxiliares para partidos
  team.ts             # Funciones auxiliares para equipos

/constants
  roles.ts            # Tipos de roles
  status.ts           # Estados de partidos, equipos, canchas
  config.ts           # Configuración general del sistema

/hooks
  useUser.ts
  useTeam.ts
  useMatch.ts
  useVenue.ts

/types
  user.d.ts
  match.d.ts
  team.d.ts
  venue.d.ts

/middleware.ts        # Middleware global (auth, logging, etc.)
/public               # Imágenes, íconos, logos
/styles
  globals.css
  tailwind.config.ts

```

## 7. Impacto esperado

- Reducción de la fricción al organizar partidos.
- Aumento en la participación y frecuencia de encuentros.
- Visibilización y digitalización de las canchas barriales.
- Posible expansión a rankings zonales, torneos y comunidad más competitiva.

## 8. Limitaciones y consideraciones

- Requiere masa crítica de usuarios activos para funcionar de forma óptima.
- Necesita mecanismos de moderación ante conflictos o faltas.
- Puede haber desafíos con geolocalización, pagos o cobertura de zonas rurales.

---

> *Inspirado por la pasión barrial y el deseo de hacer más fácil y justo el potrero digital.*
