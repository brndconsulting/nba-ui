/**
 * Zod schemas para validación de matchups y capabilities
 */
import { z } from 'zod';

// Matchups

export const statCategorySchema = z.object({
  stat_id: z.string(),
  name: z.string(),
  value: z.number().nullable().optional(),
  display_value: z.string().nullable().optional(),
  result: z.enum(['W', 'L', 'T']).nullable().optional(),
});

export const teamInMatchupSchema = z.object({
  team_key: z.string(),
  name: z.string(),
  logo_url: z.string().nullable().optional(),
  points_total: z.number().nullable().optional(),
  categories: z.array(statCategorySchema),
});

export const matchupDataSchema = z.object({
  league_key: z.string(),
  team_keys: z.array(z.string()),
  week: z.number().nullable().optional(),
  scoring_type: z.string(),
  teams: z.array(teamInMatchupSchema),
  meta: z.object({
    source: z.string(),
    last_sync_at: z.string().datetime(),
    checksum: z.string(),
    is_valid: z.boolean(),
  }),
});

export const matchupEnvelopeSchema = z.object({
  success: z.boolean(),
  data: matchupDataSchema.nullable(),
  errors: z.array(z.any()).default([]),
  meta: z.object({
    owner_id: z.string().nullable().optional(),
    league_key: z.string().nullable().optional(),
    team_key: z.string().nullable().optional(),
    timestamp: z.string().datetime(),
    from_cache: z.boolean(),
  }),
  capabilities: z.any().optional(),
});

// Capabilities

export const statCategoryCapabilitySchema = z.object({
  id: z.string(),
  label: z.string(),
  sort: z.string().nullable().optional(),
  display_format: z.string().nullable().optional(),
});

export const rosterPositionSchema = z.object({
  position: z.string(),
  label: z.string(),
  count: z.number().nullable().optional(),
});

export const capabilitiesDataSchema = z.object({
  has_categories_scoring: z.boolean(),
  has_points_scoring: z.boolean(),
  stat_categories: z.array(statCategoryCapabilitySchema),
  roster_positions: z.array(rosterPositionSchema),
  supports_matchup_weeks: z.boolean(),
  supports_ties: z.boolean(),
  supports_stat_wins: z.boolean(),
  sport: z.string(),
});

export const capabilitiesEnvelopeSchema = z.object({
  success: z.boolean(),
  data: capabilitiesDataSchema.nullable(),
  errors: z.array(z.any()).default([]),
  meta: z.object({
    league_key: z.string().nullable().optional(),
    timestamp: z.string().datetime(),
    from_cache: z.boolean(),
  }),
  capabilities: z.any().optional(),
});

// Type exports
export type StatCategory = z.infer<typeof statCategorySchema>;
export type TeamInMatchup = z.infer<typeof teamInMatchupSchema>;
export type MatchupData = z.infer<typeof matchupDataSchema>;
export type MatchupEnvelope = z.infer<typeof matchupEnvelopeSchema>;

export type StatCategoryCapability = z.infer<typeof statCategoryCapabilitySchema>;
export type RosterPosition = z.infer<typeof rosterPositionSchema>;
export type Capabilities = z.infer<typeof capabilitiesDataSchema>;
export type CapabilitiesEnvelope = z.infer<typeof capabilitiesEnvelopeSchema>;
