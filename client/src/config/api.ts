/**
 * Configuración centralizada de API
 * 
 * En dev: usa /api (proxy de Vite al backend)
 * En prod: usa URL pública del backend
 */

export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

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
