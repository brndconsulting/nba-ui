/**
 * Hook para consumir contexto desde API /v1/context
 * - Obtiene ligas/equipos del owner
 * - Maneja selección activa
 * - Valida con Zod
 */
import { useEffect, useState } from 'react';
import { contextSchema } from '@/lib/schemas/context';
import { API_BASE, API_ENDPOINTS } from '@/config/api';

export interface League {
  league_key: string;
  league_id: string;
  name: string;
  season: number;
  game_key: string;
  scoring_type: string;
  teams: Team[];
}

export interface Team {
  team_key: string;
  team_id: string;
  name: string;
  manager_id?: string;
  manager_name?: string;
}

export interface Context {
  owner_id: string;
  leagues: League[];
  active_league_key?: string;
  active_team_key?: string;
}

export function useContext(ownerId: string) {
  const [context, setContext] = useState<Context | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/v1/context?owner_id=${ownerId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        // Validar con Zod
        const validated = contextSchema.parse(data);

        if (validated.success && validated.data) {
          setContext(validated.data);
          setError(null);
        } else if (validated.success && !validated.data) {
          // No hay contexto (missing)
          setContext(null);
          setError(null);
        } else {
          setError('Error validando contexto');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setContext(null);
      } finally {
        setLoading(false);
      }
    };

    if (ownerId) {
      fetchContext();
    }
  }, [ownerId]);

  const setActiveContext = async (
    leagueKey: string,
    teamKey?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_BASE}/v1/context/active?owner_id=${ownerId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            league_key: leagueKey,
            team_key: teamKey,
          }),
        }
      );

      if (response.ok) {
        // Refetch context
        const contextResponse = await fetch(
          `${API_BASE}/v1/context?owner_id=${ownerId}`
        );
        const data = await contextResponse.json();
        const validated = contextSchema.parse(data);
        if (validated.success && validated.data) {
          setContext(validated.data);
        }
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      return false;
    }
  };

  return {
    context,
    loading,
    error,
    setActiveContext,
  };
}
