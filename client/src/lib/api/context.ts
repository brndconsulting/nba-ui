/**
 * Context API Service
 * 
 * Rule: setActiveContext ALWAYS uses query params (not JSON body)
 * This is the confirmed working approach from smoke tests.
 */
import { 
  ContextResponseSchema, 
  SyncStatusResponseSchema,
  SetActiveContextResponseSchema,
  type ContextResponse,
  type SyncStatusResponse,
  type SetActiveContextResponse
} from "../schemas/api";

const API_BASE = "/api/v1";

/**
 * Fetch user context (leagues, teams, active selections)
 */
export async function fetchContext(ownerId: string): Promise<ContextResponse> {
  const url = `${API_BASE}/context?owner_id=${encodeURIComponent(ownerId)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch context: ${response.status}`);
  }
  
  const data = await response.json();
  return ContextResponseSchema.parse(data);
}

/**
 * Set active league and team for user
 * 
 * IMPORTANT: Uses query params, NOT JSON body
 * This is the confirmed working approach.
 */
export async function setActiveContext(
  ownerId: string,
  leagueKey: string | null,
  teamKey: string | null
): Promise<SetActiveContextResponse> {
  const params = new URLSearchParams();
  params.set("owner_id", ownerId);
  if (leagueKey) params.set("league_key", leagueKey);
  if (teamKey) params.set("team_key", teamKey);
  
  const url = `${API_BASE}/context/active?${params.toString()}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to set active context: ${response.status}`);
  }
  
  const data = await response.json();
  return SetActiveContextResponseSchema.parse(data);
}

/**
 * Fetch sync status for all domains
 */
export async function fetchSyncStatus(
  ownerId: string,
  leagueKey?: string
): Promise<SyncStatusResponse> {
  const params = new URLSearchParams();
  params.set("owner_id", ownerId);
  if (leagueKey) params.set("league_key", leagueKey);
  
  const url = `${API_BASE}/sync-status?${params.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sync status: ${response.status}`);
  }
  
  const data = await response.json();
  return SyncStatusResponseSchema.parse(data);
}

/**
 * Helper to determine UI state from API response
 */
export function getUIStateFromResponse<T>(
  response: { success: boolean; data: T; errors: Array<{ message: string }> | null; meta: { last_sync_at: string } },
  isEmpty: (data: T) => boolean
): { state: "ready" | "empty" | "error"; data: T | null; error: string | null; lastSyncAt: string } {
  if (!response.success) {
    return {
      state: "error",
      data: null,
      error: response.errors?.[0]?.message || "Unknown error",
      lastSyncAt: response.meta.last_sync_at,
    };
  }
  
  if (isEmpty(response.data)) {
    return {
      state: "empty",
      data: null,
      error: null,
      lastSyncAt: response.meta.last_sync_at,
    };
  }
  
  return {
    state: "ready",
    data: response.data,
    error: null,
    lastSyncAt: response.meta.last_sync_at,
  };
}
