/**
 * ContextProvider - proporciona contexto del usuario a toda la app
 * Lee /v1/context desde API
 * Maneja selección activa de liga/equipo
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useContext as useContextHook } from '@/hooks/useContext';
import type { Context, League, Team } from '@/hooks/useContext';

interface ContextContextType {
  ownerId: string | null;
  context: Context | null;
  loading: boolean;
  error: string | null;
  activeLeague: League | null;
  activeTeam: Team | null;
  setActiveContext: (_leagueKey: string, _teamKey?: string) => Promise<boolean>;
}

const ContextContext = createContext<ContextContextType | undefined>(undefined);

export function ContextProvider({
  children,
  ownerId,
}: {
  children: React.ReactNode;
  ownerId: string;
}) {
  const { context, loading, error, setActiveContext } = useContextHook(ownerId);
  const [activeLeague, setActiveLeague] = useState<League | null>(null);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

  // Actualizar liga/equipo activos cuando cambia el contexto
  useEffect(() => {
    if (context) {
      const league = context.leagues.find(
        (l) => l.league_key === context.active_league_key
      );
      setActiveLeague(league || null);

      if (league && context.active_team_key) {
        const team = league.teams.find((t) => t.team_key === context.active_team_key);
        setActiveTeam(team || null);
      } else {
        setActiveTeam(null);
      }
    } else {
      setActiveLeague(null);
      setActiveTeam(null);
    }
  }, [context]);

  const value: ContextContextType = {
    ownerId,
    context,
    loading,
    error,
    activeLeague,
    activeTeam,
    setActiveContext,
  };

  return (
    <ContextContext.Provider value={value}>{children}</ContextContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(ContextContext);
  if (!context) {
    throw new Error('useAppContext must be used within ContextProvider');
  }
  return context;
}
