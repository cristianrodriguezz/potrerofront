import { z } from 'zod';
import { shapeNames } from './shape-registry.generated';

// ... (tus otros schemas no cambian)

// NUEVO: Definimos el schema para un único elemento del escudo
const CrestElementSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['icon']),
  name: z.string(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  // CAMBIO: Reemplazamos 'size' por 'scale' para un manejo más flexible
  scale: z.number().min(0.5).max(3).default(1),
  // NUEVO: Añadimos la propiedad de rotación
  rotation: z.number().min(-180).max(180).default(0),
});

/**
 * Schema para el segundo paso del formulario de creación de un equipo (el escudo).
 */
export const CreateTeamStep2Schema = z.object({
  crest: z.object({
    shape: z.enum(shapeNames),
    backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    pattern: z.object({
      type: z.enum(['none', 'stripes', 'sash', 'half', 'gradient', 'checkered']),
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    }),
    // CAMBIO: Ahora tenemos un array de elementos en lugar de un solo ícono
    elements: z.array(CrestElementSchema),
  }),
});

export type CreateTeamStep2Type = z.infer<typeof CreateTeamStep2Schema>;
export type CrestElementType = z.infer<typeof CrestElementSchema>;
