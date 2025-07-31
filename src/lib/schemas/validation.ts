import { z } from 'zod';

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
// SCHEMAS BASE DE MODELOS (La base para nuestros formularios)
// ============================================================================

export const UserSchema = z.object({
  role: UserRoleSchema,
  auth_provider: AuthProviderSchema,
  id: z.string().uuid(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  username: z.string().nullable(),
  phone_number: z.string().nullable(),
  email: z.string().email('Email inválido').nullable(),
  email_verified: z.boolean().nullable(),
  password_hash: z.string().nullable(),
  profile_picture_url: z.string().url('URL inválida').nullable(),
  created_at: z.coerce.date(),
  is_active: z.boolean(),
  is_private: z.boolean(),
});

export const VenueSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  alias: z.string().nullable(),
  address: z.string().nullable(),
  profile_picture_url: z.string().url('URL inválida').nullable(),
  created_at: z.coerce.date(),
  is_active: z.boolean(),
});

export const TeamSchema = z.object({
  id: z.bigint(),
  team_name: z.string(),
  alias: z.string().nullable(),
  alias_normalized: z.string().nullable(),
  crest: z.any().nullable(), // Simplificado para el frontend
  elo_rating: z.number().int(),
  created_by_user_id: z.string().nullable(),
  deleted_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
});

export const MatchSchema = z.object({
  status: MatchStatusSchema,
  id: z.bigint(),
  team_a_id: z.bigint(),
  team_b_id: z.bigint().nullable(),
  score_team_a: z.number().int().nullable(),
  score_team_b: z.number().int().nullable(),
  team_a_elo_snapshot: z.number().int().nullable(),
  team_b_elo_snapshot: z.number().int().nullable(),
  team_a_elo_diff: z.number().int().nullable(),
  team_b_elo_diff: z.number().int().nullable(),
  venue_id: z.string().nullable(),
  ground_type_id: z.bigint().nullable(),
  scheduled_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  match_postponed_id: z.bigint().nullable(),
});


// ============================================================================
// === SCHEMAS PARA FORMULARIOS (LOS QUE REALMENTE USARÁS EN EL FRONTEND) ===
// ============================================================================

/**
 * Schema para el formulario de registro de un nuevo usuario.
 */
export const UserRegisterFormSchema = UserSchema.pick({
  email: true,
  first_name: true,
  last_name: true,
  username: true,
}).extend({
  // Sobreescribimos email para que sea obligatorio
  email: z.string().email('Por favor, introduce un email válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"], // Asigna el error al campo de confirmación
});

// Exportamos el tipo inferido para usarlo con React Hook Form
export type UserRegisterFormType = z.infer<typeof UserRegisterFormSchema>;


/**
 * Schema para el formulario de inicio de sesión.
 */
export const UserLoginFormSchema = z.object({
  email: z.string().email('Por favor, introduce un email válido.'),
  password: z.string().nonempty('La contraseña es requerida.'),
});

export type UserLoginFormType = z.infer<typeof UserLoginFormSchema>;


/**
 * Schema para el formulario de creación de un Venue.
 */
export const CreateVenueFormSchema = VenueSchema.pick({
  name: true,
  alias: true,
  address: true,
}).extend({
  // Hacemos el nombre obligatorio
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
});

export type CreateVenueFormType = z.infer<typeof CreateVenueFormSchema>;


/**
 * Schema para el formulario de creación de un equipo.
 */
export const CreateTeamFormSchema = TeamSchema.pick({
  team_name: true,
  alias: true,
}).extend({
  team_name: z.string().min(3, 'El nombre del equipo es muy corto.'),
});

export type CreateTeamFormType = z.infer<typeof CreateTeamFormSchema>;


/**
 * Schema para reportar el resultado de un partido.
 */
export const ReportMatchScoreFormSchema = MatchSchema.pick({
  score_team_a: true,
  score_team_b: true,
}).extend({
  score_team_a: z.coerce.number().int().min(0, 'El resultado no puede ser negativo.'),
  score_team_b: z.coerce.number().int().min(0, 'El resultado no puede ser negativo.'),
});

export type ReportMatchScoreFormType = z.infer<typeof ReportMatchScoreFormSchema>;