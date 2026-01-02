/**
 * Hook para consumir contexto desde API /v1/context
 * - Obtiene ligas/equipos del owner
 * - Maneja selección activa
 * - Valida con Zod
 */
import { useEffect, useState } from 'react';
import { contextSchema } from '@/lib/schemas/context';
import { API_BASE } from '@/config/api';

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
  active_league_key?: string | null;
  active_team_key?: string | null;
}

export function useContext(ownerId: string | null) {
  const [context, setContext] = useState<Context | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContext = async () => {
      console.log('[useContext] Starting fetch, ownerId:', ownerId);
      
      // If no owner ID, show "no owner" state
      if (!ownerId) {
        console.log('[useContext] No owner ID, setting error');
        setContext(null);
        setError("No owner ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('[useContext] Fetching from:', `${API_BASE}/v1/context?owner_id=${ownerId}`);
        const response = await fetch(
          `${API_BASE}/v1/context?owner_id=${ownerId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('[useContext] Response status:', response.status);

        const data = await response.json();
        console.log('[useContext] Raw data:', data);

        // Validar con Zod
        console.log('[useContext] Validating with Zod...');
        const validated = contextSchema.parse(data);
        console.log('[useContext] Validated:', validated);

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

    fetchContext();
  }, [ownerId]);

  const setActiveContext = async (leagueKey: string, teamKey?: string): Promise<boolean> => {
    if (!ownerId) {
      setError("No owner ID set");
      return false;
    }

    try {
      // IMPORTANT: Use query params, NOT JSON body (confirmed working approach)
      const params = new URLSearchParams();
      params.set('owner_id', ownerId);
      params.set('league_key', leagueKey);
      if (teamKey) params.set('team_key', teamKey);
      
      const response = await fetch(
        `${API_BASE}/v1/context/active?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
