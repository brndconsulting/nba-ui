/**
 * Zod schemas para validación de contexto
 */
import { z } from 'zod';

export const teamSchema = z.object({
  team_key: z.string(),
  team_id: z.string(),
  name: z.string(),
  manager_id: z.string().optional(),
  manager_name: z.string().optional(),
});

export const leagueSchema = z.object({
  league_key: z.string(),
  league_id: z.string(),
  name: z.string(),
  season: z.number(),
  game_key: z.string(),
  scoring_type: z.string(),
  teams: z.array(teamSchema),
});

export const contextDataSchema = z.object({
  owner_id: z.string(),
  leagues: z.array(leagueSchema),
  active_league_key: z.string().optional(),
  active_team_key: z.string().optional(),
});

export const contextSchema = z.object({
  success: z.boolean(),
  data: contextDataSchema.nullable(),
  errors: z.array(z.any()).default([]),
  meta: z.any(),
  capabilities: z.any().optional(),
});

export type Team = z.infer<typeof teamSchema>;
export type League = z.infer<typeof leagueSchema>;
export type Context = z.infer<typeof contextDataSchema>;
export type ContextResponse = z.infer<typeof contextSchema>;
