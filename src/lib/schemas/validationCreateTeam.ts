import { z } from 'zod';
// 1. Importamos los nombres de las formas desde el archivo auto-generado
import { shapeNames } from './shape-registry.generated';

// ============================================================================
// ENUMS (Útiles para <select> en la UI y validación)
// ============================================================================

export const AuthProviderSchema = z.enum(['local','supabase']);
export const UserRoleSchema = z.enum(['team_member','venue_staff','super_admin']);
export const TeamRoleSchema = z.enum(['admin','captain','player']);
export const VenueRoleSchema = z.enum(['owner','manager','staff']);
export const InvitationStatusSchema = z.enum(['pending','accepted','declined']);
export const MatchStatusSchema = z.enum(['draft','published','confirmed','scheduled','in_progress','pending_score','disputed_result','completed','cancelled']);

// ============================================================================
// SCHEMAS PARA PASOS INDIVIDUALES
// ============================================================================

export const CreateTeamStep1Schema = z.object({
  team_name: z.string().min(3, 'El nombre del equipo es muy corto.'),
  alias: z.string().min(2, 'El alias es requerido (ej: LHAL).'),
});

export const CreateTeamStep2Schema = z.object({
  crest: z.object({
    // 2. Usamos el array de nombres generado para crear el enum dinámicamente
    shape: z.enum(shapeNames),
    backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Debe ser un color hexadecimal válido."),
    icon: z.string(),
    iconColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Debe ser un color hexadecimal válido."),
    positionIcon: z.object({
      x: z.number().min(-50).max(50).default(0),
      y: z.number().min(-50).max(50).default(0),
    }),
    pattern: z.object({
      type: z.enum(['none', 'stripes', 'sash', 'half', 'gradient', 'checkered']),
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Debe ser un color hexadecimal válido."),
    }),
  }),
});

// ============================================================================
// SCHEMA UNIFICADO PARA TODO EL FORMULARIO
// ============================================================================

// Combinamos los schemas de todos los pasos en uno solo.
export const FullCreateTeamSchema = CreateTeamStep1Schema.merge(CreateTeamStep2Schema);

// Exportamos el tipo inferido de todo el formulario. Este será nuestro "source of truth".
export type FullCreateTeamType = z.infer<typeof FullCreateTeamSchema>;

// ============================================================================
// TIPOS EXPORTADOS PARA LOS COMPONENTES
// ============================================================================

export type CreateTeamStep1Type = z.infer<typeof CreateTeamStep1Schema>;
export type CreateTeamStep2Type = z.infer<typeof CreateTeamStep2Schema>;
