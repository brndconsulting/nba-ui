/**
 * Configuración centralizada de API
 */

export const API_BASE = import.meta.env.VITE_API_BASE || 'https://8000-ijlgepjs4b0mok7qfhfv6-668991c1.sg1.manus.computer';

export const API_ENDPOINTS = {
  // Context
  context: (ownerId: string) => `/v1/context?owner_id=${ownerId}`,
  setActiveContext: (ownerId: string) => `/v1/context/active?owner_id=${ownerId}`,

  // Snapshots
  snapshot: (ownerId: string, leagueKey: string, domain: string, teamKey?: string) =>
    `/v1/snapshots?owner_id=${ownerId}&league_key=${leagueKey}&domain=${domain}${teamKey ? `&team_key=${teamKey}` : ''}`,

  // Sync Status
  syncStatus: (ownerId: string, leagueKey: string, teamKey?: string) =>
    `/v1/sync-status?owner_id=${ownerId}&league_key=${leagueKey}${teamKey ? `&team_key=${teamKey}` : ''}`,
};
