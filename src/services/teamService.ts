import { fetchWithAuth } from "@/lib/apiClient";
import { TeamAvailabilityParams } from "@/lib/types";

// La interfaz ahora es mucho más simple
export interface ValidationResponse {
  teamNameAvailable: boolean;
  teamAliasAvailable: boolean;
}

/**
 * Llama al endpoint de disponibilidad del backend.
 * @param teamName - El nombre del equipo a validar.
 * @param alias - El alias a validar.
 * @returns Una promesa que resuelve con los resultados de la validación.
 */
export const validateTeamAvailability = async (
  teamName: string,
  alias: string
): Promise<ValidationResponse> => {
  const queryParams = new URLSearchParams();
  // Solo añadimos los parámetros si tienen contenido
  if (teamName) {
    const key: keyof TeamAvailabilityParams = 'team_name';
    queryParams.set(key, teamName);
  }
  if (alias) {
    const key: keyof TeamAvailabilityParams = 'alias';
    queryParams.set(key, alias);
  }
  // Si no hay nada que validar, no hacemos la llamada
  if (queryParams.toString() === '') {
    return { teamNameAvailable: true, teamAliasAvailable: true };
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  const response = await fetchWithAuth(`${API_BASE_URL}/team/validate-available?${queryParams}`);
  const data = await response.json();


  if (!response.ok) {
    console.error('Error al validar la disponibilidad. Status:', response.status);
    return { teamNameAvailable: false, teamAliasAvailable: false };
  }

  // Devolvemos la data que ya leímos.
  return data;
};
