/**
 * Hook para consumir matchups desde API /v1/matchups/current
 * - Obtiene matchups cacheados
 * - Valida con Zod
 * - Maneja estados (loading, error, stale)
 */
import { useEffect, useState } from 'react';
import { matchupEnvelopeSchema, capabilitiesEnvelopeSchema } from '@/lib/schemas/matchups';
import { API_BASE } from '@/config/api';
import type { MatchupData, Capabilities } from '@/lib/schemas/matchups';

export function useMatchups(leagueKey: string, teamKey?: string, ownerId?: string) {
  const [matchup, setMatchup] = useState<MatchupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);

  useEffect(() => {
    const fetchMatchups = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          league_key: leagueKey,
          ...(teamKey && { team_key: teamKey }),
          ...(ownerId && { owner_id: ownerId }),
        });

        const response = await fetch(
          `${API_BASE}/v1/matchups/current?${params}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        // Validar con Zod
        const validated = matchupEnvelopeSchema.parse(data);

        if (validated.success && validated.data) {
          setMatchup(validated.data);
          setLastSyncAt(new Date(validated.meta.timestamp));
          setError(null);
        } else if (validated.success && !validated.data) {
          // No hay matchup
          setMatchup(null);
          setError(null);
        } else {
          setError('Error validando matchups');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setMatchup(null);
      } finally {
        setLoading(false);
      }
    };

    if (leagueKey) {
      fetchMatchups();
    }
  }, [leagueKey, teamKey, ownerId]);

  return {
    matchup,
    loading,
    error,
    lastSyncAt,
  };
}

export function useCapabilities(leagueKey: string, ownerId?: string) {
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCapabilities = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          league_key: leagueKey,
          ...(ownerId && { owner_id: ownerId }),
        });

        const response = await fetch(
          `${API_BASE}/v1/capabilities?${params}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        // Validar con Zod
        const validated = capabilitiesEnvelopeSchema.parse(data);

        if (validated.success && validated.data) {
          setCapabilities(validated.data);
          setError(null);
        } else {
          setError('Error validando capabilities');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setCapabilities(null);
      } finally {
        setLoading(false);
      }
    };

    if (leagueKey) {
      fetchCapabilities();
    }
  }, [leagueKey, ownerId]);

  return {
    capabilities,
    loading,
    error,
  };
}
