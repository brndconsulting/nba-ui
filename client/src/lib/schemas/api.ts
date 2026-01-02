/**
 * API Response Schemas (Zod)
 * Based on actual backend response structures
 * 
 * Design Rule: All nullable fields use .nullable() to handle null from API
 */
import { z } from "zod";

// ===== Common Envelope =====

export const MetaSchema = z.object({
  owner_id: z.string(),
  snapshot_date: z.string(),
  from_cache: z.boolean(),
  last_sync_at: z.string(),
});

export const CapabilitiesSchema = z.object({
  has_context: z.boolean().optional().default(false),
  has_settings: z.boolean().optional().default(false),
  has_matchups: z.boolean().optional().default(false),
  has_waivers: z.boolean().optional().default(false),
  has_analytics: z.boolean().optional().default(false),
  has_roster: z.boolean().optional().default(false),
  has_standings: z.boolean().optional().default(false),
  has_schedule: z.boolean().optional().default(false),
  has_team_stats: z.boolean().optional().default(false),
  has_player_pool: z.boolean().optional().default(false),
  has_manager_profiles: z.boolean().optional().default(false),
  has_sync_status: z.boolean().optional().default(false),
});

export const ErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
});

// Base envelope that all responses follow
export const BaseEnvelopeSchema = z.object({
  success: z.boolean(),
  meta: MetaSchema,
  capabilities: CapabilitiesSchema,
  errors: z.array(ErrorSchema).nullable().transform(v => v ?? []),
});

// ===== Context Schemas =====

export const TeamSchema = z.object({
  team_key: z.string(),
  team_id: z.string(),
  name: z.string(),
  manager_id: z.string().nullable().optional(),
  manager_name: z.string().nullable().optional(),
});

export const LeagueSchema = z.object({
  league_key: z.string(),
  league_id: z.string(),
  name: z.string(),
  season: z.string(),
  game_key: z.string(),
  scoring_type: z.string().nullable().optional(),
  teams: z.array(TeamSchema).default([]),
});

export const ContextDataSchema = z.object({
  owner_id: z.string(),
  leagues: z.array(LeagueSchema).default([]),
  active_league_key: z.string().nullable(),
  active_team_key: z.string().nullable(),
});

export const ContextResponseSchema = BaseEnvelopeSchema.extend({
  data: ContextDataSchema,
});

// ===== Sync Status Schemas =====

export const SyncDomainStatusSchema = z.object({
  status: z.enum(["fresh", "stale", "missing"]),
  last_sync_at: z.string().nullable(),
  message: z.string(),
  display_name: z.string().optional(),
  description: z.string().optional(),
});

export const SyncStatusDataSchema = z.object({
  sync_status: z.record(z.string(), SyncDomainStatusSchema),
  overall_status: z.enum(["fresh", "stale", "incomplete"]),
  league_key: z.string().nullable(),
  owner_id: z.string(),
  domains_count: z.number().optional(),
});

export const SyncStatusResponseSchema = BaseEnvelopeSchema.extend({
  data: SyncStatusDataSchema,
});

// ===== Set Active Context Schemas =====

export const SetActiveContextDataSchema = z.object({
  owner_id: z.string(),
  leagues: z.array(LeagueSchema).default([]),
  active_league_key: z.string().nullable(),
  active_team_key: z.string().nullable(),
});

export const SetActiveContextResponseSchema = BaseEnvelopeSchema.extend({
  data: SetActiveContextDataSchema,
});

// ===== Type Exports =====

export type Meta = z.infer<typeof MetaSchema>;
export type Capabilities = z.infer<typeof CapabilitiesSchema>;
export type ApiError = z.infer<typeof ErrorSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type League = z.infer<typeof LeagueSchema>;
export type ContextData = z.infer<typeof ContextDataSchema>;
export type ContextResponse = z.infer<typeof ContextResponseSchema>;
export type SyncDomainStatus = z.infer<typeof SyncDomainStatusSchema>;
export type SyncStatusData = z.infer<typeof SyncStatusDataSchema>;
export type SyncStatusResponse = z.infer<typeof SyncStatusResponseSchema>;
export type SetActiveContextResponse = z.infer<typeof SetActiveContextResponseSchema>;

// ===== UI State Types =====

export type DataState = "loading" | "empty" | "missing" | "stale" | "error" | "ready";

export interface UIState<T> {
  state: DataState;
  data: T | null;
  error: string | null;
  lastSyncAt: string | null;
  reason: string | null;
}
