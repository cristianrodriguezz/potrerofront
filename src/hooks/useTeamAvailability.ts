import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { validateTeamAvailability } from '@/services/teamService';
import { CreateTeamFormSchema } from '@/lib/schemas/validation';

/**
 * Hook para validar la disponibilidad de 'team_name' y 'alias' de forma asíncrona e independiente.
 * @param teamName El valor actual del nombre del equipo.
 * @param alias El valor actual del alias.
 * @returns Estados de carga y disponibilidad para cada campo.
 */
export function useTeamAvailability(teamName: string, alias: string) {
  const [isTeamNameLoading, setIsTeamNameLoading] = useState(false);
  const [isTeamNameAvailable, setIsTeamNameAvailable] = useState(true);
  const [teamNameError, setTeamNameError] = useState('');

  const [isAliasLoading, setIsAliasLoading] = useState(false);
  const [isAliasAvailable, setIsAliasAvailable] = useState(true);
  const [aliasError, setAliasError] = useState('');

  const debouncedTeamName = useDebounce(teamName, 800);
  const debouncedAlias = useDebounce(alias, 800);

  useEffect(() => {
    const isLongEnough = CreateTeamFormSchema.shape.team_name.safeParse(teamName).success;
    
    // Si el texto es suficientemente largo, ponemos el estado en "cargando" INMEDIATAMENTE.
    // Esto evita el parpadeo del estado "disponible".
    if (isLongEnough) {
      setIsTeamNameLoading(true);
      setTeamNameError('');
    } else {
      // Si el texto es muy corto, reseteamos todo.
      setIsTeamNameLoading(false);
      setIsTeamNameAvailable(true);
      setTeamNameError('');
    }
  }, [teamName]); // Se ejecuta con el valor en tiempo real

  // 2. Este useEffect se ejecuta solo DESPUÉS de la pausa (debounce).
  useEffect(() => {
    const checkTeamName = async () => {
      const isLongEnough = CreateTeamFormSchema.shape.team_name.safeParse(debouncedTeamName).success;

      if (!isLongEnough) {
        return; // No hacemos nada si, tras la pausa, el texto es corto.
      }

      // Ahora hacemos la llamada a la API.
      try {
        const result = await validateTeamAvailability(debouncedTeamName, '');
        setIsTeamNameAvailable(result.teamNameAvailable);
        if (!result.teamNameAvailable) {
          setTeamNameError('Este nombre de equipo ya está en uso.');
        }
      } catch(error) {
        console.error('Error checking team name availability:', error);
        setTeamNameError('No se pudo verificar la disponibilidad.');
      } finally {
        // Cuando la API responde, quitamos el estado de carga.
        setIsTeamNameLoading(false);
      }
    };

    checkTeamName();
  }, [debouncedTeamName]); // Se ejecuta con el valor "retrasado"

  // --- LÓGICA PARA EL ALIAS (sigue el mismo patrón) ---

  useEffect(() => {
    const isLongEnough = CreateTeamFormSchema.shape.alias.safeParse(alias).success;
    if (isLongEnough) {
      setIsAliasLoading(true);
      setAliasError('');
    } else {
      setIsAliasLoading(false);
      setIsAliasAvailable(true);
      setAliasError('');
    }
  }, [alias]);

  useEffect(() => {
    const checkAlias = async () => {
      const isLongEnough = CreateTeamFormSchema.shape.alias.safeParse(debouncedAlias).success;
      if (!isLongEnough) {
        return;
      }
      try {
        const result = await validateTeamAvailability('', debouncedAlias);
        setIsAliasAvailable(result.teamAliasAvailable);
        if (!result.teamAliasAvailable) {
          setAliasError('Este alias ya está en uso.');
        }
      } catch (error) {
        console.error('Error checking alias availability:', error);
        setAliasError('No se pudo verificar la disponibilidad.');
      } finally {
        setIsAliasLoading(false);
      }
    };

    checkAlias();
  }, [debouncedAlias]);

  return {
    isTeamNameLoading,
    isTeamNameAvailable,
    teamNameError,
    isAliasLoading,
    isAliasAvailable,
    aliasError,
  };
}
